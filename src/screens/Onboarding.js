import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R, GRAD } from '../theme';
import { LANGS, translate } from '../i18n';
import { useStore } from '../store';
import { Button, tap, Icon } from '../components/ui';
import SignGraphic from '../components/SignGraphic';
import { signById } from '../data/signs';

export default function Onboarding() {
  const { setLang } = useStore();
  const [pick, setPick] = useState('en');
  const ins = useSafeAreaInsets();
  const t = (k) => translate(pick, k);
  const rtl = pick === 'ur';

  return (
    <LinearGradient colors={GRAD.hero} style={[styles.wrap, { paddingTop: ins.top + 24, paddingBottom: ins.bottom + 20 }]}>
      <View style={styles.hero}>
        <View style={styles.signs}>
          <View style={{ transform: [{ rotate: '-10deg' }] }}><SignGraphic sign={signById.stop} size={64} /></View>
          <View style={{ marginTop: -14 }}><SignGraphic sign={signById.camels} size={78} /></View>
          <View style={{ transform: [{ rotate: '10deg' }] }}><SignGraphic sign={signById.speed80} size={64} /></View>
        </View>
        <Text style={styles.brand}>Rukhsa</Text>
        <Text style={styles.brandAr}>رخصة</Text>
        <Text style={styles.tag}>{t('tagline')}</Text>
      </View>

      <View style={styles.sheet}>
        <Text style={[styles.h, rtl && styles.rtl]}>{t('chooseLang')}</Text>
        <Text style={[styles.sub, rtl && styles.rtl]}>{t('chooseLangSub')}</Text>
        <View style={styles.grid}>
          {LANGS.map((l) => {
            const on = l.code === pick;
            return (
              <Pressable key={l.code} onPress={() => { tap(); setPick(l.code); }} style={[styles.lang, on && styles.langOn]}>
                <Text style={[styles.native, on && { color: C.primary }]}>{l.native}</Text>
                <Text style={styles.label}>{l.label}</Text>
                {on && <View style={styles.tick}><Icon name="check" size={14} color={C.white} strokeWidth={3} /></View>}
              </Pressable>
            );
          })}
        </View>
        <Button title={t('start')} onPress={() => setLang(pick)} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' },
  hero: { alignItems: 'center', marginTop: 12 },
  signs: { flexDirection: 'row', alignItems: 'flex-end', gap: 14, marginBottom: 22 },
  brand: { color: C.white, fontSize: 40, fontWeight: '900', letterSpacing: 0.5 },
  brandAr: { color: C.gold, fontSize: 24, fontWeight: '700', marginTop: -2 },
  tag: { color: 'rgba(255,255,255,0.85)', fontSize: 16, marginTop: 10, textAlign: 'center' },
  sheet: { backgroundColor: C.card, borderRadius: R.xl, padding: 22 },
  h: { fontSize: 22, fontWeight: '800', color: C.ink },
  sub: { fontSize: 14, color: C.muted, marginTop: 6, marginBottom: 18, lineHeight: 20 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  lang: { width: '47%', flexGrow: 1, borderWidth: 1.5, borderColor: C.line, borderRadius: R.md, paddingVertical: 16, paddingHorizontal: 14, backgroundColor: C.bg },
  langOn: { borderColor: C.primary, backgroundColor: C.primarySoft },
  native: { fontSize: 20, fontWeight: '800', color: C.ink },
  label: { fontSize: 13, color: C.muted, marginTop: 2 },
  tick: { position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
});
