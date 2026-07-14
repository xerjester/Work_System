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
    howToUseDesc1: "Create lists to organize different stages of your project.",
    howToUseDesc2: "Add cards to lists to represent individual tasks.",
    howToUseDesc3: "Use the 'Share' button to collaborate with your team.",
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
    howToUseDesc1: "สร้างรายการ (List) เพื่อจัดระเบียบขั้นตอนต่างๆ ของโปรเจกต์",
    howToUseDesc2: "เพิ่มการ์ด (Card) ลงในรายการเพื่อเป็นตัวแทนของแต่ละงาน",
    howToUseDesc3: "ใช้ปุ่ม 'แชร์' เพื่อทำงานร่วมกับทีมของคุณ",
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
  const [lang, setLang] = useState('en');

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
