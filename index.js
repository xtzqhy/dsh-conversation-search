/**
 * dsh-conversation-search —— Host 侧入口（占位）。
 *
 * 插件的全部功能在 client.js：一个「搜索本对话」按钮 + 关键词搜索面板。
 * 之所以不需要 Host 能力：同一会话的事件窗口已经完整地处于客户端
 * （ctx.sessions.binding(sessionId).eventSource），历史页也能用
 * session.loadOlder() 增量载入，所以搜索可以直接在浏览器里完成，
 * 无需新增 Host 服务或远程 RPC。
 */
export const name = 'dsh-conversation-search'

export function apply() {
  // 纯客户端插件：Host 侧无事可做。
}