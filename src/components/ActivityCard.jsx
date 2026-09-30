import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ActivityCard.module.css';

const MAX_TILT_DEG = 10;
const NEUTRAL_LIFT = 'perspective(800px) scale(1.05) translateY(-6px)';

// Gradient activity card. Renders a real <Link> (not a clickable <div>) so it
// is reachable, activatable and announced correctly by assistive tech and
// the keyboard. The 3D tilt/lift is a pure enhancement layered on with
// inline transforms and is skipped under prefers-reduced-motion.
//
// The entrance "zoom in" is a one-shot CSS *transition* (from a `.entering`
// start state to the card's resting state), staggered per card via
// `entranceDelayMs`, rather than a `forwards`-filling @keyframes animation.
// A filling animation keeps overriding `transform` indefinitely — even over
// an inline style set from JS — which silently ate the hover tilt below. A
// transition has no such fill concept: once it finishes, `transform` is
// free for hover/focus to drive directly.
function ActivityCard({ activity, entranceDelayMs = 0 }) {
  const cardRef = useRef(null);
  const [isEntering, setIsEntering] = useState(true);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      setIsEntering(false);
      return;
    }
    const timer = setTimeout(() => setIsEntering(false), entranceDelayMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTiltFromEvent = (event) => {
    if (prefersReducedMotion || isEntering || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = x * MAX_TILT_DEG * 2;
    const rotateX = y * -MAX_TILT_DEG * 2;
    cardRef.current.style.transform = `perspective(800px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const applyNeutralLift = () => {
    if (prefersReducedMotion || isEntering || !cardRef.current) return;
    cardRef.current.style.transform = NEUTRAL_LIFT;
  };

  const resetTransform = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = '';
  };

  return (
    <Link
      ref={cardRef}
      to={activity.route}
      className={`${styles.card} ${isEntering ? styles.entering : ''}`}
      aria-label={activity.ariaLabel}
      onMouseEnter={applyTiltFromEvent}
      onMouseMove={applyTiltFromEvent}
      onMouseLeave={resetTransform}
      onFocus={applyNeutralLift}
      onBlur={resetTransform}
    >
      <span className={styles.label}>{activity.displayName}</span>
    </Link>
  );
}

export default ActivityCard;
