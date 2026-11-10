import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R, GRAD, shadow } from '../theme';
import { useStore, shuffle, prepare, weakQuestions, EXAM_SIZE, PASS_PCT } from '../store';
import { QUESTIONS } from '../data/questions';
import { signById } from '../data/signs';
import SignGraphic from '../components/SignGraphic';
import SessionHeader from '../components/SessionHeader';
import Option from '../components/Option';
import { T, Button, ArChip, Ring, buzz, Pill } from '../components/ui';

export default function Quiz({ nav, params }) {
  const { mode, topic } = params;
  const { t, L, state, answerQ, saveExam, rtl } = useStore();
  const ins = useSafeAreaInsets();
  const isMock = mode === 'mock';

  const items = useMemo(() => {
    let pool = mode === 'weak' ? weakQuestions(state) : mode === 'topic' ? QUESTIONS.filter((x) => x.topic === topic) : QUESTIONS;
    pool = shuffle(pool);
    if (isMock) pool = pool.slice(0, EXAM_SIZE);
    return pool.map(prepare);
  }, []);

  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]); // original option index chosen per question
  const [done, setDone] = useState(false);

  if (!items.length) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <SessionHeader onClose={nav.pop} progress={0} label="" />
        <View style={styles.empty}>
          <Text style={{ fontSize: 56 }}>🎉</Text>
          <T center style={styles.emptyH}>{t('noWeak')}</T>
          <T center style={styles.emptySub}>{t('noWeakSub')}</T>
          <Button title={t('backHome')} onPress={nav.pop} style={{ marginTop: 24, alignSelf: 'stretch' }} />
        </View>
      </View>
    );
  }

  if (done) return <Result nav={nav} items={items} answers={answers} isMock={isMock} />;

  const item = items[i];
  const last = i === items.length - 1;
  const chosenOrig = pick === null ? null : item.order[pick];

  const advance = (orig) => {
    const nextAnswers = [...answers, orig];
    setAnswers(nextAnswers);
    setPick(null);
    setChecked(false);
    if (last) {
      nextAnswers.forEach((a, k) => answerQ(items[k].id, a === 0));
      if (isMock) saveExam(nextAnswers.filter((a) => a === 0).length, items.length);
      setDone(true);
    } else setI(i + 1);
  };

  const onCheck = () => { setChecked(true); buzz(chosenOrig === 0); };

  const optState = (k) => {
    const orig = item.order[k];
    if (isMock || !checked) return k === pick ? 'selected' : 'idle';
    if (orig === 0) return 'correct';
    if (k === pick) return 'wrong';
    return 'dim';
  };

  const sign = item.sign && signById[item.sign];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <SessionHeader onClose={nav.confirmClose} progress={(i / items.length) * 100} label={`${i + 1}/${items.length}`} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }}>
        <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', gap: 8, marginBottom: 12 }}>
          <Pill label={isMock ? t('mockExam') : t('topic_' + item.topic)} />
        </View>
        {sign && <View style={styles.signBox}><SignGraphic sign={sign} size={140} /></View>}
        <T style={styles.q}>{L(item.q)}</T>
        <ArChip text={item.ar} style={{ marginTop: 10, alignSelf: rtl ? 'flex-end' : 'flex-start' }} />
        <View style={{ gap: 10, marginTop: 18 }}>
          {item.order.map((orig, k) => (
            <Option key={k} index={k} label={L(item.o)[orig] ?? item.o.en[orig]} state={optState(k)}
              onPress={() => { if (!checked) setPick(k); }} />
          ))}
        </View>
        {!isMock && checked && (
          <View style={[styles.feedback, { backgroundColor: chosenOrig === 0 ? C.successSoft : C.dangerSoft }]}>
            <T style={[styles.fbH, { color: chosenOrig === 0 ? C.success : C.danger }]}>{chosenOrig === 0 ? t('correct') : t('wrong')}</T>
            <T style={styles.fbBody}><Text style={{ fontWeight: '800' }}>{t('whyLabel')}: </Text>{L(item.why)}</T>
          </View>
        )}
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingBottom: ins.bottom + 16, paddingTop: 8 }}>
        {isMock || checked ? (
          <Button title={last ? t('finish') : t('next')} disabled={pick === null} onPress={() => advance(chosenOrig)} />
        ) : (
          <Button title={t('check')} disabled={pick === null} onPress={onCheck} />
        )}
      </View>
    </View>
  );
}

