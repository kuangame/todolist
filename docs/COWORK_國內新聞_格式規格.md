# Cowork → Dashboard 國內新聞 對接規格

Cowork 產出台股個股新聞後，請把結果寫成本檔規定的 JSON，覆寫 repo 根目錄的
`domestic_news.json`，然後 commit + push。Dashboard 的「晨報 tab → 國內新聞」段落會直接讀這個檔。

---

## 檔案位置

- **必須覆寫**：`domestic_news.json`（repo 根目錄，不是放 docs/ 或 digest/）
- 檔案編碼 UTF-8、必須是**合法 JSON**（不能有註解、不能有尾逗號）

## 頂層結構

```json
{
  "fetched_at": "2026-07-11T16:18:00+08:00",
  "items": [ ...每則新聞一個物件... ]
}
```

| 欄位 | 型別 | 說明 |
| :-- | :-- | :-- |
| `fetched_at` | string | 產出當下的時間，ISO 8601，台灣時區 +08:00。Dashboard 會顯示成「更新：時間」 |
| `items` | array | 新聞陣列，每則一個物件（見下） |

## 每則新聞物件

```json
{
  "title": "南亞科（2408）法說 Q2 毛利率飆 79.5% 超越台積電",
  "summary": "稅後大賺 501.92 億元、EPS 14.66 元創單季新高…",
  "published": "07/11",
  "link": "",
  "is_revenue": true,
  "source": "mops"
}
```

| 欄位 | 必填 | 說明 |
| :-- | :-- | :-- |
| `title` | ✅ | 標題，建議帶股名＋代碼，例：`聯發科（2454）6 月營收 580.12 億元月增 22.3%` |
| `summary` | 建議 | 一到兩句重點，顯示在標題下方灰字 |
| `published` | 選填 | 日期字串，格式 `MM/DD`，例 `07/11`。顯示在標題前 |
| `link` | 選填 | 新聞原始網址；有值時標題會變成可點連結，沒有就填空字串 `""` |
| `is_revenue` | 選填 | 布林，`source` 為 `mops` 時填 `true`、否則 `false`（純視覺用途） |
| `source` | ✅ | **決定新聞歸到哪一區，只能是這兩個值之一（大小寫需一致）** |

## ⚠️ 最重要的規則：`source` 只能填這兩個

Dashboard 只渲染這兩種 `source`，填別的（例如 `"cowork"`、`"news"`）**那則新聞不會顯示**：

| `source` | 歸到 Dashboard 哪一區 | 用於 |
| :-- | :-- | :-- |
| `"mops"` | 💰 營收 / 自結財報 | 月營收、自結、財報、法說會數字 |
| `"yahoo"` | 📰 國內財經新聞 | 其他個股消息（設廠、法人動向、產業族群異動等） |

分類原則：**是財報/營收數字 → `mops`；其他一般新聞 → `yahoo`。**

---

## 完整範例（照這個產就對了）

```json
{
  "fetched_at": "2026-07-11T16:18:00+08:00",
  "items": [
    {
      "title": "南亞科（2408）法說 Q2 毛利率飆 79.5% 超越台積電",
      "summary": "稅後大賺 501.92 億元、EPS 14.66 元創單季新高，總座稱記憶體缺貨將延續數季；股價亮燈漲停 435.5 元。",
      "published": "07/11",
      "link": "",
      "is_revenue": true,
      "source": "mops"
    },
    {
      "title": "京元電（2449）董事會拍板赴美設廠，投資上限 14 億美元（約 450 億台幣）",
      "summary": "為退出中國後最大海外布局，客戶涵蓋輝達、博通、Google 等。",
      "published": "07/11",
      "link": "",
      "is_revenue": false,
      "source": "yahoo"
    }
  ]
}
```

## 產出前自我檢查

1. `domestic_news.json` 是合法 JSON 嗎？（可用 `python3 -m json.tool domestic_news.json` 驗證）
2. 每則的 `source` 是不是都只有 `mops` 或 `yahoo`？
3. `fetched_at` 是不是這次產出的時間、帶 `+08:00`？
4. 覆寫的是 repo 根目錄的 `domestic_news.json`，不是別的路徑？
