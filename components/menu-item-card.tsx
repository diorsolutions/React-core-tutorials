"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";
import type { MenuItem } from "@/lib/menu-data";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { language, t } = useLanguage();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (item.stock < quantity) {
      return;
    }

    setIsAdding(true);
    onAddToCart(item, quantity);

    // Add bounce animation delay
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 600);
  };

  const handleViewProduct = () => {
    router.push(`/product/${item.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const isOutOfStock = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock <= 5;
  const maxQuantity = Math.min(10, item.stock);

  return (
    <Card className="overflow-hidden card-interactive hover-lift group animate-fade-in">
      <div className="relative cursor-pointer" onClick={handleViewProduct}>
        <div className="overflow-hidden">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name[language]}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {item.popular && (
            <Badge className="bg-[#00B0C3] text-white animate-wiggle shadow-lg py-1">
              {t("app.populars")}
            </Badge>
          )}
          {isOutOfStock ? (
            <Badge variant="destructive" className="!bg-red-600 shadow-lg py-1">
              {t("app.stocks")}
            </Badge>
          ) : isLowStock ? (
            <Badge className="text-white shadow-lg animate-pulse-slow">
              {item.stock} {t("app.left")}
            </Badge>
          ) : null}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/95 hover:bg-white text-black shadow-lg animate-scale-in cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-2" />
            {t("app.view")}
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <h3
            className="font-semibold text-lg cursor-pointer hover:text-brand-primary transition-colors duration-200 line-clamp-1"
            onClick={handleViewProduct}
          >
            {item.name[language]}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description[language]}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-brand-primary">
              {formatPrice(item.price)}
            </p>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {isOutOfStock
                ? `${t("app.stocks")}`
                : `${item.stock} ${t("app.left")}`}
            </span>
          </div>
        </div>

        {isOutOfStock ? (
          <Button
            disabled
            className="w-full bg-muted text-muted-foreground cursor-not-allowed"
          >
            {t("app.stocks")}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 hover-scale transition-all duration-200 bg-transparent"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-semibold text-brand-primary">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 hover-scale transition-all duration-200 bg-transparent"
                  onClick={() =>
                    setQuantity(Math.min(maxQuantity, quantity + 1))
                  }
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                className={`btn-primary flex-1 ml-4 ${
                  isAdding ? "animate-bounce-gentle" : ""
                }`}
                disabled={quantity > item.stock || isAdding}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isAdding ? "Qo'shilmoqda..." : t("cart.add_to_cart")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
