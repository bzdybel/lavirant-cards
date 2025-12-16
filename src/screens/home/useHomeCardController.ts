import type { Card, CardType } from '@/src/types/Card';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

const HERO_IN_DURATION = 220;
const HERO_OUT_DURATION = 180;
const FLIP_DURATION = 420;
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_IN_OUT = Easing.inOut(Easing.cubic);

export type HomeCardController = {
  selectedType: CardType | null;
  heroType: CardType | null;
  isFlipped: boolean;
  revealCorrect: boolean;
  setRevealCorrect: (value: boolean) => void;

  flipAnim: Animated.Value;
  expandAnim: Animated.Value;
  overlayOpacity: Animated.Value;
  cardScale: Animated.Value;
  cardTranslateY: Animated.Value;
  backgroundBlur: Animated.Value;

  frontTransform: Animated.AnimatedInterpolation<string>;
  backTransform: Animated.AnimatedInterpolation<string>;
  frontOpacity: Animated.AnimatedInterpolation<number>;
  backOpacity: Animated.AnimatedInterpolation<number>;

  backgroundCardOpacity: Animated.AnimatedInterpolation<number>;
  backgroundCardScale: Animated.AnimatedInterpolation<number>;

  showRevealButton: boolean;

  onDrawCard: (type: CardType) => void;
  onReset: () => void;
};

export function useHomeCardController(params: {
  currentCard: Card | null;
  drawCard: (type: CardType) => void;
  clearCurrentCard: () => void;
}): HomeCardController {
  const { currentCard, drawCard, clearCurrentCard } = params;

  const [isFlipped, setIsFlipped] = useState(false);
  const [revealCorrect, setRevealCorrect] = useState(false);
  const [selectedType, setSelectedType] = useState<CardType | null>(null);
  const [heroType, setHeroType] = useState<CardType | null>(null);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const cardTranslateY = useRef(new Animated.Value(0)).current;
  const backgroundBlur = useRef(new Animated.Value(0)).current;

  const animateFlip = useCallback(
    (toValue: number, onComplete?: () => void) => {
      Animated.timing(flipAnim, {
        toValue,
        duration: FLIP_DURATION,
        easing: EASE_IN_OUT,
        useNativeDriver: true,
      }).start(onComplete);
    },
    [flipAnim]
  );

  const onDrawCard = useCallback(
    (type: CardType) => {
      setSelectedType(type);
      setHeroType(type);
      drawCard(type);
      setIsFlipped(false);
      setRevealCorrect(false);
      flipAnim.setValue(0);

      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: 1,
          duration: HERO_IN_DURATION,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1.12,
          duration: HERO_IN_DURATION,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: -48,
          duration: HERO_IN_DURATION,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: HERO_IN_DURATION,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundBlur, {
          toValue: 1,
          duration: HERO_IN_DURATION,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
      ]).start(() => {
        animateFlip(1, () => setIsFlipped(true));
      });
    },
    [animateFlip, backgroundBlur, cardScale, cardTranslateY, drawCard, expandAnim, flipAnim, overlayOpacity]
  );

  const onReset = useCallback(() => {
    setSelectedType(null);

    animateFlip(0, () => {
      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: 0,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundBlur, {
          toValue: 0,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsFlipped(false);
        setRevealCorrect(false);
        setHeroType(null);
        clearCurrentCard();
      });
    });
  }, [animateFlip, backgroundBlur, cardScale, cardTranslateY, clearCurrentCard, expandAnim, overlayOpacity]);

  const createInterpolation = useCallback(
    (outputRange: string[]) => flipAnim.interpolate({ inputRange: [0, 1], outputRange }),
    [flipAnim]
  );

  const frontTransform = useMemo(() => createInterpolation(['0deg', '180deg']), [createInterpolation]);
  const backTransform = useMemo(() => createInterpolation(['180deg', '360deg']), [createInterpolation]);
  const frontOpacity = useMemo(
    () => flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] }),
    [flipAnim]
  );
  const backOpacity = useMemo(
    () => flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] }),
    [flipAnim]
  );

  const isQuestion = currentCard?.type === 'question';
  const showRevealButton = Boolean(isQuestion && !revealCorrect && isFlipped);

  const backgroundCardOpacity = useMemo(
    () =>
      backgroundBlur.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.3],
      }),
    [backgroundBlur]
  );

  const backgroundCardScale = useMemo(
    () =>
      backgroundBlur.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.95],
      }),
    [backgroundBlur]
  );

  return {
    selectedType,
    heroType,
    isFlipped,
    revealCorrect,
    setRevealCorrect,

    flipAnim,
    expandAnim,
    overlayOpacity,
    cardScale,
    cardTranslateY,
    backgroundBlur,

    frontTransform,
    backTransform,
    frontOpacity,
    backOpacity,

    backgroundCardOpacity,
    backgroundCardScale,

    showRevealButton,

    onDrawCard,
    onReset,
  };
}
