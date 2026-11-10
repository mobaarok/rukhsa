import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R } from '../theme';
import { useStore, countDue, signStatus, stats } from '../store';
import { SIGNS, SIGN_CATS } from '../data/signs';
import SignGraphic from '../components/SignGraphic';
import { T, Card, Button, ArChip, IconBadge, ProgressBar, tap, Pill } from '../components/ui';

const STATUS = {
  mastered: { color: C.success, bg: C.successSoft },
  learning: { color: '#9A6B00', bg: C.goldSoft },
  new: { color: C.muted, bg: C.line },
};

export default function SignsTab({ nav }) {
  const { t, L, state, rtl } = useStore();
  const ins = useSafeAreaInsets();
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState(null);
  const s = stats(state);
  const due = countDue(state);
  const row = rtl ? 'row-reverse' : 'row';
  const list = cat === 'all' ? SIGNS : SIGNS.filter((x) => x.cat === cat);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: ins.top + 16, paddingHorizontal: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <T style={styles.h1}>{t('learnSigns')}</T>
        <T style={styles.sub}>{t('learnSignsSub')}</T>

        <Card style={{ marginTop: 18 }}>
          <View style={{ flexDirection: row, justifyContent: 'space-between', marginBottom: 10 }}>
            <T style={{ fontWeight: '700' }}>{t('signsMastered')}</T>
            <Text style={{ fontWeight: '800', color: C.primary }}>{s.mastered}/{s.totalSigns}</Text>
          </View>
          <ProgressBar value={(s.mastered / s.totalSigns) * 100} />
          <View style={{ flexDirection: row, gap: 10, marginTop: 16 }}>
            <Button title={t('flashcards')} onPress={() => nav.push('flash')} style={{ flex: 1 }} />
            <Button title={t('signQuiz')} variant="ghost" onPress={() => nav.push('signQuiz')} style={{ flex: 1 }} />
          </View>
          {due > 0 && <T style={styles.due}>{t('due', { n: due })}</T>}
        </Card>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 22, marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, flexDirection: row }}>
          {['all', ...SIGN_CATS].map((c) => {
            const on = c === cat;
            return (
              <Pressable key={c} onPress={() => { tap(); setCat(c); }} style={[styles.chip, on && styles.chipOn]}>
                <Text style={[styles.chipText, on && { color: C.white }]}>{c === 'all' ? t('allSigns') : t('cat_' + c)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles.grid, { flexDirection: row }]}>
          {list.map((sg) => {
            const st = signStatus(state.signs[sg.id]);
            return (
              <Card key={sg.id} onPress={() => setOpen(sg)} style={styles.tile}>
                <SignGraphic sign={sg} size={72} />
                <Text style={styles.tileName} numberOfLines={2}>{L(sg.name)}</Text>
                <View style={[styles.dot, { backgroundColor: STATUS[st].color }]} />
              </Card>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={!!open} transparent animationType="slide" onRequestClose={() => setOpen(null)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(null)} />
        {open && (
          <View style={[styles.sheet, { paddingBottom: ins.bottom + 20 }]}>
            <View style={styles.grab} />
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <SignGraphic sign={open} size={150} />
            </View>
            <View style={{ flexDirection: row, gap: 8, marginBottom: 10 }}>
              <Pill label={t('cat_' + open.cat)} />
              {(() => { const st = signStatus(state.signs[open.id]); return <Pill label={t(st)} color={STATUS[st].color} bg={STATUS[st].bg} />; })()}
            </View>
            <T style={styles.sheetTitle}>{L(open.name)}</T>
            <ArChip text={open.ar} style={{ marginTop: 8, alignSelf: rtl ? 'flex-end' : 'flex-start' }} />
            <T style={styles.sheetBody}>{L(open.meaning)}</T>
            <Button title="OK" onPress={() => setOpen(null)} style={{ marginTop: 20 }} />
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '900' },
  sub: { color: C.muted, marginTop: 4 },
  due: { marginTop: 12, color: C.primary, fontWeight: '700', fontSize: 13 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: R.pill, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  chipOn: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontWeight: '700', color: C.ink2, fontSize: 13 },
  grid: { flexWrap: 'wrap', gap: 12, marginTop: 16 },
  tile: { width: '31%', flexGrow: 1, maxWidth: '32%', alignItems: 'center', padding: 12, minHeight: 136 },
  tileName: { fontSize: 12, fontWeight: '600', color: C.ink2, textAlign: 'center', marginTop: 8 },
  dot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(6,30,20,0.45)' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: R.xl, borderTopRightRadius: R.xl, padding: 22 },
  grab: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: C.line, marginBottom: 6 },
  sheetTitle: { fontSize: 24, fontWeight: '900' },
  sheetBody: { fontSize: 16, color: C.ink2, marginTop: 14, lineHeight: 24 },
});
