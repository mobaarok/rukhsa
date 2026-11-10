import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R, shadow } from '../theme';
import { useStore, dueSigns, shuffle } from '../store';
import { SIGNS } from '../data/signs';
import SignGraphic from '../components/SignGraphic';
import SessionHeader from '../components/SessionHeader';
import { T, Button, ArChip, buzz } from '../components/ui';
import Option from '../components/Option';
import SessionDone from './SessionDone';

export default function SignQuiz({ nav }) {
  const { t, L, state, rateSign, rtl } = useStore();
  const ins = useSafeAreaInsets();
  const items = useMemo(() => dueSigns(state, 10).map((sg) => {
    // distractors: prefer same category so the quiz is not too easy
    const same = shuffle(SIGNS.filter((x) => x.id !== sg.id && x.cat === sg.cat));
    const other = shuffle(SIGNS.filter((x) => x.id !== sg.id && x.cat !== sg.cat));
    const opts = shuffle([sg, ...[...same, ...other].slice(0, 3)]);
    return { sg, opts };
  }), []);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);

  if (i >= items.length) return <SessionDone nav={nav} title={t('sessionDone')} sub={t('signsReviewed', { n: items.length })} score={score} total={items.length} />;
  const { sg, opts } = items[i];
  const answered = pick !== null;
  const ok = answered && opts[pick].id === sg.id;

  const choose = (k) => {
    if (answered) return;
    setPick(k);
    const right = opts[k].id === sg.id;
    buzz(right);
    rateSign(sg.id, right);
    if (right) setScore((x) => x + 1);
  };
  const next = () => { setPick(null); setI(i + 1); };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <SessionHeader onClose={nav.confirmClose} progress={(i / items.length) * 100} label={`${i + 1}/${items.length}`} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={styles.signBox}><SignGraphic sign={sg} size={170} /></View>
        <T style={styles.q}>{t('whatSign')}</T>
        <View style={{ gap: 10, marginTop: 14 }}>
          {opts.map((o, k) => (
            <Option key={o.id} label={L(o.name)} index={k}
              state={!answered ? 'idle' : o.id === sg.id ? 'correct' : k === pick ? 'wrong' : 'dim'}
              onPress={() => choose(k)} />
          ))}
        </View>
        {answered && (
          <View style={[styles.feedback, { backgroundColor: ok ? C.successSoft : C.dangerSoft }]}>
            <T style={[styles.fbH, { color: ok ? C.success : C.danger }]}>{ok ? t('correct') : t('wrong')}</T>
            <ArChip text={sg.ar} style={{ marginTop: 8, alignSelf: rtl ? 'flex-end' : 'flex-start' }} />
            <T style={styles.fbBody}>{L(sg.meaning)}</T>
          </View>
        )}
      </ScrollView>
      {answered && (
        <View style={{ paddingHorizontal: 20, paddingBottom: ins.bottom + 16 }}>
          <Button title={i === items.length - 1 ? t('finish') : t('next')} onPress={next} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  signBox: { alignItems: 'center', backgroundColor: C.card, borderRadius: R.xl, paddingVertical: 24, ...shadow },
  q: { fontSize: 20, fontWeight: '800', marginTop: 22 },
  feedback: { marginTop: 16, borderRadius: R.md, padding: 16 },
  fbH: { fontSize: 17, fontWeight: '900' },
  fbBody: { marginTop: 10, color: C.ink2, lineHeight: 22 },
});
