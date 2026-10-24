# 추가 사진10장 처리 기록

작업 브랜치: `audit/destination-images-20261018`, PR #2. 시작 head `fd3947d396ca83d6af404b1e0870d6334170d301`; main `cab4dabc8dda97a182d0571be05e329e5f571dc0`를 다시 확인했다. 원본을 직접 열어 확인했고 원본JPEG·EXIF/GPS/XMP와 생성PNG는 커밋하지 않는다. 이 배치는 변환·자산 검사·브라우저 검증을 마친 후 같은 브랜치에 반영한다.

## 장소와 처리 범위

- IMG_8888의 촬영 도시는 사용자 확인으로 사마르칸트다. 일정표의2026-10-14 숙소는 Orient Star Hotel이다. 사진에 촬영일EXIF가 없으므로 실제 호텔명을 독립 검증한 것으로 기록하지 않는다. 그림은 해당 사마르칸트 숙박 항목으로 이동하며 캡션에는 도시와 관찰 대상만 쓴다. 3층 객실·엘리베이터 없음은 사용자 숙박 메모로 표시한다.
- IMG_9014는 사용자 순서 설명에서 비비하눔이었으나, 흰색 정면·대칭 첨탑·문양 아치를 공식 미노르 사진과 대조하면 타슈켄트 미노르로 판단된다. 비비하눔 확보로 세지 않는다. 출처: https://uzbekistan.travel/en/o/the-minor-mosque/ 및 해당 공식 사진 https://uzbekistan.travel/storage/app/media/uploaded-files/minor.jpg. 외부 이미지는 식별 참고이며 새 게시 그림의 입력은 사용자 사진뿐이다.
- IMG_8938은 사용자가 대통령 집무실로 설명했다. 독립광장 분수와 흰색 행정건물로 중립 표기하고 현행 입주기관·정식 건물명은 단정하지 않는다. https://visittashkent.uz/en/places/independence-square.html 의 검색 결과는 과거 상원·대통령 행정실 용도 변화를 설명했으나, 이번 직접 열람은 확인 화면에 막혔다. 현행 기관 검증으로 사용하지 않는다.
- IMG_8800은 기존 인터넷 캡처 항공샷 IMG_8706 기반의 bukhara-poi-kalyan-watercolor를 교체한다. 항공 시점으로 만들지 않고 실제 새 사진의 시점을 유지한다. 하단 펜스·임시 시설·군중·거친 지면과 크레인을 정리하되 건물의 가려진 내부를 상상해 복원하지 않는다.
- IMG_9057은 사냥꾼·산양으로 보이는 새김선의 위치·방향·불완전한 선을 보존한다. 개별 바위의 연대나 장면을 확정하지 않는다. 인물 얼굴·관모·기하학 문양·문자 등은 없는 세부를 보태지 않는다.
- 작은 세로4장(IMG_9014/9013/9057/9059)은370×800, 산정상 IMG_9064는800×370이다. 실제 변환본 비율을 유지하며 원본의 가로·세로를 모두 넘지 않게 축소한다. 작은 원본을480/800/1200px로 확대하지 않는다.
- 공원 전등·샹들리에의 구조 지지선은 건물/설치물의 관찰 가능한 부분으로 구분하고, 일반 전선·전신주와 차창 반사는 제거한다.

## 원본·이미지ID·배치·최종 지시

### 1. IMG_8979.jpeg → rukh-ordo-lakeside-watercolor

- 화풍: watercolor; 배치: `cholponata:9:detail`; 처리: 신규 추가.
- 캡션: 촐폰아타 루흐 오르도 — 호숫가 아치와 조각 정원
- alt: 종이 매달린 아치와 잔디 위 돌 조각, 키 큰 나무 너머로 이식쿨 호수와 눈 덮인 산맥이 보이는 정원
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer. Convert this exact Rukh Ordo photo into delicate watercolor. Landscape4:3 canvas. Preserve the large pointed arch with suspended bells on left, sculptures, tall narrow trees, lawn, paths, lake horizon and snow-covered distant mountain silhouette. Preserve the actual lamp positions, supporting structures and sculptures, without adding chapels or imaginary symbols. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.

### 2. IMG_8939.jpeg → tashkent-amir-temur-watercolor

