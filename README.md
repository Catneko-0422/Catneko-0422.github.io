# Nekocat.cc 專案說明

## 專案簡介
個人網站，展示自我介紹、社群連結、小工具選單等互動功能。採用 Next.js + React + TypeScript + Tailwind CSS v4 實作，支援深色/淺色模式切換。

## 目錄結構
```
src/
├── app/                 # 頁面路由與 API
│   ├── api/             # API 路由（admin、auth、tools）
│   ├── about/           # 關於我頁面
│   ├── chat/            # 聊天頁面（開發中）
│   ├── contact/         # 聯絡頁面
│   ├── project/         # 專案展示頁面
│   ├── globals.css      # 全域樣式與 Mizuki 動畫
│   ├── layout.tsx       # 根佈局（ThemeProvider）
│   ├── page.tsx         # 首頁
│   └── RootShell.tsx    # 共用 Header/Footer/Nav
├── components/
│   ├── about/           # 關於頁元件（SkillRadar、Card、Timeline）
│   ├── home/            # 首頁元件（ProfileHeader）
│   └── tools/           # 小工具選單元件（FloatingToolsWidget、Modal、TreeNode 等）
├── data/                # 靜態資料（about、project）
├── hooks/               # 自訂 hooks（useReducedMotion）
└── types/               # TypeScript 型別定義
public/                  # 靜態資源（圖片、SVG 等）
```

## 安裝與啟動
```bash
pnpm install
pnpm dev
```
瀏覽器開啟 http://localhost:3000

## 主要技術
- Next.js 15（Turbopack）
- React 19
- TypeScript
- Tailwind CSS v4
- next-themes（深色/淺色模式）
- FontAwesome（圖示）
- Chart.js（技能雷達圖）
- Redis（小工具選單資料儲存）

## 部署
- Vercel 托管
- GitHub Pages（静态导出）

## 維護建議
- 元件放在 `src/components/`，按功能分子目錄
- 頁面邏輯在 `src/app/`，每個頁面獨立檔案
- 靜態資料在 `src/data/`
- 型別定義在 `src/types/`
- API 路由在 `src/app/api/`

## 聯絡方式
如需協助或建議，請至 [GitHub](https://github.com/Catneko-0422) 聯絡。
