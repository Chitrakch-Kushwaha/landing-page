import React, { useState, useMemo, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { FlashcardGrid } from './components/Flashcard';
import { studyFlashcards } from './data/flashcardsData';
import './index.css';

export const App: React.FC = () => {
  // Navigation view router: Default to landing page
  const [currentView, setCurrentView] = useState<'landing' | 'studydeck'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'studydeck' || window.location.hash === '#deck') {
        return 'studydeck';
      }
    }
    return 'landing';
  });

  // Listen to popstate / hash change
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'studydeck' || window.location.hash === '#deck') {
        setCurrentView('studydeck');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // StudyDeck state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [flippedMap, setFlippedMap] = useState<Record<string | number, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [flipDuration, setFlipDuration] = useState<number>(850);
  const [enableTilt, setEnableTilt] = useState<boolean>(true);
  const [enableSpotlight, setEnableSpotlight] = useState<boolean>(true);

  // Extract unique categories for StudyDeck
  const categories = useMemo(() => {
    const set = new Set<string>();
    studyFlashcards.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Filter cards by category and query
  const filteredCards = useMemo(() => {
    return studyFlashcards.filter((card) => {
      const matchesCategory =
        selectedCategory === 'All' || card.category === selectedCategory;
      const matchesQuery =
        card.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof card.answer === 'string' &&
          card.answer.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCardFlip = (id: string | number, isFlipped: boolean) => {
    setFlippedMap((prev) => ({
      ...prev,
      [id]: isFlipped,
    }));
  };

  const flippedCount = Object.values(flippedMap).filter(Boolean).length;
  const progressPercent = Math.round(
    (flippedCount / Math.max(studyFlashcards.length, 1)) * 100
  );

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // If in landing view, render Noesis Landing Page
  if (currentView === 'landing') {
    return (
      <LandingPage
        onOpenDeck={() => {
          setCurrentView('studydeck');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // Otherwise, render full StudyDeck Flashcards platform
  return (
    <div className={`study-platform ${isDarkMode ? 'dark' : ''}`}>
      {/* Return to Landing Banner */}
      <div
        style={{
          backgroundColor: '#0c0d0e',
          borderBottom: '1px solid rgba(81, 81, 81, 0.4)',
          padding: '0.625rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#F5F5F5',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#FC710C',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: 0,
          }}
        >
          <span>← Back to Noesis Overview</span>
        </button>
        <span style={{ fontSize: '0.75rem', color: '#A5A19E' }}>
          Noesis Practice Engine · 3D Flashcards
        </span>
      </div>

      {/* Header & Navigation */}
      <header className="study-header">
        <div className="study-header-inner">
          <div className="study-brand">
            <span className="study-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="m9 8 6 4-6 4Z" />
              </svg>
            </span>
            <div>
              <h1 className="study-title">StudyDeck</h1>
              <p className="study-subtitle">3D Flashcards with Spotlight Border Glow</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="study-main">
        {/* Progress & Controls Bar */}
        <section className="study-progress-card">
          <div className="study-progress-header">
            <div>
              <span className="study-stat-label">Session Progress</span>
              <p className="study-stat-value">
                {flippedCount} of {studyFlashcards.length} cards revealed ({progressPercent}%)
              </p>
            </div>
            <div className="study-keyboard-hint">
              <kbd>Tab</kbd> to focus • <kbd>Enter</kbd> / <kbd>Space</kbd> to flip
            </div>
          </div>
          <div className="progress-bar-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          {/* Interactive Effect Controls Toolbar */}
          <div className="effect-controls-toolbar">
            <div className="effect-control-item">
              <label htmlFor="flip-speed-slider" className="control-label">
                Flip Speed: <strong>{flipDuration}ms</strong>
              </label>
              <input
                id="flip-speed-slider"
                type="range"
                min="500"
                max="1400"
                step="50"
                value={flipDuration}
                onChange={(e) => setFlipDuration(Number(e.target.value))}
                className="range-slider"
              />
            </div>

            <div className="effect-toggles">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={enableSpotlight}
                  onChange={(e) => setEnableSpotlight(e.target.checked)}
                />
                <span>Spotlight Border Glow</span>
              </label>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={enableTilt}
                  onChange={(e) => setEnableTilt(e.target.checked)}
                />
                <span>Subtle Tilt (8° Reverse)</span>
              </label>
            </div>
          </div>
        </section>

        {/* Search & Category Filter Controls */}
        <section className="study-controls">
          <div className="search-box">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search topics or answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search flashcards"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="category-pills" role="tablist" aria-label="Card categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Responsive Flashcard Grid with Spotlight Border Glow & Subtle Tilt */}
        <section className="study-cards-section" aria-label="Flashcards">
          {filteredCards.length > 0 ? (
            <FlashcardGrid
              items={filteredCards}
              flipDuration={flipDuration}
              enableTilt={enableTilt}
              enableSpotlight={enableSpotlight}
              onCardFlip={handleCardFlip}
            />
          ) : (
            <div className="empty-state">
              <p>No flashcards found matching "{searchQuery}".</p>
              <button
                type="button"
                className="reset-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="study-footer">
        <p>Interactive 3D Study Platform • Spotlight Border Glow & Subtle Tilt Active</p>
      </footer>
    </div>
  );
};

export default App;
