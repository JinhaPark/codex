# 비비하눔·모히 호사 · 2026-10-19 별도 이미지 작업

기준 main: `4825b886d1a3ae9a18a245fb1e39f6e1c9131a31`. 브랜치 `images/bibi-mohi-20261019`. PR #3의 디반베기 그림과 분리한 변경이다. main 및 PR #3을 수정하거나 병합하지 않았다.

## 기존 모히 호사 후보 확인

PR #3 head `e69f514193868adb69ba50a44fb3fc4a7d5c9404` 및 `docs/audit/photo-batch-20261019-mohi-pending.md`를 읽었다. IMG_9073은 인터넷 캡처이며 원본 URL·촬영자·이용 조건이 미확인이다. 문서에만 있는 변환본/해시는 라이선스 증거가 아니므로 기존 변환을 게시하지 않는다. 해당 비공개 작업 파일은 이번 작업공간에 없으며 재생성하지 않았다. 아래 대체 사진을 직접 다운로드·육안 확인하여 새로 변환했다.

## 모히 호사 대체 자료와 이용 조건

- 제목: Harem of Sitorai Mokhi-Khosa Palace 01.jpg
- 저작자: Bernard Gagnon, 촬영 2023-10-03, Commons 업로드 2023-12-16.
- 원본: https://commons.wikimedia.org/wiki/File:Harem_of_Sitorai_Mokhi-Khosa_Palace_01.jpg
- 확인한 고정판: https://commons.wikimedia.org/w/index.php?title=File:Harem_of_Sitorai_Mokhi-Khosa_Palace_01.jpg&oldid=1153097626
- 원본 파일: https://upload.wikimedia.org/wikipedia/commons/a/a5/Harem_of_Sitorai_Mokhi-Khosa_Palace_01.jpg
- 라이선스: CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/
- Commons 파일 설명의 Licensing 절에서 권리 포기·복제·수정·배포 및 상업적 이용 허용을 확인(2026-10-19). CC0는 저작자 표시나 동일조건 배포를 요구하지 않지만, 출처 추적을 위해 저작자·원본·라이선스를 이 문서와 manifest에 보존한다. 사진의 저작권 조건에 관한 확인이며 제3자 권리 전반의 보증은 아니다.
- 대안 비교: Stanislav Kozlovskiy의 Sitorai Mokhi-hosa.jpg도 연못·건물 구도이며 CC BY 3.0 사용 가능. 저작자·라이선스 링크·수정 표시가 필요하다. 더 높은 해상도이고 조건이 간단한 Gagnon의 CC0 자료를 선택했다.
- 변환: 내장 imagegen. 수채·색연필 스타일, 오른쪽 작은 방문객 제거, 원본 3:2 구도·건물·연못 반영 보존. 게시 캡션에는 제작 방식 문구를 넣지 않았다.
- 표시: 부하라 도시 해설의 `bukhara:10:detail`.

## 비비하눔

사용자가 이 요청에 첨부한 IMG_9082.jpeg(800×370)를 직접 확인했다. 새 사진에 대해 인터넷 캡처라고 하는 정보는 제공되지 않았으며 사용자 제공 여행 사진으로 처리한다. 내장 imagegen으로 군중·머리·모자·출입구 방문객을 제거하고 석재 바닥과 기단을 보완했다. 왼쪽 위 잘린 탑을 보완하고 건물 위로 파란 하늘 여백을 추가했다. 이는 요청된 구도 확장이므로 기존 원본 비율 보존 검사에는 이 ID에만 명시적 예외를 적용한다. 복원한 탑 상단과 가려졌던 바닥 세부는 생성 보완이며 실측 복원 자료가 아니다. 원본보다 큰 WebP를 내보내지 않도록 두 변형 모두 원본 양축 이내로 제한했다. 사마르칸트 `samarkand:6:detail`에 한 번 표시한다.

## 최종 프롬프트 · 내장 imagegen

비비하눔:
```text
Use case: style-transfer with precise-object-edit. Edit target Image 1: user's Bibi-Khanym Mosque travel photo in Samarkand. Make a faithful restrained watercolor and fine colored-pencil illustration for the existing Korean Central Asia guide. Remove ALL people/crowds/hats from the foreground and small doorway visitors, filling only their former areas with plausible existing stone paving and base stonework. Preserve the huge tiled entrance portal, recessed pointed arch, blue tile panels, door position, right minaret and source upward perspective. Outpaint above the original image so the clipped upper-left tower top is complete, matching the surviving right portal corner; give the entire facade a small natural blue-sky margin above its highest point (about 6-8% canvas height). Do not crop building sides. Landscape composition approx 1.6:1, with subtle transparent watercolor washes, controlled pencil detail, cream stone and natural blue tile/sky. No extra domes, towers, people, text, captions, borders, watermarks; no invented legible inscriptions. Preserve recognizable source architecture and proportions. One final illustration.
```

