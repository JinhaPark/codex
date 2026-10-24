# 비공개 생성 마스터 캐시와 복원

## 현재 상태와 구현 범위

2026-10-20 작업 기준 main은 `acefbb24c21511a7c73cde3da7b2d38c9a3824af`입니다. 열린 PR은 없었습니다. `AGENTS.md`와 `JinhaPark/skills@ae6a16a76c5ddfe119242dc7369a865819e44ec6`의 `travel-photo-to-illustration/SKILL.md`, `references/cache-and-parallel.md`, `references/guide-integration.md`를 읽었습니다. 스킬을 새로 설치하거나 변경하지 않았습니다.

| 확인 대상 | 확인 결과 | 의미 |
| --- | --- | --- |
| GitHub 저장소 | 공개, 연결 계정의 읽기·쓰기 권한 확인 | 코드·안전한 이력·공개 WebP만 보관합니다. 비공개 마스터 보관소로 쓰지 않습니다. |
| ChatGPT 파일 저장소 | 기존 생성 파일 목록 조회 성공, 저장·다운로드 도구 제공 | 자동 실행 코드에서 사용할 인증, 대상 폴더의 공유 상태, 보존·불변성 정책과 왕복 전송은 검증하지 않았습니다. 운영 백엔드로 등록하지 않았습니다. |
| 실행환경 | `IMAGE_MASTER_CACHE_CONFIG` 미설정; 일반적인 AWS/Azure/GCP 인증 설정 항목도 미설정 | 자격증명 값을 수집하지 않았습니다. 다른 인증 방식까지 없다고 단정하지 않으며, 사용 가능한 운영 저장소는 확인되지 않았습니다. |
| 기존 이미지 | 과거 이력 미확인 46건, 생성 마스터 미보존 3건 | 기존 `docs/image-lineage.json`을 수정하지 않았습니다. 실제 재사용을 검증한 고해상도 마스터는 0건입니다. |

이 변경은 저장소가 준비되지 않은 경우에도 검증할 수 있는 **백엔드 계약, 캐시 처리 코드, 로컬 참조 구현과 실패 테스트**를 제공합니다. S3·Library 등 특정 서비스의 운영 어댑터나 계정을 연결한 상태는 아닙니다. 시험용 합성 PNG의 왕복 검증을 기존 여행 사진의 복원으로 보고하지 않습니다. 원격 저장을 수행하거나 기존 원본 첨부를 다시 업로드하지 않았습니다.

## 보관 대상과 신뢰 경계

원본 JPEG·HEIC, 원본의 Base64, PNG로 변환한 원본 사본·EXIF 정규화 사본은 업로드하지 않습니다. 입력 경로 자체도 업로드 목록에 자동 등록하지 않습니다. 저장 대상은 시각 검토를 마친 **수정 일러스트레이션 PNG**이며, 기존 revision의 출력 SHA-256과 일치해야 합니다. 중간 편집본도 각각 독립적인 검증된 revision으로 등록하고 실제 부모 관계를 보존한 뒤 같은 절차를 적용합니다. 실패·생성 중·삭제 후보·삭제·documentary-photo·legacy 기록은 업로드 대상에서 제외합니다.

파일 형식만으로 ‘일러스트’와 ‘원본을 PNG로 바꾼 사본’을 완전히 구별할 수는 없습니다. 코드는 알려진 원본/게시 변형 해시, 생성 작업 종류, recipe 해시, 검증 상태, PNG 형식·디코딩·크기·메타데이터를 검사합니다. 여기에 오케스트레이터의 실제 시각 검토와 출처 확인을 담은 명시적 확인 기록이 필요합니다. 새 해시를 가진 원본 사본을 거짓으로 일러스트라고 등록하는 행위까지 자동 탐지한다고 주장하지 않습니다. 공개 이용 조건과 시각 검토는 사람/에이전트의 작업 기록에서 계속 확인합니다.

