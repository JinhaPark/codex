// 숫자는 원단위로 보존하고 화면에서만 단위 변환·반올림합니다.
export default {
  "metadata": {
    "year": 2024,
    "source": "World Bank WDI",
    "retrievedAt": "2026-10-17",
    "sourceUpdatedAt": "2026-10-08",
    "snapshotPath": "data/wdi-2024-2026-10-17.json",
    "units": {
      "population": "persons",
      "gdpUsd": "current USD",
      "gdpPerCapitaUsd": "current USD/person",
      "remittancesPctGdp": "percent of GDP"
    },
    "indicators": {
      "population": "SP.POP.TOTL",
      "gdpUsd": "NY.GDP.MKTP.CD",
      "gdpPerCapitaUsd": "NY.GDP.PCAP.CD",
      "remittancesPctGdp": "BX.TRF.PWKR.DT.GD.ZS"
    }
  },
  "intro": "중앙아시아 5개국 비교이며 이번 여행 방문국은 우즈베키스탄·키르기스스탄·카자흐스탄입니다. 수치는 반올림했으며 구매력 차이를 반영하지 않습니다. 1인당 GDP는 평균 임금이나 가계소득이 아닙니다.",
  "alternateTurkmenistan": {
    "year": 2024,
    "gdpUsd": 68700000000,
    "gdpPerCapitaUsd": 9166,
    "source": "세계은행 투르크메니스탄 국가 개요",
    "url": "https://www.worldbank.org/en/country/turkmenistan/overview",
    "retrievedAt": "2026-10-17"
  },
  "countries": [
    {
      "iso3": "KAZ",
      "name": "카자흐스탄",
      "year": 2024,
      "population": 20592571,
      "gdpUsd": 291480274648.826,
      "gdpPerCapitaUsd": 14154.6324958076,
      "remittancesPctGdp": 0.08260553410117,
      "source": "World Bank WDI",
      "retrievedAt": "2026-10-17",
      "sourceUpdatedAt": "2026-10-08",
      "industries": "석유·우라늄·구리·금속·금융",
      "description": "대규모 원유·광물 수출과 금융·물류·제조업 병행. 국제유가와 송유관 경로에 민감"
    },
    {
      "iso3": "TKM",
      "name": "투르크메니스탄",
      "year": 2024,
      "population": 7494498,
      "gdpUsd": 44249447717.2312,
      "gdpPerCapitaUsd": 5904.25772576512,
      "remittancesPctGdp": null,
      "source": "World Bank WDI",
      "retrievedAt": "2026-10-17",
      "sourceUpdatedAt": "2026-10-08",
      "industries": "천연가스·석유화학·비료·면화",
      "description": "가스 수출에 집중된 국가주도 경제. 수출시장 편중과 통계 투명성이 과제"
    },
    {
      "iso3": "UZB",
      "name": "우즈베키스탄",
      "year": 2024,
      "population": 36361859,
      "gdpUsd": 121356065241.228,
      "gdpPerCapitaUsd": 3337.45492058664,
      "remittancesPctGdp": 13.6616648886765,
      "source": "World Bank WDI",
      "retrievedAt": "2026-10-17",
      "sourceUpdatedAt": "2026-10-08",
      "industries": "금·구리·자동차·섬유·화학·농업",
      "description": "최대 인구와 내수시장, 광업과 제조업 다각화. 전력·용수·일자리 확대가 과제"
    },
    {
      "iso3": "KGZ",
      "name": "키르기스스탄",
      "year": 2024,
      "population": 7221868,
      "gdpUsd": 18161630698.9052,
      "gdpPerCapitaUsd": 2514.81066933171,
      "remittancesPctGdp": 17.6042447290407,
      "source": "World Bank WDI",
      "retrievedAt": "2026-10-17",
      "sourceUpdatedAt": "2026-10-08",
      "industries": "금광·상업·관광·수력·농축산",
      "description": "서비스와 재수출·송금이 중요. 산악 물류와 금값·해외 노동시장 변동에 노출"
    },
    {
      "iso3": "TJK",
      "name": "타지키스탄",
      "year": 2024,
      "population": 10590927,
      "gdpUsd": 14425113699.7925,
      "gdpPerCapitaUsd": 1362.02559981695,
      "remittancesPctGdp": 47.1531186167275,
      "source": "World Bank WDI",
      "retrievedAt": "2026-10-17",
      "sourceUpdatedAt": "2026-10-08",
      "industries": "수력·알루미늄·금·안티몬·농업",
      "description": "수력발전 잠재력이 크고 송금 의존도가 높음. 산악 교통·전력 계절성이 제약"
    }
  ],
  "chapters": [
    {
      "title": "인구와 시장",
      "kind": "market"
    },
    {
      "title": "자원과 제조업",
      "body": "카자흐스탄은 원유·우라늄·금속, 투르크메니스탄은 천연가스, 우즈베키스탄은 금·구리와 자동차·섬유·화학이 특징입니다. 키르기스스탄은 금광과 서비스업, 타지키스탄은 수력·알루미늄·광업이 중요합니다."
    },
    {
      "title": "물·전력·농업",
      "body": "우즈베키스탄과 투르크메니스탄의 관개농업은 아무다리야·시르다리야 유역의 물 공급에 크게 의존합니다. 키르기스스탄과 타지키스탄의 상류 수력발전 운영은 하류의 농업용수 수요와 계절별 조정이 필요합니다."
    },
    {
      "title": "해외 송금 의존도",
      "kind": "remittances"
    },
    {
      "title": "철도·물류",
      "body": "카자흐스탄은 중국–유럽 육상교역과 원유 수송의 핵심 통로입니다. 우즈베키스탄은 역내 철도 교차점이지만 이중 내륙국이라 운송비가 높습니다. 중국–키르기스스탄–우즈베키스탄 철도는 건설 중인 사업으로 기존 운행 노선과 구별해야 합니다."
    },
    {
      "title": "중장기 산업 과제",
      "body": "카자흐스탄은 자원 의존 축소, 우즈베키스탄은 제조업 생산성·민간 일자리, 투르크메니스탄은 가스 수출 다변화, 키르기스스탄은 전력·관광·물류, 타지키스탄은 수력발전의 산업화와 송금 의존 완화가 주요 과제입니다."
    },
    {
      "title": "통계 주의사항",
      "kind": "statistics"
    }
  ],
  "sources": [
    {
      "name": "세계은행 WDI 인구 — 2024년, SP.POP.TOTL",
      "url": "https://api.worldbank.org/v2/country/KAZ;UZB;TKM;KGZ;TJK/indicator/SP.POP.TOTL?date=2024&format=json&source=2"
    },
    {
      "name": "세계은행 WDI 명목 GDP — 2024년, NY.GDP.MKTP.CD",
      "url": "https://api.worldbank.org/v2/country/KAZ;UZB;TKM;KGZ;TJK/indicator/NY.GDP.MKTP.CD?date=2024&format=json&source=2"
    },
    {
      "name": "세계은행 WDI 1인당 명목 GDP — 2024년, NY.GDP.PCAP.CD",
      "url": "https://api.worldbank.org/v2/country/KAZ;UZB;TKM;KGZ;TJK/indicator/NY.GDP.PCAP.CD?date=2024&format=json&source=2"
    },
    {
      "name": "세계은행 WDI 개인 송금 수입/GDP — 2024년, BX.TRF.PWKR.DT.GD.ZS",
      "url": "https://api.worldbank.org/v2/country/KAZ;UZB;TKM;KGZ;TJK/indicator/BX.TRF.PWKR.DT.GD.ZS?date=2024&format=json&source=2"
    },
    {
      "name": "세계은행 투르크메니스탄 국가 개요",
      "url": "https://www.worldbank.org/en/country/turkmenistan/overview"
    },
    {
      "name": "세계은행 The Road Home and Abroad: Enhancing TVET for Youths and Migration in Central Asia (2025) — 본문 1–3쪽, 우즈베키스탄·키르기스스탄·타지키스탄의 고용·이주 참고",
      "url": "https://documents1.worldbank.org/curated/en/099063025094197983/pdf/P500986-7d2be0d0-1f17-427a-afed-a0f0d69097a9.pdf"
    }
  ]
};
