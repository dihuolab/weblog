# 地火创客 · 网站

地火创客（DIHUOLAB）的官方网站。用来介绍地火的最新状态、活动、业务、精神、会员与创办历史，也用来发布项目需求、召集创客共同研发。

- **线上地址**：https://dihuolab.github.io/weblog/
- **英文版**：https://dihuolab.github.io/weblog/en/
- **仓库**：https://github.com/dihuolab/weblog

## 技术选择

纯静态网站：HTML + CSS + 原生 JavaScript。

- 没有构建步骤、没有 npm 依赖、没有外部 CDN 请求，双击 `index.html` 就能看。
- 适合 GitHub Pages 直接托管，推送即发布。
- 动态与项目数据集中在 `assets/js/data.js`（英文版为 `assets/js/data-en.js`），改内容不需要碰页面结构。
- 中英文为两套独立页面，共用 CSS/JS；页头地球图标在对应页面间切换，并配置了 `hreflang` 与双语 sitemap。
- 响应式布局、支持 `prefers-reduced-motion`、主要页面有语义化结构与 SEO 元信息。

## 本地预览

最简单：直接双击 `index.html`。

如果想用本地服务器（更接近线上环境）：

```powershell
# 任选一种，装过 Python 或 Node 的话
python -m http.server 8000
npx serve .
```

然后打开 http://localhost:8000/

> 有 Node 或 Python 时用本地服务器更接近线上环境；没有的话，直接双击 `index.html` 也能正常浏览。

## 目录结构

```
.
├── index.html                 首页
├── about.html                 关于地火：名字、理念、时间线、能力、领域、成员构成
├── projects.html              项目与招募
├── news.html                  动态与记录 + 灵感源
├── join.html                  加入方式、联系方式
├── 404.html                   404 页
├── en/                        英文版（index / about / projects / news / join）
├── assets/
│   ├── css/style.css          全部样式与设计变量
│   ├── js/data.js             ★ 中文动态 / 项目 / 站点链接
│   ├── js/data-en.js          ★ 英文动态 / 项目 / 站点链接
│   ├── js/site.js             导航、动画、双语列表渲染、筛选、首屏火星
│   └── img/
│       ├── dihuologo.png      官方 logo 原图（保留原始文件）
│       ├── logo-mark.png      官方红色笔触图形（透明底，用于页头、首屏）
│       ├── logo-wordmark-light.png  深色背景用横版组合（透明底）
│       ├── favicon.png        站点图标
│       ├── og.png             中文社交分享图（1200×630）
│       └── og-en.png          英文社交分享图（1200×630）
├── .github/ISSUE_TEMPLATE/
│   ├── join.md                “报名加入” Issue 模板
│   └── project-proposal.md    “发起项目” Issue 模板
├── .nojekyll                  让 GitHub Pages 跳过 Jekyll
├── robots.txt
├── sitemap.xml
├── thinking.txt               项目初期的思考记录（保留原样，不对外链接）
└── README.md
```

## 更新内容

### 发布一条动态

编辑 `assets/js/data.js`，在 `news` 数组**最前面**加一条：

```js
{
  date: "2026-11-01",       // YYYY-MM-DD，列表按日期倒序
  type: "本站",              // 会成为筛选标签：本站 / 项目 / 活动 / 行业……
  title: "开放日记录：第一次把打印机拆开",
  summary: "两句话说明发生了什么、结果如何。",
  link: ""                  // 可留空；也可填 "projects.html" 或外部链接
}
```

保存后刷新页面即可。首页自动显示最新 3 条。

### 发布一个项目 / 招募需求

在 `projects` 数组里加一条（字段含义见文件内注释）：

```js
{
  title: "项目名称",
  status: "招募中",          // 招募中 / 进行中 / 筹备中 / 已完成
  tags: ["结构", "3D 打印"], // 会自动变成筛选按钮
  summary: "一段话说明要做什么、为什么值得做。",
  need: ["需要什么样的人", "需要什么能力"],
  offer: ["地火能提供什么"],
  note: "可选的一句补充。"
}
```

每张卡片会自动生成“我想参与”按钮，点击后带着项目名打开一条新的 GitHub Issue。

### 更新英文内容

英文页面在 `en/`，内容数据在 `assets/js/data-en.js`，字段与中文版一致。项目 `status` 使用 `Recruiting` / `Preparing` / `In progress` / `Completed`，`site.js` 会自动映射成对应状态样式。英文动态的站内链接（如 `projects.html`）是相对于 `en/` 的路径。

