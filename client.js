window.__ModuleLoader__.load({
  id: 'dsh-conversation-search',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    let ReactDOM = null
    try {
      ReactDOM = require('react-dom')
    } catch (error) {
      ReactDOM = null
    }

    // Markdown / LaTeX 渲染复用应用自带的渲染器（含 KaTeX、代码围栏、表格等），
    // 拿不到时退回纯文本，功能不缺失。
    let MarkdownText = null
    try {
      const primitives = require('@deepseek-ai/dsh-client-ui-primitives')
      // MarkdownText 是 memo(...) 组件：导出的是对象而不是函数，所以只判断存在性。
      if (primitives && primitives.MarkdownText) MarkdownText = primitives.MarkdownText
    } catch (error) {
      MarkdownText = null
    }

    const NS = 'dsh-conversation-search'
    const ID = 'dsh-conversation-search'
    const SLOT = 'conversation.input.left'
    const PLUGIN_ATTR = 'data-dsh-plugin'

    // ---------------------------------------------------------------------
    // 文案
    // ---------------------------------------------------------------------
    const EN = {
      'trigger.label': 'Search conversation',
      'trigger.title': 'Search this conversation (Ctrl+Shift+F)',
      'panel.title': 'Search conversation',
      'panel.placeholder': 'Keywords — searches your prompts and model replies',
      'panel.hint': 'Type one or more keywords to search this conversation',
      'panel.hint.scope': 'Searches prompts you sent and replies the model produced.',
      'panel.empty': 'No message in this conversation matches',
      'panel.results': '{n} matching messages',
      'panel.scanned': '{n} messages scanned',
      'panel.matches': '{n} matches',
      'panel.loading': 'Loading earlier messages…',
      'panel.loadMore': 'Search earlier messages',
      'panel.loadingMore': 'Loading…',
      'panel.loadError': 'Could not load earlier messages',
      'panel.earlierHint': 'Earlier messages are not loaded yet',
      'panel.allLoaded': 'Reached the start of the conversation',
      'panel.footerHint': '↑↓ select · Enter expand · Alt+Enter jump · Esc close',
      'panel.notReady': 'This conversation is still loading',
      'panel.overflow': 'Showing the first {n} results',
      'panel.raw': 'Plain text',
      'jump': 'Jump',
      'jumping': 'Jumping…',
      'jumpFailed': 'That turn is not loaded yet — scroll up in the chat to load it first',
      'jump.aria': 'Jump to turn {n}',
      'code.copy': 'Copy code',
      'code.copied': 'Copied',
      'code.title': 'Code',
      'code.wrap': 'Wrap lines',
      'code.unwrap': 'Unwrap lines',
      'markdown.footnotes': 'Footnotes',
      'filter.all': 'All',
      'filter.user': 'Mine',
      'filter.model': 'Model',
      'role.user': 'Me',
      'role.model': 'Model',
      'role.system': 'Context',
      'turn': 'Turn {n}',
      'copy': 'Copy',
      'copied': 'Copied',
      'copyFailed': 'Copy failed',
      'close': 'Close',
    }
    const ZH = {
      'trigger.label': '搜索本对话',
      'trigger.title': '搜索本对话历史（Ctrl+Shift+F）',
      'panel.title': '搜索本对话',
      'panel.placeholder': '输入关键词，搜索你发过的提示词与模型回复',
      'panel.hint': '输入一个或多个关键词，搜索本对话',
      'panel.hint.scope': '搜索范围：你发送的提示词 + 模型生成的回复。',
      'panel.empty': '本对话中没有匹配该关键词的消息',
      'panel.results': '找到 {n} 条消息',
      'panel.scanned': '已扫描 {n} 条消息',
      'panel.matches': '{n} 处匹配',
      'panel.loading': '正在载入更早的对话…',
      'panel.loadMore': '继续搜索更早的对话',
      'panel.loadingMore': '载入中…',
      'panel.loadError': '载入更早的对话失败',
      'panel.earlierHint': '更早的对话尚未载入',
      'panel.allLoaded': '已到本对话的开头',
      'panel.footerHint': '↑↓ 选择 · Enter 展开 · Alt+Enter 跳转 · Esc 关闭',
      'panel.notReady': '对话还在载入中',
      'panel.overflow': '结果过多，仅显示前 {n} 条',
      'panel.raw': '纯文本',
      'jump': '跳转',
      'jumping': '正在跳转…',
      'jumpFailed': '该轮次尚未载入，请先在对话中向上滚动加载',
      'jump.aria': '跳转到第 {n} 轮',
      'code.copy': '复制代码',
      'code.copied': '已复制',
      'code.title': '代码',
      'code.wrap': '自动换行',
      'code.unwrap': '取消换行',
      'markdown.footnotes': '脚注',
      'filter.all': '全部',
      'filter.user': '我的',
      'filter.model': '模型',
      'role.user': '我',
      'role.model': '模型',
      'role.system': '上下文',
      'turn': '第 {n} 轮',
      'copy': '复制',
      'copied': '已复制',
      'copyFailed': '复制失败',
      'close': '关闭',
    }

    // ---------------------------------------------------------------------
    // 样式（全部走主题 token，浅色/深色自动适配）
    // ---------------------------------------------------------------------
    const CSS = `
.dcs-trigger{display:inline-flex;align-items:center;justify-content:center;height:28px;min-width:28px;padding:0 6px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background .15s ease,color .15s ease,border-color .15s ease,box-shadow .15s ease}
.dcs-trigger:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2)}
.dcs-trigger:active{background:var(--dsw-alias-bg-layer-1)}
.dcs-trigger:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dcs-trigger.is-open{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-border-l2)}
.dcs-root{position:fixed;inset:0;z-index:1200;display:flex;align-items:flex-start;justify-content:center;padding:max(40px,7vh) 16px 24px;font-family:inherit;font-size:13px;line-height:1.55;color:var(--dsw-alias-label-primary);-webkit-font-smoothing:antialiased}
.dcs-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.38);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
.dcs-panel{position:relative;display:flex;flex-direction:column;width:min(760px,100%);max-height:min(80vh,860px);background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,.28),0 2px 8px rgba(0,0,0,.10);overflow:hidden}
.dcs-head{flex:none;padding:14px 16px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
.dcs-title-row{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.dcs-title{flex:1;font-size:14px;font-weight:600;letter-spacing:.01em}
.dcs-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:16px;line-height:1;cursor:pointer}
.dcs-icon-btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dcs-input-row{display:flex;align-items:center;gap:8px;padding:0 10px;height:38px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-base);transition:border-color .15s ease,box-shadow .15s ease}
.dcs-input-row:focus-within{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 3px rgba(0,102,255,.12)}
.dcs-input-icon{flex:none;display:inline-flex;color:var(--dsw-alias-label-secondary)}
.dcs-input{flex:1;min-width:0;height:100%;border:none;outline:none;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}
.dcs-input::placeholder{color:var(--dsw-alias-label-secondary);opacity:.85}
.dcs-filter-row{display:flex;align-items:center;gap:6px;margin-top:10px;flex-wrap:wrap}
.dcs-chip{display:inline-flex;align-items:center;height:24px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer;transition:all .12s ease}
.dcs-chip:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dcs-chip.is-active{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);color:#fff}
.dcs-spacer{flex:1}
.dcs-status{color:var(--dsw-alias-label-secondary);font-size:12px;white-space:nowrap}
.dcs-body{flex:1;min-height:120px;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:2px}
.dcs-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:44px 24px;text-align:center;color:var(--dsw-alias-label-secondary)}
.dcs-state-title{font-size:13px;color:var(--dsw-alias-label-primary)}
.dcs-state-sub{font-size:12px;max-width:420px}
.dcs-list{display:flex;flex-direction:column;gap:2px}
.dcs-row{padding:9px 10px;border:1px solid transparent;border-radius:10px;cursor:pointer;outline:none}
.dcs-row:hover{background:var(--dsw-alias-bg-layer-2)}
.dcs-row.is-active{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2)}
.dcs-row-head{display:flex;align-items:center;gap:8px;margin-bottom:3px;font-size:11px;color:var(--dsw-alias-label-secondary)}
.dcs-badge{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:5px;font-size:11px;font-weight:600;letter-spacing:.02em}
.dcs-badge.role-user{background:rgba(0,102,255,.14);color:var(--dsw-alias-brand-primary)}
.dcs-badge.role-model{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1)}
.dcs-badge.role-system{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-state-idle-primary);border:1px dashed var(--dsw-alias-border-l1)}
.dcs-turn{color:var(--dsw-alias-label-secondary)}
.dcs-count{color:var(--dsw-alias-label-secondary);opacity:.9}
.dcs-copy{flex:none;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;padding:2px 6px;cursor:pointer}
.dcs-copy:hover{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}
.dcs-snippet{color:var(--dsw-alias-label-primary);word-break:break-word;white-space:pre-wrap;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.dcs-row.is-expanded .dcs-snippet{display:block;-webkit-line-clamp:unset;max-height:320px;overflow-y:auto;color:var(--dsw-alias-label-primary)}
.dcs-mark{background:rgba(0,102,255,.18);color:inherit;border-radius:3px;padding:0 1px}
.dcs-foot{flex:none;display:flex;align-items:center;gap:10px;padding:8px 12px;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:11px}
.dcs-load-more{margin-left:auto;display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;cursor:pointer}
.dcs-load-more:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dcs-load-more:disabled{opacity:.6;cursor:default}
.dcs-foot-note{color:var(--dsw-alias-state-warn-primary)}
.dcs-foot-note.is-error{color:var(--dsw-alias-state-error-primary)}
.dcs-jump{flex:none;display:inline-flex;align-items:center;gap:4px;height:20px;padding:0 7px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;cursor:pointer;opacity:.9}
.dcs-jump:hover{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary)}
.dcs-jump:disabled{opacity:.55;cursor:default}
.dcs-md{max-height:420px;overflow-y:auto;padding:2px 2px 6px;color:var(--dsw-alias-label-primary)}
.dcs-md img{max-width:100%;height:auto;border-radius:6px}
.dcs-md pre{overflow-x:auto;max-width:100%}
.dcs-md table{max-width:100%;display:block;overflow-x:auto}
.dcs-row.is-expanded .dcs-snippet{max-height:none}
@keyframes dcs-flash{0%{box-shadow:0 0 0 2px rgba(0,102,255,.55) inset,0 0 0 2px rgba(0,102,255,.55)}100%{box-shadow:0 0 0 2px rgba(0,102,255,0) inset,0 0 0 2px rgba(0,102,255,0)}}
.dcs-flash{animation:dcs-flash 1.8s ease-out 1;border-radius:10px}
@media (max-width:640px){.dcs-root{padding:0}.dcs-panel{width:100%;max-height:100%;height:100%;border-radius:0;border-left:none;border-right:none}}
`

    // ---------------------------------------------------------------------
    // 文本与匹配工具
    // ---------------------------------------------------------------------
    const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const termsOf = (query) => query.toLowerCase().split(/\s+/).filter(Boolean)

    const blocksToText = (blocks) => {
      if (!Array.isArray(blocks)) return ''
      const parts = []
      for (const block of blocks) {
        if (block && block.type === 'text' && typeof block.text === 'string' && block.text) {
          parts.push(block.text)
        }
      }
      return parts.join('\n\n').trim()
    }

    const sourceKind = (source) => {
      if (!source || typeof source !== 'object') return 'unknown'
      return typeof source.kind === 'string' ? source.kind : 'unknown'
    }

    const countMatches = (text, terms) => {
      const lower = text.toLowerCase()
      let total = 0
      for (const term of terms) {
        let from = 0
        for (;;) {
          const index = lower.indexOf(term, from)
          if (index === -1) break
          total += 1
          from = index + term.length
        }
      }
      return total
    }

    const matchesAll = (text, terms) => {
      if (!terms.length) return false
      const lower = text.toLowerCase()
      return terms.every((term) => lower.includes(term))
    }

    const buildSnippet = (text, terms, radius = 130) => {
      const lower = text.toLowerCase()
      let first = -1
      for (const term of terms) {
        const index = lower.indexOf(term)
        if (index !== -1 && (first === -1 || index < first)) first = index
      }
      if (first === -1) first = 0
      const start = Math.max(0, first - Math.floor(radius * 0.35))
      const end = Math.min(text.length, start + radius * 2)
      const slice = text.slice(start, end).replace(/[ \t]+/g, ' ').trim()
      return (start > 0 ? '… ' : '') + slice + (end < text.length ? ' …' : '')
    }

    const formatTime = (time) => {
      if (typeof time !== 'number' || !Number.isFinite(time)) return ''
      const date = new Date(time)
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const clock = pad(date.getHours()) + ':' + pad(date.getMinutes())
      if (date.toDateString() === now.toDateString()) return clock
      return date.getMonth() + 1 + '/' + date.getDate() + ' ' + clock
    }

    /**
     * 把会话事件窗口折叠成可搜索的消息列表，只保留「人发的提示词」与
     * 「模型生成的文本」。工具调用、推理过程、图片等块一律跳过——
     * 用户想找的是自己说过什么、模型答过什么。
     */
    const collectMessages = (entries) => {
      const messages = []
      const seen = new Set()
      let currentTurn = 0
      for (const entry of entries || []) {
        if (!entry || entry.type !== 'event') continue
        const event = entry.event
        if (!event || typeof event.type !== 'string' || typeof event.seq !== 'number') continue
        const data = event.data && typeof event.data === 'object' ? event.data : {}
        if (event.type === 'turn/start') {
          if (typeof data.turn === 'number') currentTurn = data.turn
          continue
        }
        if (seen.has(event.seq)) continue
        if (event.type === 'user/message') {
          const text = blocksToText(data.content)
          if (!text) continue
          const kind = sourceKind(data.source)
          seen.add(event.seq)
          messages.push({
            id: 'u:' + event.seq,
            seq: event.seq,
            time: event.time,
            role: kind === 'user' ? 'user' : 'system',
            turn: currentTurn,
            text,
          })
          continue
        }
        if (event.type === 'assistant/message') {
          const message = data.message && typeof data.message === 'object' ? data.message : {}
          const text = blocksToText(message.content)
          if (!text) continue
          seen.add(event.seq)
          messages.push({
            id: 'a:' + event.seq,
            seq: event.seq,
            time: event.time,
            role: 'model',
            turn: typeof data.turn === 'number' ? data.turn : currentTurn,
            text,
          })
        }
      }
      return messages
    }

    // ---------------------------------------------------------------------
    // 跳转：聊天流里的行带有 data-chat-turn 属性，按轮次定位并滚动过去。
    // ---------------------------------------------------------------------
    const findChatRow = (turn, includeHidden) => {
      if (typeof document === 'undefined') return null
      const rows = document.querySelectorAll('[data-chat-turn="' + String(turn) + '"]')
      for (const row of rows) {
        if (!includeHidden && row.closest('[hidden]')) continue
        return row
      }
      return null
    }

    // 精确轮次的行找不到时，退回到可见的、紧随其后的那一轮。
    const findNearestChatRow = (turn) => {
      if (typeof document === 'undefined') return null
      for (const row of document.querySelectorAll('[data-chat-turn]')) {
        if (row.closest('[hidden]')) continue
        const value = Number(row.getAttribute('data-chat-turn'))
        if (Number.isSafeInteger(value) && value >= turn && value <= turn + 1) return row
      }
      return null
    }

    // 折叠里的行带 hidden="until-found"，聊天自己监听 beforematch 来做展开，
    // 这里派发同一个事件把目标行露出来。
    const revealChatRow = (row) => {
      const hidden = row && row.closest('[hidden]')
      if (!hidden) return
      try {
        const view = (hidden.ownerDocument && hidden.ownerDocument.defaultView) || window
        hidden.dispatchEvent(new view.Event('beforematch', { bubbles: true }))
      } catch (error) {
        /* 老浏览器没有 beforematch，退回到“找不到就提示” */
      }
    }

    const nextFrame = () =>
      new Promise((resolve) => {
        if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve())
        else setTimeout(resolve, 30)
      })

    const waitForChatRow = (turn, timeout) =>
      new Promise((resolve) => {
        const startedAt = Date.now()
        const tick = () => {
          const row = findChatRow(turn, false)
          if (row) return resolve(row)
          if (Date.now() - startedAt >= timeout) return resolve(null)
          if (typeof requestAnimationFrame === 'function') requestAnimationFrame(tick)
          else setTimeout(tick, 60)
        }
        tick()
      })

    const flashChatRow = (row) => {
      if (!row || !row.classList) return
      row.classList.add('dcs-flash')
      setTimeout(() => {
        if (row.classList) row.classList.remove('dcs-flash')
      }, 1900)
    }

    const scrollChatRow = (row) => {
      if (!row || typeof row.scrollIntoView !== 'function') return
      try {
        row.scrollIntoView({ block: 'start', behavior: 'smooth' })
      } catch (error) {
        row.scrollIntoView()
      }
    }

    const copyText = (text) => {
      const nav = typeof navigator === 'undefined' ? null : navigator
      if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
        return nav.clipboard.writeText(text)
      }
      return new Promise((resolve, reject) => {
        try {
          const area = document.createElement('textarea')
          area.value = text
          area.setAttribute('readonly', 'readonly')
          area.style.position = 'fixed'
          area.style.top = '-1000px'
          area.style.opacity = '0'
          document.body.appendChild(area)
          area.select()
          const ok = document.execCommand('copy')
          area.remove()
          if (ok) resolve()
          else reject(new Error('copy rejected'))
        } catch (error) {
          reject(error)
        }
      })
    }

    // ---------------------------------------------------------------------
    // 图标
    // ---------------------------------------------------------------------
    const svg = (props, children) =>
      h(
        'svg',
        Object.assign(
          {
            width: 16,
            height: 16,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            'aria-hidden': 'true',
          },
          props,
        ),
        children,
      )

    const SearchIcon = () => svg({}, [h('circle', { key: 'c', cx: 11, cy: 11, r: 7 }), h('path', { key: 'p', d: 'm20 20-3.5-3.5' })])
    const EmptyIcon = () =>
      svg({ width: 28, height: 28, strokeWidth: 1.6 }, [
        h('circle', { key: 'c', cx: 11, cy: 11, r: 7 }),
        h('path', { key: 'p', d: 'm20 20-3.5-3.5' }),
      ])

    // ---------------------------------------------------------------------
    // 结果行
    // ---------------------------------------------------------------------
    function ResultRow(props) {
      const { message, terms, active, expanded, copied, jumping, t, markdownLabels, onToggle, onCopy, onJump, registerRef } = props
      const count = React.useMemo(() => countMatches(message.text, terms), [message.text, terms])
      const snippet = React.useMemo(() => highlight(buildSnippet(message.text, terms), terms), [message.text, terms])
      const full = React.useMemo(() => {
        if (!expanded) return null
        if (message.text.length > 20000) return message.text
        return highlight(message.text, terms)
      }, [expanded, message.text, terms])

      const className = 'dcs-row' + (active ? ' is-active' : '') + (expanded ? ' is-expanded' : '')

      return h(
        'div',
        {
          className,
          role: 'option',
          tabIndex: -1,
          'aria-selected': active ? 'true' : 'false',
          onClick: onToggle,
          ref: registerRef,
        },
        h(
          'div',
          { className: 'dcs-row-head' },
          h('span', { className: 'dcs-badge role-' + message.role }, t('role.' + message.role)),
          message.turn > 0 ? h('span', { className: 'dcs-turn' }, t('turn', { n: message.turn })) : null,
          h('span', { className: 'dcs-time' }, formatTime(message.time)),
          h('span', { className: 'dcs-count' }, t('panel.matches', { n: count })),
          h('span', { className: 'dcs-spacer' }),
          h(
            'button',
            {
              type: 'button',
              className: 'dcs-jump',
              disabled: jumping,
              title: t('jump.aria', { n: message.turn }),
              onClick: (event) => {
                event.stopPropagation()
                onJump(message)
              },
            },
            jumping ? t('jumping') : t('jump'),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dcs-copy',
              onClick: (event) => {
                event.stopPropagation()
                onCopy(message)
              },
            },
            copied ? t('copied') : t('copy'),
          ),
        ),
        expanded && MarkdownText
          ? h('div', { className: 'dcs-md' }, h(MarkdownText, { text: message.text, labels: markdownLabels }))
          : h('div', { className: 'dcs-snippet' }, expanded ? full : snippet),
      )
    }

    const highlight = (text, terms) => {
      if (!terms.length) return text
      const pattern = new RegExp('(' + terms.map(escapeRegExp).join('|') + ')', 'gi')
      const nodes = []
      let last = 0
      let key = 0
      let match
      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) nodes.push(text.slice(last, match.index))
        nodes.push(h('mark', { key: 'm' + key++, className: 'dcs-mark' }, match[0]))
        last = match.index + match[0].length
        if (match[0].length === 0) pattern.lastIndex += 1
      }
      if (last < text.length) nodes.push(text.slice(last))
      return nodes
    }

    // ---------------------------------------------------------------------
    // 面板
    // ---------------------------------------------------------------------
    const RESULT_LIMIT = 150
    const PAGE_LOADS_PER_CLICK = 20
    const EMPTY_WINDOW = { entries: [], hasMore: false, revision: 0 }

    function useSessionBinding(sessions, sessionId) {
      const read = React.useCallback(() => {
        if (!sessions || !sessionId) return null
        try {
          return sessions.binding(sessionId) || null
        } catch (error) {
          return null
        }
      }, [sessions, sessionId])

      const [binding, setBinding] = React.useState(read)

      React.useEffect(() => {
        const current = read()
        setBinding((previous) => (previous === current ? previous : current))
        if (current) return undefined
        // 会话绑定可能比面板晚一步就绪，轻量重试即可。
        const timer = setInterval(() => {
          const next = read()
          if (next) {
            clearInterval(timer)
            setBinding(next)
          }
        }, 400)
        return () => clearInterval(timer)
      }, [read])

      return binding
    }

    function useEventWindow(binding) {
      const [window, setWindow] = React.useState(() => {
        if (!binding) return EMPTY_WINDOW
        const snapshot = binding.eventSource.getSnapshot()
        return snapshot || EMPTY_WINDOW
      })

      React.useEffect(() => {
        if (!binding) {
          setWindow(EMPTY_WINDOW)
          return undefined
        }
        const source = binding.eventSource
        const update = () => setWindow(source.getSnapshot() || EMPTY_WINDOW)
        update()
        return source.subscribe(update)
      }, [binding])

      return window
    }

    function SearchPanel(props) {
      const { sessionId, sessions, t, onClose } = props
      const binding = useSessionBinding(sessions, sessionId)
      const windowSnapshot = useEventWindow(binding)
      const messages = React.useMemo(() => collectMessages(windowSnapshot.entries), [windowSnapshot])

      const [query, setQuery] = React.useState('')
      const terms = React.useMemo(() => termsOf(query), [query])

      const [filter, setFilter] = React.useState('all')
      const [expanded, setExpanded] = React.useState(() => new Set())
      const [activeIndex, setActiveIndex] = React.useState(0)
      const [copiedId, setCopiedId] = React.useState(null)
      const [jumpingId, setJumpingId] = React.useState(null)
      const [jumpNote, setJumpNote] = React.useState('')
      const [loadingOlder, setLoadingOlder] = React.useState(false)
      const [loadError, setLoadError] = React.useState(false)

      const inputRef = React.useRef(null)
      const bodyRef = React.useRef(null)
      const rowRefs = React.useRef(new Map())
      const copyTimer = React.useRef(null)

      const matched = React.useMemo(() => {
        if (!terms.length) return []
        return messages.filter((message) => matchesAll(message.text, terms))
      }, [messages, terms])

      const results = React.useMemo(() => {
        if (filter === 'user') return matched.filter((message) => message.role === 'user')
        if (filter === 'model') return matched.filter((message) => message.role === 'model')
        return matched
      }, [matched, filter])

      const visible = React.useMemo(() => results.slice(0, RESULT_LIMIT), [results])

      const totalMatches = React.useMemo(
        () => results.slice(0, 400).reduce((sum, message) => sum + countMatches(message.text, terms), 0),
        [results, terms],
      )

      // 每次输入聚焦、Esc 关闭、上下选择
      React.useEffect(() => {
        const node = inputRef.current
        if (node) node.focus()
      }, [])

      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (event.defaultPrevented) return
          if (event.key === 'Escape') {
            event.preventDefault()
            onClose()
          }
        }
        document.addEventListener('keydown', onKeyDown, true)
        return () => document.removeEventListener('keydown', onKeyDown, true)
      }, [onClose])

      React.useEffect(() => setActiveIndex(0), [terms, filter])

      React.useEffect(() => {
        if (!visible.length) return
        if (activeIndex >= visible.length) {
          setActiveIndex(visible.length - 1)
          return
        }
        const node = rowRefs.current.get(visible[activeIndex].id)
        if (node && typeof node.scrollIntoView === 'function') {
          node.scrollIntoView({ block: 'nearest' })
        }
      }, [activeIndex, visible])

      React.useEffect(() => () => {
        if (copyTimer.current !== null) clearTimeout(copyTimer.current)
      }, [])

      const toggleExpanded = React.useCallback((id) => {
        setExpanded((previous) => {
          const next = new Set(previous)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        })
      }, [])

      const handleCopy = React.useCallback(
        (message) => {
          const done = () => {
            setCopiedId(message.id)
            if (copyTimer.current !== null) clearTimeout(copyTimer.current)
            copyTimer.current = setTimeout(() => setCopiedId(null), 1400)
          }
          try {
            const pending = copyText(message.text)
            if (pending && typeof pending.then === 'function') {
              pending.then(done).catch(() => {
                setCopiedId(null)
              })
            } else {
              done()
            }
          } catch (error) {
            setCopiedId(null)
          }
        },
        [],
      )

      const jumpTo = React.useCallback(
        async (message) => {
          const session = binding && binding.session
          if (!session) return
          setJumpNote('')
          setJumpingId(message.id)
          try {
            // 先看 DOM 里有没有这一轮；被折叠起来的话先展开它。
            let row = findChatRow(message.turn, false)
            if (!row) {
              const folded = findChatRow(message.turn, true)
              if (folded) {
                revealChatRow(folded)
                await nextFrame()
                row = findChatRow(message.turn, false)
              }
            }
            if (!row && typeof session.loadThrough === 'function') {
              try {
                await session.loadThrough(message.seq)
              } catch (error) {
                /* 载入失败时仍然尝试按已有 DOM 跳转 */
              }
              row = await waitForChatRow(message.turn, 3000)
            }
            if (!row) row = findNearestChatRow(message.turn)
            if (!row) {
              setJumpNote(t('jumpFailed'))
              return
            }
            onClose()
            scrollChatRow(row)
            flashChatRow(row)
          } finally {
            setJumpingId(null)
          }
        },
        [binding, onClose, t],
      )

      const markdownLabels = React.useMemo(
        () => ({
          code: {
            copyLabel: t('code.copy'),
            copiedLabel: t('code.copied'),
            toolbarLabels: { codeLabel: t('code.title'), wrapLabel: t('code.wrap'), unwrapLabel: t('code.unwrap') },
          },
          footnotes: t('markdown.footnotes'),
        }),
        [t],
      )

      const loadEarlier = React.useCallback(async () => {
        if (!binding || loadingOlder) return
        const session = binding.session
        if (!session || typeof session.loadOlder !== 'function') return
        setLoadingOlder(true)
        setLoadError(false)
        try {
          for (let page = 0; page < PAGE_LOADS_PER_CLICK; page += 1) {
            const snapshot = typeof session.getSnapshot === 'function' ? session.getSnapshot() : null
            if (!snapshot || !snapshot.hasMore) break
            if (snapshot.historyLoadStatus === 'error') {
              setLoadError(true)
              break
            }
            const before = binding.eventSource.getSnapshot()
            const beforeRevision = before ? before.revision : 0
            const beforeCount = before && Array.isArray(before.entries) ? before.entries.length : 0
            await session.loadOlder()
            const after = binding.eventSource.getSnapshot()
            const afterRevision = after ? after.revision : 0
            const afterCount = after && Array.isArray(after.entries) ? after.entries.length : 0
            // 没有新增事件说明这一页没有可消费的内容，停止以免空转。
            if (afterRevision === beforeRevision && afterCount === beforeCount) break
          }
          const finalSnapshot = typeof session.getSnapshot === 'function' ? session.getSnapshot() : null
          if (finalSnapshot && finalSnapshot.historyLoadStatus === 'error') setLoadError(true)
        } catch (error) {
          setLoadError(true)
        } finally {
          setLoadingOlder(false)
        }
      }, [binding, loadingOlder])

      const onInputKeyDown = (event) => {
        if (event.nativeEvent && event.nativeEvent.isComposing) return
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          setActiveIndex((index) => Math.min(index + 1, Math.max(visible.length - 1, 0)))
          return
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          setActiveIndex((index) => Math.max(index - 1, 0))
          return
        }
        if (event.key === 'Enter') {
          const current = visible[activeIndex]
          if (current) {
            event.preventDefault()
            if (event.altKey || event.metaKey) jumpTo(current)
            else toggleExpanded(current.id)
          }
        }
      }

      const chips = [
        ['all', t('filter.all')],
        ['user', t('filter.user')],
        ['model', t('filter.model')],
      ]

      const headerStatus = terms.length
        ? t('panel.results', { n: results.length }) + ' · ' + t('panel.scanned', { n: messages.length })
        : t('panel.scanned', { n: messages.length })

      let content
      if (!binding) {
        content = h('div', { className: 'dcs-state' }, h(EmptyIcon), h('div', { className: 'dcs-state-title' }, t('panel.notReady')))
      } else if (!terms.length) {
        content = h(
          'div',
          { className: 'dcs-state' },
          h(EmptyIcon),
          h('div', { className: 'dcs-state-title' }, t('panel.hint')),
          h('div', { className: 'dcs-state-sub' }, t('panel.hint.scope')),
        )
      } else if (!results.length) {
        content = h('div', { className: 'dcs-state' }, h(EmptyIcon), h('div', { className: 'dcs-state-title' }, t('panel.empty')))
      } else {
        content = h(
          'div',
          { className: 'dcs-list', role: 'listbox', 'aria-label': t('panel.title') },
          visible.map((message, index) =>
            h(ResultRow, {
              key: message.id,
              message,
              terms,
              active: index === activeIndex,
              expanded: expanded.has(message.id),
              copied: copiedId === message.id,
              jumping: jumpingId === message.id,
              t,
              markdownLabels,
              onToggle: () => {
                setActiveIndex(index)
                toggleExpanded(message.id)
              },
              onCopy: handleCopy,
              onJump: jumpTo,
              registerRef: (node) => {
                if (node) rowRefs.current.set(message.id, node)
                else rowRefs.current.delete(message.id)
              },
            }),
          ),
        )
      }

      const footerNote = jumpNote
        ? h('span', { className: 'dcs-foot-note is-error' }, jumpNote)
        : loadError
          ? h('span', { className: 'dcs-foot-note is-error' }, t('panel.loadError'))
          : windowSnapshot.hasMore
            ? h('span', { className: 'dcs-foot-note' }, t('panel.earlierHint'))
            : terms.length && messages.length
              ? h('span', null, t('panel.allLoaded'))
              : null

      const tree = h(
          'div',
          { className: 'dcs-root', onMouseDown: (event) => event.stopPropagation() },
          h('div', { className: 'dcs-backdrop', onMouseDown: onClose }),
          h(
            'div',
            {
              className: 'dcs-panel',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-label': t('panel.title'),
              onMouseDown: (event) => event.stopPropagation(),
            },
            h(
              'div',
              { className: 'dcs-head' },
              h(
                'div',
                { className: 'dcs-title-row' },
                h(SearchIcon),
                h('span', { className: 'dcs-title' }, t('panel.title')),
                h(
                  'button',
                  { type: 'button', className: 'dcs-icon-btn', 'aria-label': t('close'), title: t('close'), onClick: onClose },
                  '×',
                ),
              ),
              h(
                'div',
                { className: 'dcs-input-row' },
                h('span', { className: 'dcs-input-icon' }, h(SearchIcon)),
                h('input', {
                  ref: inputRef,
                  className: 'dcs-input',
                  value: query,
                  placeholder: t('panel.placeholder'),
                  onChange: (event) => setQuery(event.target.value),
                  onKeyDown: onInputKeyDown,
                  spellCheck: false,
                  autoComplete: 'off',
                  'aria-label': t('panel.placeholder'),
                }),
              ),
              h(
                'div',
                { className: 'dcs-filter-row' },
                chips.map(([value, label]) =>
                  h(
                    'button',
                    {
                      key: value,
                      type: 'button',
                      className: 'dcs-chip' + (filter === value ? ' is-active' : ''),
                      onClick: () => setFilter(value),
                    },
                    label,
                  ),
                ),
                h('span', { className: 'dcs-spacer' }),
                h('span', { className: 'dcs-status' }, headerStatus),
              ),
            ),
            h('div', { className: 'dcs-body', ref: bodyRef }, content),
            h(
              'div',
              { className: 'dcs-foot' },
              h('span', null, t('panel.footerHint')),
              terms.length > 0 && results.length > RESULT_LIMIT
                ? h('span', { className: 'dcs-foot-note' }, t('panel.overflow', { n: RESULT_LIMIT }))
                : null,
              h('span', { className: 'dcs-spacer' }),
              footerNote,
              windowSnapshot.hasMore
                ? h(
                    'button',
                    {
                      type: 'button',
                      className: 'dcs-load-more',
                      onClick: loadEarlier,
                      disabled: loadingOlder,
                      title: t('panel.loadMore'),
                    },
                    loadingOlder ? t('panel.loadingMore') : t('panel.loadMore'),
                  )
                : null,
            ),
          ),
        )

      return ReactDOM && typeof ReactDOM.createPortal === 'function'
        ? ReactDOM.createPortal(tree, document.body)
        : tree
    }

    // ---------------------------------------------------------------------
    // 触发按钮：注册进会话输入框左侧
    // ---------------------------------------------------------------------
    function SearchTrigger(props) {
      const { t, sessions } = props
      const sessionId = props.sessionId
      const [open, setOpen] = React.useState(false)

      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (event.defaultPrevented) return
          if (!(event.ctrlKey || event.metaKey) || !event.shiftKey) return
          if (event.key !== 'f' && event.key !== 'F') return
          event.preventDefault()
          setOpen(true)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
      }, [])

      return h(
        React.Fragment,
        null,
        h(
          'button',
          {
            type: 'button',
            className: 'dcs-trigger' + (open ? ' is-open' : ''),
            title: t('trigger.title'),
            'aria-label': t('trigger.label'),
            'aria-expanded': open ? 'true' : 'false',
            onClick: () => setOpen((value) => !value),
          },
          h(SearchIcon),
        ),
        open
          ? h(SearchPanel, {
              sessionId,
              sessions,
              t,
              onClose: () => setOpen(false),
            })
          : null,
      )
    }

    // ---------------------------------------------------------------------
    // 插件入口
    // ---------------------------------------------------------------------
    return {
      name: ID,
      inject: ['slots', 'sessions', 'locale'],
      apply(ctx) {
        const locale = ctx.get('locale') || ctx.locale
        const sessions = ctx.get('sessions')
        const fallbackDict = typeof navigator !== 'undefined' && /^zh/i.test(navigator.language || '') ? ZH : EN
        const fallbackT = (key, params) => {
          const template = fallbackDict[key] || EN[key] || key
          if (!params) return template
          return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
        }
        const t = locale && typeof locale.bind === 'function' ? locale.bind(NS) : fallbackT

        // 语言包：注册中英文案，未注册的语言回落到 en。
        // 插件热重载时同一 namespace 已注册过，重复注册会抛错，因此先探测。
        const alreadyLocalized = typeof locale?.bind === 'function' && locale.bind(NS)('panel.title') !== 'panel.title'
        if (locale && typeof locale.register === 'function' && !alreadyLocalized) {
          ctx.effect(() => {
            const disposers = []
            try {
              const enDispose = locale.register(NS, 'en', EN)
              if (typeof enDispose === 'function') disposers.push(enDispose)
              const zhDispose = locale.register(NS, 'zh', ZH)
              if (typeof zhDispose === 'function') disposers.push(zhDispose)
            } catch (error) {
              try {
                const disposeAll = locale.register(NS, { en: EN, zh: ZH })
                if (typeof disposeAll === 'function') disposers.push(disposeAll)
              } catch (inner) {
                console.warn('[dsh-conversation-search] locale registration failed', inner)
              }
            }
            return () => {
              for (const dispose of disposers) {
                try {
                  dispose()
                } catch (error) {
                  /* ignore */
                }
              }
            }
          })
        }

        // 样式：优先走 ui-primitives 的 styles 服务，不可用时退回 <style> 标签。
        ctx.effect(() => {
          const styles = ctx.get('styles')
          if (styles && typeof styles.insert === 'function') {
            const dispose = styles.insert(CSS)
            return () => {
              if (typeof dispose === 'function') dispose()
            }
          }
          const element = document.createElement('style')
          element.setAttribute(PLUGIN_ATTR, ID)
          element.textContent = CSS
          document.head.appendChild(element)
          return () => element.remove()
        })

        // 槽位组件只拿得到标准 props，这里把插件作用域里的文案函数与会话服务补进去。
        const Trigger = (props) => h(SearchTrigger, Object.assign({}, props, { t, sessions }))

        const register = () =>
          ctx.slots.register(
            {
              name: SLOT,
              id: ID,
              order: 10,
              label: () => t('trigger.label'),
            },
            Trigger,
          )

        ctx.slots.inject(SLOT, () => {
          const registration = register()
          return () => {
            if (typeof registration === 'function') registration()
            else if (registration && typeof registration.dispose === 'function') registration.dispose()
          }
        })
      },
    }
  },
})