export const skills = [
  { label: "硬體", value: 70 },
  { label: "AI / 深度學習", value: 60 },
  { label: "後端", value: 50 },
  { label: "前端", value: 45 },
  { label: "系統設計", value: 55 },
];

export const achievements = {
  "2023": ["市立木柵高工畢業 (電機科)"],
  "2024": ["雲林科技大學 資管系AI專班 就讀中"],
};

export const experiences = {
  "2024": ["雲林科技大學 校內團體程式競賽佳作"],
};

export interface Competition {
  year: string;
  name: string;
  project: string;
  award: string;
  scope: "國際性" | "全國性" | "研討會";
}

export const competitions: Competition[] = [
  {
    year: "2026",
    name: "第十六屆網路智能與應用研討會 NCWIA",
    project: "基於 6D 姿態估計之邊緣運算即時智慧圖書借閱系統",
    award: "投稿",
    scope: "研討會",
  },
  {
    year: "2026",
    name: "日本東京創新天才國際發明展",
    project: "基於 6D 姿態估計之邊緣運算即時智慧圖書借閱系統",
    award: "銀牌",
    scope: "國際性",
  },
  {
    year: "2025",
    name: "第十二屆香港創新科技國際發明展",
    project: "Construction Engineering 3D Modeling AI Automatic Verification and Management System",
    award: "金牌",
    scope: "國際性",
  },
  {
    year: "2025",
    name: "全國大專院校產學創新實作競賽",
    project: "基於無人機與深度學習之營建工地多維度監測系統",
    award: "第三名",
    scope: "全國性",
  },
  {
    year: "2025",
    name: "第三十九屆日本東京創新天才國際發明展",
    project: "基於深度學習全天候工廠智慧判煙監控系統",
    award: "銀牌",
    scope: "國際性",
  },
  {
    year: "2024",
    name: "萬潤創新創意競賽-大專組",
    project: "校園自動化趕鴿器",
    award: "佳作",
    scope: "全國性",
  },
  {
    year: "2024",
    name: "校內團體程式競賽",
    project: "",
    award: "佳作",
    scope: "全國性",
  },
  {
    year: "2023",
    name: "全國技藝競賽 工業配線",
    project: "",
    award: "金手獎第七名",
    scope: "全國性",
  },
];

export const certifications = [
  { name: "工業配線", level: "乙級", img: "/certs/wiring_b.png" },
  { name: "工業電子", level: "丙級", img: "/certs/electronics_c.png" },
  { name: "室內配線", level: "丙級", img: "/certs/indoor_c.png" },
  { name: "自來水配管", level: "丙級", img: "/certs/water_c.png" },
];
