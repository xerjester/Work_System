import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = import.meta.env.DEV ? 'http://localhost:8080/api' : '/api';

export default function Card({ card, onUpdate, onEdit, onDelete, onMoveCard, lists, currentListId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descText, setDescText] = useState(card.description || '');
  const [loadedImages, setLoadedImages] = useState(card.images || []);
  const fileInputRef = useRef(null);
  const { t, lang } = useLanguage();

  // Lazy-load images from separate API to avoid payload size limit
  useEffect(() => {
    if (!card.images || card.images.length === 0) {
      fetch(`${API_BASE}/images?id=${card.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.images && data.images.length > 0) {
            setLoadedImages(data.images);
          }
        })
        .catch(() => {});
    } else {
      setLoadedImages(card.images);
    }
  }, [card.id, card.images]);

  const handleDescBlur = () => {
    setIsEditingDesc(false);
    if (descText !== (card.description || '')) {
      onUpdate({ ...card, description: descText });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        const newImages = [...loadedImages, base64];
        setLoadedImages(newImages);
        onUpdate({ ...card, images: newImages });
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = null;
  };

  const handleDeleteImage = (indexToDelete) => {
    const confirmMsg = lang === 'th' ? 'ต้องการลบรูปภาพนี้หรือไม่?' : 'Delete this image?';
    if (!window.confirm(confirmMsg)) return;
    const newImages = loadedImages.filter((_, i) => i !== indexToDelete);
    setLoadedImages(newImages);
    onUpdate({ ...card, images: newImages });
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
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h4 onDoubleClick={(e) => { e.stopPropagation(); onEdit(card); }} style={{ margin: 0, flex: 1, wordBreak: 'break-word' }}>{card.title}</h4>
        <div className="card-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          {lists && lists.length > 0 && (
            <select
              className="btn btn-ghost card-move-select"
              style={{ padding: '0 2px', fontSize: '11px', background: 'transparent', color: 'inherit', border: '1px solid var(--glass-border)', borderRadius: '4px', cursor: 'pointer', maxWidth: '80px', textOverflow: 'ellipsis' }}
              value={currentListId}
              onChange={(e) => {
                e.stopPropagation();
                if (onMoveCard && e.target.value !== currentListId) {
                  onMoveCard(card.id, e.target.value);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              title={t('moveCard') || "Move Card"}
            >
              <option value="" disabled>{t('moveCard') || "Move to..."}</option>
              {lists.map(l => (
                <option key={l.id} value={l.id} style={{ color: 'black' }}>
                  {l.titleKey ? t(l.titleKey) : l.title}
                </option>
              ))}
            </select>
          )}
          <button className="btn btn-ghost" style={{ padding: '2px', fontSize: '12px' }} onClick={(e) => { e.stopPropagation(); onEdit(card); }} title="Edit Task">✏️</button>
          <button className="btn btn-ghost" style={{ padding: '2px', fontSize: '12px', color: '#f43f5e' }} onClick={(e) => { e.stopPropagation(); onDelete(card.id); }} title="Delete Task">🗑️</button>
        </div>
      </div>
      {isEditingDesc ? (
        <textarea
          autoFocus
          value={descText}
          onChange={(e) => setDescText(e.target.value)}
          onBlur={handleDescBlur}
          onKeyDown={(e) => { if (e.key === 'Escape') { setDescText(card.description || ''); setIsEditingDesc(false); } }}
          className="card-desc-edit"
          style={{ width: '100%', minHeight: '60px', background: 'rgba(255,255,255,0.1)', color: 'inherit', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '4px', resize: 'vertical', marginTop: '0.5rem', fontFamily: 'inherit' }}
          placeholder="Enter description..."
        />
      ) : (
        <p 
          className="card-desc" 
          onClick={(e) => { e.stopPropagation(); setIsEditingDesc(true); }}
          style={{ cursor: 'text', minHeight: '20px', padding: card.description ? '0' : '4px', border: card.description ? 'none' : '1px dashed var(--glass-border)', opacity: card.description ? 1 : 0.6, borderRadius: '4px', marginTop: '0.5rem' }}
        >
          {card.description || "+ Add description..."}
        </p>
      )}
      
      {loadedImages && loadedImages.length > 0 && (
        <div className="card-images" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {loadedImages.map((img, i) => (
            <div key={i} style={{ position: 'relative', width: '100%' }}>
              <img src={img} alt="attachment" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteImage(i); }}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(244, 63, 94, 0.9)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                title={lang === 'th' ? 'ลบรูปภาพ' : 'Delete image'}
              >
                ✕
              </button>
            </div>
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