- 화풍: watercolor; 배치: `tashkent:8:0`; 처리: 신규 추가.
- 캡션: 타슈켄트 아미르 티무르 광장 — 기마상과 호텔 우즈베키스탄
- alt: 오른쪽의 티무르 기마상과 붉은 받침대, 왼쪽 호텔 우즈베키스탄의 격자 외벽, 나무와 광장 관람객
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer. Convert this exact Amir Temur Square photo into watercolor, landscape4:3. Preserve the equestrian statue pose and raised hand on right, horse, red stone plinth, Hotel Uzbekistan grid facade on left, trees and foreground visitors in their exact positions. Preserve the observed roof text HOTEL UZBEKISTAN and AMIR TEMUR on plinth if legible; leave other small letters indistinct rather than inventing words. Do not remove people or redesign faces. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.

### 3. IMG_8938.jpeg → tashkent-independence-fountains-watercolor

- 화풍: watercolor; 배치: `tashkent:9:0`; 처리: 신규 추가.
- 캡션: 타슈켄트 독립광장 — 분수 너머 흰색 행정건물
- alt: 가로로 뻗은 흰색 행정건물 앞의 분수 물줄기와 수조, 앞쪽 잔디와 작은 나무, 줄무늬 보도
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer. Convert this exact photo of fountains in front of a white civic building into watercolor, landscape4:3. Preserve the horizontal white facade, central emblem/pediment, fountain jets, pool, shrubs, lawn and striped pavement. The photo was taken through glass: remove window reflections and overall glass haze without changing architecture. Remove the intrusive plain gray utility/light pole in center-right and any utility wires, continuing only the existing water/sky/building texture behind it without new openings or detail. Keep the actual small trees and fountain fixtures. No invented flags or emblems; don't add a building name or political label. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.

### 4. IMG_9019.jpeg → ala-archa-valley-watercolor

- 화풍: watercolor; 배치: `bishkek:10:0`; 처리: 신규 추가.
- 캡션: 알라아르차 국립공원 — 숲 너머의 계곡과 설산
- alt: 낙엽 진 가는 나뭇가지와 짙은 침엽수 너머로 계곡 양쪽의 바위산과 눈 덮인 능선이 보이는 풍경
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer. Convert this exact Ala Archa valley photo into delicate watercolor, landscape4:3. Preserve the exact jagged skyline, snowy patches, sunlit rocky slopes, valley depth, evergreen trees and dense leafless foreground branches. Keep the contrast of shaded foreground and sunlit mountains; don't erase the forest to invent a clear river view. Remove only camera/window glare or edge reflection, not natural haze. No invented trail, bridge, cable car or people. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.

### 5. IMG_8800.jpeg → bukhara-poi-kalyan-watercolor

- 화풍: watercolor; 배치: `bukhara:7:1`; 처리: 기존1점 교체.
- 캡션: 부하라 포이칼랸 — 미리아랍 마드라사와 칼랸 미나레트·모스크
- alt: 왼쪽 미리아랍 마드라사의 청록색 돔과 아치, 가운데 칼랸 미나레트, 오른쪽 칼랸 모스크의 돔과 낮은 지붕이 나란히 보이는 전경
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer and precise-object-edit. Replace a previous aerial illustration with a watercolor based ONLY on this exact user photo of the Poi Kalyan ensemble, landscape4:3. Preserve the observed viewpoint and relative building positions: blue-domed madrasa on left, tall brick minaret near center, larger blue dome on right, arches, roof domes, distant city and large sky. Clean the untidy bottom: remove all white fence posts/rails, temporary barriers, lower crowds, tents and foreground rubble/earth mounds, continuing a quiet unobtrusive warm sand/stone ground so the buildings stand out. Remove visible construction cranes, utility wires and utilitarian poles, not the minaret. Do not invent courtyard interiors or show an aerial viewpoint; preserve the photographed silhouettes and brick/tile proportions. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.

### 6. IMG_9014.jpeg → tashkent-minor-portrait-watercolor

