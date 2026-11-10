import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect, Polygon, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { C, R, shadow } from '../theme';
import { useStore } from '../store';

export const tap = () => Haptics.selectionAsync().catch(() => {});
export const buzz = (ok) =>
  Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});

// Text that follows the language direction (Urdu = RTL).
export function T({ style, center, children, ...rest }) {
  const { rtl } = useStore();
  const dir = center ? { textAlign: 'center' } : { textAlign: rtl ? 'right' : 'left', writingDirection: rtl ? 'rtl' : 'ltr' };
  return <Text style={[styles.text, dir, style]} {...rest}>{children}</Text>;
}

export function Card({ style, children, onPress }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable onPress={() => { tap(); onPress(); }} style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

export function Button({ title, onPress, variant = 'primary', disabled, style }) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      disabled={disabled}
      onPress={() => { tap(); onPress && onPress(); }}
      style={({ pressed }) => [styles.btn, { backgroundColor: v.bg, borderColor: v.border }, disabled && { opacity: 0.4 }, pressed && styles.pressed, style]}
    >
      <Text style={[styles.btnText, { color: v.fg }]}>{title}</Text>
    </Pressable>
  );
}
const VARIANTS = {
  primary: { bg: C.primary, fg: C.white, border: C.primary },
  gold: { bg: C.gold, fg: C.white, border: C.gold },
  ghost: { bg: C.card, fg: C.ink, border: C.line },
  danger: { bg: C.dangerSoft, fg: C.danger, border: C.dangerSoft },
};

// Arabic term pill — always shown next to translations.
export function ArChip({ text, style }) {
  if (!text) return null;
  return (
    <View style={[styles.ar, style]}>
      <Text style={styles.arLabel}>ع</Text>
      <Text style={styles.arText}>{text}</Text>
    </View>
  );
}

export function Pill({ label, color = C.primary, bg = C.primarySoft }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ value, color = C.primary, track = C.line, height = 8 }) {
  return (
    <View style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(100, value))}%`, height, borderRadius: height, backgroundColor: color }} />
    </View>
  );
}

export function Ring({ value, size = 120, stroke = 12, color = C.gold, track = 'rgba(255,255,255,0.18)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, value)) / 100);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={`${c} ${c}`} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      {children}
    </View>
  );
}

// Minimal line icons, drawn in a 24x24 box.
export function Icon({ name, size = 24, color = C.ink, strokeWidth = 2 }) {
  const p = { stroke: color, strokeWidth, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const body = {
    home: <Path d="M3 11 L12 4 L21 11 V20 A1 1 0 0 1 20 21 H15 V15 H9 V21 H4 A1 1 0 0 1 3 20 Z" {...p} />,
    signs: <G><Polygon points="12,3 21,19 3,19" {...p} /><Path d="M12 9 V13 M12 16 V16.5" {...p} /></G>,
    practice: <G><Rect x={4} y={3} width={16} height={18} rx={3} {...p} /><Path d="M8 9 L10 11 L14 7 M8 16 H16" {...p} /></G>,
    profile: <G><Circle cx={12} cy={8} r={4} {...p} /><Path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" {...p} /></G>,
    back: <Path d="M15 5 L8 12 L15 19" {...p} />,
    close: <Path d="M6 6 L18 18 M18 6 L6 18" {...p} />,
    chevron: <Path d="M9 5 L16 12 L9 19" {...p} />,
    exam: <G><Path d="M5 4 H15 L19 8 V20 H5 Z" {...p} /><Path d="M9 12 H15 M9 16 H13" {...p} /></G>,
    cards: <G><Rect x={3} y={6} width={13} height={15} rx={2} {...p} /><Path d="M8 3 H19 A2 2 0 0 1 21 5 V17" {...p} /></G>,
    target: <G><Circle cx={12} cy={12} r={8} {...p} /><Circle cx={12} cy={12} r={3} {...p} /></G>,
    bolt: <Path d="M13 3 L5 14 H12 L11 21 L19 10 H12 Z" {...p} />,
    check: <Path d="M5 12 L10 17 L19 7" {...p} />,
    globe: <G><Circle cx={12} cy={12} r={9} {...p} /><Path d="M3 12 H21 M12 3 C15 6 15 18 12 21 C9 18 9 6 12 3" {...p} /></G>,
    refresh: <Path d="M20 11 A8 8 0 1 0 18 17 M20 5 V11 H14" {...p} />,
    info: <G><Circle cx={12} cy={12} r={9} {...p} /><Path d="M12 11 V16 M12 8 V8.5" {...p} /></G>,
    trophy: <G><Path d="M8 4 H16 V10 A4 4 0 0 1 8 10 Z M12 14 V18 M8 21 H16 M16 6 H20 A3 3 0 0 1 16 10 M8 6 H4 A3 3 0 0 0 8 10" {...p} /></G>,
  }[name];
  return <Svg width={size} height={size} viewBox="0 0 24 24">{body}</Svg>;
}

export function IconBadge({ name, color = C.primary, bg = C.primarySoft, size = 44 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 3, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} color={color} size={size * 0.5} />
    </View>
  );
}

export function SectionTitle({ children, style }) {
  return <T style={[styles.section, style]}>{children}</T>;
}

const styles = StyleSheet.create({
  text: { color: C.ink, fontSize: 15 },
  card: { backgroundColor: C.card, borderRadius: R.lg, padding: 18, ...shadow },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  btn: { height: 56, borderRadius: R.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, borderWidth: 1.5 },
  btnText: { fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  ar: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: C.goldSoft, borderRadius: R.pill, paddingVertical: 5, paddingHorizontal: 10, gap: 8 },
  arLabel: { color: C.white, backgroundColor: C.gold, width: 20, height: 20, borderRadius: 10, textAlign: 'center', fontSize: 12, fontWeight: '700', lineHeight: 20, overflow: 'hidden' },
  arText: { color: '#7A5C00', fontSize: 15, fontWeight: '600', writingDirection: 'rtl' },
  pill: { borderRadius: R.pill, paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start' },
  pillText: { fontSize: 12, fontWeight: '700' },
  section: { fontSize: 18, fontWeight: '800', color: C.ink, marginTop: 26, marginBottom: 12 },
});