### 修改联系方式 / 社交链接

- 页脚与各页的 GitHub 链接：搜索 `https://github.com/dihuolab/weblog` 批量替换即可。
- 线下地址：中文加入页的 `contact-address` 区块与各页页脚，当前为「四川省成都市郫都区校园路818号附697号」；英文页使用 “Annex 697, No. 818 Xiaoyuan Road, Pidu District, Chengdu, Sichuan, China”。
- 联系方式目前在 `join.html` 的 `contact-list` 区块，补齐后建议同步更新中英文页脚。
- 站点级链接（仓库、Issue 入口）集中在 `assets/js/data.js` 与 `assets/js/data-en.js` 顶部的 `window.DIHUO_SITE`。

### 调整导航 / 新增页面

五个中文主页面、英文 `en/` 页面与 404 页共用同一套页头/页脚结构。新增页面时，需要同步复制页头与页脚，更新各页的 `aria-current="page"`、语言切换链接、`canonical`、`hreflang` 与 `sitemap.xml`。

## 部署到 GitHub Pages

仓库已经包含 `.nojekyll`，当前已配置为从 `main` 分支根目录发布（https://dihuolab.github.io/weblog/ 已上线）。

1. 把改动推送到 `main` 分支。
2. 打开仓库 **Settings → Pages**。
3. **Build and deployment → Source** 选择 **Deploy from a branch**。
4. **Branch** 选择 `main`，目录选择 **/ (root)**，点击 **Save**。
5. 等待 1–2 分钟，访问 https://dihuolab.github.io/weblog/

之后每次 push 到 `main`，Pages 会自动重新构建。构建状态可在 **Actions** 或 **Environments → github-pages** 中查看。

### 自定义域名（可选）

1. 在仓库根目录新建 `CNAME` 文件，内容为域名，例如 `dihuo.example.com`。
2. 在域名服务商处添加 CNAME 记录指向 `dihuolab.github.io`。
3. 回到 **Settings → Pages → Custom domain** 填写并保存，勾选 Enforce HTTPS。
4. 同时把各页 `<link rel="canonical">`、`sitemap.xml`、`robots.txt` 与 OG 链接里的域名替换掉。

### 开启 Discussions（可选）

如果希望用 Discussions 而不是 Issues 做日常交流：**Settings → General → Features → Discussions** 勾选开启，然后把页脚/加入页的链接换过去。

## 设计与品牌

- **色彩**：近黑 `#08080a`、地火红 `#e8232f`、暖白 `#f4f1ea`，辅以余烬橙 `#ff7a35`。官方 logo 的笔触红为 `#b04038`，标志相关图形一律使用该色。
- **标志**：使用官方红黑 logo。页头取红色笔触图形 + “地火创客 / DIHUOLAB”，首屏中央使用同一笔触图形，社交图与图标均由官方原图生成。
- **字体**：中文使用系统中文字体（PingFang SC / 微软雅黑 / Noto Sans SC），英文使用 Arial / Helvetica 系统字体，标签与数字使用等宽字体，不请求外部字体。
- **双语**：中文页面在根目录，英文页面在 `en/`；页头地球图标直接跳转到当前页面对应的另一种语言。
- **动效**：首屏火星粒子、旋转刻度环、滚动进场；全部尊重 `prefers-reduced-motion`。
- 所有设计变量集中在 `assets/css/style.css` 顶部 `:root`。

## 待补充（建议尽快）

- [ ] **更高分辨率的 logo 源文件**：当前使用的 `dihuologo.png` 为 1280×720 位图，已生成透明底与深色背景版本；如果之后拿到矢量源文件，替换页头与首屏引用即可。
- [ ] **成立时间与真实历史**：目前时间线只分了“火种 / 聚拢 / 此刻”三个阶段，没有写年份。
- [ ] **开放时间、邮箱 / 微信**：线下地址已补充到加入页与页脚；开放时间与邮箱仍在加入页留位。
- [ ] **真实项目、活动照片、成员介绍**：目前项目是共创方向，成员页写的是人员构成而非具体个人。
- [ ] **社交账号**：公众号、B 站、小红书等。
- [ ] **自定义域名**（可选）。

## 内容原则

- 不编造年份、人数、设备型号和活动记录；不确定的信息宁可留白。
- 外部内容注明来源，不直接搬运。
- 动态可以少，但要真实、可追溯。

---

由地火创客维护。地下的火，仍在燃烧。
