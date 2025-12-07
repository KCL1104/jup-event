# Jupiter Event Hedging Tool

一鍵式 JUP 代幣避險工具，讓您零風險參與 Jupiter 活動。

## 功能

- 🛡️ **價格保護**: Delta-neutral 策略，JUP 價格波動不影響您的資金
- ⚡ **原子執行**: 透過 Jito Bundles，三個操作一次完成
- 🔐 **單次簽名**: 只需一次錢包授權

## 運作流程

1. **Buy JUP** - 透過 Jupiter Aggregator 購買 JUP
2. **Short JUP** - 在 Drift Protocol 開設 1x 空頭倉位
3. **Send to Event** - 將代幣發送至活動地址

## 開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 技術棧

- React 18 + TypeScript
- Vite
- Tailwind CSS
- @solana/web3.js
- Lucide React (Icons)

## 連結

- [活動資訊 (Luma)](https://luma.com/7f1gdren?tk=kQ8qKF)
- [補貼表單 (Airtable)](https://airtable.com/app99T2lXOgDkK293/pagOV4Up7BdhLFHoF/form)

## 注意事項

⚠️ 目前為 Mock 版本，點擊執行按鈕會發送一個測試交易（轉帳 0.000001 SOL）來模擬簽名流程。

實際版本將整合：
- Jupiter Swap API
- Drift Protocol SDK
- Jito Bundles


