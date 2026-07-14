import React from 'react';
import Card from './Card';
import { useLanguage } from '../contexts/LanguageContext';

export default function List({ list, cards, onUpdateCard, onMoveCard, onAddCard }) {
  const { t } = useLanguage();
  
  return (
    <div 
      className="list-container glass-panel"
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove('drag-over');
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const cardId = e.dataTransfer.getData('text/plain');
        if (cardId && onMoveCard) {
          onMoveCard(cardId, list.id);
        }
      }}
    >
      <div className="list-header">
        <span>{list.titleKey ? t(list.titleKey) : list.title}</span>
        <button className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>⋮</button>
      </div>
      <div className="list-cards" style={{ minHeight: '50px' }}>
        {cards.map(card => (
          <Card key={card.id} card={card} onUpdate={onUpdateCard} />
        ))}
      </div>
      <button className="btn btn-ghost add-card-btn" onClick={() => onAddCard(list.id)}>
        {t('addCard')}
      </button>
    </div>
  );
}