모히 호사:
```text
Use case: style-transfer. Edit target: Image 1, Bernard Gagnon's CC0 Harem of Sitorai Mokhi-Khosa Palace 01.jpg (Wikimedia Commons). Create a delicate watercolor travel-guide illustration with fine colored-pencil architectural accents, natural restrained cream ochre turquoise and green, light paper texture. Preserve exact landscape 3:2 framing, central cream two-storey building, left upper arched loggia and small domed tower, right higher hip-roof section, turquoise windows and doors, stone steps, wide pond and mirrored building reflection, trees and blue sky. Faithful architecture and relative proportions, no imagined buildings or decorative details, no readable invented inscriptions. Remove only tiny incidental visitors on the right walkway if visible; preserve furniture and trees. No text, labels, watermark, border or new people. Keep the pond reflection fully recognizable. Output one landscape 3:2 watercolor illustration.
```

## 게시 자산

원본 JPEG와 생성 PNG는 커밋하지 않는다. RGB 픽셀을 새로 만들고 리사이즈하여 WebP로 저장하며 EXIF·XMP·ICC를 넘기지 않는다. 각 파일 250,000bytes 이하. 작은 사진의 디테일을 임의 업스케일하지 않고 srcset/sizes·lazy loading·고유 width/height를 기존 렌더러로 사용한다.

### samarkand-bibi-khanym-watercolor

생성 1586×992, 게시 590×369. 위치 `samarkand:6:detail`.

- `samarkand-bibi-khanym-watercolor-480.webp`: 480×300, 56,538bytes, q88, SHA256 `ad291ea54264517f1b6f05793d12ddc9ffa91d3fed4da79c8032a8fe039ee163`
- `samarkand-bibi-khanym-watercolor-590.webp`: 590×369, 87,686bytes, q88, SHA256 `0d0cc7b79a8db60537b07d65445a486f7170fb7d16594dc51674c75cc8997ba3`

### bukhara-sitorai-pool-watercolor

생성 1536×1024, 게시 1200×800. 위치 `bukhara:10:detail`.

- `bukhara-sitorai-pool-watercolor-480.webp`: 480×320, 50,176bytes, q88, SHA256 `8d8e016d9adeea63be8c690c64938dd7775f55feb2d91271b09452395745f474`
- `bukhara-sitorai-pool-watercolor-800.webp`: 800×533, 143,838bytes, q88, SHA256 `0e6f82e1edfe294d7e6a8c41a2cb6a5ef05842939a4045625e7fa5bbbac91d9b`
- `bukhara-sitorai-pool-watercolor-1200.webp`: 1200×800, 208,568bytes, q80, SHA256 `c1e3bc546e267c4fe0089f45a5d6b95a585a895c228efc84f3da22fcc95189e3`


## 검증 결과

- npm test: 14/14 통과(권리 미확인 IMG_9073 미게시, CC0 출처·저작자와 배치 검사 포함). npm run build 통과.
- Pillow 전수 검사: 45점,119WebP,20,407,194bytes. 디코딩·종횡비·용량·메타데이터 제거·중복 없음 통과. 신규5파일은 모두250,000bytes 이하.
- Chromium 153.0.8010.0, 2026-10-19T05:14:54.960Z:375·390·430px,10일·4탭에서 전체45점 각1회 배치, 캡션·alt·width/height·srcset 디코딩·가로 넘침 없음 통과. 새 두 그림은 해당 도시/유적 설명 뒤에서 확인.119URL 디코딩, 전체 해설 그림 방문 후 오프라인 재열람, 준비물 저장·기존 기능·타사이트 캐시 보존 통과.
- 통제 캐시 fixture: v12 cache name/current app → v15; old cache removed. 실제 과거 배포 번들 전체 마이그레이션·실제 iPhone Safari·라이브 환율은 미검증. 이번 PR은 아직 배포하지 않았다.
- 새 두 그림을375px에서 별도 캡처하고 육안 검토했다. 비비하눔 군중 없음·좌상단 완성·하늘, 모히 호사 건물·연못과 반영을 확인했다.

전체 생성PNG는 공개하지 않으며 최종 사용 자산은 `public/illustrations/samarkand-bibi-khanym-watercolor-{480,590}.webp`, `public/illustrations/bukhara-sitorai-pool-watercolor-{480,800,1200}.webp`다. 최종 프롬프트는 위에 기록했다.
