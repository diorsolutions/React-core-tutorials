// Utility functions for localStorage management
export const storage = {
  // User details
  getUserDetails: () => {
    if (typeof window === "undefined") return null;
    try {
      const details = localStorage.getItem("fastfood-user-details");
      return details ? JSON.parse(details) : null;
    } catch (error) {
      console.error("Error getting user details:", error);
      return null;
    }
  },

  setUserDetails: (details: any) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("fastfood-user-details", JSON.stringify(details));
    } catch (error) {
      console.error("Error setting user details:", error);
    }
  },

  // Cart
  getCart: () => {
    if (typeof window === "undefined") return [];
    try {
      const cart = localStorage.getItem("fastfood-cart");
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Error getting cart:", error);
      return [];
    }
  },

  setCart: (cart: any[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("fastfood-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error setting cart:", error);
    }
  },

  // Theme
  getTheme: () => {
    if (typeof window === "undefined") return "light";
    try {
      return localStorage.getItem("fastfood-theme") || "light";
    } catch (error) {
      console.error("Error getting theme:", error);
      return "light";
    }
  },

  setTheme: (theme: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("fastfood-theme", theme);
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  },

  // Language
  getLanguage: () => {
    if (typeof window === "undefined") return "uz";
    try {
      return localStorage.getItem("fastfood-language") || "uz";
    } catch (error) {
      console.error("Error getting language:", error);
      return "uz";
    }
  },

  setLanguage: (language: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("fastfood-language", language);
      // Trigger event to notify other components
      window.dispatchEvent(
        new CustomEvent("languageChanged", { detail: { language } })
      );
    } catch (error) {
      console.error("Error setting language:", error);
    }
  },

  // Helper method to trigger storage events manually
  triggerStorageEvent: (key: string, newValue: any) => {
    if (typeof window === "undefined") return;
    try {
      const storageEvent = new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(newValue),
        storageArea: localStorage,
      });
      window.dispatchEvent(storageEvent);
    } catch (error) {
      console.error("Error triggering storage event:", error);
    }
  },

  // Debug method to check all stored data
  debugStorage: () => {
    if (typeof window === "undefined") return;
    console.log("=== Storage Debug ===");
    console.log("User details:", storage.getUserDetails());
    console.log("Cart:", storage.getCart());
    console.log("Theme:", storage.getTheme());
    console.log("Language:", storage.getLanguage());
    console.log("Admin menu items:", localStorage.getItem("admin-menu-items"));
    console.log("====================");
  },
};
