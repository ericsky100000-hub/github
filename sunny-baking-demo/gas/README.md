# 日心網站 CMS - GAS / Google Sheets 串接

此資料夾是獨立的日心網站 CMS 後端原始碼，不與其他 GAS 專案共用。

## 專用 Google Sheets
名稱：日心網站資料庫_CMS
ID：1mH-5J-yvxPhWANlcfpC3HArjzQMAMH88uaQepx3PYFI

## 工作表
- 網站設定
- 企業介紹
- 專營項目
- 產品
- 產品分類
- OEM_ODM
- 品質認證
- 聯絡資訊
- 版本紀錄
- 管理員

## 部署
1. 建立全新的 Apps Script 專案，名稱「日心網站CMS」。
2. 將 Code.gs 與 appsscript.json 貼入該獨立專案。
3. 部署 → 新增部署作業 → 網頁應用程式。
4. 執行身分：自己。
5. 存取權：依正式需求選擇；目前前台讀取若要公開，可使用任何人。
6. 部署後取得 Web App URL，再填入 GitHub Pages CMS 的 API_URL。

## API
GET ?action=health
GET ?action=content
POST JSON:
- {action:"saveContent", data:{...}}
- {action:"publish", data:{...}}

## 安全注意
目前程式是第一階段資料 API 骨架。正式允許後台寫入前，需加入管理員驗證，不應把寫入權限直接暴露給匿名公開網頁。
