# A4 简历模板

可打印的 1–3 页 A4 简历模板，支持 SCSS 主题定制、自动配色方案生成、无障碍对比度合规，并内置 AI Agent 技能实现自动简历生成。

## 特性

- **A4 打印就绪**：精确 210mm × 297mm 页面尺寸，配备 `@page` 和 `@media print` 样式
- **灵活布局**：1–3 页可组合的 CSS 类 — 根据内容自由调整段落
- **SCSS 配色方案**：从单一基色自动生成完整的 10 阶色彩系统
- **无障碍合规**：编译时 SCSS 检查 + 运行时 axe-core 扫描，确保 WCAG AA 合规
- **智能色阶选择**：根据对比度需求，自动为每个场景选择最佳色阶
- **打印预览模式**：添加 `?print` 查询参数即可在屏幕上预览打印样式
- **集成测试**：Playwright 测试验证布局、文本截断检测和无障碍性
- **Agent 技能**：内置 AI 编程助手技能，可通过对话式交互生成并验证简历

## Agent 技能

本项目包含一个专为 AI 编程助手设计的技能，可通过对话方式生成简历：

```
skills/resume-builder/
├── SKILL.md       # Agent 工作流：访谈 → 主题 → 验证 → 交付
└── REFERENCE.md   # CSS 类工具箱、问题模板、配色启发式指引
```

**用法：** `帮我根据我的经历制作一份简历`

技能引导 Agent 完成以下交互式流程：
1. 检测或克隆项目，安装依赖
2. 读取 `index.html` 作为起始模板 — Agent 可以自由增删或调整段落
3. 按优先级访谈用户（工作经历 → 技能 → 个人总结 → 头部信息 → 教育背景 → 项目经历）
4. 根据用户行业和风格选择主题颜色
5. 运行测试验证布局、无障碍性和视觉效果
6. 启动开发服务器，供实时预览和 PDF 导出

详见 [skills/resume-builder/SKILL.md](skills/resume-builder/SKILL.md) 了解完整 Agent 工作流，[skills/resume-builder/REFERENCE.md](skills/resume-builder/REFERENCE.md) 查看 CSS 类工具箱。

## 快速开始

```bash
# 安装依赖
pnpm install

# 编译 SCSS（仅在修改主题颜色时需要）
pnpm build:css

# 启动本地开发服务器
pnpm dev

# 在浏览器中查看简历：http://localhost:3000
# 打印预览模式：http://localhost:3000/?print
```

## 测试

```bash
# 运行全部测试（17 个测试用例）
pnpm test

# 仅运行无障碍测试
pnpm test -- tests/a11y.spec.ts

# 仅运行布局测试
pnpm test -- tests/resume.spec.ts

# 仅运行截图测试
pnpm test -- tests/screenshots.spec.ts

# 视觉变更后更新截图基准
pnpm test -- --update-snapshots

# UI 模式运行测试
pnpm test:ui

# 调试模式运行测试
pnpm test:debug
```

## 测试覆盖

**布局测试**（`tests/resume.spec.ts`）：
- ✅ 无文本被省略号截断（普通视图）
- ✅ 无文本被省略号截断（打印预览模式）
- ✅ 所有简历段落可见
- ✅ 存在包含姓名的头部区域
- ✅ 存在联系信息
- ✅ `?print` 参数存在时应用打印预览类
- ✅ 无 `?print` 参数时不应用打印预览类

**无障碍测试**（`tests/a11y.spec.ts`）：
- ✅ 无 WCAG A/AA 违规（全页面，普通视图）
- ✅ 无 WCAG A/AA 违规（全页面，打印预览）
- ✅ 头部区域无 WCAG A/AA 违规
- ✅ 侧边栏区域无 WCAG A/AA 违规

**截图测试**（`tests/screenshots.spec.ts`）：
- ✅ 第 1 页截图（普通视图）
- ✅ 第 2 页截图（普通视图）
- ✅ 第 1 页截图（打印预览）
- ✅ 第 2 页截图（打印预览）
- ✅ 完整文档截图（普通视图）
- ✅ 完整文档截图（打印预览）

截图保存至 `screenshots/` 目录并附加到测试结果中。每次无障碍测试的 axe-core 扫描结果以 JSON 格式附加，便于调试。

## 主题定制

### 更换基色

编辑 `styles/_palette.scss`，修改 `$primary-base` 变量，然后重新编译：

```scss
$primary-base: #1B4F72 !default;   // 修改此处即可更换主题
```

```bash
pnpm build:css
```

配色方案生成器将：
1. 从浅到深创建 10 个色阶（50–900）
2. 生成中性灰色阶
3. 自动为每个背景色计算文字颜色
4. **智能选择**每个场景的最佳色阶
5. 在编译时验证所有组合均满足 WCAG AA 对比度要求 — 检查不通过时编译将报错

### 智能色阶选择

主题自动为每个场景选择最佳色阶：

