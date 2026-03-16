# PubPaper

这是一个用于 GitHub Pages 的静态站点，展示控制领域重要期刊/会议的投稿导航（包括 CPCC、CAC、CCC、IEEE Control Systems Letters 等），并提供官网链接、收稿/截稿日期说明及投稿模板入口。

## ✅ 目录结构

- `docs/`：GitHub Pages 发布目录
  - `index.html`：主页
  - `styles.css`：样式表
  - `script.js`：筛选、卡片/表格双视图交互

## 🚀 部署（已配置）

仓库已设置 GitHub Pages 源为：`/docs` 目录。
发布地址：<https://qianyuan1437.github.io/PubPaper>

> 🔧 如需更新页面内容，请直接编辑 `docs/index.html`（或样式 `docs/styles.css`），然后提交到主分支。

## ✨ 更新建议

- 请定期检查官网的最新征稿公告、截稿日期、投稿模板链接。
- 页面支持“卡片视图 + 表格视图”以及关键词/状态筛选，适合持续补充期刊与会议条目。
- 若要添加新的期刊/会议，可参考现有 `venue-card` 条目，补充 `data-entry-type`、`data-status`、`data-topics` 和 `data-search` 字段，筛选与表格会自动兼容。

---

© 2026 QianYuan1437
