import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R } from '../theme';
import { LANGS } from '../i18n';
import { useStore, stats } from '../store';
import { T, Card, SectionTitle, Button, Icon, tap } from '../components/ui';

export default function Profile() {
  const { t, lang, setLang, reset, state, rtl } = useStore();
  const ins = useSafeAreaInsets();
  const row = rtl ? 'row-reverse' : 'row';
  const s = stats(state);

  const confirmReset = () =>
    Alert.alert(t('resetProgress'), t('resetMsg'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('reset'), style: 'destructive', onPress: reset },
    ]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: ins.top + 16, paddingHorizontal: 20, paddingBottom: 30 }}>
      <T style={styles.h1}>{t('profile')}</T>

      <View style={[styles.statsRow, { flexDirection: row }]}>
        <Card style={styles.stat}><Text style={styles.val}>{s.seen}</Text><Text style={styles.lbl}>{t('answered')}</Text></Card>
        <Card style={styles.stat}><Text style={styles.val}>{s.seen ? s.accuracy + '%' : '—'}</Text><Text style={styles.lbl}>{t('accuracy')}</Text></Card>
        <Card style={styles.stat}><Text style={styles.val}>{s.passed}</Text><Text style={styles.lbl}>{t('examsPassed')}</Text></Card>
      </View>

      <SectionTitle>{t('language')}</SectionTitle>
      <Card style={{ padding: 6 }}>
        {LANGS.map((l, i) => {
          const on = l.code === lang;
          return (
            <Pressable key={l.code} onPress={() => { tap(); setLang(l.code); }}
              style={[styles.langRow, { flexDirection: row }, i < LANGS.length - 1 && styles.divider]}>
              <View style={{ flex: 1 }}>
                <T style={[styles.native, on && { color: C.primary }]}>{l.native}</T>
                <T style={styles.lbl2}>{l.label}</T>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>{on && <Icon name="check" size={14} color={C.white} strokeWidth={3} />}</View>
            </Pressable>
          );
        })}
      </Card>

      <SectionTitle>{t('about')}</SectionTitle>
      <Card>
        <T style={{ color: C.ink2, lineHeight: 22 }}>{t('disclaimer')}</T>
        <Text style={styles.ver}>Rukhsa · v0.1 (Phase 1 prototype)</Text>
      </Card>

      <Button title={t('resetProgress')} variant="danger" onPress={confirmReset} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '900' },
  statsRow: { gap: 10, marginTop: 18 },
  stat: { flex: 1, alignItems: 'center', padding: 14 },
  val: { fontSize: 22, fontWeight: '900', color: C.primaryDark },
  lbl: { fontSize: 12, color: C.muted, marginTop: 4, textAlign: 'center' },
  langRow: { alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.line },
  native: { fontSize: 17, fontWeight: '800' },
  lbl2: { fontSize: 13, color: C.muted },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: C.primary, borderColor: C.primary },
  ver: { marginTop: 12, color: C.muted, fontSize: 12 },
});
