"""Check video discovery and public captions without generating a summary."""

import json
import os
from datetime import datetime, time, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

KST = ZoneInfo("Asia/Seoul")
CHANNELS = {
    "공병호": "UCraFuSXdd7ei5gUJrN3FxiQ",
    "연합": "UC6kZpTl39-_SqfBrF1-N2oQ",
}


class ApiError(Exception):
    """Expose only a safe code, never a request URL containing credentials."""


def instant(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def api(endpoint, key, **params):
    request = Request(
        "https://www.googleapis.com/youtube/v3/" + endpoint + "?"
        + urlencode({**params, "key": key}),
        headers={"User-Agent": "codex-youtube-probe/1.0"},
    )
    try:
        with urlopen(request, timeout=20) as response:
            return json.load(response)
    except HTTPError as error:
        reason = "unknown"
        try:
            body = json.loads(error.read())
            candidate = body["error"]["errors"][0]["reason"]
            if candidate in {
                "keyInvalid", "accessNotConfigured", "quotaExceeded",
                "dailyLimitExceeded", "ipRefererBlocked", "forbidden",
                "youtubeSignupRequired", "playlistNotFound",
            }:
                reason = candidate
        except (KeyError, IndexError, ValueError, TypeError):
            pass
        raise ApiError(f"HTTP_{error.code}:{reason}") from None
    except (URLError, TimeoutError, ValueError):
        raise ApiError("network_or_response_error") from None


def select_video(keyword, videos, now):
    """Return a source and allowed offset interval, using actual broadcast times."""
    candidates = []
    for video in videos:
        snippet = video["snippet"]
        if snippet.get("channelId") != CHANNELS[keyword]:
            continue
        if instant(snippet["publishedAt"]) > now:
            continue
        live = video.get("liveStreamingDetails", {})
        if snippet.get("liveBroadcastContent") in {"live", "upcoming"}:
            continue
        if "actualStartTime" in live and "actualEndTime" not in live:
            continue
        if keyword == "공병호":
            candidates.append((instant(snippet["publishedAt"]), video, None))
            continue
        if "인포맥스라이브" not in snippet["title"].replace(" ", ""):
            continue
        if not live.get("actualStartTime") or not live.get("actualEndTime"):
            continue
        start = instant(live["actualStartTime"]).astimezone(KST)
        end = instant(live["actualEndTime"]).astimezone(KST)
        if start.weekday() >= 5 or end > now or end <= start:
            continue
        window_start = datetime.combine(start.date(), time(19), KST)
        window_end = datetime.combine(start.date(), time(21), KST)
        allowed_start, allowed_end = max(start, window_start), min(end, window_end)
        if allowed_start < allowed_end:
            offsets = [(allowed_start - start).total_seconds(),
                       (allowed_end - start).total_seconds()]
            candidates.append((start, video, offsets))
    if not candidates:
        return None
    _, video, offsets = max(candidates, key=lambda item: item[0])
    return video, offsets


def discover(keyword, key, now):
    channel_id = CHANNELS[keyword]
    if keyword == "공병호":
        channels = api("channels", key, part="contentDetails", id=channel_id)
        uploads = channels["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
        items = api("playlistItems", key, part="contentDetails",
                    playlistId=uploads, maxResults=50)
        ids = [item["contentDetails"]["videoId"] for item in items["items"]]
    else:
        items = api("search", key, part="id", channelId=channel_id,
                    q="인포맥스라이브", type="video", eventType="completed",
                    order="date", maxResults=25)
        ids = [item["id"]["videoId"] for item in items["items"]]
    if not ids:
        return None
    videos = api("videos", key, part="snippet,liveStreamingDetails",
                 id=",".join(ids))
    return select_video(keyword, videos["items"], now)


def clip_segments(segments, offsets):
    # Drop boundary-crossing segments rather than include words outside 19:00–21:00.
    return [s for s in segments if s.get("text", "").strip() and
            (offsets is None or (s["start"] >= offsets[0] and
             s["start"] + s["duration"] <= offsets[1]))]


def captions(video_id, offsets):
    from requests import Session
    from youtube_transcript_api import YouTubeTranscriptApi

    class TimedSession(Session):
        def request(self, *args, **kwargs):
            kwargs.setdefault("timeout", 20)
            return super().request(*args, **kwargs)

    try:
        with TimedSession() as session:
            fetched = YouTubeTranscriptApi(http_client=session).fetch(
                video_id, languages=["ko"])
        segments = clip_segments(fetched.to_raw_data(), offsets)
        return {
            "status": "available" if segments else "empty",
            "language": fetched.language_code,
            "is_generated": fetched.is_generated,
            "segment_count": len(segments),
            "segments": segments,
        }
    except Exception as error:
        # Third-party exceptions may contain URLs; never persist their messages.
        known = {"RequestBlocked", "IpBlocked", "TranscriptsDisabled",
                 "NoTranscriptFound", "VideoUnavailable", "AgeRestricted"}
        code = type(error).__name__
        return {"status": "unavailable", "reason": code if code in known
                else "caption_fetch_failed", "segment_count": 0}


def run(key, output, now):
    report = {"checked_at_kst": now.astimezone(KST).isoformat(),
              "official_api": "ok", "channels": {}, "summary_generated": False}
    for keyword in CHANNELS:
        try:
            selected = discover(keyword, key, now)
            if selected is None:
                report["channels"][keyword] = {"status": "no_matching_video",
                    "search_scope": "latest 50 uploads or 25 completed broadcast matches"}
                continue
            video, offsets = selected
            transcript = captions(video["id"], offsets)
            segments = transcript.pop("segments", [])
            entry = {"status": "video_found", "video_id": video["id"],
                     "title": video["snippet"]["title"],
                     "url": "https://www.youtube.com/watch?v=" + video["id"],
                     "published_at": video["snippet"]["publishedAt"],
                     "live": video.get("liveStreamingDetails", {}),
                     "allowed_offsets_seconds": offsets, "captions": transcript}
            report["channels"][keyword] = entry
            if segments:
                # Temporary Actions artifact only; never commit caption bodies.
                (output / (video["id"] + ".json")).write_text(json.dumps(
                    {"source": entry, "segments": segments}, ensure_ascii=False),
                    encoding="utf-8")
        except ApiError as error:
            report["official_api"] = "error"
            report["channels"][keyword] = {"status": "api_error", "reason": str(error)}
        except (KeyError, IndexError, TypeError, ValueError):
            report["official_api"] = "error"
            report["channels"][keyword] = {"status": "invalid_api_response"}
    return report


def main():
    output = Path("probe-output")
    output.mkdir(exist_ok=True)
    key = os.environ.get("YOUTUBE_API_KEY", "").strip()
    if key:
        report = run(key, output, datetime.now(timezone.utc))
    else:
        report = {"official_api": "missing_secret", "summary_generated": False}
    (output / "report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = ["# YouTube source probe", "", "Official API: " + report["official_api"]]
    for keyword, entry in report.get("channels", {}).items():
        lines.extend(["", "## " + keyword, "Status: " + entry["status"]])
        if "reason" in entry:
            lines.append("Reason: " + entry["reason"])
        if "url" in entry:
            lines.append(entry["url"])
            lines.append("Captions: " + entry["captions"]["status"])
            lines.append("Segments: " + str(entry["captions"]["segment_count"]))
            if "reason" in entry["captions"]:
                lines.append("Reason: " + entry["captions"]["reason"])
    lines.extend(["", "No summary or Kakao reply was generated."])
    summary = "\n".join(lines) + "\n"
    print(summary)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as handle:
            handle.write(summary)
    return 0 if report["official_api"] == "ok" else 1


if __name__ == "__main__":
    raise SystemExit(main())
