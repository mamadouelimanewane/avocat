"use client"

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (message: string, type?: ToastType, duration?: number) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substring(7)
        const newToast: Toast = { id, message, type, duration }

        setToasts(prev => [...prev, newToast])

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, duration)
        }
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    )
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: string) => void }) {
    if (toasts.length === 0) return null

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    )
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) {
    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
    }

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-amber-50 border-amber-200',
        info: 'bg-blue-50 border-blue-200',
    }

    return (
        <div
            className={cn(
                "flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-5 fade-in duration-300",
                bgColors[toast.type]
            )}
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-slate-800">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
