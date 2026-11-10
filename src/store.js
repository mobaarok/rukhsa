import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translate, isRtl } from './i18n';
import { SIGNS } from './data/signs';
import { QUESTIONS } from './data/questions';

const KEY = 'rukhsa.v1';
export const EXAM_SIZE = 20;
export const PASS_PCT = 85; // TODO: confirm the current official pass mark.

// Leitner spaced repetition: higher box = longer before the sign comes back.
const BOX_DELAY_MIN = [0, 10, 60 * 24, 60 * 24 * 3, 60 * 24 * 7, 60 * 24 * 21];
export const MASTERED_BOX = 3;

const empty = { lang: null, signs: {}, qs: {}, exams: [] };
const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(empty);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setState({ ...empty, ...JSON.parse(raw) }); })
      .catch(() => {})
      .finally(() => { loaded.current = true; setReady(true); });
  }, []);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const api = useMemo(() => {
    const lang = state.lang || 'en';
    return {
      ready, state, lang,
      rtl: isRtl(lang),
      t: (k, v) => translate(lang, k, v),
      L: (obj) => (obj ? obj[lang] || obj.en : ''),
      setLang: (l) => setState((s) => ({ ...s, lang: l })),
      reset: () => setState((s) => ({ ...empty, lang: s.lang })),
      rateSign: (id, ok) => setState((s) => {
        const cur = s.signs[id] || { box: 0, seen: 0, correct: 0 };
        const box = ok ? Math.min(cur.box + 1, BOX_DELAY_MIN.length - 1) : 0;
        const next = { box, seen: cur.seen + 1, correct: cur.correct + (ok ? 1 : 0), due: Date.now() + BOX_DELAY_MIN[box] * 60000 };
        return { ...s, signs: { ...s.signs, [id]: next } };
      }),
      answerQ: (id, ok) => setState((s) => {
        const cur = s.qs[id] || { seen: 0, correct: 0 };
        return { ...s, qs: { ...s.qs, [id]: { seen: cur.seen + 1, correct: cur.correct + (ok ? 1 : 0), last: ok } } };
      }),
      saveExam: (score, total) => setState((s) => ({
        ...s,
        exams: [{ at: Date.now(), score, total, passed: (score / total) * 100 >= PASS_PCT }, ...s.exams].slice(0, 30),
      })),
    };
  }, [state, ready]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

// ---------- derived stats ----------
export function signStatus(p) {
  if (!p || !p.seen) return 'new';
  return p.box >= MASTERED_BOX ? 'mastered' : 'learning';
}

export function dueSigns(state, n = 10) {
  const now = Date.now();
  const scored = SIGNS.map((sg) => {
    const p = state.signs[sg.id];
    // new signs first-ish, then overdue low boxes; mastered & not due go last
    const pri = !p ? 1 : p.due <= now ? 0 - (5 - p.box) : 10 + p.box;
    return { sg, pri: pri + Math.random() * 0.5 };
  });
  return scored.sort((a, b) => a.pri - b.pri).slice(0, n).map((x) => x.sg);
}

export function countDue(state) {
  const now = Date.now();
  return SIGNS.filter((sg) => { const p = state.signs[sg.id]; return !p || p.due <= now; }).length;
}

export function stats(state) {
  const answeredIds = Object.keys(state.qs);
  const seen = answeredIds.reduce((a, id) => a + state.qs[id].seen, 0);
  const correct = answeredIds.reduce((a, id) => a + state.qs[id].correct, 0);
  const mastered = SIGNS.filter((sg) => signStatus(state.signs[sg.id]) === 'mastered').length;
  const lastRight = QUESTIONS.filter((x) => state.qs[x.id] && state.qs[x.id].last).length;
  const recent = state.exams.slice(0, 3);
  const examPct = recent.length ? recent.reduce((a, e) => a + e.score / e.total, 0) / recent.length : 0;
  const bankPct = lastRight / QUESTIONS.length;
  const signPct = mastered / SIGNS.length;
  const readiness = Math.round(100 * (recent.length ? 0.5 * examPct + 0.3 * bankPct + 0.2 * signPct : 0.6 * bankPct + 0.4 * signPct * 0.8));
  return {
    seen, accuracy: seen ? Math.round((correct / seen) * 100) : 0,
    mastered, totalSigns: SIGNS.length,
    passed: state.exams.filter((e) => e.passed).length,
    readiness: Math.min(100, readiness),
  };
}

export function topicStats(state, topic) {
  const list = QUESTIONS.filter((x) => x.topic === topic);
  let seen = 0, correct = 0;
  list.forEach((x) => { const p = state.qs[x.id]; if (p) { seen += p.seen; correct += p.correct; } });
  return { total: list.length, pct: seen ? Math.round((correct / seen) * 100) : null };
}

export const weakQuestions = (state) => QUESTIONS.filter((x) => state.qs[x.id] && state.qs[x.id].last === false);

// ---------- helpers ----------
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Build a playable question with shuffled option order. `order[k]` = original option index.
export const prepare = (qq) => ({ ...qq, order: shuffle([0, 1, 2, 3]) });
