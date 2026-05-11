import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Raksha, your safety assistant. How can I help you prepare or stay safe today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const newMessages = [...messages, { role: 'user', content: input.trim() } as Message]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      if (!res.ok) throw new Error('API Error')
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.response }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="glass-icon-badge" style={{ width: 36, height: 36, background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
          <Bot size={18} color="#60a5fa" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>Raksha AI</p>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Safety assistant</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 8,
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '88%',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
          }}>
            {/* Avatar */}
            <div className="glass-icon-badge" style={{
              width: 28, height: 28, flexShrink: 0,
              background: msg.role === 'assistant' ? 'rgba(96,165,250,0.15)' : 'rgba(167,139,250,0.15)',
              border: `1px solid ${msg.role === 'assistant' ? 'rgba(96,165,250,0.3)' : 'rgba(167,139,250,0.3)'}`,
            }}>
              {msg.role === 'assistant'
                ? <Bot size={14} color="#60a5fa" />
                : <User size={14} color="#a78bfa" />
              }
            </div>

            {/* Bubble */}
            <div style={{
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user'
                ? 'rgba(167,139,250,0.25)'
                : 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: msg.role === 'user'
                ? '1px solid rgba(167,139,250,0.35)'
                : '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 14,
              lineHeight: 1.55,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-start', alignItems: 'flex-end' }}>
            <div className="glass-icon-badge" style={{ width: 28, height: 28, background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
              <Bot size={14} color="#60a5fa" />
            </div>
            <div style={{
              padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <div className="typing-dot" style={{ animationDelay: '0ms' }} />
              <div className="typing-dot" style={{ animationDelay: '160ms' }} />
              <div className="typing-dot" style={{ animationDelay: '320ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '10px 14px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 28, padding: '0 16px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Raksha..."
            disabled={isLoading}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: 14, padding: '13px 0',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{
            width: 46, height: 46, borderRadius: '50%',
            background: input.trim() && !isLoading
              ? 'linear-gradient(135deg, rgba(167,139,250,0.6), rgba(96,165,250,0.6))'
              : 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() && !isLoading ? 'pointer' : 'default',
            transition: 'all 0.2s',
            boxShadow: input.trim() && !isLoading ? '0 4px 16px rgba(167,139,250,0.3)' : 'none',
          } as React.CSSProperties}
        >
          {isLoading
            ? <Loader2 size={18} color="rgba(255,255,255,0.5)" style={{ animation: 'spin 1s linear infinite' }} />
            : <Send size={18} color={input.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} />
          }
        </button>
      </form>
    </div>
  )
}
