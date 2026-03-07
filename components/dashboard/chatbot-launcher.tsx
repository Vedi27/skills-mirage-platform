'use client'

import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CHATBOT_BASE =
  process.env.NEXT_PUBLIC_STREAMLIT_CHATBOT_URL ||
  'https://chatbot-final-2254.streamlit.app/'
// Append ?embed=true so Streamlit allows iframe embedding (required for Community Cloud)
const CHATBOT_URL =
  CHATBOT_BASE.replace(/\/?$/, '') + (CHATBOT_BASE.includes('?') ? '&' : '?') + 'embed=true'

interface ChatbotLauncherProps {
  children: React.ReactNode
}

export function ChatbotLauncher({ children }: ChatbotLauncherProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Main content - gets right margin when chatbot is open (70% visible) */}
      <div
        className={cn(
          'min-h-screen w-full transition-[margin-right] duration-200',
          isOpen && CHATBOT_URL && 'mr-[30%]'
        )}
      >
        {children}
      </div>

      {/* Chatbot split panel - 30% on the right */}
      {isOpen && CHATBOT_URL && (
        <aside
          className="fixed right-0 top-0 z-40 flex h-screen w-[30%] min-w-[320px] max-w-[500px] flex-col border-l border-border bg-background shadow-xl"
          aria-label="Chatbot panel"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-medium text-foreground">
              AI Chatbot
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <iframe
              src={CHATBOT_URL}
              title="Streamlit Chatbot"
              className="h-full w-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </aside>
      )}

      {/* Floating button with Castor greeting - bottom right */}
      {CHATBOT_URL && (
        <div
          className={cn(
            'fixed bottom-6 z-50 flex flex-col items-end gap-2',
            isOpen ? 'right-[calc(30%+1.5rem)]' : 'right-6'
          )}
        >
          {/* Speech bubble from Castor - only when panel is closed */}
          {!isOpen && (
            <div className="relative max-w-[200px] rounded-lg rounded-br-sm border border-border bg-card px-3 py-2 shadow-md">
              <p className="text-xs text-white leading-snug">
                Hi! I am Castor. How can I help you?
              </p>
              {/* Small tail pointing to the button */}
              <div
                className="absolute -bottom-1.5 right-4 h-2 w-2 rotate-45 border-r border-b border-border bg-card"
                aria-hidden
              />
            </div>
          )}
          <Button
            onClick={() => setIsOpen((o) => !o)}
            size="icon"
            className={cn(
              'h-12 w-12 rounded-full shadow-lg',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'transition-all hover:scale-105'
            )}
            aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MessageSquare className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}
    </>
  )
}
