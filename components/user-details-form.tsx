"use client";

import type React from "react";
import { useState, useEffect } from "react";
// import { MapPin, User, Phone, Home, Map, Loader2, X, CheckCircle } from "lucide-react"
import {
  MapPin,
  User,
  Phone,
  Home,
  Map,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { InteractiveMap } from "@/components/interactive-map";
import { storage } from "@/lib/storage";
import type { CartItem } from "@/components/cart-sidebar";

interface UserDetails {
  name: string;
  phone: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface UserDetailsFormProps {
  cartItems: CartItem[];
  onSubmit: (details: UserDetails) => void;
  onCancel: () => void;
}

export function UserDetailsForm({
  cartItems,
  onSubmit,
  onCancel,
}: UserDetailsFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<UserDetails>({
    name: "",
    phone: "",
    address: "",
  });
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  const [saveDetails, setSaveDetails] = useState(true);
  interface FormErrors {
    name?: string;
    phone?: string;
    address?: string;
    location?: string;
  }
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLocationRequested, setIsLocationRequested] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setIsVisible(true);

    const savedDetails = storage.getUserDetails();
    if (
      savedDetails &&
      savedDetails.name &&
      savedDetails.phone &&
      savedDetails.address
    ) {
      setFormData(savedDetails);
      setIsReturningCustomer(true);
      console.log("[v0] Returning customer detected:", savedDetails);
    } else {
      console.log("[v0] New customer - showing full form");
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isReturningCustomer) {
      if (!formData.name.trim()) {
        newErrors.name = t("form.required") || "Required field";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.address.trim()) {
        newErrors.address = t("form.required") || "Required field";
      } else if (formData.address.trim().length < 10) {
        newErrors.address = "Please provide a more detailed address";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("form.required") || "Required field";
    } else if (!/^\+?[\d\s\-()]{9,}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: "name" | "phone" | "address",
    value: string
  ) => {
    console.log("[v0] Input change:", field, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleMapLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    console.log("[v0] Map location selected:", location);
    setFormData((prev) => ({ ...prev, location }));
    setShowMap(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Form submission started");

    if (!validateForm()) {
      console.log("[v0] Form validation failed:", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      storage.setUserDetails(formData);
      console.log("[v0] User details saved to localStorage");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit(formData);
    } catch (error) {
      console.error("[v0] Order submission error:", error);
      setErrors({ name: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-all duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div
          className={`bg-background rounded-xl max-w-2xl w-full max-h-[90vh] shadow-2xl transform transition-all duration-300 ${
            isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4 sticky top-0 bg-background/95 backdrop-blur-sm border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-[#302dbb] flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {isReturningCustomer
                      ? t("form.confirm_details") || "Buyurtma tasdiqlash"
                      : t("form.delivery_details") ||
                        "Yetkazib berish ma'lumotlari"}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-3 text-[#302dbb] flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    {cartItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-1"
                      >
                        <span className="text-gray-700">
                          {item.name.en} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-3 font-bold flex justify-between text-[#302dbb]">
                      <span>Jami:</span>
                      <span className="text-lg">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isReturningCustomer && (
                    <>
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2 font-medium"
                        >
                          <User className="h-4 w-4 text-[#302dbb]" />
                          Ism *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Ism"
                          className={`w-full ${
                            errors.name
                              ? "border-red-500 focus:border-red-500 bg-red-50"
                              : "focus:border-[#302dbb] focus:ring-2 focus:ring-[#302dbb]/20"
                          }`}
                          autoComplete="name"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="flex items-center gap-2 font-medium"
                        >
                          <Home className="h-4 w-4 text-[#302dbb]" />
                          Manzil *
                        </Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          placeholder="Manzil"
                          className={`w-full resize-none ${
                            errors.address
                              ? "border-red-500 focus:border-red-500 bg-red-50"
                              : "focus:border-[#302dbb] focus:ring-2 focus:ring-[#302dbb]/20"
                          }`}
                          rows={3}
                          autoComplete="address-line1"
                        />
                        {errors.address && (
                          <p className="text-sm text-red-500">
                            {errors.address}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {isReturningCustomer && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Saqlangan ma'lumotlar
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Ism:</strong> {formData.name}
                        </p>
                        <p>
                          <strong>Manzil:</strong> {formData.address}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsReturningCustomer(false)}
                        className="mt-2 text-xs hover:bg-green-100"
                      >
                        Ma'lumotlarni o'zgartirish
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="flex items-center gap-2 font-medium"
                    >
                      <Phone className="h-4 w-4 text-[#302dbb]" />
                      Telefon *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+998 90 123 45 67"
                      className={`w-full ${
                        errors.phone
                          ? "border-red-500 focus:border-red-500 bg-red-50"
                          : "focus:border-[#302dbb] focus:ring-2 focus:ring-[#302dbb]/20"
                      }`}
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 font-medium">
                      <MapPin className="h-4 w-4 text-[#302dbb]" />
                      Joylashuv (Xaritadan tanlash)
                    </Label>
                    {!formData.location ? (
                      <div className="grid grid-cols-1 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowMap(true)}
                          className="w-full hover:bg-[#302dbb]/5 hover:border-[#302dbb]"
                        >
                          <Map className="h-4 w-4 mr-2" />
                          Xaritada tanlash
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">
                              Location captured:
                            </p>
                            <p className="text-sm text-green-700 font-mono mt-1">
                              {formData.location.address}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Coordinates: {formData.location.lat.toFixed(6)},{" "}
                              {formData.location.lng.toFixed(6)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMap(true)}
                            className="h-auto p-2 text-xs hover:bg-green-100"
                          >
                            Change on Map
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                location: undefined,
                              }))
                            }
                            className="h-auto p-2 text-xs hover:bg-red-100 text-red-600"
                          >
                            Remove location
                          </Button>
                        </div>
                      </div>
                    )}
                    {errors.location && (
                      <p className="text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1 hover:bg-gray-50 bg-transparent"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#302dbb] hover:bg-[#302dbb]/90 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Complete Order"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showMap && (
        <InteractiveMap
          onLocationSelect={handleMapLocationSelect}
          onClose={() => setShowMap(false)}
          initialLocation={formData.location}
        />
      )}
    </>
  );
}
