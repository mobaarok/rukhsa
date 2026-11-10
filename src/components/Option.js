import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { C, R } from '../theme';
import { useStore } from '../store';
import { Icon, tap } from './ui';

const LETTERS = ['A', 'B', 'C', 'D'];

// state: idle | selected | correct | wrong | dim
export default function Option({ label, index, state = 'idle', onPress }) {
  const { rtl } = useStore();
  const s = LOOK[state];
  return (
    <Pressable
      onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => [styles.opt, { backgroundColor: s.bg, borderColor: s.border, flexDirection: rtl ? 'row-reverse' : 'row' }, pressed && state === 'idle' && { transform: [{ scale: 0.98 }] }]}
    >
      <View style={[styles.letter, { backgroundColor: s.badge }]}>
        {state === 'correct' ? <Icon name="check" size={16} color={C.white} strokeWidth={3} />
          : state === 'wrong' ? <Icon name="close" size={16} color={C.white} strokeWidth={3} />
          : <Text style={[styles.letterText, { color: s.badgeFg }]}>{LETTERS[index]}</Text>}
      </View>
      <Text style={[styles.label, { color: s.fg, textAlign: rtl ? 'right' : 'left', writingDirection: rtl ? 'rtl' : 'ltr' }]}>{label}</Text>
    </Pressable>
  );
}

const LOOK = {
  idle: { bg: C.card, border: C.line, fg: C.ink, badge: C.bg, badgeFg: C.ink2 },
  selected: { bg: C.primarySoft, border: C.primary, fg: C.primaryDark, badge: C.primary, badgeFg: C.white },
  correct: { bg: C.successSoft, border: C.success, fg: '#0B5E3D', badge: C.success, badgeFg: C.white },
  wrong: { bg: C.dangerSoft, border: C.danger, fg: '#8E2323', badge: C.danger, badgeFg: C.white },
  dim: { bg: C.card, border: C.line, fg: C.muted, badge: C.bg, badgeFg: C.muted },
};

const styles = StyleSheet.create({
  opt: { alignItems: 'center', gap: 12, borderWidth: 2, borderRadius: R.md, paddingVertical: 14, paddingHorizontal: 14, minHeight: 60 },
  letter: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontWeight: '800', fontSize: 14 },
  label: { flex: 1, fontSize: 16, fontWeight: '600', lineHeight: 22 },
});
