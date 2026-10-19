# 캡션·그림 선택 수정

- 기준 main: `b0237a793ba70e4b0c25020d83fc91148dd09edc`
- 적용 스킬: `JinhaPark/skills@3873d40c8d66ce016435a76de0573b87b7ec0cbb`의 travel-photo-to-illustration, cache-and-parallel, guide-integration 규칙입니다.
- 사용자 요청으로 `travel-meal-tray-pencil`을 manifest·관광지 감사표에서 제외했습니다. 레코드와 revision은 archived로 전환하고 activeRevisionId·placement를 null로 바꿨습니다. 마지막 게시 revision과 WebP 3개는 보관하며 삭제하지 않았습니다. 이 파일은 직접 URL로는 계속 접근할 수 있습니다.
- 캡션을 “텐산산맥 아래 가을빛 포도밭”, “조로아스터교 토제유골함”으로 수정했습니다. 포도밭의 대체 텍스트와 감사표도 사용자 설명에 맞췄으며 세부 촬영 지점은 추정하지 않았습니다.
- 종합 역사 해설의 고구려 사절 관련 두 문단을 사용자가 지정하신 한 문장으로 교체했습니다. 이는 요청 문구의 편집 반영이며 새로운 학술 검증을 수행한 기록이 아닙니다.
- 시각 편집·그림 재생성·원본 업로드는 수행하지 않았습니다. WebP 바이트와 기존 revision의 편집 이력은 변경하지 않았습니다.
- 기존 파일 목록 검사는 manifest와 보관 중인 revision 자산의 합집합을 검사하도록 맞췄습니다. 보관 자산의 실제 해시·bytes·디코딩·크기·메타데이터도 계속 검사합니다.
- 서비스워커 캐시는 `ca26-pages-v20-caption-and-selection`으로 갱신했고 관련 테스트와 브라우저 fixture도 맞췄습니다.
- 검증: npm test 50개 통과, npm run build 성공, Pillow 게시 이미지 48개·128개 변형 디코딩 성공입니다. 보관한 식판 변형 3개도 검사했습니다. 실제 iPhone 검증은 미실시입니다.
