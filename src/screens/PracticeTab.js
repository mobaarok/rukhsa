import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R, GRAD } from '../theme';
import { useStore, topicStats, weakQuestions, EXAM_SIZE, PASS_PCT } from '../store';
import { TOPICS } from '../data/questions';
import { T, Card, IconBadge, SectionTitle, ProgressBar, Pill, Icon, tap } from '../components/ui';
import { Pressable } from 'react-native';

const TOPIC_ICON = { rules: 'practice', signs: 'signs', rightofway: 'bolt', safety: 'check', emergency: 'info', conditions: 'globe' };

export default function PracticeTab({ nav }) {
  const { t, state, rtl } = useStore();
  const ins = useSafeAreaInsets();
  const row = rtl ? 'row-reverse' : 'row';
  const weak = weakQuestions(state).length;
  const last = state.exams[0];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: ins.top + 16, paddingHorizontal: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      <T style={styles.h1}>{t('practice')}</T>

      <Pressable onPress={() => { tap(); nav.push('quiz', { mode: 'mock' }); }} style={({ pressed }) => [{ marginTop: 18 }, pressed && { transform: [{ scale: 0.98 }] }]}>
        <LinearGradient colors={GRAD.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.mock}>
          <View style={{ flexDirection: row, alignItems: 'center', gap: 14 }}>
            <IconBadge name="exam" color={C.primaryDark} bg={C.gold} size={52} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.mockH, rtl && styles.rtl]}>{t('mockExam')}</Text>
              <Text style={[styles.mockSub, rtl && styles.rtl]}>{t('mockDesc', { n: EXAM_SIZE, p: PASS_PCT })}</Text>
            </View>
          </View>
          {last && (
            <View style={[styles.lastRow, { flexDirection: row }]}>
              <Text style={styles.lastText}>{t('lastExams')}:</Text>
              {state.exams.slice(0, 5).map((e, i) => (
                <View key={i} style={[styles.lastPill, { backgroundColor: e.passed ? 'rgba(23,160,106,0.35)' : 'rgba(217,72,72,0.35)' }]}>
                  <Text style={styles.lastPillText}>{Math.round((e.score / e.total) * 100)}%</Text>
                </View>
              ))}
            </View>
          )}
        </LinearGradient>
      </Pressable>

      <Card onPress={() => nav.push('quiz', { mode: 'weak' })} style={{ marginTop: 12, flexDirection: row, alignItems: 'center', gap: 14 }}>
        <IconBadge name="target" color="#9A6B00" bg={C.goldSoft} />
        <View style={{ flex: 1 }}>
          <T style={styles.title}>{t('weakReview')}</T>
          <T style={styles.sub}>{weak ? t('questions', { n: weak }) : t('weakDesc')}</T>
        </View>
        {weak > 0 && <Pill label={String(weak)} color={C.danger} bg={C.dangerSoft} />}
      </Card>

      <SectionTitle>{t('topicPractice')}</SectionTitle>
      <View style={{ gap: 12 }}>
        {TOPICS.map((tp) => {
          const ts = topicStats(state, tp);
          const col = ts.pct == null ? C.muted : ts.pct >= 85 ? C.success : ts.pct >= 60 ? C.gold : C.danger;
          return (
            <Card key={tp} onPress={() => nav.push('quiz', { mode: 'topic', topic: tp })} style={{ gap: 12 }}>
              <View style={{ flexDirection: row, alignItems: 'center', gap: 14 }}>
                <IconBadge name={TOPIC_ICON[tp]} size={40} />
                <View style={{ flex: 1 }}>
                  <T style={styles.title}>{t('topic_' + tp)}</T>
                  <T style={styles.sub}>{t('questions', { n: ts.total })}</T>
                </View>
                <Text style={[styles.pct, { color: col }]}>{ts.pct == null ? '—' : ts.pct + '%'}</Text>
                <View style={{ transform: [{ scaleX: rtl ? -1 : 1 }] }}><Icon name="chevron" size={18} color={C.muted} /></View>
              </View>
              {ts.pct != null && <ProgressBar value={ts.pct} color={col} height={6} />}
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '900' },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  mock: { borderRadius: R.lg, padding: 20 },
  mockH: { color: C.white, fontSize: 21, fontWeight: '900' },
  mockSub: { color: 'rgba(255,255,255,0.8)', marginTop: 4, fontSize: 14 },
  lastRow: { marginTop: 16, alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  lastText: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginHorizontal: 2 },
  lastPill: { borderRadius: R.pill, paddingHorizontal: 8, paddingVertical: 3 },
  lastPillText: { color: C.white, fontSize: 12, fontWeight: '700' },
  title: { fontSize: 16, fontWeight: '800' },
  sub: { fontSize: 13, color: C.muted, marginTop: 2 },
  pct: { fontSize: 16, fontWeight: '900' },
});
