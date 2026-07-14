import React, { useState } from 'react';
import './index.css';
import List from './components/List';
import HowToUseModal from './components/HowToUseModal';
import Dashboard from './components/Dashboard';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';

const INITIAL_DATA = {
  board: { title: 'Product Launch' },
  lists: [
    { id: '1', titleKey: 'todo', position: 1 },
    { id: '2', titleKey: 'inProgress', position: 2 },
    { id: '3', titleKey: 'done', position: 3 }
  ],
  cards: [
    { id: '1', list_id: '1', title: 'Design landing page', description: 'Create mockups for the new landing page using Figma.', images: [], date: '22/2/2026' },
    { id: '2', list_id: '1', title: 'Write copy', description: 'Draft the main headlines and benefits.', images: [], date: '22/2/2026' },
    { id: '3', list_id: '2', title: 'Setup database', description: 'Initialize Supabase and create tables.', images: [], date: '22/2/2026' },
    { id: '4', list_id: '3', title: 'Project planning', description: 'Define MVP scope and tasks.', images: [], date: '22/2/2026' }
  ]
};

function App() {
  const [board] = useState(INITIAL_DATA.board);
  const [lists] = useState(INITIAL_DATA.lists);
  const [cards, setCards] = useState(INITIAL_DATA.cards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('board');
  const { t, lang, toggleLanguage } = useLanguage();
  const { cycleTheme, themeEmoji } = useTheme();

  const updateCard = (updatedCard) => {
    setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const moveCard = (cardId, targetListId) => {
    setCards(prevCards => prevCards.map(c => {
      if (c.id === cardId && c.list_id !== targetListId) {
        return { ...c, list_id: targetListId };
      }
      return c;
    }));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">
          <span>❖</span> {t('appTitle')}
        </div>
        <div className="header-actions">
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <button 
              className={`btn ${currentView === 'board' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setCurrentView('board')}
            >
              {t('board')}
            </button>
            <button 
              className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setCurrentView('dashboard')}
            >
              {t('dashboard')}
            </button>
          </div>
          <h2 className="board-title">{board.title}</h2>
          <div className="header-buttons">
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(true)}>
              ℹ️ {t('howToUse')}
            </button>
            <button className="btn btn-ghost" onClick={toggleLanguage}>
              🌐 {t('language')}
            </button>
            <button className="btn btn-ghost" onClick={cycleTheme}>
              {themeEmoji} {t('theme')}
            </button>
            <button className="btn btn-primary">{t('share')}</button>
          </div>
        </div>
      </header>
      
      {currentView === 'board' ? (
        <main className="board-area">
          {lists.sort((a, b) => a.position - b.position).map(list => (
            <List 
              key={list.id} 
              list={list} 
              cards={cards.filter(c => c.list_id === list.id)} 
              onUpdateCard={updateCard}
              onMoveCard={moveCard}
            />
          ))}
          
          <button className="btn btn-ghost add-list-btn glass">
            {t('addList')}
          </button>
        </main>
      ) : (
        <Dashboard lists={lists} cards={cards} />
      )}

      <HowToUseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
