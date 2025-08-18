export interface MenuItem {
  id: string
  name: {
    uz: string
    ru: string
    en: string
  }
  description: {
    uz: string
    ru: string
    en: string
  }
  price: number
  image: string
  category: string
  popular?: boolean
  stock: number
}

export interface MenuCategory {
  id: string
  name: {
    uz: string
    ru: string
    en: string
  }
  icon: string
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
]

export const menuItems: MenuItem[] = [
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
]

export const stockManager = {
  getStock: (itemId: string): number => {
    const item = menuItems.find((item) => item.id === itemId)
    return item?.stock || 0
  },

  updateStock: (itemId: string, quantity: number): boolean => {
    const itemIndex = menuItems.findIndex((item) => item.id === itemId)
    if (itemIndex === -1) return false

    const newStock = menuItems[itemIndex].stock - quantity
    if (newStock < 0) return false

    menuItems[itemIndex].stock = newStock
    return true
  },

  isInStock: (itemId: string, requestedQuantity = 1): boolean => {
    const item = menuItems.find((item) => item.id === itemId)
    return item ? item.stock >= requestedQuantity : false
  },
}

export const adminManager = {
  getAllProducts: (): MenuItem[] => {
    return [...menuItems]
  },

  addProduct: (product: MenuItem): boolean => {
    try {
      menuItems.push(product)
      adminManager.saveToStorage()
      return true
    } catch (error) {
      console.error("Error adding product:", error)
      return false
    }
  },

  updateProduct: (productId: string, updatedProduct: MenuItem): boolean => {
    try {
      const index = menuItems.findIndex((item) => item.id === productId)
      if (index === -1) return false

      menuItems[index] = updatedProduct
      adminManager.saveToStorage()
      return true
    } catch (error) {
      console.error("Error updating product:", error)
      return false
    }
  },

  deleteProduct: (productId: string): boolean => {
    try {
      const index = menuItems.findIndex((item) => item.id === productId)
      if (index === -1) return false

      menuItems.splice(index, 1)
      adminManager.saveToStorage()
      return true
    } catch (error) {
      console.error("Error deleting product:", error)
      return false
    }
  },

  saveToStorage: (): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin-menu-items", JSON.stringify(menuItems))
    }
  },

  loadFromStorage: (): void => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin-menu-items")
      if (stored) {
        try {
          const parsedItems = JSON.parse(stored)
          menuItems.splice(0, menuItems.length, ...parsedItems)
        } catch (error) {
          console.error("Error loading from storage:", error)
        }
      }
    }
  },
}

if (typeof window !== "undefined") {
  adminManager.loadFromStorage()
}
