# Nekocat.cc 專案說明

## 專案簡介
本專案為個人網站，展示自我介紹、社群連結、小工具選單等互動功能，採用 Next.js + React + TypeScript + TailwindCSS + Framer Motion 實作，支援深色/淺色模式切換。

## 目錄結構
```
src/
  app/         # 頁面與路由邏輯
  components/  # 可重用元件
  lib/         # 工具函式
  types/       # 型別定義
public/        # 靜態資源（圖片、SVG等）
```

## 安裝與啟動
```bash
npm install
npm run dev
```
瀏覽器開啟 http://localhost:3000

## 主要技術
- Next.js
- React
- TypeScript
- TailwindCSS
- Framer Motion
- FontAwesome

## 維護建議
- 所有元件請放在 `src/components/`，並加上明確註解。
- 頁面邏輯集中於 `src/app/`，每個頁面獨立檔案。
- 工具函式放在 `src/lib/`，型別定義放在 `src/types/`。
- 靜態資源統一放在 `public/`。
- 建議每個檔案開頭加上用途註解，重要邏輯區塊加上行內註解。
- 小工具選單內容集中於一個陣列，方便維護與擴充。

## 目錄說明
- `src/app/page.tsx`：主頁面，包含動畫、社群連結、小工具選單。
- `src/components/`：建議拆分如 Header、Footer、WidgetMenu 等元件。
- `src/lib/utils.ts`：工具函式，可放共用邏輯。
- `src/types/`：自訂型別，方便大型專案維護。

## 註解範例
```tsx
// src/app/page.tsx
/**
 * 主頁面元件，包含打字機動畫、社群連結、小工具選單
 */
const Home: React.FC = () => {
  // 小工具選單內容
  const tools = [
    { name: "計算機", url: "..." },
    // ...
  ];
  // ... 其他邏輯
}
```

## 聯絡方式
如需協助或建議，請至 [GitHub](https://github.com/Catneko-0422) 聯絡。
