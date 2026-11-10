import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import { useStore } from '../store';
import { T, Button, Ring } from '../components/ui';

export default function SessionDone({ nav, title, sub, score, total }) {
  const { t } = useStore();
  const ins = useSafeAreaInsets();
  const pct = total ? Math.round((score / total) * 100) : 0;
  return (
    <View style={[styles.wrap, { paddingTop: ins.top + 40, paddingBottom: ins.bottom + 20 }]}>
      <View style={{ alignItems: 'center' }}>
        <Ring value={pct} size={170} stroke={14} color={C.gold} track={C.line}>
          <Text style={styles.num}>{score}<Text style={styles.of}>/{total}</Text></Text>
        </Ring>
        <T center style={styles.h}>{title} 🎉</T>
        <T center style={styles.sub}>{sub}</T>
      </View>
      <View style={{ gap: 12 }}>
        <Button title={t('tryAgain')} onPress={nav.replay} />
        <Button title={t('backHome')} variant="ghost" onPress={nav.pop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, justifyContent: 'space-between' },
  num: { fontSize: 44, fontWeight: '900', color: C.primaryDark },
  of: { fontSize: 22, color: C.muted },
  h: { fontSize: 26, fontWeight: '900', marginTop: 26 },
  sub: { color: C.muted, marginTop: 6, fontSize: 15 },
});
