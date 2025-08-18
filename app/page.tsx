"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { MenuItemCard } from "@/components/menu-item-card";
import { CartSidebar, type CartItem } from "@/components/cart-sidebar";
import { CashOnlyAlert } from "@/components/cash-only-alert";
import { UserDetailsForm } from "@/components/user-details-form";
import { LocationPermissionDialog } from "@/components/location-permission-dialog";
import { OrderSuccessDialog } from "@/components/order-success-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { storage } from "@/lib/storage";
import { menuCategories, menuItems, type MenuItem } from "@/lib/menu-data";
import { telegramService } from "@/lib/telegram-service";
import { useLanguage } from "@/components/language-provider";

export default function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCashAlert, setShowCashAlert] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    setIsHydrated(true);
    const savedCart = storage.getCart();
    setCartItems(savedCart);

    // Simulate loading for smooth animation
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      storage.setCart(cartItems);
    }
  }, [cartItems, isHydrated]);

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCashAlert(true);
  };

  const handleCashAlertConfirm = () => {
    setShowCashAlert(false);

    const savedDetails = storage.getUserDetails();
    if (
      savedDetails &&
      savedDetails.name &&
      savedDetails.phone &&
      savedDetails.address
    ) {
      setShowLocationDialog(true);
    } else {
      setShowUserForm(true);
    }
  };

  const handleLocationAllow = () => {
    setShowLocationDialog(false);
    const savedDetails = storage.getUserDetails();
    if (savedDetails) {
      handleOrderSubmit(savedDetails);
    }
  };

  const handleLocationDeny = () => {
    setShowLocationDialog(false);
    const savedDetails = storage.getUserDetails();
    if (savedDetails) {
      handleOrderSubmit(savedDetails);
    }
  };

  const handleOrderSubmit = async (userDetails: any) => {
    setShowUserForm(false);

    const telegramResult = telegramService.prepareOrder(
      cartItems,
      userDetails,
      language
    );

    console.log("📋 Order prepared for Telegram:", telegramResult);

    let sendResult;
    if (telegramResult.isConfigured) {
      sendResult = await telegramService.sendOrder(telegramResult.orderData);
      console.log("📤 Telegram send result:", sendResult);
    }

    setOrderResult({
      orderId: telegramResult.orderData.orderId,
      message: telegramResult.message,
      telegramUrl: telegramResult.telegramUrl,
      isConfigured: telegramResult.isConfigured,
      sendResult,
    });

    setCartItems([]);
    storage.setCart([]);

    setShowOrderSuccess(true);
  };

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground animate-pulse-slow">
            Tayyormisiz..?!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemsCount={totalCartItems}
        onCartClick={() => setShowCart(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12 animate-slide-up">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-primary">
              {t("app.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("app.subtitle")}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{t("app.bonus")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#302DBB] rounded-full animate-pulse"></div>
              <span>{t("app.delivery_only")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span>{t("app.quantity_g")}</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center animate-slide-up">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={`btn-primary hover-scale ${
              selectedCategory === "all" ? "shadow-lg" : ""
            }`}
          >
            {t("category.all") || "All"}
          </Button>
          {menuCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`btn-primary hover-scale transition-all duration-200 ${
                selectedCategory === category.id ? "shadow-lg" : ""
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name[language]}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MenuItemCard item={item} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>

        {/* Popular Items Section */}
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-3xl font-bold text-foreground">
              {t("category.popular") || "Popular Items"}
            </h3>
            <Badge className="bg-brand-accent text-accent-foreground animate-wiggle shadow-lg">
              ⭐ Trending
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems
              .filter((item) => item.popular)
              .map((item, index) => (
                <div
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <MenuItemCard item={item} onAddToCart={handleAddToCart} />
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Cash Only Alert */}
      <CashOnlyAlert
        isOpen={showCashAlert}
        onConfirm={handleCashAlertConfirm}
      />

      {/* Location Permission Dialog */}
      <LocationPermissionDialog
        isOpen={showLocationDialog}
        onAllow={handleLocationAllow}
        onDeny={handleLocationDeny}
      />

      {/* User Details Form */}
      {showUserForm && (
        <UserDetailsForm
          cartItems={cartItems}
          onSubmit={handleOrderSubmit}
          onCancel={() => setShowUserForm(false)}
        />
      )}

      {orderResult && (
        <OrderSuccessDialog
          isOpen={showOrderSuccess}
          onClose={() => setShowOrderSuccess(false)}
          orderData={orderResult}
        />
      )}
    </div>
  );
}
