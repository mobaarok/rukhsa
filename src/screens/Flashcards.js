import React, { useMemo, useRef, useState } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R, shadow } from '../theme';
import { useStore, dueSigns } from '../store';
import SignGraphic from '../components/SignGraphic';
import SessionHeader from '../components/SessionHeader';
import { T, Button, ArChip, Pill, tap, buzz } from '../components/ui';
import SessionDone from './SessionDone';

export default function Flashcards({ nav }) {
  const { t, L, state, rateSign, rtl } = useStore();
  const ins = useSafeAreaInsets();
  const deck = useMemo(() => dueSigns(state, 10), []); // fixed for this session
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  if (i >= deck.length) return <SessionDone nav={nav} title={t('sessionDone')} sub={t('signsReviewed', { n: deck.length })} score={known} total={deck.length} />;
  const sg = deck[i];

  const flip = () => {
    tap();
    Animated.spring(anim, { toValue: flipped ? 0 : 1, useNativeDriver: true, friction: 8, tension: 40 }).start();
    setFlipped(!flipped);
  };
  const rate = (ok) => {
    buzz(ok);
    rateSign(sg.id, ok);
    if (ok) setKnown((k) => k + 1);
    anim.setValue(0);
    setFlipped(false);
    setI(i + 1);
  };

  const front = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const back = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <SessionHeader onClose={nav.confirmClose} progress={(i / deck.length) * 100} label={`${i + 1}/${deck.length}`} />
      <View style={styles.stage}>
        <Pressable onPress={flip} style={{ flex: 1 }}>
          <Animated.View style={[styles.card, { transform: [{ perspective: 1200 }, { rotateY: front }] }]}>
            <Pill label={t('cat_' + sg.cat)} />
            <View style={styles.center}><SignGraphic sign={sg} size={210} /></View>
            <T center style={styles.hint}>{t('tapToFlip')}</T>
          </Animated.View>
          <Animated.View style={[styles.card, styles.back, { transform: [{ perspective: 1200 }, { rotateY: back }] }]}>
            <View style={{ alignItems: 'center' }}><SignGraphic sign={sg} size={110} /></View>
            <T style={styles.name}>{L(sg.name)}</T>
            <ArChip text={sg.ar} style={{ marginTop: 10, alignSelf: rtl ? 'flex-end' : 'flex-start' }} />
            <T style={styles.meaning}>{L(sg.meaning)}</T>
          </Animated.View>
        </Pressable>
      </View>
      <View style={[styles.actions, { paddingBottom: ins.bottom + 16, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
        {flipped ? (
          <>
            <Button title={t('again')} variant="danger" onPress={() => rate(false)} style={{ flex: 1 }} />
            <Button title={t('gotIt')} onPress={() => rate(true)} style={{ flex: 1 }} />
          </>
        ) : (
          <Button title={t('tapToFlip')} variant="ghost" onPress={flip} style={{ flex: 1 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, padding: 20 },
  card: { ...StyleSheet.absoluteFillObject, backgroundColor: C.card, borderRadius: R.xl, padding: 22, backfaceVisibility: 'hidden', ...shadow },
  back: { justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { color: C.muted, fontSize: 13 },
  name: { fontSize: 26, fontWeight: '900', marginTop: 18 },
  meaning: { fontSize: 17, color: C.ink2, lineHeight: 26, marginTop: 16 },
  actions: { paddingHorizontal: 20, gap: 12 },
});