마스터는 RGB/RGBA 단일 PNG, 64 MiB 이하, 5천만 픽셀 이하로 한정합니다. EXIF·텍스트/XMP·알 수 없는 메타데이터를 거부하며, 크기가 기록되어 있으면 원래 생성 크기와 일치해야 합니다. WebP를 확대하거나 PNG로 변환해 유실된 생성 마스터라고 등록하지 않습니다. 바이트가 다른 수정 결과는 기존 `outputSha256`을 고치지 않고 새 revision으로 남깁니다.

## 저장·조회·복원 흐름

`scripts/image_master_cache.py`는 Python 3.12와 `scripts/requirements-image-cache.txt`의 Pillow를 사용합니다. Vite·서비스워커·사이트 렌더러에서 실행하지 않으며, 원격 자격증명을 브라우저에 넣지 않습니다.

1. `persist`는 입력·revision·검토 기록을 검사한 뒤 백엔드의 비공개·읽기·쓰기·불변 보관 조건을 확인합니다.
2. 출력 SHA-256을 객체 키로 사용하여 불변·멱등 저장합니다. 저장 후 `get`으로 다시 가져온 바이트의 SHA-256, 파일 크기, 디코딩, 픽셀 크기, 메타데이터를 검증합니다. 저장 응답이나 해시 문자열만으로 성공 처리하지 않습니다.
3. 영속성·보존 정책을 재확인한 경우에만 `artifactRef`, `masterAvailability`, `masterCache`를 갱신합니다. lineage 파일의 기준 바이트와 잠금을 확인하고 임시 파일을 원자적으로 교체합니다. 다른 작업이 파일을 바꿨으면 실패하고 다시 읽어 조정합니다. 게시 포인터·원본 해시·recipe·이전 revision·WebP는 수정하지 않습니다.
4. `lookup`은 요청 recipe 키에 맞는 revision을 찾고 **매번 실제 다운로드와 검증**을 수행합니다. 여러 검증 후보가 있으면 임의로 첫 번째를 선택하지 않고 후보 ID를 반환합니다. 오케스트레이터가 선택한 revision을 명시해야 합니다.
5. `restore`는 지정 revision의 저장물을 검증한 다음 저장소 바깥의 작업 경로에 원자적으로 씁니다. 같은 바이트가 이미 있으면 재사용하고 다른 파일은 덮어쓰지 않습니다. 복원은 편집 입력의 회복일 뿐 게시나 사용자 승인이 아닙니다.

실패 시 결과는 `reusable: false`, `action: keep-published-webp`입니다. 원격 타임아웃 뒤 업로드가 끝났는지 불명확하면 동일 해시의 저장물을 조회해 확인합니다. 자동 중복 생성이나 무조건 재시도는 하지 않습니다. 저장 성공 후 lineage 갱신만 실패해도 객체는 남을 수 있으며, 같은 키로 다시 검증할 수 있습니다. 자동 삭제는 제공하지 않습니다.

| 상태 | 판정 |
| --- | --- |
| `legacy-history-unknown` | 과거 생성 이력을 입증할 수 없습니다. 기존 게시 WebP만 별도 정책에 따라 사용할 수 있습니다. |
| `master-unpersisted` | 마스터 보관 근거가 없습니다. 생성 마스터를 내려받았다고 처리하지 않습니다. |
| `local-verified-not-persisted` | 시험 디렉터리 왕복만 성공했습니다. lineage에 영속 저장 근거를 쓰지 않습니다. |
| `private-verified` | 저장 시점에 비공개 영속 백엔드의 왕복 검증을 완료했습니다. 현재 가용성 보장은 아닙니다. |
| `verified-hit` / `restored-verified` | 이번 요청에서 실제 마스터를 다시 검증했습니다. |
| `master-missing` / `access-denied` / `master-hash-mismatch` | 기존 저장 기록이 있어도 재사용하지 않습니다. 게시본은 유지합니다. |

