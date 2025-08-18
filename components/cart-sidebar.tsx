"use client"

import { X, Minus, Plus, Trash2, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/components/language-provider"
import type { MenuItem } from "@/lib/menu-data"

export interface CartItem extends MenuItem {
  quantity: number
  customization?: string
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
}

export function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) {
  const { language, t } = useLanguage()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            {t("nav.cart")}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">{t("cart.empty")}</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 mt-4">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name[language]}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium text-sm">{item.name[language]}</h4>
                        <p className="text-sm font-semibold text-[#302dbb]">{formatPrice(item.price)}</p>

                        {item.customization && (
                          <div className="bg-muted/50 rounded-md p-2 mt-2">
                            <div className="flex items-start gap-2">
                              <Edit3 className="w-3 h-3 text-[#302dbb] mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-[#302dbb] mb-1">
                                  {t("product.customization_label")}:
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{item.customization}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#302dbb]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive/80"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t("cart.total")}:</span>
                  <span className="font-bold text-lg text-[#302dbb]">{formatPrice(totalPrice)}</span>
                </div>

                <Button
                  onClick={onCheckout}
                  className="w-full bg-[#302dbb] hover:bg-[#302dbb]/90 text-white"
                  disabled={cartItems.length === 0}
                >
                  {t("cart.order_now")}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
