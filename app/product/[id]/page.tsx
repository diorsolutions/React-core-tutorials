"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Minus, ShoppingCart, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/language-provider";
import { menuItems, stockManager, type MenuItem } from "@/lib/menu-data";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

type CartItem = MenuItem & { quantity: number; customization?: string };

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customization, setCustomization] = useState("");

  useEffect(() => {
    const foundProduct = menuItems.find((item) => item.id === params.id);
    setProduct(foundProduct || null);
  }, [params.id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;

    const maxQuantity = Math.min(10, product.stock);
    const validQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
    setQuantity(validQuantity);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsLoading(true);

    // Check stock availability
    if (!stockManager.isInStock(product.id, quantity)) {
      toast({
        title: `{t("app.out_stock")}`,
        description: `Only ${product.stock} items available`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Add to cart
    const currentCart = storage.getCart() as CartItem[];
    const existingItem = currentCart.find((item) => item.id === product.id);

    let updatedCart: CartItem[];
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (!stockManager.isInStock(product.id, newQuantity)) {
        toast({
          title: "Insufficient Stock",
          description: `Cannot add ${quantity} more items. Only ${
            product.stock - existingItem.quantity
          } available`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      updatedCart = currentCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: newQuantity,
              customization: customization || item.customization,
            }
          : item
      );
    } else {
      updatedCart = [
        ...currentCart,
        { ...product, quantity, customization: customization || undefined },
      ];
    }

    storage.setCart(updatedCart);

    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name[language]} added to cart`,
    });

    setIsLoading(false);

    // Navigate back to main page
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("app.back")}
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("app.back")}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name[language]}
                  className="w-full h-96 object-cover"
                />
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-[#302dbb]">
                  {product.name[language]}
                </h1>
                {product.popular && (
                  <Badge className="bg-[#302dbb] hover:bg-[#302dbb]/90">
                    {t("app.popularity")}
                  </Badge>
                )}
              </div>

              <p className="text-lg text-muted-foreground mb-4">
                {product.description[language]}
              </p>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-[#302dbb]">
                  {formatPrice(product.price)}
                </span>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {isOutOfStock ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                  ) : isLowStock ? (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800"
                    >
                      Faqat {product.stock} {t("app.stock")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-black text-[15px]"
                    >
                      {product.stock} {t("app.stock")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("app.quantity")}
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <span className="text-xl font-semibold min-w-[3rem] text-center">
                      {quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= Math.min(10, product.stock)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    Faqat {Math.min(10, product.stock)} {t("app.maximumOrder")}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomization(!showCustomization)}
                    className="flex items-center gap-2 text-[#302dbb] hover:text-[#302dbb]/80 transition-colors text-sm font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    {t("product.customize")}
                  </button>

                  {showCustomization && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <Label
                        htmlFor="customization"
                        className="text-sm font-medium"
                      >
                        {t("product.customization_label")}
                      </Label>
                      <Textarea
                        id="customization"
                        placeholder={t("product.customization_placeholder")}
                        value={customization}
                        onChange={(e) => setCustomization(e.target.value)}
                        className="min-h-[80px] resize-none"
                        maxLength={200}
                      />
                      <p className="text-xs text-muted-foreground">
                        {customization.length}/200 {t("app.characters")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Total Price */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-2xl font-bold text-[#302dbb]">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                  {customization && (
                    <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">
                          {t("product.customization_label")}:
                        </span>{" "}
                        {customization}
                      </p>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={isLoading || isOutOfStock}
                  className="w-full bg-[#302dbb] hover:bg-[#302dbb]/90 text-white py-6 text-lg"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isLoading ? "Qo'shilmoqda..." : `${t("app.cart")} ${quantity} ${t("app.add_cart")}`}
                </Button>
              </div>
            )}

            {isOutOfStock && (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground mb-4">
                  This item is currently out of stock
                </p>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  size="lg"
                >
                  Browse Other Items
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