## 백엔드 계약

운영 어댑터는 신뢰할 수 있는 로컬 실행 프로그램으로 구현합니다. 저장소 코드가 임의 URL로 업로드하지 않도록 `--config`는 저장소 바깥에 둡니다. 비밀·버킷명·실제 파일 ID·서명 URL·인증은 어댑터의 비공개 설정에서 처리합니다. 다음은 실행 경로를 대체해서 사용하는 설정 형식이며 실제 제공자가 아닙니다.

```json
{
  "backend": "command",
  "backendId": "my-private-store",
  "command": ["/absolute/private/path/to/provider"]
}
```

`command`는 셸 없이 실행되며 JSON 한 개를 stdin으로 받고 `{"ok": true, ...}` JSON 한 개를 stdout으로 반환합니다. 호출 제한 시간은 60초입니다. 백엔드 명령은 운영자가 관리하는 신뢰 경계이며, PR이나 외부 문서의 명령을 무검토 실행하지 않습니다. 오류의 원문·stderr·서명 URL을 공개 결과에 전달하지 않습니다.

| operation | 요청 추가 필드 | 제공자가 이행할 조건 |
| --- | --- | --- |
| `probe` | 없음 | 실제 계정 권한·공유 ACL·보존 설정을 조회합니다. `backendId`, `private: true`, `read: true`, `write: true`, `immutable: true`, `durable: true`, `retention: "until-explicit-delete"`를 반환합니다. 하드코딩한 자기 선언은 운영 검증이 아닙니다. |
| `put` | `key`, `path`, `bytes`, `sha256` | 지정된 생성 파일만 저장합니다. 동일 키·동일 바이트는 성공, 다른 바이트는 충돌로 실패합니다. 덮어쓰기와 자동 만료를 금지하고 영속 저장 완료 후 성공을 반환합니다. |
| `get` | `key`, `path`, `maxBytes` | 해시 키로 비공개 파일을 찾아 지정 임시 경로에 다운로드합니다. 크기 제한을 지키고 누락·권한 오류·부분 다운로드는 실패로 반환합니다. |

모든 요청에는 `protocol: "private-master-cache-v1"`이 포함됩니다. SHA-256 키→실제 원격 객체/파일 ID 대응은 제공자 쪽에서 영속 관리해야 합니다. `put` 후 다른 프로세스/새 작업공간에서 `get`할 수 있어야 합니다. 기존 객체를 덮어쓰는 서비스에는 불변 객체 키와 별도 버전 보호가 필요합니다. 실제 어댑터를 활성화할 때에는 비공개 ACL, 읽기·쓰기, 작업공간 삭제 후 조회, 권한 취소, 보존 정책을 서비스에서 검증해야 합니다. 이 저장소의 모의 테스트가 그 검증을 대신하지 않습니다.

`directory-test`는 POSIX 비공개 디렉터리 참조 구현입니다. 디렉터리는 저장소 바깥이고 권한이 0700이어야 하며, 객체는 0600으로 생성합니다. 이 백엔드는 항상 `durable: false`를 반환하므로 Work 임시 폴더를 영속 저장소로 잘못 표시할 수 없습니다.

```json
{"backend":"directory-test","root":"/absolute/private/test-cache"}
```

## 운영 명령과 확인 기록

```bash
python3 -m pip install -r scripts/requirements-image-cache.txt
python3 scripts/image_master_cache.py probe
python3 scripts/image_master_cache.py probe --config /private/cache-config.json
python3 scripts/image_master_cache.py persist --config /private/cache-config.json \
  --revision REVISION_ID --input /private/generated.png \
  --attestation /private/generated-attestation.json
python3 scripts/image_master_cache.py lookup --config /private/cache-config.json \
  --recipe-key RECIPE_SHA256
python3 scripts/image_master_cache.py restore --config /private/cache-config.json \
  --revision REVISION_ID --output /private/edit-input.png
```