| 场景 | 函数 | 结果 |
|------|------|------|
| 浅色背景上的文字 | `select-text-shade()` | `primary-500`（必要时更深） |
| 浅色背景 | `select-bg-shade()` | `primary-50`（搭配深色文字） |
| 深色背景 | `select-bg-shade-light()` | 支持白色文字的最深色阶 |
| 装饰元素 | 自动配对 | 匹配的互补色阶 |

所有选择均在编译时验证，确保满足 4.5:1 对比度要求。

### 可用的颜色变量

```css
/* 主色调色板 */
var(--color-primary-50) 至 var(--color-primary-900)
var(--color-primary-{色阶}-on) /* 自动计算的文字颜色 */

/* 语义颜色（自动选择） */
var(--color-heading)              /* 标题最佳色阶 */
var(--color-accent)               /* 强调色最佳色阶 */
var(--color-tag-bg)               /* 最佳浅色背景 */
var(--color-tag-text)             /* 标签对比文字 */
var(--color-decoration)           /* 项目符号、强调 */
var(--color-decoration-muted)     /* 柔和的装饰元素 */

/* 中性色调色板 */
var(--color-neutral-50) 至 var(--color-neutral-900)
var(--color-surface), var(--color-surface-raised)
var(--color-text-primary), var(--color-text-secondary), var(--color-text-muted)
var(--color-border), var(--color-divider)
```

## CSS 类

模板提供可组合的 CSS 类。阅读 `index.html` 了解当前布局，然后自由组合以下类来构建 1–3 页简历：

| 类别 | 类名 |
|------|------|
| **页面与布局** | `.resume-page`、`.resume-grid`、`.resume-header`、`.resume-main`、`.resume-sidebar` |
| **头部** | `.header`、`.header-name`、`.header-meta`、`.header-contact` |
| **段落** | `.section`、`.section-title`、`.summary-text` |
| **条目** | `.entry`、`.entry--compact`、`.entry-header`、`.entry-org`、`.entry-dates`、`.entry-role`、`.entry-desc`、`.entry-duties` |
| **侧边栏** | `.sidebar`、`.sidebar-card`、`.sidebar-title`、`.sidebar-text` |
| **标签** | `.tags`、`.tag` |
| **可选** | `.highlights`、`.expectation-status`、`.expectation-info` |
| **工具** | `.no-clip`、`.print-preview` |

完整类参考：[skills/resume-builder/REFERENCE.md](skills/resume-builder/REFERENCE.md)

## 文件结构

```
a4-resume-template/
├── index.html                 # 简历内容（起始模板）
├── AGENTS.md                  # AI 编程助手指令
├── package.json
├── playwright.config.js       # Playwright 测试配置

├── styles/
│   ├── _palette.scss          # 配色方案生成器（含无障碍检查）
│   ├── theme.scss             # 布局、排版、组件、打印样式
│   └── theme.css              # 编译后的 CSS（已 gitignore）
├── scripts/
│   └── main.js                # ?print 查询参数处理器
├── skills/
│   └── resume-builder/
│       ├── SKILL.md           # Agent 技能工作流
│       └── REFERENCE.md       # CSS 类工具箱、访谈模板、配色指引
└── tests/
    ├── axe-test.ts            # 共享 axe fixture
    ├── a11y.spec.ts           # 无障碍测试（axe-core）
    ├── resume.spec.ts         # 布局与集成测试
    └── screenshots.spec.ts    # 逐页截图捕获
└── screenshots/               # 生成的 PNG 截图（已 gitignore）
```

## 自定义

### 个人信息

编辑 `index.html` 填入你的信息：

```html
<h1 class="header-name">你的姓名</h1>
<div class="header-meta">
  <span>所在城市</span>
  <span>工作年限</span>
</div>
<div class="header-contact">
  <a href="tel:+1234567890">📞 +1 234 567 890</a>
  <a href="mailto:your.email@example.com">✉️ your.email@example.com</a>
</div>
```

### 段落

可用的段落（可按需增减）：
- **头部**：姓名、联系信息、元数据
- **个人总结**：简要的职业概述
- **工作经历**：包含量化成果的职位条目
- **亮点**：关键优势或成就
- **侧边栏**：教育背景、技能、证书、语言能力
- **项目经历**：重要项目（第 2 页起）
- **附加信息**：出版物、奖项、志愿服务、兴趣爱好

### 页数

模板支持 1–3 页 A4 简历。每个 `.resume-page` 容器代表一页，可根据内容长度增减页面。CSS 自动处理打印时的分页。

## 打印说明

1. 打开 `http://localhost:3000`（普通视图）或 `http://localhost:3000/?print`（打印预览）
2. 按 `Cmd+P`（Mac）或 `Ctrl+P`（Windows/Linux）
3. 选择"另存为 PDF"或打印机
4. 启用"背景图形"
5. 边距设为"无"（由 CSS 控制边距）

## 浏览器支持

- Chrome/Edge（已测试）
- Safari（通过打印对话框）
- Firefox（通过打印对话框）

## 许可证

MIT
