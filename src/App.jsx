import React, { useState, useEffect } from 'react';
import './index.css';
import List from './components/List';
import HowToUseModal from './components/HowToUseModal';
import Dashboard from './components/Dashboard';
import ThemeEffects from './components/ThemeEffects';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { SpeedInsights } from '@vercel/speed-insights/react';

const API_BASE = import.meta.env.DEV ? 'http://localhost:8080/api' : '/api';

function App() {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('board');
  const [loading, setLoading] = useState(true);
  const { t, lang, toggleLanguage } = useLanguage();
  const { cycleTheme, themeEmoji } = useTheme();

  useEffect(() => {
    fetch(`${API_BASE}/data`)
      .then(res => res.json())
      .then(data => {
        if (data.board) {
          setBoard(data.board);
          setLists(data.lists || []);
          setCards(data.cards || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const updateCard = (updatedCard) => {
    setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
    
    fetch(`${API_BASE}/cards`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCard)
    }).catch(err => console.error("Error updating card:", err));
  };

  const moveCard = (cardId, targetListId) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.list_id === targetListId) return;

    const updatedCard = { ...card, list_id: targetListId };
    
    setCards(prevCards => prevCards.map(c => c.id === cardId ? updatedCard : c));

    fetch(`${API_BASE}/cards`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCard)
    }).catch(err => console.error("Error moving card:", err));
  };

  const addList = () => {
    const title = prompt("List Name / ชื่อรายการ:");
    if (!title) return;
    
    const newList = { title, board_id: board?.id || '1' };
    fetch(`${API_BASE}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newList)
    })
    .then(res => res.json())
    .then(data => {
      setLists([...lists, { ...newList, id: data.id || Date.now().toString(), position: 99 }]);
    })
    .catch(err => console.error("Error adding list:", err));
  };

  const addCard = (listId) => {
    const title = prompt("Task Title / ชื่องาน:");
    if (!title) return;
    
    const newCard = { list_id: listId, title, description: '', images: [], date: new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US') };
    fetch(`${API_BASE}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCard)
    })
    .then(res => res.json())
    .then(data => {
      setCards([...cards, { ...newCard, id: data.id || Date.now().toString(), position: 99 }]);
    })
    .catch(err => console.error("Error adding card:", err));
  };

  const editList = (list) => {
    const newTitle = prompt(lang === 'th' ? "ชื่อรายการใหม่:" : "New List Name:", list.titleKey ? t(list.titleKey) : list.title);
    if (!newTitle) return;
    const updatedList = { ...list, title: newTitle, titleKey: null };
    setLists(lists.map(l => l.id === list.id ? updatedList : l));
    fetch(`${API_BASE}/lists`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedList)
    }).catch(err => console.error("Error editing list:", err));
  };

  const deleteList = (listId) => {
    if (!window.confirm(lang === 'th' ? "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้พร้อมงานทั้งหมดข้างใน?" : "Are you sure you want to delete this list and all its tasks?")) return;
    setLists(lists.filter(l => l.id !== listId));
    setCards(cards.filter(c => c.list_id !== listId));
    fetch(`${API_BASE}/lists?id=${listId}`, { method: 'DELETE' }).catch(err => console.error(err));
  };

  const editCard = (card) => {
    const newTitle = prompt(lang === 'th' ? "ชื่องานใหม่:" : "New Task Title:", card.title);
    if (!newTitle) return;
    const updatedCard = { ...card, title: newTitle };
    updateCard(updatedCard);
  };

  const deleteCard = (cardId) => {
    if (!window.confirm(lang === 'th' ? "คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?" : "Are you sure you want to delete this task?")) return;
    setCards(cards.filter(c => c.id !== cardId));
    fetch(`${API_BASE}/cards?id=${cardId}`, { method: 'DELETE' }).catch(err => console.error(err));
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}><h2>Loading Workspace...</h2></div>;
  }

  if (!board) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', flexDirection: 'column' }}>
        <h2>❌ Error Loading Data</h2>
        <p>Could not load the workspace. Please check your database connection.</p>
      </div>
    );
  }

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
              onAddCard={addCard}
              onEditList={editList}
              onDeleteList={deleteList}
              onEditCard={editCard}
              onDeleteCard={deleteCard}
              lists={lists}
            />
          ))}
          
        </main>
      ) : (
        <Dashboard lists={lists} cards={cards} />
      )}

      <HowToUseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ThemeEffects />
      <SpeedInsights />
    </div>
  );
}

export default App;
