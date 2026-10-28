import { ReactNode } from 'react';
import type { GlowEffectProps } from '../components/ui/GlowEffect';
import type { SpotlightProps } from '../components/core/spotlight';

/**
 * Data structure representing a single flashcard item.
 */
export interface FlashcardItem {
  id: string | number;
  topic: string;
  answer: string | ReactNode;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  glowColors?: string[];
  spotlightColor?: string;
}

/**
 * Props accepted by the reusable Flashcard component.
 */
export interface FlashcardProps {
  /** The topic title displayed on the front */
  topic: string;
  /** The answer or explanation content displayed on the back */
  answer: string | ReactNode;
  /** Optional unique identifier for tracking/testing */
  id?: string | number;
  /** Optional category or subject badge */
  category?: string;
  /** Optional custom CSS class name for the outer card */
  className?: string;
  /** Optional callback fired when the card flips */
  onFlip?: (isFlipped: boolean, id?: string | number) => void;
  /** Optional controlled flipped state */
  isFlipped?: boolean;
  /** Hint text shown on the front side */
  revealHint?: string;
  /** Hint text shown on the back side */
  returnHint?: string;
  /** Optional minimum height for the card (defaults to 260px) */
  minHeight?: string | number;
  /** Flipping animation duration in milliseconds (default: 850ms) */
  flipDuration?: number;
  /** Whether to enable interactive 3D mouse tilt effect (default: true) */
  enableTilt?: boolean;
  /** Tilt rotation factor degrees (default: 12) */
  tiltRotationFactor?: number;
  /** Whether to enable ambient animated glow effect (default: true) */
  enableGlow?: boolean;
  /** Glow effect mode ('rotate' | 'pulse' | 'breathe' | 'colorShift' | 'flowHorizontal' | 'static') */
  glowMode?: GlowEffectProps['mode'];
  /** Colors for the animated glow halo */
  glowColors?: string[];
  /** Blur intensity for glow */
  glowBlur?: GlowEffectProps['blur'];
  /** Whether to enable cursor-following spotlight glow (default: true) */
  enableSpotlight?: boolean;
  /** Diameter of the cursor spotlight in pixels (default: 220) */
  spotlightSize?: number;
  /** Optional custom spotlight color */
  spotlightColor?: string;
  /** Custom spotlight options */
  spotlightProps?: Partial<SpotlightProps>;
}

/**
 * Props for the responsive FlashcardGrid component.
 */
export interface FlashcardGridProps {
  /** Array of flashcard data items */
  items: FlashcardItem[];
  /** Optional custom CSS class name for the grid */
  className?: string;
  /** Optional minimum column width */
  minColWidth?: string | number;
  /** Callback when any card is flipped */
  onCardFlip?: (id: string | number, isFlipped: boolean) => void;
  /** Flipping animation duration in milliseconds (default: 850ms) */
  flipDuration?: number;
  /** Enable tilt on cards */
  enableTilt?: boolean;
  /** Enable ambient glow on cards */
  enableGlow?: boolean;
  /** Glow mode for cards */
  glowMode?: GlowEffectProps['mode'];
  /** Enable cursor-following spotlight */
  enableSpotlight?: boolean;
  /** Spotlight size */
  spotlightSize?: number;
}