function Result({ nav, items, answers, isMock }) {
  const { t, L, rtl } = useStore();
  const ins = useSafeAreaInsets();
  const score = answers.filter((a) => a === 0).length;
  const pct = Math.round((score / items.length) * 100);
  const passed = pct >= PASS_PCT;
  const [show, setShow] = useState(false);
  const row = rtl ? 'row-reverse' : 'row';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: ins.bottom + 24 }}>
      <LinearGradient colors={passed ? GRAD.hero : ['#7A2323', '#3E1010']} style={[styles.resHero, { paddingTop: ins.top + 30 }]}>
        <Ring value={pct} size={170} stroke={14} color={passed ? C.gold : '#FF8A8A'}>
          <Text style={styles.resPct}>{pct}%</Text>
          <Text style={styles.resScore}>{score}/{items.length}</Text>
        </Ring>
        <Text style={styles.resH}>{isMock ? (passed ? t('passed') : t('failed')) : t('sessionDone')}</Text>
        {isMock && <Text style={styles.resSub}>{passed ? t('passedSub') : t('failedSub', { p: PASS_PCT })}</Text>}
      </LinearGradient>

      <View style={{ padding: 20, gap: 12 }}>
        <Button title={t('tryAgain')} onPress={nav.replay} />
        <Button title={show ? '▲  ' + t('reviewAnswers') : '▼  ' + t('reviewAnswers')} variant="ghost" onPress={() => setShow(!show)} />
        <Button title={t('backHome')} variant="ghost" onPress={nav.pop} />

        {show && items.map((it, k) => {
          const ok = answers[k] === 0;
          const opts = L(it.o);
          return (
            <View key={it.id} style={[styles.rev, { borderColor: ok ? C.success : C.danger }]}>
              <View style={{ flexDirection: row, gap: 8, alignItems: 'center' }}>
                <Pill label={String(k + 1)} color={ok ? C.success : C.danger} bg={ok ? C.successSoft : C.dangerSoft} />
                <T style={{ flex: 1, fontWeight: '700' }}>{L(it.q)}</T>
              </View>
              {!ok && <T style={styles.revWrong}>✗ {t('yourAnswer')}: {opts[answers[k]]}</T>}
              <T style={styles.revRight}>✓ {t('correctAnswer')}: {opts[0]}</T>
              <T style={styles.revWhy}>{L(it.why)}</T>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  signBox: { alignItems: 'center', backgroundColor: C.card, borderRadius: R.xl, paddingVertical: 20, marginBottom: 18, ...shadow },
  q: { fontSize: 20, fontWeight: '800', lineHeight: 28 },
  feedback: { marginTop: 16, borderRadius: R.md, padding: 16 },
  fbH: { fontSize: 17, fontWeight: '900' },
  fbBody: { marginTop: 8, color: C.ink2, lineHeight: 22 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyH: { fontSize: 22, fontWeight: '900', marginTop: 12 },
  emptySub: { color: C.muted, marginTop: 8, lineHeight: 22 },
  resHero: { alignItems: 'center', paddingBottom: 34, paddingHorizontal: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  resPct: { color: C.white, fontSize: 42, fontWeight: '900' },
  resScore: { color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: '700' },
  resH: { color: C.white, fontSize: 28, fontWeight: '900', marginTop: 20 },
  resSub: { color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 6, textAlign: 'center' },
  rev: { backgroundColor: C.card, borderRadius: R.md, padding: 14, borderLeftWidth: 4, gap: 6 },
  revWrong: { color: C.danger, fontSize: 14 },
  revRight: { color: C.success, fontSize: 14, fontWeight: '700' },
  revWhy: { color: C.muted, fontSize: 13, lineHeight: 19 },
});
