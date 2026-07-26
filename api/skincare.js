// Vercel Serverless Function
// 환경변수 NOTION_TOKEN 에 노션 인테그레이션 시크릿을 넣어두면
// 이 함수가 서버에서만 그 시크릿을 사용해 노션 API를 호출합니다.
// 프론트엔드(index.html)는 이 함수의 결과만 받아서 그립니다.

const LOG_DB = "3420494c-783c-8076-b8c5-e57302396ef7"; // 스킨케어 로그
const PRODUCTS_DB = "3420494c-783c-8046-86a1-ecda9e1b9991"; // 제품 목록

const NOTION_HEADERS = (token) => ({
  Authorization: `Bearer ${token}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
});

async function queryAll(dbId, token, body = {}) {
  let results = [];
  let cursor;
  do {
    const r = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: "POST",
      headers: NOTION_HEADERS(token),
      body: JSON.stringify({ ...body, start_cursor: cursor }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || `Notion API error (${r.status}) on ${dbId}`);
    results = results.concat(j.results || []);
    cursor = j.has_more ? j.next_cursor : undefined;
  } while (cursor);
  return results;
}

function textVal(prop) {
  return prop?.rich_text?.[0]?.plain_text || "";
}
function multiSelectNames(prop) {
  return (prop?.multi_select || []).map((o) => o.name);
}
function relationIds(prop) {
  return (prop?.relation || []).map((r) => r.id);
}

// 한국 시간(KST) 기준 날짜 문자열 포맷터
function fmtDate(d) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
}

// 한국 시간(KST) 기준으로 지난주 월요일 ~ 다음주 일요일(21일) 범위를 구한다.
function getKstRange() {
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const nowKst = new Date(Date.now() + KST_OFFSET);
  const day = nowKst.getUTCDay(); // 0=일 .. 6=토
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const thisMonday = new Date(nowKst);
  thisMonday.setUTCDate(nowKst.getUTCDate() + diffToMonday);
  thisMonday.setUTCHours(0, 0, 0, 0);

  const start = new Date(thisMonday);
  start.setUTCDate(thisMonday.getUTCDate() - 7);
  const end = new Date(thisMonday);
  end.setUTCDate(thisMonday.getUTCDate() + 13);

  // 트러블 트렌드용: 최근 6개월(약 182일) 전부터
  const trendStart = new Date(nowKst);
  trendStart.setUTCHours(0, 0, 0, 0);
  trendStart.setUTCDate(trendStart.getUTCDate() - 182);

  return {
    startStr: fmtDate(start),
    endStr: fmtDate(end),
    trendStartStr: fmtDate(trendStart),
  };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    res.status(500).json({ error: "NOTION_TOKEN 환경변수가 설정되지 않았습니다." });
    return;
  }

  try {
    const { startStr, endStr, trendStartStr } = getKstRange();

    // 1) 제품 목록 -> 축약명 매핑
    const products = await queryAll(PRODUCTS_DB, token);
    const productMap = {};
    products.forEach((p) => {
      const name = p.properties["제품명"]?.title?.[0]?.plain_text || "";
      const abbr = textVal(p.properties["축약명"]);
      productMap[p.id] = abbr || name;
    });

    // 2) 스킨케어 로그 — 트러블 트렌드 기간(6개월 전)부터 다음주까지 한 번에 조회
    const logs = await queryAll(LOG_DB, token, {
      filter: {
        and: [
          { property: "날짜", date: { on_or_after: trendStartStr } },
          { property: "날짜", date: { on_or_before: endStr } },
        ],
      },
      sorts: [{ property: "날짜", direction: "ascending" }],
    });

    const data = logs
      .filter((pg) => {
        const d = pg.properties["날짜"]?.date?.start?.slice(0, 10);
        return d && d >= startStr && d <= endStr;
      })
      .map((pg) => {
        const props = pg.properties;
        const date = props["날짜"]?.date?.start;
        return {
          date: date.slice(0, 10),
          morning: {
            skin: multiSelectNames(props["아침 피부상태"]),
            products: relationIds(props["아침"]).map((id) => productMap[id]).filter(Boolean),
            memo: textVal(props["아침 메모"]),
          },
          night: {
            skin: multiSelectNames(props["저녁 피부상태"]),
            products: relationIds(props["저녁"]).map((id) => productMap[id]).filter(Boolean),
            memo: textVal(props["저녁 메모"]) || textVal(props["텍스트"]),
            actives: multiSelectNames(props["저녁 액티브"]),
            care: multiSelectNames(props["저녁 관리"]),
          },
        };
      });

    // 3) 트러블 트렌드 — 아침/저녁 피부상태("부위/증상")에서 증상(슬래시 뒤쪽)만 추출해 날짜별로 합치고 중복 제거
    function symptomsOf(prop) {
      return multiSelectNames(prop).map((name) => {
        const idx = name.indexOf("/");
        return idx === -1 ? name : name.slice(idx + 1);
      });
    }
    const troubleMap = {};
    logs.forEach((pg) => {
      const date = pg.properties["날짜"]?.date?.start?.slice(0, 10);
      if (!date) return;
      const symptoms = [
        ...symptomsOf(pg.properties["아침 피부상태"]),
        ...symptomsOf(pg.properties["저녁 피부상태"]),
      ];
      if (!symptoms.length) return;
      if (!troubleMap[date]) troubleMap[date] = new Set();
      symptoms.forEach((s) => troubleMap[date].add(s));
    });
    const troubles = Object.entries(troubleMap).map(([date, set]) => ({
      date,
      symptoms: Array.from(set),
    }));

    res.status(200).json({
      range: { startStr, endStr, trendStartStr },
      data,
      troubles,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
