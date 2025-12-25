"use client"

import { createContext, useContext, useState, useEffect } from "react"
import frMessages from "@/messages/fr.json"
import enMessages from "@/messages/en.json"

type Locale = "fr" | "en"
type Messages = typeof frMessages

const I18nContext = createContext<{
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
}>({
    locale: "fr",
    setLocale: () => { },
    t: (key) => key
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>("fr")
    const [messages, setMessages] = useState<Messages>(frMessages)

    useEffect(() => {
        setMessages(locale === "fr" ? frMessages : enMessages)
    }, [locale])

    const t = (path: string) => {
        const keys = path.split('.')
        let current: any = messages
        for (const key of keys) {
            if (current[key] === undefined) return path
            current = current[key]
        }
        return current as string
    }

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export const useI18n = () => useContext(I18nContext)
