"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface SettingsContextType {
  language: string
  currency: string
  setLanguage: (language: string) => void
  setCurrency: (currency: string) => void
  formatCurrency: (amount: number) => string
  isLoading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: React.ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [language, setLanguageState] = useState('en')
  const [currency, setCurrencyState] = useState('TND')
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from localStorage and API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // First, load from localStorage for immediate UI update
        const savedLanguage = localStorage.getItem('dental-camp-language')
        const savedCurrency = localStorage.getItem('dental-camp-currency')
        
        if (savedLanguage) setLanguageState(savedLanguage)
        if (savedCurrency) setCurrencyState(savedCurrency)

        // Then, fetch from API to get the latest settings
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.store) {
            setLanguageState(data.store.language || 'en')
            setCurrencyState(data.store.currency || 'TND')
            
            // Update localStorage with API data
            localStorage.setItem('dental-camp-language', data.store.language || 'en')
            localStorage.setItem('dental-camp-currency', data.store.currency || 'TND')
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const setLanguage = async (newLanguage: string) => {
    setLanguageState(newLanguage)
    localStorage.setItem('dental-camp-language', newLanguage)
    
    // Update in database
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'store',
          data: { language: newLanguage }
        })
      })
    } catch (error) {
      console.error('Failed to save language setting:', error)
    }
  }

  const setCurrency = async (newCurrency: string) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('dental-camp-currency', newCurrency)
    
    // Update in database
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'store',
          data: { currency: newCurrency }
        })
      })
    } catch (error) {
      console.error('Failed to save currency setting:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    const currencyMap: { [key: string]: { code: string; locale: string } } = {
      'TND': { code: 'TND', locale: 'en-US' }, // Changed from 'ar-TN' to 'en-US' to show TND instead of د ت
      'EUR': { code: 'EUR', locale: 'fr-FR' },
      'USD': { code: 'USD', locale: 'en-US' }
    }

    const currencyInfo = currencyMap[currency] || currencyMap['TND']

    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currencyInfo.code,
      minimumFractionDigits: currency === 'TND' ? 3 : 2,
      maximumFractionDigits: currency === 'TND' ? 3 : 2
    }).format(amount)
  }

  const value = {
    language,
    currency,
    setLanguage,
    setCurrency,
    formatCurrency,
    isLoading
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

// Hook for easy access to currency formatting
export function useCurrency() {
  const { formatCurrency, currency } = useSettings()
  return { formatCurrency, currency }
}

// Hook for easy access to language
export function useLanguage() {
  const { language, setLanguage } = useSettings()
  return { language, setLanguage }
}