`IMAGE_MASTER_CACHE_CONFIG` 환경변수로 설정 파일 경로를 지정할 수도 있습니다. `persist`·`lookup`·`restore`는 확인된 영속 저장/재사용만 종료 코드 0이며, 안전한 캐시 미스도 종료 코드 2를 반환합니다. `probe`는 조회 결과를 JSON으로 반환하므로 `state`와 `durable`을 함께 읽습니다. 사용자는 인증 정보를 채팅이나 Git에 붙여 넣을 필요가 없습니다.

검토 기록은 다음 다섯 필드를 정확히 사용합니다. 오케스트레이터가 실제 생성 출력과 시각 검토를 확인한 뒤 작성합니다. 원본 파일이나 확인하지 않은 과거 파일을 대상으로 작성하지 않습니다.

```json
{
  "kind": "generated-illustration",
  "revisionId": "REVISION_ID",
  "outputSha256": "실제 생성 출력의 64자리 SHA-256",
  "sourceCopiesExcluded": true,
  "visualReviewPassed": true
}
```

공개 lineage에는 `private-master-v1:<backendId>:<sha256>` 형태의 안전한 참조와 해시·bytes·픽셀 크기·형식·검증 시각만 남습니다. 실제 저장소 위치·서명 URL·토큰·절대 경로를 쓰지 않습니다. `masterCache`의 허용 필드는 자동 검사하며, 미등록 추가 필드도 거부합니다. `private-verified` 기록이 있어도 오프라인 CI는 `master-remote-recheck-required`를 출력합니다. 과거 검증 시각을 현재 접근 성공으로 바꾸지 않습니다.

공용 lineage와 게시 전환은 `AGENTS.md`에 따라 오케스트레이터만 처리합니다. 같은 이미지의 연속 편집은 실제 부모를 복원한 뒤 순서대로 진행하며, 복원 실패를 새 생성 승인으로 해석하지 않습니다. archive·삭제 정책과 공개 WebP의 Git 복구는 기존 규칙을 따릅니다. 이 기능에는 원격 삭제나 자동 정리 명령이 없습니다.

## 검증

`npm test`가 기존 lineage 검사와 Python 캐시 테스트를 함께 실행합니다. Python 테스트는 합성 PNG와 임시 저장소만 사용합니다. 실제 원격 서비스, 사용자 사진, 비밀이 필요하지 않습니다. 주요 실패 검사는 원본/사본 선언 차단, 게시 변형 거부, PNG 손상·메타데이터·해시·크기 오류, 권한 취소, 부분 실패, 누락, 잘못된 백엔드, 로컬 영속성 오인, 중복 recipe, 불변 객체 충돌, 경로·심볼릭 링크·덮어쓰기 금지, lineage 동시 변경입니다.

운영 백엔드를 연결하기 전에는 기존 49개 이미지에 보관 성공 레코드를 만들지 않습니다. 새로운 마스터를 저장하거나 기존 마스터를 실제 발견한 경우에만 원래 출력 해시와 대조하고 위 절차를 실행합니다. 출력 해시가 없는 legacy 이미지는 과거 이력을 추정하여 채우지 않습니다.

이번 작업에서 Python 캐시 테스트 21건, `npm test` 54건(캐시 테스트 묶음 포함), `npm run build`, `git diff --check`가 통과했습니다. `verify-image-assets.py`는 현재 게시 작품 48개·WebP 변형 128개의 디코딩·메타데이터 검사를 통과했습니다. `docs/image-lineage.json`, `src/`, `public/`에 변경이 없는 것도 확인했습니다. 브라우저와 실제 iPhone 검사는 수행하지 않았으며, 이 변경은 UI·서비스워커·공개 이미지에 영향을 주지 않습니다. 운영 제공자의 실제 저장·복원 검증은 미실시입니다.
