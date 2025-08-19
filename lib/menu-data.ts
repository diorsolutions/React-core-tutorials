export interface MenuItem {
  id: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  description: {
    uz: string;
    ru: string;
    en: string;
  };
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  stock: number;
}

export interface MenuCategory {
  id: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  icon: string;
}

export const menuCategories: MenuCategory[] = [
  {
    id: "burgers",
    name: {
      uz: "Burgerlar",
      ru: "Бургеры",
      en: "Burgers",
    },
    icon: "🍔",
  },
  {
    id: "pizza",
    name: {
      uz: "Pitsa",
      ru: "Пицца",
      en: "Pizza",
    },
    icon: "🍕",
  },
  {
    id: "drinks",
    name: {
      uz: "Ichimliklar",
      ru: "Напитки",
      en: "Drinks",
    },
    icon: "🥤",
  },
  {
    id: "desserts",
    name: {
      uz: "Shirinliklar",
      ru: "Десерты",
      en: "Desserts",
    },
    icon: "🍰",
  },
];

// Initial default menu items
const defaultMenuItems: MenuItem[] = [
  // Burgers
  {
    id: "classic-burger",
    name: {
      uz: "Klassik Burger",
      ru: "Классический Бургер",
      en: "Classic Burger",
    },
    description: {
      uz: "Mol go'shti, pomidor, salat, piyoz va maxsus sous",
      ru: "Говядина, помидор, салат, лук и специальный соус",
      en: "Beef patty, tomato, lettuce, onion and special sauce",
    },
    price: 25000,
    image: "/placeholder.svg?height=200&width=200",
    category: "burgers",
    popular: true,
    stock: 15,
  },
  {
    id: "cheese-burger",
    name: {
      uz: "Chizburger",
      ru: "Чизбургер",
      en: "Cheeseburger",
    },
    description: {
      uz: "Mol go'shti, pishloq, pomidor, salat va sous",
      ru: "Говядина, сыр, помидор, салат и соус",
      en: "Beef patty, cheese, tomato, lettuce and sauce",
    },
    price: 28000,
    image: "/placeholder.svg?height=200&width=200",
    category: "burgers",
    stock: 12,
  },
  {
    id: "chicken-burger",
    name: {
      uz: "Tovuq Burger",
      ru: "Куриный Бургер",
      en: "Chicken Burger",
    },
    description: {
      uz: "Tovuq go'shti, salat, pomidor va mayonez",
      ru: "Куриное мясо, салат, помидор и майонез",
      en: "Chicken breast, lettuce, tomato and mayo",
    },
    price: 23000,
    image: "/placeholder.svg?height=200&width=200",
    category: "burgers",
    stock: 18,
  },

  // Pizza
  {
    id: "margherita",
    name: {
      uz: "Margarita",
      ru: "Маргарита",
      en: "Margherita",
    },
    description: {
      uz: "Pomidor sousi, mozzarella va rayhon",
      ru: "Томатный соус, моцарелла и базилик",
      en: "Tomato sauce, mozzarella and basil",
    },
    price: 35000,
    image: "/placeholder.svg?height=200&width=200",
    category: "pizza",
    popular: true,
    stock: 10,
  },
  {
    id: "pepperoni",
    name: {
      uz: "Pepperoni",
      ru: "Пепперони",
      en: "Pepperoni",
    },
    description: {
      uz: "Pomidor sousi, mozzarella va pepperoni",
      ru: "Томатный соус, моцарелла и пепперони",
      en: "Tomato sauce, mozzarella and pepperoni",
    },
    price: 42000,
    image: "/placeholder.svg?height=200&width=200",
    category: "pizza",
    stock: 8,
  },

  // Drinks
  {
    id: "cola",
    name: {
      uz: "Kola",
      ru: "Кола",
      en: "Cola",
    },
    description: {
      uz: "Sovuq gazli ichimlik",
      ru: "Холодный газированный напиток",
      en: "Cold carbonated drink",
    },
    price: 8000,
    image: "/placeholder.svg?height=200&width=200",
    category: "drinks",
    stock: 25,
  },
  {
    id: "orange-juice",
    name: {
      uz: "Apelsin sharbati",
      ru: "Апельсиновый сок",
      en: "Orange Juice",
    },
    description: {
      uz: "Tabiiy apelsin sharbati",
      ru: "Натуральный апельсиновый сок",
      en: "Fresh orange juice",
    },
    price: 12000,
    image: "/placeholder.svg?height=200&width=200",
    category: "drinks",
    stock: 20,
  },

  // Desserts
  {
    id: "chocolate-cake",
    name: {
      uz: "Shokoladli tort",
      ru: "Шоколадный торт",
      en: "Chocolate Cake",
    },
    description: {
      uz: "Yumshoq shokoladli tort",
      ru: "Мягкий шоколадный торт",
      en: "Soft chocolate cake",
    },
    price: 18000,
    image: "/placeholder.svg?height=200&width=200",
    category: "desserts",
    stock: 6,
  },
  {
    id: "ice-cream",
    name: {
      uz: "Muzqaymoq",
      ru: "Мороженое",
      en: "Ice Cream",
    },
    description: {
      uz: "Vanilli muzqaymoq",
      ru: "Ванильное мороженое",
      en: "Vanilla ice cream",
    },
    price: 15000,
    image: "/placeholder.svg?height=200&width=200",
    category: "desserts",
    stock: 14,
  },
];