- 화풍: watercolor; 배치: `tashkent:10:detail`; 처리: 신규 추가.
- 캡션: 타슈켄트 미노르 모스크 — 흰색 정면과 꽃밭
- alt: 흰색 모스크의 높은 문양 아치와 양옆 첨탑을 배경으로 모자를 쓴 여행자가 꽃과 잔디 앞에 서 있는 모습
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer and identity-preserve. Convert this exact narrow portrait photo into a faithful watercolor. Maintain the original37:80 tall narrow canvas and complete full-body framing. Preserve the foreground traveler's face, hat, white shirt, dark trousers, shoes, pose and position; preserve the white marble patterned portal, visible cropped minarets, flowerbeds and lawn. Do not widen the frame or invent the cropped building sides or a dome. No sharpening into invented calligraphy. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.

### 7. IMG_9013.jpeg → hazrati-imam-portrait-watercolor

- 화풍: watercolor; 배치: `tashkent:7:detail`; 처리: 신규 추가.
- 캡션: 타슈켄트 하즈라티 이맘 단지 — 타일 아치 입구
- alt: 큰 벽돌 아치와 청색 타일 문양이 있는 입구 앞에 흰 셔츠와 검은 바지를 입은 여행자가 서 있는 모습
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer and identity-preserve. Convert this exact narrow portrait of a tiled brick entrance in the Hazrati Imam complex into watercolor. Keep original37:80 tall narrow canvas and full body. Preserve the foreground person's identity, hair, white shirt, black trousers, backpack straps, pose and position; preserve other visitors at doorway. Keep exact arch profile, tile pattern regions, lattice, doors, paving and shadows. Keep small signage/calligraphy only as observed and indistinct, don't invent letters, dates or a different monument. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.

### 8. IMG_9057.jpeg → cholponata-petroglyph-detail-pencil

- 화풍: colored-pencil; 배치: `cholponata:2:detail`; 처리: 신규 추가.
- 캡션: 촐폰아타 암각화 — 활과 뿔 달린 동물의 새김선
- alt: 큰 바위 표면에 활을 든 사람과 긴 뿔의 동물로 보이는 옅은 새김선이 있으며 뒤로 마른 풀과 산이 보이는 모습
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer, archaeological detail preservation. Convert this exact close-up of a petroglyph boulder into restrained colored pencil with fine grain. Preserve original37:80 narrow portrait composition. Most important: trace only the actual existing pale pecked/engraved lines, including the archer-like human and horned goat-like animals, at precisely their photographed positions, sizes, orientations and incomplete shapes. Preserve rough brown/gray rock texture, weathering and ambiguous overlapping marks. Do not invent extra animals, bows, arrows, limbs, horns, eyes or completed missing lines; do not rearrange, simplify into modern pictograms, add labels or date it. Slightly improve local readability of existing grooves without turning them into solid white outlines. Keep background mountain, grass and cloud composition. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.

### 9. IMG_9059.jpeg → tashkent-broadway-watercolor

- 화풍: watercolor; 배치: `tashkent:11:detail`; 처리: 신규 추가.
- 캡션: 타슈켄트 브로드웨이 거리 — 나무와 샹들리에 장식
- alt: 나무 사이 보행거리 위의 큰 샹들리에 장식과 색색의 천, 양옆 작은 가판대와 멀리 걷는 사람들
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer. Convert this exact Broadway pedestrian street photo into watercolor. Preserve original37:80 narrow portrait canvas, large chandelier-like hanging installation at top, central tree-lined perspective, colorful fabric canopy further down, kiosks, benches and distant pedestrians. Remove the black overhead electrical utility cables along the very top and any ordinary utility poles; retain the chandelier and its thin structural suspension supports so it doesn't look redesigned. Preserve actual fabric colors and tree positions. No invented shop signs or lettering. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.

### 10. IMG_9064.jpeg → ala-archa-summit-watercolor

- 화풍: watercolor; 배치: `bishkek:10:detail`; 처리: 신규 추가.
- 캡션: 알라아르차 케이블카 상부에서 본 설산
- alt: 그늘진 바위 능선 사이로 눈이 쌓인 봉우리와 산허리의 구름이 보이는 가로로 긴 산악 풍경
- 실행: 내장 imagegen, 사용자 사진 직접 참조.

