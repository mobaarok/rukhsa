import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, BackHandler, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './src/theme';
import { StoreProvider, useStore } from './src/store';
import { Icon, tap } from './src/components/ui';
import Onboarding from './src/screens/Onboarding';
import Home from './src/screens/Home';
import SignsTab from './src/screens/SignsTab';
import PracticeTab from './src/screens/PracticeTab';
import Profile from './src/screens/Profile';
import Flashcards from './src/screens/Flashcards';
import SignQuiz from './src/screens/SignQuiz';
import Quiz from './src/screens/Quiz';

const TABS = [
  { key: 'home', icon: 'home', C: Home },
  { key: 'signs', icon: 'signs', C: SignsTab },
  { key: 'practice', icon: 'practice', C: PracticeTab },
  { key: 'profile', icon: 'profile', C: Profile },
];
const STACK = { flash: Flashcards, signQuiz: SignQuiz, quiz: Quiz };

function Root() {
  const { ready, state, t, rtl } = useStore();
  const ins = useSafeAreaInsets();
  const [tab, setTab] = useState('home');
  const [stack, setStack] = useState([]); // [{name, params, key}]
  const stackRef = useRef(stack);
  stackRef.current = stack;

  const nav = useMemo(() => {
    const pop = () => setStack((s) => s.slice(0, -1));
    return {
      push: (name, params = {}) => setStack((s) => [...s, { name, params, key: Date.now() }]),
      pop,
      tab: setTab,
      // restart the current session with a fresh deck
      replay: () => setStack((s) => s.length ? [...s.slice(0, -1), { ...s[s.length - 1], key: Date.now() }] : s),
      confirmClose: () =>
        Alert.alert(t('quitTitle'), t('quitMsg'), [
          { text: t('stay'), style: 'cancel' },
          { text: t('leave'), style: 'destructive', onPress: pop },
        ]),
    };
  }, [t]);

  // Android hardware back button
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stackRef.current.length) { nav.confirmClose(); return true; }
      if (tab !== 'home') { setTab('home'); return true; }
      return false;
    });
    return () => sub.remove();
  }, [nav, tab]);

  if (!ready) return <View style={styles.loading}><ActivityIndicator color={C.primary} size="large" /></View>;
  if (!state.lang) return <><StatusBar style="light" /><Onboarding /></>;

  const top = stack[stack.length - 1];
  if (top) {
    const Screen = STACK[top.name];
    return <><StatusBar style="dark" /><Screen key={top.key} nav={nav} params={top.params} /></>;
  }

  const Active = TABS.find((x) => x.key === tab).C;
  const lightBar = tab === 'home';
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style={lightBar ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}><Active nav={nav} /></View>
      <View style={[styles.tabbar, { paddingBottom: ins.bottom + 8, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
        {TABS.map((x) => {
          const on = x.key === tab;
          return (
            <Pressable key={x.key} onPress={() => { tap(); setTab(x.key); }} style={styles.tabBtn}>
              <View style={[styles.tabIcon, on && styles.tabIconOn]}>
                <Icon name={x.icon} size={22} color={on ? C.primary : C.muted} strokeWidth={on ? 2.4 : 2} />
              </View>
              <Text style={[styles.tabLabel, on && { color: C.primary, fontWeight: '800' }]} numberOfLines={1}>{t(x.key)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Root />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  tabbar: { backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 8, paddingHorizontal: 8 },
  tabBtn: { flex: 1, alignItems: 'center', gap: 2 },
  tabIcon: { width: 56, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tabIconOn: { backgroundColor: C.primarySoft },
  tabLabel: { fontSize: 11, color: C.muted, fontWeight: '600' },
});