// Dynamic menuItems array that can be modified
export let menuItems: MenuItem[] = [...defaultMenuItems];

export const stockManager = {
  getStock: (itemId: string): number => {
    const item = menuItems.find((item) => item.id === itemId);
    return item?.stock || 0;
  },

  updateStock: (itemId: string, quantity: number): boolean => {
    const itemIndex = menuItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return false;

    const newStock = menuItems[itemIndex].stock - quantity;
    if (newStock < 0) return false;

    menuItems[itemIndex].stock = newStock;

    // Save to localStorage when stock is updated
    adminManager.saveToStorage();
    return true;
  },

  isInStock: (itemId: string, requestedQuantity = 1): boolean => {
    const item = menuItems.find((item) => item.id === itemId);
    return item ? item.stock >= requestedQuantity : false;
  },
};

export const adminManager = {
  getAllProducts: (): MenuItem[] => {
    // Always return current menuItems (which includes localStorage data)
    return [...menuItems];
  },

  addProduct: (product: MenuItem): boolean => {
    try {
      menuItems.push(product);
      adminManager.saveToStorage();
      // Trigger multiple events to ensure all components are notified
      adminManager.triggerAllEvents();
      return true;
    } catch (error) {
      console.error("Error adding product:", error);
      return false;
    }
  },

  updateProduct: (productId: string, updatedProduct: MenuItem): boolean => {
    try {
      const index = menuItems.findIndex((item) => item.id === productId);
      if (index === -1) return false;

      menuItems[index] = updatedProduct;
      adminManager.saveToStorage();
      // Trigger multiple events to ensure all components are notified
      adminManager.triggerAllEvents();
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    }
  },

  deleteProduct: (productId: string): boolean => {
    try {
      const index = menuItems.findIndex((item) => item.id === productId);
      if (index === -1) return false;

      menuItems.splice(index, 1);
      adminManager.saveToStorage();
      // Trigger multiple events to ensure all components are notified
      adminManager.triggerAllEvents();
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  },

  saveToStorage: (): void => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin-menu-items", JSON.stringify(menuItems));
        console.log("Menu items saved to localStorage:", menuItems.length);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  },

  loadFromStorage: (): void => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("admin-menu-items");
        if (stored) {
          const parsedItems = JSON.parse(stored);
          // Clear current items and replace with stored items
          menuItems.splice(0, menuItems.length, ...parsedItems);
          console.log("Menu items loaded from localStorage:", menuItems.length);
        } else {
          console.log("No stored menu items found, using defaults");
        }
      } catch (error) {
        console.error("Error loading from storage:", error);
        // If error, reset to default items
        menuItems.splice(0, menuItems.length, ...defaultMenuItems);
      }
    }
  },

  // Enhanced event triggering with multiple approaches
  triggerAllEvents: (): void => {
    if (typeof window !== "undefined") {
      // Approach 1: Custom event for same-tab updates
      const customEvent = new CustomEvent("menuItemsUpdated", {
        detail: {
          menuItems: [...menuItems],
          timestamp: Date.now(),
        },
      });
      window.dispatchEvent(customEvent);

      // Approach 2: Manual storage event (for same-tab localStorage changes)
      const storageEvent = new StorageEvent("storage", {
        key: "admin-menu-items",
        newValue: JSON.stringify(menuItems),
        storageArea: localStorage,
      });
      window.dispatchEvent(storageEvent);

      // Approach 3: Force a delayed custom event (backup)
      setTimeout(() => {
        const delayedEvent = new CustomEvent("forceMenuUpdate", {
          detail: { menuItems: [...menuItems] },
        });
        window.dispatchEvent(delayedEvent);
      }, 100);

      console.log("All events triggered for menu update");
    }
  },

  // Reset to default items (useful for testing)
  resetToDefault: (): void => {
    menuItems.splice(0, menuItems.length, ...defaultMenuItems);
    adminManager.saveToStorage();
    adminManager.triggerAllEvents();
  },
};

// Initialize from localStorage on load
if (typeof window !== "undefined") {
  adminManager.loadFromStorage();
}
