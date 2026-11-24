# dsh-conversation-search

在当前对话内按关键词搜索历史消息的 DSH Web 插件。

同一段对话轮次很多时，想回头找「我前面某一轮说过什么」往往只能靠翻。
这个插件在会话输入框左下角加了一个放大镜按钮（快捷键 `Ctrl+Shift+F` /
`Cmd+Shift+F`），可以只检索**当前这段对话**：

- 搜索你自己发送的提示词，以及模型生成的回复正文；
- 多个关键词用空格分隔，取「同时包含」；
- 结果按轮次、时间、命中次数展示，可筛选「全部 / 我的 / 模型」；
- 点击展开全文按 Markdown 渲染（代码块、表格、列表、KaTeX 公式），
  一键复制原文，或点「跳转」回到聊天里对应的那一轮；
- 更早的历史尚未载入时，可以一键继续载入并搜索，无需手动向上滚动。

纯客户端实现：不上传内容、不新增网络请求，也不改变任何会话数据。

## 安装

需要 DSH `0.2.2-rc` 系列（`dsh web`）。

```sh
# 从 GitHub 源码安装（pnpm 直接拉仓库，无需构建）
dsh plugin --profile web add github:xtzqhy/dsh-conversation-search

# 如果已发布到 npm，也可以直接按包名安装
dsh plugin --profile web add dsh-conversation-search
```

装好后刷新页面，输入框左下角出现放大镜按钮即生效；侧边栏插件详情里也能看到标题与说明。
卸载：`dsh plugin --profile web remove dsh-conversation-search`。

## 开发

仓库里就是可直接加载的插件包，没有构建步骤：

- `client.js` —— 客户端插件本体（搜索面板、Markdown 渲染、跳转）；
- `index.js` —— Host 侧入口（空实现，只为让包被 Loader 识别）；
- `cordis.patch.yml` —— 把插件插进 profile 的 patch 行；
- `locale/{zh,en}.json` —— 界面文案与插件详情页的 `meta.title` / `meta.description`。

本机调试时把它链接进 profile 即可：

```sh
git clone https://github.com/xtzqhy/dsh-conversation-search.git
dsh plugin --profile web add /absolute/path/to/dsh-conversation-search
```

详细说明见 [docs/DETAIL.md](docs/DETAIL.md)。