"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Currency,
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  getCurrencyByCode,
} from "@/lib/currency";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number) => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);

  // Load currency from settings on mount
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const response = await fetch("/api/settings/currency");
        if (response.ok) {
          const data = await response.json();
          const savedCurrency = getCurrencyByCode(data.value || "SAR");
          setCurrencyState(savedCurrency);
        }
      } catch (error) {
        console.error("Failed to load currency setting:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrency();
  }, []);

  const setCurrency = async (newCurrency: Currency) => {
    try {
      // Update in database
      const response = await fetch("/api/settings/currency", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: newCurrency.code }),
      });

      if (response.ok) {
        setCurrencyState(newCurrency);
      } else {
        throw new Error("Failed to update currency");
      }
    } catch (error) {
      console.error("Failed to update currency:", error);
      throw error;
    }
  };

  const formatPrice = (amount: number): string => {
    return `${amount} ${currency.symbol}`;
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatPrice,
    loading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
