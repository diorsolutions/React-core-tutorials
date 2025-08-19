"use client"

import { CheckCircle, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useState } from "react"

interface OrderSuccessDialogProps {
  isOpen: boolean
  onClose: () => void
  orderData: {
    orderId: string
    message: string
    telegramUrl?: string
    isConfigured: boolean
  }
}

export function OrderSuccessDialog({ isOpen, onClose, orderData }: OrderSuccessDialogProps) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(orderData.message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleOpenTelegram = () => {
    if (orderData.telegramUrl) {
      window.open(orderData.telegramUrl, "_blank")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-[#302dbb]">
            {t("order.success_title") || "Order Submitted Successfully!"}
          </CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="text-[#302dbb]">
              Order #{orderData.orderId}
            </Badge>
            {orderData.isConfigured ? (
              <Badge className="bg-green-500 hover:bg-green-600">{t("telegram.configured") || "Telegram Ready"}</Badge>
            ) : (
              <Badge variant="secondary">{t("telegram.manual_mode") || "Manual Mode"}</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              {t("order.success_message") || "Your order has been prepared and is ready to be sent to our team."}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("order.contact_soon") || "We will contact you soon to confirm delivery details."}
            </p>
          </div>

          {/* Order Message Preview */}
          {/* <div className="space-y-3">
            <h4 className="font-semibold">{t("telegram.message_preview") || "Order Details:"}</h4>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">{orderData.message}</pre>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="space-y-3">
            {orderData.isConfigured ? (
              <div className="space-y-2">
                <p className="text-sm text-center text-green-600 font-medium">
                  ✅ {t("telegram.auto_sent") || "This order will be automatically sent to your Telegram bot."}
                </p>
                {/* {orderData.telegramUrl && (
                  <Button onClick={handleOpenTelegram} className="w-full bg-transparent" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("telegram.view_in_telegram") || "View in Telegram"}
                  </Button>
                )} */}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-amber-600 font-medium">
                  ⚠️ {t("telegram.manual_required") || "Telegram not configured - manual copy required"}
                </p>
                <Button onClick={handleCopyMessage} className="w-full bg-transparent" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? t("telegram.copied") || "Copied!" : t("telegram.copy_message") || "Copy Order Message"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {t("telegram.copy_instructions") ||
                    "Copy the message above and send it to your business Telegram chat or bot."}
                </p>
              </div>
            )}
          </div>

          <Button onClick={onClose} className="w-full bg-[#302dbb] hover:bg-[#302dbb]/90">
            {t("common.close") || "Close"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
