import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    appTitle: "WorkSystem",
    share: "Share",
    addList: "+ Add another list",
    addCard: "+ Add a card",
    howToUse: "How to use",
    language: "EN",
    howToUseTitle: "How to use WorkSystem",
    howToUseDesc1: "Drag and drop tasks between lists. Double-click titles or use ✏️ to edit them, and 🗑️ to delete.",
    howToUseDesc2: "Click on any task's description to write or edit details directly.",
    howToUseDesc3: "Switch themes to enjoy unique interactive animations (try moving your mouse!).",
    howToUseDesc4: "View your progress and download PDF reports in the Dashboard.",
    close: "Close",
    todo: "To Do",
    inProgress: "In Progress",
    done: "Done",
    theme: "Theme",
    board: "Board",
    dashboard: "Dashboard",
    totalTasks: "Total Tasks",
    completionRate: "Completion Rate",
    recentActivity: "Recent Activity",
    downloadReport: "Download PDF",
    reportTitle: "Project Status Report",
    date: "Date",
    completedTasks: "Completed Tasks",
    pendingTasks: "Pending Tasks",
    taskName: "Task Name",
    status: "Status",
    taskDetails: "Task Details",
    images: "Attached Images",
    addImage: "Add Image"
  },
  th: {
    appTitle: "ระบบจัดการงาน",
    share: "แชร์",
    addList: "+ เพิ่มรายการใหม่",
    addCard: "+ เพิ่มการ์ด",
    howToUse: "วิธีใช้งาน",
    language: "TH",
    howToUseTitle: "วิธีใช้งาน WorkSystem",
    howToUseDesc1: "ลากและวางงานเพื่อย้ายสถานะ ดับเบิลคลิกที่ชื่อ หรือกดปุ่ม ✏️ เพื่อแก้ไข และ 🗑️ เพื่อลบ",
    howToUseDesc2: "คลิกที่รายละเอียดงานเพื่อพิมพ์ข้อความเพิ่มเติม และแนบรูปภาพได้",
    howToUseDesc3: "สลับธีมเพื่อเล่นเอฟเฟกต์แอนิเมชันสุดล้ำ (ลองเอาเมาส์ปัดเล่นดูสิ!)",
    howToUseDesc4: "ดูสถิติความคืบหน้า และดาวน์โหลดรายงานสรุป PDF ได้ที่หน้าแดชบอร์ด",
    close: "ปิด",
    todo: "สิ่งที่ต้องทำ",
    inProgress: "กำลังดำเนินการ",
    done: "เสร็จสิ้น",
    theme: "ธีม",
    board: "กระดาน",
    dashboard: "แดชบอร์ด",
    totalTasks: "งานทั้งหมด",
    completionRate: "อัตราความสำเร็จ",
    recentActivity: "กิจกรรมล่าสุด",
    downloadReport: "ดาวน์โหลด PDF",
    reportTitle: "รายงานสถานะโครงการ",
    date: "วันที่",
    completedTasks: "งานที่เสร็จแล้ว",
    pendingTasks: "งานที่ยังไม่เสร็จ",
    taskName: "ชื่องาน",
    status: "สถานะ",
    taskDetails: "รายละเอียดงาน",
    images: "รูปประกอบ",
    addImage: "เพิ่มรูปภาพ"
  }
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('th');

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'th' : 'en');
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
