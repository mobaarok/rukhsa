import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R, GRAD } from '../theme';
import { useStore, stats, countDue, EXAM_SIZE, PASS_PCT, weakQuestions } from '../store';
import { T, Card, Ring, IconBadge, SectionTitle, Icon } from '../components/ui';

export default function Home({ nav }) {
  const { t, state, rtl } = useStore();
  const ins = useSafeAreaInsets();
  const s = stats(state);
  const due = countDue(state);
  const weak = weakQuestions(state).length;
  const row = rtl ? 'row-reverse' : 'row';
  const msg = s.readiness >= 85 ? t('readinessHigh') : s.readiness >= 50 ? t('readinessMid') : t('readinessLow');

  const actions = [
    { icon: 'exam', title: t('mockExam'), sub: t('mockDesc', { n: EXAM_SIZE, p: PASS_PCT }), go: () => nav.push('quiz', { mode: 'mock' }), color: C.primary, bg: C.primarySoft },
    { icon: 'signs', title: t('signQuiz'), sub: t('signQuizDesc'), go: () => nav.push('signQuiz'), color: '#B3261E', bg: C.dangerSoft },
    { icon: 'cards', title: t('flashcards'), sub: due ? t('due', { n: due }) : t('flashDesc'), go: () => nav.push('flash'), color: C.blue, bg: '#E5EEFB' },
    { icon: 'target', title: t('weakReview'), sub: weak ? t('questions', { n: weak }) : t('weakDesc'), go: () => nav.push('quiz', { mode: 'weak' }), color: '#9A6B00', bg: C.goldSoft },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={GRAD.hero} style={[styles.hero, { paddingTop: ins.top + 18 }]}>
        <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[styles.hello, rtl && styles.rtl]}>{t('hello')}</Text>
            <Text style={[styles.brand, rtl && styles.rtl]}>Rukhsa <Text style={{ color: C.gold }}>رخصة</Text></Text>
          </View>
        </View>

        <View style={[styles.readyCard, { flexDirection: row }]}>
          <Ring value={s.readiness} size={104} stroke={11}>
            <Text style={styles.ringNum}>{s.readiness}<Text style={styles.ringPct}>%</Text></Text>
          </Ring>
          <View style={{ flex: 1, marginHorizontal: 16 }}>
            <Text style={[styles.readyH, rtl && styles.rtl]}>{t('readiness')}</Text>
            <Text style={[styles.readySub, rtl && styles.rtl]}>{msg}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={[styles.statsRow, { flexDirection: row }]}>
          <Stat label={t('signsMastered')} value={`${s.mastered}/${s.totalSigns}`} />
          <Stat label={t('accuracy')} value={s.seen ? `${s.accuracy}%` : '—'} />
          <Stat label={t('examsPassed')} value={String(s.passed)} />
        </View>

        <SectionTitle>{t('quickStart')}</SectionTitle>
        <View style={{ gap: 12 }}>
          {actions.map((a) => (
            <Card key={a.title} onPress={a.go} style={{ flexDirection: row, alignItems: 'center', gap: 14, paddingVertical: 16 }}>
              <IconBadge name={a.icon} color={a.color} bg={a.bg} />
              <View style={{ flex: 1 }}>
                <T style={styles.actTitle}>{a.title}</T>
                <T style={styles.actSub}>{a.sub}</T>
              </View>
              <View style={{ transform: [{ scaleX: rtl ? -1 : 1 }] }}><Icon name="chevron" size={20} color={C.muted} /></View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }) {
  return (
    <Card style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={2}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 20, paddingBottom: 56, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  hello: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  brand: { color: C.white, fontSize: 28, fontWeight: '900', marginTop: 2 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  readyCard: { marginTop: 22, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: R.lg, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  ringNum: { color: C.white, fontSize: 30, fontWeight: '900' },
  ringPct: { fontSize: 16, color: C.gold },
  readyH: { color: C.white, fontSize: 19, fontWeight: '800' },
  readySub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 6, lineHeight: 20 },
  body: { paddingHorizontal: 20, marginTop: -36 },
  statsRow: { gap: 10 },
  stat: { flex: 1, padding: 14, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '900', color: C.primaryDark },
  statLabel: { fontSize: 12, color: C.muted, marginTop: 4, textAlign: 'center' },
  actTitle: { fontSize: 16, fontWeight: '800' },
  actSub: { fontSize: 13, color: C.muted, marginTop: 3 },
});
