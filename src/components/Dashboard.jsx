import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Dashboard({ lists, cards }) {
  const { t, lang } = useLanguage();
  
  const totalCards = cards.length;
  const doneCards = cards.filter(c => c.list_id === '3');
  const completionRate = totalCards > 0 ? Math.round((doneCards.length / totalCards) * 100) : 0;

  // Pie chart calculation
  let currentAngle = 0;
  const pieColors = ['#f43f5e', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
  const pieData = lists.map((list, index) => {
    const count = cards.filter(c => c.list_id === list.id).length;
    const percentage = totalCards > 0 ? (count / totalCards) * 100 : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + percentage;
    currentAngle = endAngle;
    return {
      id: list.id,
      title: list.titleKey ? t(list.titleKey) : list.title,
      count,
      percentage,
      color: pieColors[index % pieColors.length],
      gradientStr: `${pieColors[index % pieColors.length]} ${startAngle}% ${endAngle}%`
    };
  });
  const conicGradient = pieData.length > 0 ? pieData.map(d => d.gradientStr).join(', ') : 'transparent';

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="dashboard-container animation-slide-up">
      <div className="dashboard-header print-hide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>{t('dashboard')} 📊</h2>
          <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>Overview of your project metrics</p>
        </div>
        <button className="btn btn-primary" onClick={handleDownloadPDF} style={{ display: 'flex', gap: '0.5rem' }}>
          📄 {t('downloadReport')}
        </button>
      </div>

      <div className="metrics-grid print-hide">
        <div className="metric-card glass">
          <h3>{t('totalTasks')}</h3>
          <div className="metric-value">{totalCards}</div>
        </div>
        <div className="metric-card glass">
          <h3>{t('done')}</h3>
          <div className="metric-value" style={{ color: 'var(--success)' }}>{doneCards.length}</div>
        </div>
        <div className="metric-card glass">
          <h3>{t('completionRate')}</h3>
          <div className="metric-value" style={{ color: 'var(--accent-color)' }}>{completionRate}%</div>
          <div className="progress-bar-bg mt-2">
            <div className="progress-bar-fill" style={{ width: `${completionRate}%`, background: 'var(--accent-color)' }}></div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-row print-hide" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="chart-card glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Task Distribution</h3>
          <div style={{
            width: '180px', height: '180px', borderRadius: '50%',
            background: totalCards > 0 ? `conic-gradient(${conicGradient})` : 'rgba(128,128,128,0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '4px solid var(--glass-bg)'
          }}></div>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {pieData.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ width: '12px', height: '12px', background: d.color, borderRadius: '50%' }}></span>
                {d.title} ({d.count})
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart-card glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>All Work (Analyst View)</h3>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '250px', paddingRight: '0.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0.5rem 0.5rem 0', color: 'var(--text-secondary)' }}>{t('taskName')}</th>
                  <th style={{ padding: '0.5rem 0.5rem 0.5rem 0', color: 'var(--text-secondary)', textAlign: 'right' }}>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {cards.map(card => {
                  const list = lists.find(l => l.id === card.list_id);
                  const listName = list ? (list.titleKey ? t(list.titleKey) : list.title) : '';
                  const badgeColor = list ? pieData.find(p => p.id === list.id)?.color : 'var(--accent-color)';
                  
                  return (
                    <tr key={card.id} style={{ borderBottom: '1px solid rgba(128,128,128,0.15)' }}>
                      <td style={{ padding: '0.75rem 0.5rem 0.75rem 0', fontWeight: '500' }}>{card.title}</td>
                      <td style={{ padding: '0.75rem 0.5rem 0.75rem 0', textAlign: 'right' }}>
                        <span style={{ background: badgeColor, color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {listName}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Printable PDF Table - Hidden on screen via print-hide, but wait, report-section is visible on screen right now.
          We will wrap it in a div that is ONLY visible during print to keep the dashboard clean. */}
      <div className="report-section print-only" style={{ background: 'white', color: 'black' }}>
        <h3 className="report-title-header" style={{ textAlign: 'center', background: '#a5d8dd', color: '#c00000', padding: '0.75rem', border: '1px solid black', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
          {t('reportTitle')}
        </h3>
        <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'black' }}>
          <thead>
            <tr style={{ background: '#dce6f1' }}>
              <th style={{ border: '1px solid black', padding: '0.5rem', width: '10%', textAlign: 'center' }}>{t('date')}</th>
              <th style={{ border: '1px solid black', padding: '0.5rem', width: '25%', textAlign: 'center' }}>{t('taskDetails')}</th>
              <th style={{ border: '1px solid black', padding: '0.5rem', width: '50%', textAlign: 'center' }}>{t('images')}</th>
              <th style={{ border: '1px solid black', padding: '0.5rem', width: '15%', textAlign: 'center' }}>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {doneCards.map(card => {
              const list = lists.find(l => l.id === card.list_id);
              const listName = list ? (list.titleKey ? t(list.titleKey) : list.title) : '';
              return (
                <tr key={card.id}>
                  <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'center' }}>
                    {card.date || new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}
                  </td>
                  <td style={{ border: '1px solid black', padding: '0.5rem', verticalAlign: 'top' }}>
                    <strong>{card.title}</strong><br/>
                    <span style={{ fontSize: '0.85rem' }}>{card.description}</span>
                  </td>
                  <td style={{ border: '1px solid black', padding: '0.5rem', verticalAlign: 'top' }}>
                    {card.images && card.images.length > 0 ? (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {card.images.map((img, i) => (
                          <img key={i} src={img} alt="attachment" style={{ height: '100px', objectFit: 'contain' }} />
                        ))}
                      </div>
                    ) : null}
                  </td>
                  <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'center', verticalAlign: 'middle' }}>
                    {listName}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
