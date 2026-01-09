# 祥盛旅店後台管理系統 (Hostal Management System)

這是一個專為民宿設計的現代化後台管理系統，支援手機版操作，方便業者隨時隨地管理訂房與顧客資料。

## ✨ 主要功能

*   **📅 訂房行事曆 (Dashboard)**
    *   以行事曆方式檢視每日訂房狀況（支援月檢視、列表檢視）。
    *   支援手機版響應式設計 (Mobile-first)。
    *   **新增訂房**：自動偵測日期衝突，支援搜尋舊客或直接建立新客資料。
    *   **修改/刪除訂房**：點擊訂單即可查看詳情並進行編輯或刪除。

*   **👥 常客管理 (Guest Management)**
    *   建立與管理顧客資料庫（姓名、電話、備註）。
    *   支援即時搜尋（姓名/電話）。
    *   查看顧客歷史入住紀錄。

*   **🔄 iCal 同步 (Synchronization)**
    *   支援匯入 Booking.com 等 OTA 平台的 iCal 行事曆連結。
    *   自動同步外部訂單至系統行事曆，避免重複訂房。

## 🛠️ 技術架構

*   **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS
*   **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth)
*   **UI Components**: FullCalendar, Lucide Icons
*   **Internationalization**: 繁體中文 (Traditional Chinese)

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

請在根目錄建立 `.env.local` 檔案，並填入 Supabase 的連線資訊：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CRON_SECRET=your_custom_secret_for_sync
```

### 3. 初始化資料庫

請在 Supabase SQL Editor 中執行 `supabase/migrations/` 下的 SQL 腳本以建立資料表。

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器並訪問 [http://localhost:3000](http://localhost:3000)。

## 📦 部署

本專案優化為部署至 [Vercel](https://vercel.com/)。

1.  將專案 Push 到 GitHub。
2.  在 Vercel 匯入專案。
3.  在 Vercel 設定頁面填入上述的環境變數。
4.  完成部署！
