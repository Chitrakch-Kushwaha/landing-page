import { FlashcardItem } from '../types/flashcard';

/**
 * Flashcard Study Dataset
 * Separated completely from presentation logic.
 */
export const studyFlashcards: FlashcardItem[] = [
  {
    id: 'fc-1',
    category: 'CSS & Web Rendering',
    topic: 'How does CSS 3D perspective work?',
    answer: 'The perspective property defines the distance between the z=0 plane and the viewer. A lower value (e.g., 400px) creates an intense, dramatic 3D perspective, while a higher value (e.g., 1000px) yields a subtle, natural depth. When combined with transform-style: preserve-3d, child elements share the 3D space.',
    difficulty: 'Intermediate',
    tags: ['css', '3d', 'transforms'],
    glowColors: ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6'],
  },
  {
    id: 'fc-2',
    category: 'Accessibility',
    topic: 'Why is the HTML `inert` attribute critical for flip cards?',
    answer: 'The inert attribute disables all user interaction and hides elements from assistive technology. Applying inert to the hidden card face guarantees that screen readers and Tab key focus cannot navigate into or read the back answer while the user is still looking at the question.',
    difficulty: 'Intermediate',
    tags: ['a11y', 'html', 'focus'],
    glowColors: ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6'],
  },
  {
    id: 'fc-3',
    category: 'Performance',
    topic: 'Why animate transform and opacity instead of height or margin?',
    answer: 'Transform and opacity changes bypass both the browser Layout (reflow) and Paint stages. They are handled directly on the compositor thread on the GPU, avoiding main-thread bottlenecks and guaranteeing silky 60/120fps animations without dropping frames.',
    difficulty: 'Beginner',
    tags: ['performance', 'compositor', 'gpu'],
    glowColors: ['#f59e0b', '#f97316', '#f43f5e', '#a855f7'],
  },
  {
    id: 'fc-4',
    category: 'Computer Science',
    topic: 'What is CAP Theorem in Distributed Systems?',
    answer: 'CAP theorem states that a distributed data store can simultaneously provide at most two out of three guarantees: Consistency (every read receives the most recent write or an error), Availability (every request receives a non-error response), and Partition Tolerance (the system continues to operate despite arbitrary network dropped messages).',
    difficulty: 'Advanced',
    tags: ['distributed-systems', 'databases', 'system-design'],
    glowColors: ['#8b5cf6', '#d946ef', '#ec4899', '#6366f1'],
  },
  {
    id: 'fc-5',
    category: 'Web Accessibility',
    topic: 'How to handle `prefers-reduced-motion` for 3D interactions?',
    answer: 'Users with vestibular motion disorders can experience nausea from 3D rotational spinning. In @media (prefers-reduced-motion: reduce), we disable the 3D rotateY transform and instead use a gentle opacity crossfade or instant transition to preserve accessibility while maintaining functionality.',
    difficulty: 'Intermediate',
    tags: ['a11y', 'reduced-motion', 'ux'],
    glowColors: ['#f43f5e', '#fb923c', '#facc15', '#a3e635'],
  },
  {
    id: 'fc-6',
    category: 'React Architecture',
    topic: 'What is the benefit of Uncontrolled vs. Controlled Component patterns?',
    answer: 'An uncontrolled card encapsulates its own flip state with useState, making it zero-friction to drop in anywhere. Supporting an optional controlled prop (isFlipped) allows parents to coordinate collective actions (like "Flip All" or step-by-step flashcard reviews) without rewriting the card.',
    difficulty: 'Intermediate',
    tags: ['react', 'patterns', 'state'],
    glowColors: ['#38bdf8', '#06b6d4', '#6366f1', '#a855f7'],
  },
];
