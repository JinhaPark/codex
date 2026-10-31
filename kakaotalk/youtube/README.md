# YouTube source probe

The `Check YouTube sources` GitHub Actions workflow uses the repository's
`YOUTUBE_API_KEY` Actions secret to discover sources. It runs once when this module
changes on main, or manually from Actions. Pull requests run offline tests only.
There is no recurring schedule.

- `공병호`: latest published, non-running video among the channel's latest 50 uploads.
- `연합`: latest completed Infomax Live broadcast among 25 search matches whose
  actual broadcast times overlap Wednesday 18:00–21:00 or other weekdays
  19:00–21:00 Asia/Seoul.
  An edited upload without actual broadcast timestamps does not qualify.
- Only fully contained caption segments inside the permitted time interval are
  retained for Yonhap; boundary-crossing segments are dropped. Short overlaps
  can yield partial source material and must never be described as a full show.

Official YouTube Data API access retrieves metadata, not arbitrary channel
captions. Public Korean captions are tested separately with
[`youtube-transcript-api` 1.2.4](https://github.com/jdepoix/youtube-transcript-api/tree/v1.2.4),
an unofficial library which can fail on cloud-hosted IPs. No proxy, cookies,
OAuth credentials, additional API keys, or paid provider is configured.

Read the run summary and `youtube-source-probe` artifact's `report.json`.
`official_api: ok` means metadata requests worked; it does not mean captions
worked. Only `captions.status: available` with a positive segment count proves
caption text was retrieved. Available caption bodies are separate temporary
artifact files retained for one day, not repository files. Automatic captions
may contain recognition errors. Empty or blocked responses are not summaries.

This diagnostic does not call an LLM, update `kakaotalk/skills.md`, or send any
messages. Once usable source text exists, the agent can apply the private
`JinhaPark/skills/summarize/SKILL.md` instructions using its current model.
GitHub Actions alone cannot invoke this chat's GPT session through an API key
for YouTube.

Run offline checks with:

```sh
python -m unittest discover -s kakaotalk/youtube/tests -v
```

References:
- [YouTube upload discovery](https://developers.google.com/youtube/data/sample_requests)
- [Official caption download permission](https://developers.google.com/youtube/data/reference/rest/v3/captions/download)
