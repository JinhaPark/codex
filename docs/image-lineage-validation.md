# 이미지 이력 자동 검증

## 실행과 범위

`npm test`가 `tests/image-lineage.test.js`를 통해 `scripts/validate-image-lineage.js`를 실행합니다. manifest와 active 이미지의 일대일 대응, 중복 ID, 게시 위치·변형 메타데이터, 활성 revision의 존재·상태, WebP의 실제 SHA-256·bytes, 편집 부모의 소유 이미지·원본·출력 해시·순환, 교체 참조를 검사합니다. archived/deletion-candidate/deleted 레코드는 manifest에 게시하지 않고 tombstone으로 유지합니다.

PR CI는 `github.event.pull_request.base.sha`, main push CI는 `github.event.before`를 기준으로 변경 전 이력과 비교합니다. 전체 Git 이력을 checkout하여 기준 파일과 복원 참조를 읽습니다. 수동 배포는 해당 SHA를, 로컬은 HEAD를 기본 기준으로 사용합니다. 임의 기준 검증은 `IMAGE_LINEAGE_BASE=<commit> npm test`로 실행합니다. 기준 파일을 읽지 못하면 검사를 생략하지 않고 실패합니다. 로컬에서 커밋한 변경의 전환을 다시 확인하려면 변경 전 SHA를 명시합니다.

완료된 revision의 부모·recipe·해시·변형 등은 불변입니다. 이미지·revision 삭제 대신 tombstone을 보존하며, 교체된 활성 revision은 archived로 전환합니다. 수명주기 변경에는 새로운 `lifecycleChangedAt`과 `lifecycleReason`이 필요합니다.

허용 전환은 다음과 같습니다. 같은 상태 유지도 허용합니다.

| 기존 상태 | 허용하는 다음 상태 |
| --- | --- |
| active | archived |
| archived | active, deletion-candidate |
| deletion-candidate | archived, deleted |
| deleted | 없음 |

사용 중단 시 manifest에서 제거하고 `placement`·`activeRevisionId`를 null로 바꾸며 `lastPublishedRevisionId`는 유지합니다. 삭제된 파일은 작업 트리에 없어야 하고, 살아 있는 다른 revision이나 편집 자식이 참조하면 안 됩니다. 삭제 revision의 복원 참조는 다음 형식을 사용합니다.

```json
{
  "historyArtifactRef": {
    "commitSha": "실제 존재하는 40자리 Git SHA",
    "variants": [
      { "file": "public/illustrations/example-800.webp", "sha256": "64자리 SHA-256" }
    ]
  }
}
```

복원 참조는 `git show commit:path`의 실제 바이트로 검증합니다. 검사는 삭제 승인이나 정리 작업을 수행하지 않습니다. 열린 PR·진행 작업·외부 보관소·렌더러의 임의 문자열 참조 등 저장소 이력 JSON 밖의 보존 근거와 사용자 정리 승인은 AGENTS.md에 따른 별도 검토가 필요합니다.

## 오류와 보존 한계 구분

- `legacy-verified`는 `legacy-publication-snapshot`, `historyStatus: unknown`, null 부모를 갖는 기존 이관 기록에만 사용합니다. `legacy-history-unknown` 알림을 출력하며 과거 해시·부모·시각 승인을 추정하지 않습니다. 기존 기준에 없는 revision에 이 상태를 새로 부여하면 실패합니다. 게시 WebP 해시·bytes 검사는 동일하게 수행합니다.
- 생성 마스터의 `artifactRef: null`은 `masterAvailability`에 missing/unpersisted를 명시하면 `master-unpersisted` 알림으로 보고합니다. WebP 검증 성공은 생성 마스터 보존을 뜻하지 않습니다. 원격 마스터의 실제 접근 가능성은 이 오프라인 검사 범위 밖입니다.
- 원본 `sourceArtifactRef`는 null이어야 합니다. 원본 JPEG·HEIC나 Base64 복사본을 생성·게시하지 않습니다.
- 참조 누락·순환·게시 불일치·SHA-256·bytes 불일치·불법 전환은 오류로 처리합니다. 오류 주입 fixture와 정상 archive/교체/삭제 fixture를 함께 검사하여 검증기 자체의 회귀도 확인합니다.

## 이번 검증 기준

- 저장소 기준: `cc79e09452032f5f9b6f94dcab45a399b1f307ab`
- 읽은 travel-photo-to-illustration 스킬 및 cache-and-parallel 규칙: `JinhaPark/skills@3873d40c8d66ce016435a76de0573b87b7ec0cbb`
- 기존 49개 이미지의 manifest·대응표·WebP·원고는 변경하지 않았습니다.
- 기존 이력 미확인 46건, 생성 마스터 미보존 3건은 오류와 구분합니다.
