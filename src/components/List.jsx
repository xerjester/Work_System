import React from 'react';
import Card from './Card';
import { useLanguage } from '../contexts/LanguageContext';

export default function List({ list, cards, lists, onUpdateCard, onMoveCard, onAddCard, onEditList, onDeleteList, onEditCard, onDeleteCard }) {
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
      <div className="list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="list-title" style={{ margin: 0 }}>
          {list.titleKey ? t(list.titleKey) : list.title}
        </h3>
        <div style={{ display: 'flex', gap: '4px' }}>
        </div>
      </div>
      <div className="list-cards" style={{ minHeight: '50px' }}>
        {cards.map(card => (
          <Card key={card.id} card={card} onUpdate={onUpdateCard} onEdit={onEditCard} onDelete={onDeleteCard} onMoveCard={onMoveCard} lists={lists} currentListId={list.id} />
        ))}
      </div>
      <button className="btn btn-ghost add-card-btn" onClick={() => onAddCard(list.id)}>
        {t('addCard')}
      </button>
    </div>
  );
}
