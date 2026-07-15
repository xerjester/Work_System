import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const steps = {
  en: [
    { icon: '📋', title: 'Organize Tasks', desc: 'Your workspace has 3 lists: To Do, In Progress, and Done. Drag & drop cards to move tasks between statuses.' },
    { icon: '✏️', title: 'Edit & Manage', desc: 'Double-click a task title or tap ✏️ to rename it. Click the description area to add details. Use 🗑️ to delete.' },
    { icon: '📷', title: 'Attach Images', desc: 'Click "Add Image" on any card to attach photos as evidence of your work.' },
    { icon: '🔀', title: 'Move Cards', desc: 'Use the dropdown on each card to quickly move it to another list, or drag and drop it.' },
    { icon: '🎨', title: 'Themes & Language', desc: 'Switch between beautiful themes with unique animations. Toggle between English and Thai anytime.' },
    { icon: '📊', title: 'Dashboard & PDF', desc: 'Go to Dashboard for visual stats. Download a professional PDF report with images attached.' },
  ],
  th: [
    { icon: '📋', title: 'จัดการงาน', desc: 'พื้นที่ทำงานมี 3 รายการ: สิ่งที่ต้องทำ, กำลังดำเนินการ และเสร็จสิ้น ลากและวางการ์ดเพื่อย้ายสถานะงาน' },
    { icon: '✏️', title: 'แก้ไขและจัดการ', desc: 'ดับเบิลคลิกชื่องาน หรือกด ✏️ เพื่อเปลี่ยนชื่อ คลิกที่รายละเอียดเพื่อเพิ่มข้อมูล ใช้ 🗑️ เพื่อลบ' },
    { icon: '📷', title: 'แนบรูปภาพ', desc: 'กดปุ่ม "เพิ่มรูปภาพ" บนการ์ดเพื่อแนบรูปเป็นหลักฐานการทำงาน' },
    { icon: '🔀', title: 'ย้ายการ์ด', desc: 'ใช้ดรอปดาวน์บนการ์ดเพื่อย้ายไปรายการอื่นได้อย่างรวดเร็ว หรือลากแล้ววาง' },
    { icon: '🎨', title: 'ธีมและภาษา', desc: 'สลับธีมสวยๆ พร้อมเอฟเฟกต์แอนิเมชันเฉพาะตัว เปลี่ยนภาษาไทย/อังกฤษได้ตลอด' },
    { icon: '📊', title: 'แดชบอร์ดและ PDF', desc: 'ไปที่แดชบอร์ดเพื่อดูสถิติ ดาวน์โหลดรายงาน PDF พร้อมรูปภาพประกอบ' },
  ]
};

export default function HowToUseModal({ isOpen, onClose }) {
  const { t, lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const currentSteps = steps[lang] || steps.en;

  if (!isOpen) return null;

  const handleClose = () => {
    localStorage.setItem('worksystem_welcomed', 'true');
    setCurrentStep(0);
    onClose();
  };

  const isLastStep = currentStep === currentSteps.length - 1;

  return (
    <div className="modal-overlay" onClick={handleClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-content glass animation-slide-up" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '480px', 
          width: '90%',
          padding: '2rem',
          borderRadius: '20px',
          textAlign: 'center'
        }}
      >
        {/* Welcome Header (only on step 0) */}
        {currentStep === 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👋</div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
              {lang === 'th' ? 'ยินดีต้อนรับสู่ WorkSystem!' : 'Welcome to WorkSystem!'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {lang === 'th' ? 'มาดูวิธีใช้งานกันเลย' : "Let's get you started"}
            </p>
          </div>
        )}

        {/* Step Card */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '16px', 
          padding: '2rem 1.5rem',
          border: '1px solid var(--glass-border)',
          marginBottom: '1.5rem',
          minHeight: '160px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
            {currentSteps[currentStep].icon}
          </div>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
            {currentSteps[currentStep].title}
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem', 
            lineHeight: '1.6',
            margin: 0,
            maxWidth: '360px'
          }}>
            {currentSteps[currentStep].desc}
          </p>
        </div>

        {/* Step Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {currentSteps.map((_, i) => (
            <div 
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{ 
                width: i === currentStep ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px',
                background: i === currentStep ? 'var(--accent-color)' : 'rgba(128,128,128,0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }} 
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {currentStep > 0 && (
            <button 
              className="btn btn-ghost" 
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '12px' }}
            >
              ← {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
            </button>
          )}
          {!isLastStep ? (
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentStep(currentStep + 1)}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '12px', minWidth: '120px' }}
            >
              {lang === 'th' ? 'ถัดไป' : 'Next'} →
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleClose}
              style={{ 
                padding: '0.6rem 2rem', 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent-color), #a855f7)',
                fontWeight: '600'
              }}
            >
              🚀 {lang === 'th' ? 'เริ่มใช้งาน!' : "Let's Go!"}
            </button>
          )}
        </div>

        {/* Skip Link */}
        {!isLastStep && (
          <button 
            onClick={handleClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer',
              fontSize: '0.8rem',
              marginTop: '1rem',
              opacity: 0.7
            }}
          >
            {lang === 'th' ? 'ข้ามไปก่อน' : 'Skip for now'}
          </button>
        )}
      </div>
    </div>
  );
}
