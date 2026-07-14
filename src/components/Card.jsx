import React, { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Card({ card, onUpdate, onEdit, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useLanguage();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        onUpdate({ ...card, images: [...(card.images || []), base64] });
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = null;
  };

  return (
    <div 
      className="card glass"
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', card.id);
        setTimeout(() => e.target.classList.add('dragging'), 0);
      }}
      onDragEnd={(e) => {
        e.target.classList.remove('dragging');
      }}
      style={{ cursor: 'grab' }}
    >
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 onDoubleClick={(e) => { e.stopPropagation(); onEdit(card); }} style={{ margin: 0 }}>{card.title}</h4>
        <div style={{ display: 'flex' }}>
          <button className="btn btn-ghost" style={{ padding: '2px', fontSize: '12px' }} onClick={(e) => { e.stopPropagation(); onEdit(card); }} title="Edit Task">✏️</button>
          <button className="btn btn-ghost" style={{ padding: '2px', fontSize: '12px', color: '#f43f5e' }} onClick={(e) => { e.stopPropagation(); onDelete(card.id); }} title="Delete Task">🗑️</button>
        </div>
      </div>
      {card.description && <p className="card-desc">{card.description}</p>}
      
      {card.images && card.images.length > 0 && (
        <div className="card-images" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {card.images.map((img, i) => (
            <img key={i} src={img} alt="attachment" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-start' }}>
        <button 
          className="btn btn-ghost" 
          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', border: '1px dashed var(--glass-border)' }}
          onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
        >
          📷 {t('addImage')}
        </button>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
}
