import io
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import probe


def video(video_id, published, channel="연합", start=None, end=None,
          title="인포맥스라이브", state="none"):
    live = {}
    if start:
        live["actualStartTime"] = start
    if end:
        live["actualEndTime"] = end
    return {"id": video_id, "snippet": {"channelId": probe.CHANNELS[channel],
            "title": title, "publishedAt": published, "liveBroadcastContent": state},
            "liveStreamingDetails": live}


class SourceSelectionTests(unittest.TestCase):
    now = probe.instant("2026-10-31T14:00:00Z")

    def test_yonhap_excludes_morning_weekend_edited_and_live(self):
        items = [
            video("morning", "2026-10-30T00:00:00Z", start="2026-10-29T22:00:00Z",
                  end="2026-10-30T00:00:00Z"),
            video("weekend", "2026-10-31T13:00:00Z", start="2026-10-31T10:00:00Z",
                  end="2026-10-31T12:00:00Z"),
            video("edited", "2026-10-30T13:00:00Z"),
            video("running", "2026-10-30T09:00:00Z", start="2026-10-30T10:00:00Z",
                  state="live"),
            video("correct", "2026-10-30T12:00:00Z", start="2026-10-30T10:00:12Z",
                  end="2026-10-30T11:58:23Z"),
        ]
        source, offsets = probe.select_video("연합", items, self.now)
        self.assertEqual(source["id"], "correct")
        self.assertEqual(offsets, [0, 7091])

    def test_wednesday_starts_at_18(self):
        source, offsets = probe.select_video("연합", [video(
            "early", "2026-10-28T13:00:00Z", start="2026-10-28T09:00:00Z",
            end="2026-10-28T13:00:00Z")], self.now)
        self.assertEqual(offsets, [0, 10800])
        self.assertEqual(source["id"], "early")

    def test_other_weekdays_start_at_19(self):
        _, offsets = probe.select_video("연합", [video(
            "early", "2026-10-29T13:00:00Z", start="2026-10-29T09:00:00Z",
            end="2026-10-29T13:00:00Z")], self.now)
        self.assertEqual(offsets, [3600, 10800])

    def test_yonhap_uses_broadcast_date_instead_of_reupload_order(self):
        items = [
            video("old", "2026-10-31T01:00:00Z", start="2026-10-29T10:00:00Z",
                  end="2026-10-29T12:00:00Z"),
            video("new", "2026-10-30T12:00:00Z", start="2026-10-30T10:00:00Z",
                  end="2026-10-30T12:00:00Z"),
        ]
        self.assertEqual(probe.select_video("연합", items, self.now)[0]["id"], "new")

    def test_gong_rejects_future_live_and_wrong_channel(self):
        items = [
            video("old", "2026-10-30T05:00:00Z", channel="공병호"),
            video("new", "2026-10-31T05:00:00Z", channel="공병호"),
            video("future", "2026-11-01T05:00:00Z", channel="공병호"),
            video("live", "2026-10-31T06:00:00Z", channel="공병호", state="live"),
            video("other", "2026-10-31T07:00:00Z"),
        ]
        self.assertEqual(probe.select_video("공병호", items, self.now)[0]["id"], "new")

    def test_caption_boundaries_do_not_leak_outside_evening_window(self):
        segments = [
            {"text": "outside", "start": 3590, "duration": 20},
            {"text": "inside", "start": 3600, "duration": 20},
            {"text": "outside", "start": 10790, "duration": 20},
            {"text": " ", "start": 4000, "duration": 2},
        ]
        self.assertEqual([s["text"] for s in probe.clip_segments(
            segments, [3600, 10800])], ["inside"])

    def test_no_matching_broadcast_returns_none(self):
        self.assertIsNone(probe.select_video("연합", [video(
            "edited", "2026-10-30T12:00:00Z")], self.now))

    def test_api_failure_never_exposes_key_or_request_url(self):
        error = HTTPError("https://example.test/?key=TOP_SECRET", 403,
                          "TOP_SECRET", {}, io.BytesIO(
                              b'{"error":{"errors":[{"reason":"quotaExceeded"}]}}'))
        with patch.object(probe, "urlopen", side_effect=error):
            with self.assertRaises(probe.ApiError) as caught:
                probe.api("channels", "TOP_SECRET", id="example")
        self.assertEqual(str(caught.exception), "HTTP_403:quotaExceeded")
        self.assertNotIn("TOP_SECRET", str(caught.exception))


if __name__ == "__main__":
    unittest.main()
