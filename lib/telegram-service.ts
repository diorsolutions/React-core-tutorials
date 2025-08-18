import type { CartItem } from "@/components/cart-sidebar"
import { stockManager } from "@/lib/menu-data"

export interface TelegramOrderData {
  orderId: string
  items: CartItem[]
  userDetails: {
    name: string
    phone: string
    address: string
    location?: {
      lat: number
      lng: number
      address: string
    }
  }
  total: number
  timestamp: string
  language: string
}

export interface TelegramConfig {
  botToken?: string
  chatId?: string
  enabled: boolean
}

export class TelegramService {
  private config: TelegramConfig
  private static orderCounter = 0

  constructor() {
    this.config = {
      botToken: "8339267246:AAGJaJMjrvlm8BrBD3-49_ZE5PDpfa7RswQ",
      chatId: "7396846682",
      enabled: true,
    }
  }

  private generateOrderId(): string {
    TelegramService.orderCounter += 1
    const timestamp = new Date().getTime().toString().slice(-6)
    return `ORD${timestamp}`
  }

  /**
   * Format order data for Telegram message
   */
  formatOrderMessage(orderData: TelegramOrderData): string {
    const { orderId, items, userDetails, total, timestamp } = orderData

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
    }

    const date = new Date(timestamp)
    const formattedDate = date
      .toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/(\d+)\/(\d+)\/(\d+),/, "$3-$2-$1")

    let message = `Buyurtma tafsilotlari:\n\n`
    message += `🍔 *NEW FAST FOOD ORDER* #${orderId}\n\n`

    // Customer details
    message += `👤 *Customer Details:*\n`
    message += `• Name: ${userDetails.name}\n`
    message += `• Phone: ${userDetails.phone}\n`
    message += `• Address: ${userDetails.address}\n\n`

    // Location details if available
    if (userDetails.location) {
      message += `📍 *Location Details:*\n`
      message += `• Current Location: ${userDetails.location.lat.toFixed(6)}, ${userDetails.location.lng.toFixed(6)}\n`
      message += `• Coordinates: \`${userDetails.location.lat.toFixed(6)}, ${userDetails.location.lng.toFixed(6)}\`\n`
      message += `• [Open in Google Maps](https://maps.google.com/?q=${userDetails.location.lat},${userDetails.location.lng})\n`
      message += `• [Open in Yandex Maps](https://yandex.com/maps/?ll=${userDetails.location.lng},${userDetails.location.lat}&z=16)\n\n`
    }

    // Order items
    message += `🛒 *Order Items:*\n`
    items.forEach((item, index) => {
      const itemName = item.name.uz || item.name.en
      message += `${index + 1}. *${itemName}*\n`
      message += `   └ Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}\n`
      if (item.customization) {
        message += `   └ 📝 *Special Requirements:* ${item.customization}\n`
      }
    })

    // Total and payment info
    message += `\n💰 *TOTAL: ${formatPrice(total)}*\n`
    message += `💵 *Payment Method: CASH ONLY*\n`
    message += `⏰ *Order Time:* ${formattedDate}\n\n`

    // Action required section
    message += `📋 *Action Required:*\n`
    message += `1. ✅ Confirm order with customer\n`
    message += `2. 🍳 Prepare food items\n`
    message += `3. 🚗 Arrange delivery\n`
    message += `4. 📞 Call customer before delivery\n\n`

    // Quick actions
    message += `⚡ *Quick Actions:*\n`
    message += `• Call: [${userDetails.phone}](tel:${userDetails.phone})\n`
    if (userDetails.location) {
      message += `• Navigate: [Google Maps](https://maps.google.com/?q=${userDetails.location.lat},${userDetails.location.lng})`
    }

    return message
  }

  /**
   * Prepare order data for Telegram (ready to send)
   */
  prepareOrder(
    items: CartItem[],
    userDetails: any,
    language = "en",
  ): {
    orderData: TelegramOrderData
    message: string
    telegramUrl?: string
    isConfigured: boolean
    coordinates?: { latitude: number; longitude: number }
  } {
    const orderId = this.generateOrderId()

    const orderData: TelegramOrderData = {
      orderId,
      items,
      userDetails,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      timestamp: new Date().toISOString(),
      language,
    }

    const message = this.formatOrderMessage(orderData)

    let telegramUrl: string | undefined
    if (this.config.enabled && this.config.botToken && this.config.chatId) {
      try {
        const encodedMessage = encodeURIComponent(message)
        telegramUrl = `https://api.telegram.org/bot${this.config.botToken}/sendMessage?chat_id=${this.config.chatId}&text=${encodedMessage}&parse_mode=Markdown`
      } catch (error) {
        console.error("[v0] Error preparing Telegram URL:", error)
      }
    }

    // Extract coordinates for easy access
    const coordinates = userDetails.location
      ? { latitude: userDetails.location.lat, longitude: userDetails.location.lng }
      : undefined

    return {
      orderData,
      message,
      telegramUrl,
      isConfigured: this.config.enabled,
      coordinates, // Return coordinates separately for integration convenience
    }
  }

  /**
   * Send order to Telegram (enhanced with stock management)
   */
  async sendOrder(orderData: TelegramOrderData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("[v0] 🚀 Preparing to send order to Telegram:")
      console.log("[v0] Order ID:", orderData.orderId)
      console.log("[v0] Customer:", orderData.userDetails.name)
      console.log("[v0] Items count:", orderData.items.length)
      console.log("[v0] Total amount:", orderData.total)

      if (orderData.userDetails.location) {
        console.log("[v0] Location coordinates:", {
          lat: orderData.userDetails.location.lat,
          lng: orderData.userDetails.location.lng,
        })
      }

      for (const item of orderData.items) {
        if (!stockManager.isInStock(item.id, item.quantity)) {
          throw new Error(`Insufficient stock for ${item.name.en}. Only ${stockManager.getStock(item.id)} available.`)
        }
      }

      const response = await fetch(`https://api.telegram.org/bot${this.config.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: this.formatOrderMessage(orderData),
          parse_mode: "Markdown",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Telegram API error:", errorData)
        throw new Error(`Telegram API error: ${response.statusText} - ${errorData.description || "Unknown error"}`)
      }

      const result = await response.json()
      console.log("[v0] ✅ Order successfully sent to Telegram:", result)

      for (const item of orderData.items) {
        stockManager.updateStock(item.id, item.quantity)
        console.log("[v0] Updated stock for", item.name.en, "- remaining:", stockManager.getStock(item.id))
      }

      return {
        success: true,
      }
    } catch (error) {
      console.error("[v0] Telegram send error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  /**
   * Get configuration status
   */
  getConfigStatus(): {
    isConfigured: boolean
    botToken: boolean
    chatId: boolean
    instructions: string[]
  } {
    const instructions = []

    if (!this.config.botToken) {
      instructions.push("1. Create a Telegram bot using @BotFather")
      instructions.push("2. Get your bot token and set NEXT_PUBLIC_TELEGRAM_BOT_TOKEN environment variable")
    }

    if (!this.config.chatId) {
      instructions.push("3. Get your chat ID and set NEXT_PUBLIC_TELEGRAM_CHAT_ID environment variable")
      instructions.push(
        "4. You can get chat ID by messaging your bot and visiting: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates",
      )
    }

    if (this.config.enabled) {
      instructions.push("✅ Telegram integration is ready!")
    }

    return {
      isConfigured: this.config.enabled,
      botToken: !!this.config.botToken,
      chatId: !!this.config.chatId,
      instructions,
    }
  }
}

// Export singleton instance
export const telegramService = new TelegramService()
