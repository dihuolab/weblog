# 工作坊文档 / Workshop source docs

把工作坊的原始文档放在这个目录里。

支持：

- Markdown `.md`
- PDF `.pdf`
- Word `.docx`
- PowerPoint `.pptx`
- 图片 `.png` / `.jpg`

建议命名：

```text
2026-11-17-3d-printing-intro.md
2026-11-24-radio-basics.pdf
```

我会把每份文档整理成两份现场手册：

```text
workshops/<slug>.html
en/workshops/<slug>.html
```

并把它们加入 `assets/js/data-workshops.js` 的目录。

注意：GitHub Pages 是公开的。不要放未经授权的个人信息、内部联系方式或不能公开的材料。原始文件会保留在这个目录，手册页面会引用或整理其中的内容。

## 已导入的工作坊

| 手册 | 原始文档 |
| --- | --- |
| [让电机转起来（drv8825-stepmotor）](../drv8825-stepmotor.html) | <https://gitee.com/zaoyige/tryesp32/tree/master/workshop/drv8825-stepmotor> |

图片原文件来自上面的 Gitee 仓库；网站使用的照片存放在 `assets/img/workshops/drv8825/`，其中四张板卡特写做了居中裁切，方便在手册中看清丝印。
