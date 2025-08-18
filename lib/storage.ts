// Utility functions for localStorage management
export const storage = {
  // User details
  getUserDetails: () => {
    if (typeof window === "undefined") return null
    const details = localStorage.getItem("fastfood-user-details")
    return details ? JSON.parse(details) : null
  },

  setUserDetails: (details: any) => {
    if (typeof window === "undefined") return
    localStorage.setItem("fastfood-user-details", JSON.stringify(details))
  },

  // Cart
  getCart: () => {
    if (typeof window === "undefined") return []
    const cart = localStorage.getItem("fastfood-cart")
    return cart ? JSON.parse(cart) : []
  },

  setCart: (cart: any[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("fastfood-cart", JSON.stringify(cart))
  },

  // Theme
  getTheme: () => {
    if (typeof window === "undefined") return "light"
    return localStorage.getItem("fastfood-theme") || "light"
  },

  setTheme: (theme: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem("fastfood-theme", theme)
  },

  // Language
  getLanguage: () => {
    if (typeof window === "undefined") return "uz"
    return localStorage.getItem("fastfood-language") || "uz"
  },

  setLanguage: (language: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem("fastfood-language", language)
  },
}
