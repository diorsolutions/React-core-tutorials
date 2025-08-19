"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { MenuItemCard } from "@/components/menu-item-card";
import { CartSidebar, type CartItem } from "@/components/cart-sidebar";
import { CashOnlyAlert } from "@/components/cash-only-alert";
import { UserDetailsForm } from "@/components/user-details-form";
import {
  LocationPermissionDialog,
  LocationRequiredAlert,
} from "@/components/location-permission-dialog";
import { OrderSuccessDialog } from "@/components/order-success-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { storage } from "@/lib/storage";
import { menuCategories, adminManager, type MenuItem } from "@/lib/menu-data";
import { telegramService } from "@/lib/telegram-service";
import { useLanguage } from "@/components/language-provider";

export default function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCashAlert, setShowCashAlert] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showLocationRequired, setShowLocationRequired] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [pendingUserDetails, setPendingUserDetails] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render trigger
  const { language, t } = useLanguage();

  useEffect(() => {
    setIsHydrated(true);
    const savedCart = storage.getCart();
    setCartItems(savedCart);

    // Load current menu items from adminManager (which includes localStorage data)
    const currentMenuItems = adminManager.getAllProducts();
    setMenuItems(currentMenuItems);

    // Simulate loading for smooth animation
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  // Enhanced effect to listen for storage changes from admin panel
  useEffect(() => {
    const handleStorageChange = (event?: StorageEvent) => {
      console.log("Storage change detected:", event?.key);

      if (!event || event.key === "admin-menu-items" || event.key === null) {
        // Reload menu items when admin makes changes
        adminManager.loadFromStorage();
        const updatedMenuItems = adminManager.getAllProducts();
        setMenuItems(updatedMenuItems);
        setUpdateTrigger((prev) => prev + 1); // Force re-render
        console.log(
          "Menu items updated from storage:",
          updatedMenuItems.length
        );
      }
    };

    const handleMenuItemsUpdated = (event: CustomEvent) => {
      console.log("Custom menu update event received:", event.detail);
      // Handle same-tab updates from admin panel
      setMenuItems([...event.detail.menuItems]);
      setUpdateTrigger((prev) => prev + 1);
    };

    const handleForceMenuUpdate = (event: CustomEvent) => {
      console.log("Force menu update event received");
      // Handle delayed/forced updates
      const updatedMenuItems = adminManager.getAllProducts();
      setMenuItems(updatedMenuItems);
      setUpdateTrigger((prev) => prev + 1);
    };

    // Listen for storage events (when admin panel updates data in different tab)
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events (when admin panel updates data in same tab)
    window.addEventListener(
      "menuItemsUpdated",
      handleMenuItemsUpdated as EventListener
    );

    // Listen for force update events (backup mechanism)
    window.addEventListener(
      "forceMenuUpdate",
      handleForceMenuUpdate as EventListener
    );

    // Periodic check for updates (fallback mechanism)
    const intervalId = setInterval(() => {
      const currentItems = adminManager.getAllProducts();
      if (JSON.stringify(currentItems) !== JSON.stringify(menuItems)) {
        console.log("Periodic check: Menu items changed, updating...");
        setMenuItems(currentItems);
        setUpdateTrigger((prev) => prev + 1);
      }
    }, 2000); // Check every 2 seconds

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "menuItemsUpdated",
        handleMenuItemsUpdated as EventListener
      );
      window.removeEventListener(
        "forceMenuUpdate",
        handleForceMenuUpdate as EventListener
      );
      clearInterval(intervalId);
    };
  }, [menuItems]); // Add menuItems as dependency

  // Additional effect to handle window focus (when switching back to the tab)
  useEffect(() => {
    const handleFocus = () => {
      console.log("Window focused, checking for menu updates...");
      adminManager.loadFromStorage();
      const updatedMenuItems = adminManager.getAllProducts();
      setMenuItems(updatedMenuItems);
      setUpdateTrigger((prev) => prev + 1);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
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
    // ALWAYS show location permission dialog - never skip this step
    setShowLocationDialog(true);
  };

  const handleLocationAllow = () => {
    setShowLocationDialog(false);

    // Get current location with high accuracy
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("[v0] Location obtained:", { latitude, longitude });

          const locationData = {
            lat: latitude,
            lng: longitude,
            address: `📍 Current Location (${latitude.toFixed(
              6
            )}, ${longitude.toFixed(6)})`,
          };

          // Get user details
          const savedDetails = storage.getUserDetails();

          if (
            savedDetails &&
            savedDetails.name &&
            savedDetails.phone &&
            savedDetails.address
          ) {
            // For returning customers, add location and submit directly
            const userDetailsWithLocation = {
              ...savedDetails,
              location: locationData,
            };
            handleOrderSubmit(userDetailsWithLocation);
          } else {
            // For new customers, store location and show form
            setPendingUserDetails({ location: locationData });
            setShowUserForm(true);
          }
        },
        (error) => {
          console.error("[v0] Location error:", error);
          // If location fails but user allowed, continue without location
          const savedDetails = storage.getUserDetails();

          if (
            savedDetails &&
            savedDetails.name &&
            savedDetails.phone &&
            savedDetails.address
          ) {
            handleOrderSubmit(savedDetails);
          } else {
            setShowUserForm(true);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // Always get fresh location
        }
      );
    } else {
      // Geolocation not supported, continue without location
      const savedDetails = storage.getUserDetails();

      if (
        savedDetails &&
        savedDetails.name &&
        savedDetails.phone &&
        savedDetails.address
      ) {
        handleOrderSubmit(savedDetails);
      } else {
        setShowUserForm(true);
      }
    }
  };

  const handleLocationDeny = () => {
    setShowLocationDialog(false);
    setShowLocationRequired(true);
  };

  const handleLocationRequiredRetry = () => {
    setShowLocationRequired(false);
    setShowLocationDialog(true);
  };

  const handleOrderSubmit = async (userDetails: any) => {
    setShowUserForm(false);

    // Merge any pending location data
    const finalUserDetails = {
      ...userDetails,
      ...(pendingUserDetails && pendingUserDetails.location
        ? { location: pendingUserDetails.location }
        : {}),
    };

    const telegramResult = telegramService.prepareOrder(
      cartItems,
      finalUserDetails,
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
    setPendingUserDetails(null); // Clear pending data

    setShowOrderSuccess(true);
  };

  // Force menu refresh function (can be called manually)
  const refreshMenu = () => {
    console.log("Manual menu refresh triggered");
    adminManager.loadFromStorage();
    const updatedMenuItems = adminManager.getAllProducts();
    setMenuItems(updatedMenuItems);
    setUpdateTrigger((prev) => prev + 1);
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
            Loading delicious menu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" key={updateTrigger}>
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
              <span>{t("app.ingredients")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <span>{t("app.delivery")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span>{t("app.quality")}</span>
            </div>
          </div>

          {/* Debug info (remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-500">
              Menu items count: {menuItems.length} | Update trigger:{" "}
              {updateTrigger}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshMenu}
                className="ml-2"
              >
                Refresh Menu
              </Button>
            </div>
          )}
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
              key={`${item.id}-${updateTrigger}`} // Force re-render with key
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
                  key={`popular-${item.id}-${updateTrigger}`} // Force re-render with key
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

      {/* Location Permission Dialog - ALWAYS shows */}
      <LocationPermissionDialog
        isOpen={showLocationDialog}
        onAllow={handleLocationAllow}
        onDeny={handleLocationDeny}
      />

      {/* Location Required Alert */}
      <LocationRequiredAlert
        isOpen={showLocationRequired}
        onRetry={handleLocationRequiredRetry}
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
