import React from 'react';
import { FlashcardGridProps } from '../../types/flashcard';
import { Flashcard } from './Flashcard';

/**
 * FlashcardGrid Component
 * 
 * Renders a responsive CSS grid of flashcards where each card maintains
 * independent flip state, subtle 3D tilt (rotationFactor=8, isRevese),
 * and 1px spotlight border glow.
 */
export const FlashcardGrid: React.FC<FlashcardGridProps> = ({
  items,
  className = '',
  minColWidth = 310,
  onCardFlip,
  flipDuration = 850,
  enableTilt = true,
  enableSpotlight = true,
  spotlightSize = 124,
}) => {
  return (
    <div
      className={`flashcard-grid ${className}`.trim()}
      style={{
        '--fc-grid-min-col': typeof minColWidth === 'number' ? `${minColWidth}px` : minColWidth,
      } as React.CSSProperties}
    >
      {items.map((card) => (
        <Flashcard
          key={card.id}
          id={card.id}
          topic={card.topic}
          answer={card.answer}
          category={card.category}
          flipDuration={flipDuration}
          enableTilt={enableTilt}
          tiltRotationFactor={8}
          enableSpotlight={enableSpotlight}
          spotlightSize={spotlightSize}
          spotlightColor={card.spotlightColor}
          onFlip={(isFlipped) => {
            if (onCardFlip) {
              onCardFlip(card.id, isFlipped);
            }
          }}
        />
      ))}
    </div>
  );
};
