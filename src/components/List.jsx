import React from 'react';
import Card from './Card';
import { useLanguage } from '../contexts/LanguageContext';

export default function List({ list, cards, onUpdateCard, onMoveCard, onAddCard, onEditList, onDeleteList, onEditCard, onDeleteCard }) {
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
        <h3 className="list-title" onDoubleClick={() => onEditList(list)} style={{ margin: 0, cursor: 'text' }}>
          {list.titleKey ? t(list.titleKey) : list.title}
        </h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="btn btn-ghost" style={{ padding: '0.25rem' }} onClick={() => onEditList(list)} title="Edit List">✏️</button>
          <button className="btn btn-ghost" style={{ padding: '0.25rem', color: '#f43f5e' }} onClick={() => onDeleteList(list.id)} title="Delete List">🗑️</button>
        </div>
      </div>
      <div className="list-cards" style={{ minHeight: '50px' }}>
        {cards.map(card => (
          <Card key={card.id} card={card} onUpdate={onUpdateCard} onEdit={onEditCard} onDelete={onDeleteCard} />
        ))}
      </div>
      <button className="btn btn-ghost add-card-btn" onClick={() => onAddCard(list.id)}>
        {t('addCard')}
      </button>
    </div>
  );
}
