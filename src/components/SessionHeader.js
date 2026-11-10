import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import { Icon, ProgressBar, tap } from './ui';
import { useStore } from '../store';

// Top bar for focused sessions: close button, progress bar, counter.
export default function SessionHeader({ onClose, progress, label }) {
  const ins = useSafeAreaInsets();
  const { rtl } = useStore();
  return (
    <View style={[styles.wrap, { paddingTop: ins.top + 8, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
      <Pressable hitSlop={12} onPress={() => { tap(); onClose(); }} style={styles.close}>
        <Icon name="close" size={22} color={C.ink2} />
      </Pressable>
      <View style={{ flex: 1, marginHorizontal: 14, transform: [{ scaleX: rtl ? -1 : 1 }] }}>
        <ProgressBar value={progress} height={10} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10, backgroundColor: C.bg },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line },
  label: { fontWeight: '800', color: C.ink2, minWidth: 44, textAlign: 'center' },
});
