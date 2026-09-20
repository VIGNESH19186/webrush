export const TYPES = ["MUSIC","MOVIES","PLACES","PURCHASES","PHOTOS","MESSAGES","SEARCHES","EVENTS","NOTES"];

export const typeAliases = {
  PLACE: "PLACES", PURCHASE: "PURCHASES", PHOTO: "PHOTOS",
  MESSAGE: "MESSAGES", SEARCH: "SEARCHES", EVENT: "EVENTS", NOTE: "NOTES"
};

export function normalizeType(type) {
  return typeAliases[type] || type;
}

export function groupByDate(receipts) {
  return receipts.reduce((acc, r) => {
    (acc[r.date] ||= []).push(r);
    return acc;
  }, {});
}

export function groupByLocation(receipts) {
  return receipts.reduce((acc, r) => {
    if (!r.location) return acc;
    (acc[r.location] ||= []).push(r);
    return acc;
  }, {});
}

function keywordOverlap(a, b) {
  const A = new Set(a.keywords || []);
  return (b.keywords || []).filter(k => A.has(k)).length;
}

export function calculateConnectionScore(a, b) {
  if (a.id === b.id) return 0;
  let score = 0;
  if (a.date === b.date) score += 1;
  if (a.location && a.location === b.location) score += 2;
  const diff = Math.abs(new Date(a.timestamp) - new Date(b.timestamp)) / 60000;
  if (diff <= 60) score += 2;
  else if (diff <= 180) score += 1;
  score += Math.min(keywordOverlap(a, b) * 2, 4);
  if ((a.metadata?.eventId && a.metadata.eventId === b.metadata?.eventId)) score += 3;
  if (a.type === "EVENT" || b.type === "EVENT") {
    if (keywordOverlap(a, b) > 0) score += 2;
  }
  return score;
}

export function findConnections(receipts, threshold = 4) {
  const edges = [];
  for (let i = 0; i < receipts.length; i++) {
    for (let j = i + 1; j < receipts.length; j++) {
      const score = calculateConnectionScore(receipts[i], receipts[j]);
      if (score >= threshold) edges.push({ source: receipts[i].id, target: receipts[j].id, score });
    }
  }
  return edges.sort((a,b) => b.score - a.score);
}

export function connectionCountMap(receipts, edges = findConnections(receipts)) {
  const map = Object.fromEntries(receipts.map(r => [r.id, 0]));
  edges.forEach(e => { map[e.source]++; map[e.target]++; });
  return map;
}

export function findPatterns(receipts) {
  const patterns = [];
  const late = receipts.filter(r => Number(r.time.split(":")[0]) < 5 && r.time.includes("AM"));
  if (late.length >= 4) patterns.push({
    tag:"TIME PATTERN", title:"Midnight activity pattern",
    text:`${late.length} receipts cluster between midnight and 5 AM.`,
    value:`${late.length} late-night moments`, ids:late.map(r=>r.id)
  });

  const locations = groupByLocation(receipts);
  const topLocation = Object.entries(locations).sort((a,b)=>b[1].length-a[1].length)[0];
  if (topLocation) patterns.push({
    tag:"PLACE PATTERN", title:`${topLocation[0]} keeps returning`,
    text:`This location appears across ${topLocation[1].length} separate digital moments.`,
    value:`${topLocation[1].length} moments`, ids:topLocation[1].map(r=>r.id)
  });

  const purchases = receipts.filter(r=>r.type==="PURCHASE");
  const purchaseNames = {};
  purchases.forEach(r => purchaseNames[r.title] = (purchaseNames[r.title]||0)+1);
  const repeat = Object.entries(purchaseNames).find(([,n])=>n>1);
  if (repeat) patterns.push({
    tag:"REPEAT PATTERN", title:`Repeated purchase: ${repeat[0]}`,
    text:"The same purchase appears more than once in the receipt trail.",
    value:`${repeat[1]} repeats`, ids:purchases.filter(r=>r.title===repeat[0]).map(r=>r.id)
  });

  const music = receipts.filter(r=>r.type==="MUSIC");
  const musicPlace = music.filter(m => receipts.some(r => r.id!==m.id && r.location===m.location));
  if (musicPlace.length) patterns.push({
    tag:"CROSS-SIGNAL", title:"Music follows familiar places",
    text:`${musicPlace.length} music receipts share locations with other activity.`,
    value:`${musicPlace.length} linked tracks`, ids:musicPlace.map(r=>r.id)
  });

  const events = receipts.filter(r=>r.type==="EVENT");
  if (events.length) patterns.push({
    tag:"EVENT PATTERN", title:"Plans leave digital echoes",
    text:`${events.length} events are surrounded by messages, places, searches or purchases.`,
    value:`${events.length} anchor events`, ids:events.map(r=>r.id)
  });

  return patterns;
}

export function calculateStatistics(receipts) {
  return {
    moments: receipts.length,
    chapters: generateChapters(receipts).length,
    connections: findConnections(receipts).length,
    patterns: findPatterns(receipts).length
  };
}

export function generateChapters(receipts) {
  const locations = groupByLocation(receipts);
  const chapters = [];
  const late = receipts.filter(r => Number(r.time.split(":")[0]) < 5 && r.time.includes("AM"));
  if (late.length >= 4) chapters.push({
    title:"THE MIDNIGHT ERA", eyebrow:"01 / TIME SIGNATURE",
    dates:`${late[0].date} — ${late[late.length-1].date}`,
    stats:[`${late.length} late-night activities`,`music + searches`,`messages + notes`],
    description:"Your digital activity repeatedly concentrated after midnight. Work, music, messages and small decisions began sharing the same hours.",
    ids:late.map(r=>r.id)
  });
  const movie = receipts.filter(r => r.type==="MOVIES" || r.type==="EVENT" && r.keywords?.includes("movie"));
  if (movie.length >= 2) chapters.push({
    title:"THE MOVIE PHASE", eyebrow:"02 / ENTERTAINMENT",
    dates:`${movie[0].date} — ${movie[movie.length-1].date}`,
    stats:[`${movie.length} movie signals`,`cinema activity`,`friend messages`],
    description:"Entertainment receipts start behaving like anchors: plans, purchases, photos and messages gather around them.",
    ids:movie.map(r=>r.id)
  });
  const top = Object.entries(locations).sort((a,b)=>b[1].length-a[1].length)[0];
  if (top) chapters.push({
    title:"THE FAMILIAR PLACE", eyebrow:"03 / LOCATION",
    dates:`${top[1][0].date} — ${top[1][top[1].length-1].date}`,
    stats:[`${top[1].length} visits / signals`,`${new Set(top[1].map(r=>r.type)).size} receipt types`,"repeat behavior"],
    description:`${top[0]} appears often enough to become more than a coordinate. Music, photos, purchases and searches all leave traces there.`,
    ids:top[1].map(r=>r.id)
  });
  const work = receipts.filter(r => r.keywords?.some(k => ["work","design","hackathon","project"].includes(k)));
  if (work.length >= 5) chapters.push({
    title:"THE BUILD MODE", eyebrow:"04 / CREATION",
    dates:`${work[0].date} — ${work[work.length-1].date}`,
    stats:[`${work.length} work signals`,`design + research`,`notes + music`],
    description:"The receipts shift from consumption to creation: searches become notes, places become workspaces, and music becomes a background signal.",
    ids:work.map(r=>r.id)
  });
  return chapters;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", { day:"2-digit", month:"short", year:"numeric" }).format(new Date(date+"T00:00:00"));
}