Use case: style-transfer. Convert this exact mountain view from the Ala Archa cable-car upper area into delicate watercolor. Preserve original80:37 very wide landscape canvas, central distant flat/jagged snowy summit profile, dark rocky ridges on both sides, thin foreground slope and cloud positions. Remove window/camera haze and reflections only. Do not invent the cable car, station, trail, people, new peaks or extra glacier/snow areas. Keep original sunlit/shadowed slope relationships and subdued natural colors. Match the existing guide's refined natural-color travel illustrations. Preserve exact source composition and relative proportions, no crop or invented architecture, people, lettering, signs or historical details. Remove camera/window reflections, overhead utility wires and utility poles if present, while keeping natural sunlight and shadows. No caption, border or watermark.


## 실제 생성본·게시 결과

총10장 변환 완료: 새9점18WebP와 기존1점3WebP 교체. 전체43점114WebP. 원본보다 큰 파생 파일을 만들지 않았다.

| ID | 생성본 파일(비공개 원본) | 게시 변형 |
|---|---|---|
| tashkent-amir-temur-watercolor | exec-611a92a6-7072-4c23-90b7-c90130568e39.png | tashkent-amir-temur-watercolor-480.webp<br>tashkent-amir-temur-watercolor-800.webp<br>tashkent-amir-temur-watercolor-1200.webp |
| tashkent-independence-fountains-watercolor | exec-fe163c88-0b8e-44d2-87b0-6411c5c61d2e.png | tashkent-independence-fountains-watercolor-480.webp<br>tashkent-independence-fountains-watercolor-800.webp<br>tashkent-independence-fountains-watercolor-1200.webp |
| bukhara-poi-kalyan-watercolor | exec-470bf502-8d7e-4d98-bcc9-f2409d5ae0bf.png | bukhara-poi-kalyan-watercolor-480.webp<br>bukhara-poi-kalyan-watercolor-800.webp<br>bukhara-poi-kalyan-watercolor-1200.webp |
| tashkent-minor-portrait-watercolor | exec-2a078dd6-6090-4ee9-ae4c-36a69c4b60d4.png | tashkent-minor-portrait-watercolor-370.webp |
| rukh-ordo-lakeside-watercolor | exec-1fa82ac7-e19f-4fef-939a-51ee2c44e432.png | rukh-ordo-lakeside-watercolor-480.webp<br>rukh-ordo-lakeside-watercolor-800.webp<br>rukh-ordo-lakeside-watercolor-1200.webp |
| ala-archa-valley-watercolor | exec-33621bae-4b7f-4b9f-a5de-4dff63fce4d8.png | ala-archa-valley-watercolor-480.webp<br>ala-archa-valley-watercolor-800.webp<br>ala-archa-valley-watercolor-1200.webp |
| hazrati-imam-portrait-watercolor | exec-6bb118fa-2883-42eb-91d6-023f14fc3334.png | hazrati-imam-portrait-watercolor-370.webp |
| cholponata-petroglyph-detail-pencil | exec-d4f28fd0-6cc3-4b84-b9f9-d3223f649123.png | cholponata-petroglyph-detail-pencil-370.webp |
| tashkent-broadway-watercolor | exec-c52b264f-3e89-44c0-9278-6f2c7ae76bcf.png | tashkent-broadway-watercolor-370.webp |
| ala-archa-summit-watercolor | exec-79a99e99-fbfb-4bbf-a952-791c77282b96.png | ala-archa-summit-watercolor-480.webp<br>ala-archa-summit-watercolor-800.webp |

위 생성PNG와 원본JPEG는 공개 저장소에 포함하지 않는다. 전체21게시 파생본의 실제 규격·용량은 images.md의 최신 표에 있으며 caption/alt/배치 키는 manifest가 기준이다. 테스트14/14·build·Pillow114개 실제 디코딩·파일/크기/비율/용량/메타데이터·비중복 검사는 통과했다. 브라우저 최종 결과는 browser.md/json의 이번 배치 절을 따른다.


## 추가 사진10장·사마르칸트 숙박 배치 최종 검증

