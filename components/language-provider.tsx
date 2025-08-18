"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Language = "uz" | "ru" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    // App general
    "app.title": "Tez Ovqat",
    "app.subtitle": "Sevimli taomlaringizni buyurtma qiling",
    "app.bonus": "Yangi & Sifatli Mahsulotlar",
    "app.delivery_only": "Tez Yetkazib berish",
    "app.quantity_g": "Sifat Kafolatlanadi!",
    "app.menu_back": "Orqaga qaytish",
    "app.populars": "⭐ Mashhur",
    "app.stocks": "Sotuvda yo'q",
    "app.stock": "ta qoldi",
    "app.left": " ta qoldi",
    "app.view": "Batafsil ko'rish",
    "app.only": "Faqat ",
    "app.quantitys": "Miqdor",
    "app.quant": "ta qo'shing",
    "app.add": "Savatga",
    "app.total": "Narxi",
    "app.edit": "Tahrirlash",
    "app.pro_name": "Mahsulot nomi",
    "app.pro_desc": "Mahsulot tavsifi haqida ayting",
    "app.pro_des": "Tavsifi",
    "app.manage": "Mahsulotlar boshqaruvi",
    "app.maximum": "- tagacha buyurtma berish mumkin",

    // Navigation
    "nav.menu": "Menyu",
    "nav.cart": "Savatcha",
    "nav.orders": "Buyurtmalar",

    // Alerts
    "alert.cash_only": "Buyurtma faqat naqd pulda",
    "alert.ok": "OK",
    "alert.location_permission": "Joylashuvga ruxsat berasizmi?",
    "alert.allow": "Ruxsat berish",
    "alert.deny": "Rad etish",

    // Form
    "form.name": "Ism",
    "form.phone": "Telefon",
    "form.address": "Manzil",
    "form.location": "Joylashuv",
    "form.required": "Majburiy maydon",
    "form.save_details": "Ma'lumotlarni saqlash",
    "form.delivery_details": "Yetkazib berish ma'lumotlari",
    "form.order_summary": "Buyurtma xulosasi",
    "form.select_location": "Joylashuvni tanlang",
    "form.select_on_map": "Xaritada tanlash",
    "form.search_location": "Joylashuvni qidirish...",
    "form.map_instructions":
      "Yetkazib berish joyini tanlash uchun xaritaning istalgan joyini bosing",
    "form.selected_location": "Tanlangan joylashuv",
    "form.confirm_location": "Joylashuvni tasdiqlash",

    // Cart
    "cart.empty": "Savatcha bo'sh",
    "cart.total": "Jami",
    "cart.order_now": "Buyurtma berish",
    "cart.add_to_cart": "Savatchaga qo'shish",

    // Menu categories
    "category.all": "Hammasi",
    "category.popular": "Mashhur",

    // Theme
    "theme.light": "Yorug'",
    "theme.dark": "Qorong'u",
    "theme.system": "Tizim",

    // Product Customization
    "product.customize": "O'zgartirishlar kiritasizmi?",
    "product.customization_placeholder":
      "Ko'proq ketchup, kamroq mayonez qo'shing!",
    "product.customization_label": "Maxsus talablar",
    "product.no_customization": "Maxsus talablar yo'q",

    // Order Success
    "order.success_title": "Buyurtma muvaffaqiyatli yuborildi!",
    "order.success_message": "Sizning buyurtmangizni tayyorlamoqdamiz!",
    "order.contact_soon":
      "Yetkazib berish tafsilotlarini tasdiqlash uchun tez orada siz bilan bog'lanamiz.",

    // Telegram
    "telegram.configured": "Tez orada siz bilan bog'lanamiz",
    "telegram.manual_mode": "Qo'lda rejim",
    "telegram.message_preview": "Buyurtma tafsilotlari:",
    "telegram.auto_sent": "Tez orada Kuryer siz bilan bog'lanadi!.",
    "telegram.manual_required": "Telegram sozlanmagan - qo'lda nusxalash kerak",
    "telegram.copy_message": "Buyurtma xabarini nusxalash",
    "telegram.copied": "Nusxalandi!",
    "telegram.copy_instructions":
      "Yuqoridagi xabarni nusxalab, biznes Telegram chatiga yoki botga yuboring.",
    "telegram.view_in_telegram": "Telegramda ko'rish",

    // Common
    "common.close": "Yopish",
  },
  ru: {
    // App general
    "app.title": "Быстрая Еда",
    "app.subtitle": "Заказывайте любимые блюда",
    "app.bonus": "Новые и качественные продукты",
    "app.delivery_only": "Быстрая доставка",
    "app.quantity_g": "Гарантия качества!",
    "app.menu_back": "Назад",
    "app.populars": "⭐ Популярное",
    "app.stocks": "Нет в продаже",
    "app.stock": " осталось",
    "app.left": " осталось",
    "app.view": "Подробнее",
    "app.only": "Только ",
    "app.quantitys": "Количество",
    "app.quant": "добавить",
    "app.add": "В корзину",
    "app.total": "Цена",
    "app.edit": "Редактировать",
    "app.pro_name": "Название продукта",
    "app.pro_desc": "Опишите продукт",
    "app.pro_des": "Описание",
    "app.manage": "Управление продуктами",
    "app.maximum": "Можно заказать до - штук",

    // Navigation
    "nav.menu": "Меню",
    "nav.cart": "Корзина",
    "nav.orders": "Заказы",

    // Alerts
    "alert.cash_only": "Заказ только за наличные",
    "alert.ok": "OK",
    "alert.location_permission": "Разрешить доступ к местоположению?",
    "alert.allow": "Разрешить",
    "alert.deny": "Отклонить",

    // Form
    "form.name": "Имя",
    "form.phone": "Телефон",
    "form.address": "Адрес",
    "form.location": "Местоположение",
    "form.required": "Обязательное поле",
    "form.save_details": "Сохранить данные",
    "form.delivery_details": "Детали доставки",
    "form.order_summary": "Сводка заказа",
    "form.select_location": "Выберите местоположение",
    "form.select_on_map": "Выбрать на карте",
    "form.search_location": "Поиск местоположения...",
    "form.map_instructions":
      "Нажмите в любом месте карты, чтобы выбрать место доставки",
    "form.selected_location": "Выбранное местоположение",
    "form.confirm_location": "Подтвердить местоположение",

    // Cart
    "cart.empty": "Корзина пуста",
    "cart.total": "Итого",
    "cart.order_now": "Заказать",
    "cart.add_to_cart": "В корзину",

    // Menu categories
    "category.all": "Все",
    "category.popular": "Популярное",

    // Theme
    "theme.light": "Светлая",
    "theme.dark": "Тёмная",
    "theme.system": "Системная",

    // Product Customization
    "product.customize": "Хотите внести изменения?",
    "product.customization_placeholder":
      "Добавить больше кетчупа, меньше майонеза!",
    "product.customization_label": "Особые требования",
    "product.no_customization": "Особых требований нет",

    // Order Success
    "order.success_title": "Заказ успешно отправлен!",
    "order.success_message": "Ваш заказ готовится!",
    "order.contact_soon":
      "Мы свяжемся с вами в ближайшее время для подтверждения деталей доставки.",

    // Telegram
    "telegram.configured": "Скоро мы свяжемся с вами",
    "telegram.manual_mode": "Ручной режим",
    "telegram.message_preview": "Детали заказа:",
    "telegram.auto_sent": "Скоро курьер свяжется с вами!.",
    "telegram.manual_required":
      "Telegram не настроен - требуется ручное копирование",
    "telegram.copy_message": "Копировать сообщение заказа",
    "telegram.copied": "Скопировано!",
    "telegram.copy_instructions":
      "Скопируйте сообщение выше и отправьте его в бизнес Telegram чат или бот.",
    "telegram.view_in_telegram": "Посмотреть в Telegram",

    // Common
    "common.close": "Закрыть",
  },
  en: {
    // App general
    "app.title": "Fast Food",
    "app.subtitle": "Order your favorite meals",
    "app.bonus": "New & High-Quality Products",
    "app.delivery_only": "Fast Delivery",
    "app.quantity_g": "Quality Guaranteed!",
    "app.menu_back": "Back",
    "app.populars": "⭐ Popular",
    "app.stocks": "Out of stock",
    "app.stock": " left",
    "app.left": " left",
    "app.view": "View Details",
    "app.only": "Only ",
    "app.quantitys": "Quantity",
    "app.quant": "add",
    "app.add": "Add to Cart",
    "app.total": "Price",
    "app.edit": "Edit",
    "app.pro_name": "Product Name",
    "app.pro_desc": "Describe the product",
    "app.pro_des": "Description",
    "app.manage": "Product Management",
    "app.maximum": "You can order up to - items",

    // Navigation
    "nav.menu": "Menu",
    "nav.cart": "Cart",
    "nav.orders": "Orders",

    // Alerts
    "alert.cash_only": "Order only with cash",
    "alert.ok": "OK",
    "alert.location_permission": "Allow location access?",
    "alert.allow": "Allow",
    "alert.deny": "Deny",

    // Form
    "form.name": "Name",
    "form.phone": "Phone",
    "form.address": "Address",
    "form.location": "Location",
    "form.required": "Required field",
    "form.save_details": "Save details",
    "form.delivery_details": "Delivery Details",
    "form.order_summary": "Order Summary",
    "form.select_location": "Select Your Location",
    "form.select_on_map": "Select on Map",
    "form.search_location": "Search for a location...",
    "form.map_instructions":
      "Click anywhere on the map to select your delivery location",
    "form.selected_location": "Selected Location",
    "form.confirm_location": "Confirm Location",

    // Cart
    "cart.empty": "Cart is empty",
    "cart.total": "Total",
    "cart.order_now": "Order Now",
    "cart.add_to_cart": "Add to Cart",

    // Menu categories
    "category.all": "All",
    "category.popular": "Popular",

    // Theme
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    // Product Customization
    "product.customize": "Do you want to make changes?",
    "product.customization_placeholder": "Add more ketchup, less mayonnaise!",
    "product.customization_label": "Special Requirements",
    "product.no_customization": "No special requirements",

    // Order Success
    "order.success_title": "Order Submitted Successfully!",
    "order.success_message": "We are preparing your order!",
    "order.contact_soon":
      "We will contact you soon to confirm delivery details.",

    // Telegram
    "telegram.configured": "We will contact you soon",
    "telegram.manual_mode": "Manual Mode",
    "telegram.message_preview": "Order Details:",
    "telegram.auto_sent": "Courier will contact you soon!.",
    "telegram.manual_required":
      "Telegram not configured - manual copy required",
    "telegram.copy_message": "Copy Order Message",
    "telegram.copied": "Copied!",
    "telegram.copy_instructions":
      "Copy the message above and send it to your business Telegram chat or bot.",
    "telegram.view_in_telegram": "View in Telegram",

    // Common
    "common.close": "Close",
  },
};


const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedLanguage = localStorage.getItem("fastfood-language") as Language;
    if (savedLanguage && ["uz", "ru", "en"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (isHydrated) {
      localStorage.setItem("fastfood-language", lang);
    }
  };

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
