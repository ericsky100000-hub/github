# 日心食品網站 CMS V1

目前為可操作的後台 UI 樣本，直接開啟 GitHub Pages 下的 /cms/ 即可使用。

## 已完成
- 儀表板
- 首頁管理
- 企業介紹
- 專營項目
- 產品管理
- 分類管理
- OEM / ODM
- 品質認證
- 聯絡資訊
- 草稿 / 預覽 / 發布按鈕
- 版本紀錄
- JSON 匯出 / 匯入備份
- 瀏覽器 LocalStorage 暫存

## 下一階段：GAS + Google Sheets
正式版將把 LocalStorage 改為 Google Sheets 資料庫，並由 Google Apps Script 提供：
1. 管理員登入
2. getContent / saveContent API
3. 產品 CRUD
4. 版本紀錄
5. 發布狀態
6. 圖片 URL / Drive 連結
7. 權限與操作紀錄

目前 CMS 樣本不會直接改動 GitHub Pages 正式前台內容。