2026-10-18T19:19:01.719Z, Chromium153.0.8010.0, 로컬 프로덕션 빌드 index-B7izR5KN.js / index-DhzJzpNS.css. 375·390·430px의10일 일정·4탭에서43개ID를 각1회 실제 표시했고114개 파생URL을 디코딩해 픽셀을 대조했다. 새/기존 캡션의 manifest 일치·자동 제작문구 부재·선택 변형의 실제 비율대로 표시됨·가로 넘침·세로 사진 높이 조건이 통과했다. 전체 해설 그림을 실제 방문해 캐시한 뒤 오프라인 재열람·재디코딩했고, 이동한 호텔 그림은 일정3일차 숙소에서 온라인/오프라인 모두 확인했다. 준비물 저장·지도40링크·v11 캐시명/현재앱fixture→v12 전환·타 사이트 캐시 보존도 통과했다. npm test14/14·build·Pillow114개 실제 디코딩/규격/비율/용량/메타데이터/비중복 전수 검사 통과.

375px 포이칼랸·미노르 인물사진·암각화 근접 그림의 figure 스크린샷3개를 추가로 육안 확인했다. 건물·인물 전신·바위가 잘리지 않고 캡션이 프레임 안에서 읽힌다. 작은 원본의 화질 한계는 유지하며 확대해 세부를 만들어내지 않았다. 이미지 결과물의 고고학적 선·얼굴·장식 세부를 사실 증거로 확정하는 검증은 아니다. 실제 iPhone Safari·실물 기기·라이브 환율·과거 배포 번들 전체의 마이그레이션·이번 PR 배포는 미검증이다.

비율 검사 수정 근거: 기존370×800 발발의 실제 표시289.25×625.39px는 올바른 비율이었으나 Chromium의 srcset 밀도 보정 naturalWidth/Height가284×616으로 정수 환산되어 새 검사에서 오탐했다. 검사를 선택 srcset 파일의 실제 디코딩 픽셀(별도114URL 전수 확인)로 계산한 표시 높이와1CSS픽셀 이내인지 대조하도록 수정했고, width/height 속성의 manifest 일치도 별도로 검사한다. 오탐 시도는 통과로 기록하지 않았으며 위 시각은 수정 후 전체 재실행 결과다.

## 후속 요청: 인물·군중·손 제거와 도착일 저녁

사용자가 모스크 정면과 이맘 단지의 인물, 티무르 광장의 군중, SB bar 스테이크의 손가락 제거를 요청했다. 모스크 정면은 IMG_9014의 기존 미노르 식별을 유지한 채 같은 사진을 수정한다. 새 비비하눔 사진으로 잘못 추가하지 않는다. 기존 승인 그림4점을 내장 imagegen으로 수정하며 새로운 장소나 메뉴 사진을 생성하지 않는다. 원본과 기존 생성PNG는 수정하지 않는다.

### tashkent-minor-portrait-watercolor

편집 입력: tashkent-minor-portrait-watercolor-370.webp

Use case: precise-object-edit. Edit this existing watercolor image ONLY to remove ALL people. Remove the entire central traveler including hat, head, face, neck, shirt, arms, hands, backpack straps, trousers and shoes. Remove any other small person near the doorway too. Continue only the existing grass, flowers and simple path behind the traveler, matching neighboring shapes, without inventing architectural features hidden behind the body. Preserve exactly the white marble patterned portal, cropped minarets, flowerbeds, trees, sunlight, watercolor style and original37:80 narrow portrait framing. No human body fragments or clothing may remain; no crop, new lettering, new structures or watermark.

### hazrati-imam-portrait-watercolor

편집 입력: hazrati-imam-portrait-watercolor-370.webp

Use case: precise-object-edit. Edit this existing watercolor illustration ONLY to remove every person. Remove the full central traveler including head, face, hair, shirt, arms, hands, bag and straps, trousers and shoes, as well as all background visitors at the entrance. Continue the visible paving in perspective and quiet doorway shadows; do not invent an interior or hidden doors/windows. Preserve exact brick arch, blue tile regions, worn calligraphy, existing small signs, entrance doors, paving shadows, watercolor style and37:80 tall narrow frame. No people, human fragments, clothing or new motifs/text may remain. No crop or watermark.

### tashkent-amir-temur-watercolor

편집 입력: tashkent-amir-temur-watercolor-1200.webp

