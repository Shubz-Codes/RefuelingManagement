import React, { useEffect, useState } from "react"

// Simple modal dialog for toast events
export function Toaster({
  toasts = [],
}: {
  toasts?: Array<{
    id: string
    title?: string
    description?: string
    variant?: string
  }>
}) {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState<{
    title?: string
    description?: string
    variant?: string
  } | null>(null)

  useEffect(() => {
    if (toasts.length > 0) {
      setCurrent(toasts[0])
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [toasts])

  if (!visible || !current) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)',
          padding: '2rem 3rem',
          minWidth: '320px',
          textAlign: 'center',
          color: current.variant === 'destructive' ? '#b91c1c' : '#192133',
          fontWeight: 'bold',
          fontSize: '1.3rem',
          border: current.variant === 'destructive' ? '2px solid #b91c1c' : '2px solid #192133',
        }}
      >
        {current.title && <div style={{ marginBottom: '0.5rem' }}>{current.title}</div>}
        {current.description && <div style={{ fontWeight: 400, fontSize: '1rem', color: '#606f7b' }}>{current.description}</div>}
      </div>
    </div>
  )
}
