import React, { useState, useCallback, KeyboardEvent, useId } from 'react';
import { FlashcardProps } from '../../types/flashcard';
import { Tilt } from '../core/tilt';
import { Spotlight } from '../core/spotlight';
import './Flashcard.css';

/**
 * Flashcard Component
 * 
 * An interactive, responsive 3D-flipping flashcard component enhanced with:
 * - Spotlight Border Glow: ONLY the 1px border glows right under the cursor.
 * - Subtle 3D Mouse Tilt: rotationFactor={8} with isRevese for natural, gentle deflection.
 * - Slowed-down, cinematic 850ms flip duration.
 * - Complete keyboard and screen-reader focus locking (inert attribute).
 * - Reduced-motion graceful crossfade degradation.
 */
export const Flashcard: React.FC<FlashcardProps> = ({
  topic,
  answer,
  id,
  category,
  className = '',
  onFlip,
  isFlipped: controlledFlipped,
  revealHint = 'Click to reveal answer',
  returnHint = 'Click to flip back',
  minHeight = 260,
  flipDuration = 850,
  enableTilt = true,
  tiltRotationFactor = 4,
  enableSpotlight = true,
  spotlightSize = 124,
  spotlightColor,
  spotlightProps,
}) => {
  // Support both uncontrolled (internal state) and controlled flipping
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isControlled = controlledFlipped !== undefined;
  const isFlipped = isControlled ? controlledFlipped : internalFlipped;

  const titleId = useId();
  const answerId = useId();

  const activeSpotlightColor = spotlightColor || '#3b82f6';

  const handleToggleFlip = useCallback(() => {
    const nextState = !isFlipped;
    if (!isControlled) {
      setInternalFlipped(nextState);
    }
    if (onFlip) {
      onFlip(nextState, id);
    }
  }, [isFlipped, isControlled, onFlip, id]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      // Toggle flip on Enter or Space key
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggleFlip();
      }
    },
    [handleToggleFlip]
  );

  const cardInner = (
    <div
      className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-labelledby={isFlipped ? answerId : titleId}
      aria-label={`Flashcard: ${topic}. Status: ${isFlipped ? 'Answer revealed' : 'Topic displayed'}. Press Enter or Space to flip.`}
      onClick={handleToggleFlip}
      onKeyDown={handleKeyDown}
    >
      {/* =================================================================
          FRONT FACE: 1px Spotlight Border + Solid Inner Body
          Only the 1px perimeter border glows under cursor movement
         ================================================================= */}
      <div
        className="flashcard-face flashcard-front"
        aria-hidden={isFlipped}
        // @ts-expect-error - React supports standard inert attribute
        inert={isFlipped ? '' : undefined}
      >
        {/* Spotlight illuminates ONLY through the 1px outer border gap */}
        {enableSpotlight && (
          <Spotlight
            size={spotlightSize}
            color={activeSpotlightColor}
            className="flashcard-border-spotlight blur-3xl from-blue-600 via-blue-500 to-blue-400 dark:from-blue-200 dark:via-blue-300 dark:to-blue-400"
            {...spotlightProps}
          />
        )}

        {/* Solid inner surface blocking light from card face */}
        <div className="flashcard-face-inner">
          <div className="flashcard-front-content">
            <h3 id={titleId} className="flashcard-topic">
              {topic}
            </h3>
          </div>

          <div className="flashcard-front-footer">
            <span className="flashcard-hint">
              <svg
                className="flashcard-hint-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4 12v-3a4 4 0 0 1 4-4h12m0 0l-3-3m3 3l-3 3M20 12v3a4 4 0 0 1-4 4H4m0 0l3 3m-3-3l3-3" />
              </svg>
              <span>{revealHint}</span>
            </span>
          </div>
        </div>
      </div>

      {/* =================================================================
          BACK FACE: 1px Spotlight Border + Solid Inner Body
          Completely inert and hidden from focus/screen readers when NOT flipped
         ================================================================= */}
      <div
        className="flashcard-face flashcard-back"
        aria-hidden={!isFlipped}
        // @ts-expect-error - React supports standard inert attribute
        inert={!isFlipped ? '' : undefined}
      >
        {/* Spotlight illuminates ONLY through the 1px outer border gap */}
        {enableSpotlight && (
          <Spotlight
            size={spotlightSize}
            color={activeSpotlightColor}
            className="flashcard-border-spotlight blur-3xl from-blue-600 via-blue-500 to-blue-400 dark:from-blue-200 dark:via-blue-300 dark:to-blue-400"
            {...spotlightProps}
          />
        )}

        {/* Solid inner surface blocking light from card face */}
        <div className="flashcard-face-inner">
          <div className="flashcard-back-header">
            {category ? (
              <span className="flashcard-badge">{category}</span>
            ) : (
              <span />
            )}
            <span className="flashcard-back-topic-subtle" title={topic}>
              {topic}
            </span>
          </div>

          <div className="flashcard-back-content">
            <div id={answerId} className="flashcard-answer">
              {typeof answer === 'string' ? <p>{answer}</p> : answer}
            </div>
          </div>

          <div className="flashcard-back-footer">
            <span className="flashcard-hint-back">
              <svg
                className="flashcard-hint-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4 12v-3a4 4 0 0 1 4-4h12m0 0l-3-3m3 3l-3 3M20 12v3a4 4 0 0 1-4 4H4m0 0l3 3m-3-3l3-3" />
              </svg>
              <span>{returnHint}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`flashcard-wrapper ${className}`.trim()}
      style={{
        '--fc-card-min-height': typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
        '--fc-transition-duration': `${flipDuration}ms`,
        '--fc-transition-half-duration': `${Math.round(flipDuration / 2)}ms`,
      } as React.CSSProperties}
    >
      {/* Subtle 3D Tilt: rotationFactor={4} with isRevese */}
      {enableTilt ? (
        <Tilt
          rotationFactor={tiltRotationFactor}
          isRevese
          springOptions={{ damping: 20, stiffness: 180 }}
          style={{ height: '100%', display: 'block' }}
        >
          {cardInner}
        </Tilt>
      ) : (
        cardInner
      )}
    </div>
  );
};