Use case: precise-object-edit. Remove ALL live visitors and crowds from the foreground and distance of this existing watercolor of Amir Temur Square, including every head, face, hand, hat, torso, backpack, clothing and partial body along the bottom edge. Continue the actual plaza paving, steps, grass and low flowerbeds behind them naturally. Preserve the equestrian STATUE and its raised sculpted hand exactly; the statue is NOT a live visitor. Keep the hotel grid facade and observed HOTEL UZBEKISTAN letters, statue, horse, red plinth/AMIR TEMUR text, trees, red protective rope/barrier, sunlight and watercolor texture unchanged. Keep original landscape4:3 framing, without inventing extra structures, signs or people. No crop or watermark.

### travel-steak-table-pencil

편집 입력: travel-steak-table-pencil-1200.webp

Use case: precise-object-edit. Edit this existing colored-pencil food illustration ONLY to remove the entire pointing hand, fingers, thumb, wrist, forearm and any sleeve at the lower-left/bottom edge. Reconstruct only the existing dark table surface/table edge where the hand was, following its established geometry. Preserve the complete tomahawk steak and long bone, wood board, knife, both sauces, glasses, napkins, salads, side dish, the partial trousers at the bottom (not a pointing hand), overhead perspective and exact landscape4:3 composition. Keep existing fine colored-pencil shading and natural colors. Do not add food, fingers, text, plates or utensils. No crop, watermark or invented menu names.

SB bar는 기존 day:4:places에 이미 게시된 그림이었다. 같은ID를 day:4:dinner로 옮기고2026-10-16(5일차) 일정에 ‘저녁 식사 · 비슈케크 SB bar’ 항목을 추가한다. 키르기스스탄 도착일 저녁이라는 사용자 확인을 기록하며 중복 갤러리를 만들지 않는다. 수정본의 WebP 규격은 처리 후 표와 manifest를 기준으로 한다.


### 후속 최종 선택본

| ID | 수정PNG(비공개) | 현재 alt |
|---|---|---|
| tashkent-minor-portrait-watercolor | exec-9f829139-3efb-4b14-80b9-339302830bfd.png | 흰색 모스크의 높은 문양 아치와 양옆 첨탑, 앞쪽의 꽃밭과 잔디 |
| hazrati-imam-portrait-watercolor | exec-0d38eac8-4a92-47ab-90bb-df61aa14859b.png | 큰 벽돌 아치와 청색 타일 문양, 그 아래 출입문과 앞쪽의 포장 바닥 |
| tashkent-amir-temur-watercolor | exec-ac1f7d74-bdd7-4478-994b-c6ffb1c35a8b.png | 오른쪽 티무르 기마상과 붉은 받침대, 왼쪽 호텔 우즈베키스탄의 격자 외벽과 나무, 광장의 포장 바닥 |
| travel-steak-table-pencil | exec-25d70611-7583-4acf-8854-38aa87b1b0a1.png | 비슈케크 SB bar에서 먹은 토마호크 스테이크와 소스, 샐러드가 놓인 식탁 |

최종8WebP 규격은 images.md의 최신 표를 따르며, 인물 보존을 지시했던 초기10장 프롬프트보다 위 후속 제거 지시가 최신이다. 그림 수43·파일114개를 유지한다. 기존 배치와 새 저녁 식사 항목의 실제 표시·중복·오프라인 검사는 최신 browser.json으로 확인한다.


## 후속 인물·군중·스테이크 손 제거본 최종 검증

2026-10-18T19:32:18.809Z, Chromium153.0.8010.0, 로컬 프로덕션 빌드 index-BD0hGBG4.js / index-DhzJzpNS.css. 최종4점8WebP를 포함한 전체43점114변형에서 파일·실제 디코딩·크기·입력/편집대상 양축 비확대·실제 수정본 비율·용량·메타데이터·해시 비중복 검사가 통과했다. npm test14/14·build 통과. 375·390·430px의 모든43개 배치·캡션·가로 넘침·비율·세로 높이·중복 없음도 통과했다. 스테이크가2026-10-16 일정의 ‘저녁 식사 · 비슈케크 SB bar’ 아래 day:4:dinner에1회 나타나며 방문 후 오프라인 새로고침에서도 decode됨을 확인했다. 전체 해설 그림·사마르칸트 숙소·준비물 저장·v12 캐시명/현재앱fixture→v13 전환·타 사이트 캐시 보존도 재통과했다. 실제 iPhone Safari·이번 PR 배포·라이브 환율·실제 과거 번들 전체 마이그레이션은 미검증이다.
