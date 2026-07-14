import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HowToUseModal({ isOpen, onClose }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{t('howToUseTitle')}</h3>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          <li>{t('howToUseDesc1')}</li>
          <li>{t('howToUseDesc2')}</li>
          <li>{t('howToUseDesc3')}</li>
          <li>{t('howToUseDesc4')}</li>
        </ul>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose}>{t('close')}</button>
        </div>
      </div>
    </div>
  );
}
