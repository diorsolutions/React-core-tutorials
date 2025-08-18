"use client";

import type React from "react";
import { ImageUpload } from "@/components/image-upload";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { adminManager, type MenuItem } from "@/lib/menu-data";
import { useLanguage } from "@/components/language-provider";

interface LoginAttempt {
  timestamp: number;
  ip: string;
}

interface AdminSession {
  isAuthenticated: boolean;
  loginTime: number;
}

const ADMIN_CREDENTIALS = {
  username: "cheffhotdog",
  password: "bestanyone",
};

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export default function AdminControlPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Check authentication and blocking status on mount
  useEffect(() => {
    checkAuthStatus();
    checkBlockStatus();
    setProducts(adminManager.getAllProducts());
  }, []);

  // Update block timer
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1000) {
            setIsBlocked(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isBlocked, blockTimeRemaining]);

  const getClientIP = () => {
    // In a real application, you'd get this from the server
    // For demo purposes, we'll use a mock IP
    return "192.168.1.1";
  };

  const checkAuthStatus = () => {
    const session = localStorage.getItem("admin-session");
    if (session) {
      const sessionData: AdminSession = JSON.parse(session);
      const now = Date.now();
      if (
        sessionData.isAuthenticated &&
        now - sessionData.loginTime < SESSION_DURATION
      ) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("admin-session");
      }
    }
  };

  const checkBlockStatus = () => {
    const attempts = localStorage.getItem("login-attempts");
    if (attempts) {
      const attemptData: LoginAttempt[] = JSON.parse(attempts);
      const clientIP = getClientIP();
      const recentAttempts = attemptData.filter(
        (attempt) =>
          attempt.ip === clientIP &&
          Date.now() - attempt.timestamp < BLOCK_DURATION
      );

      if (recentAttempts.length >= MAX_ATTEMPTS) {
        const oldestAttempt = recentAttempts[0];
        const timeRemaining =
          BLOCK_DURATION - (Date.now() - oldestAttempt.timestamp);
        if (timeRemaining > 0) {
          setIsBlocked(true);
          setBlockTimeRemaining(timeRemaining);
        }
      }
    }
  };

  const recordLoginAttempt = () => {
    const attempts = localStorage.getItem("login-attempts");
    const attemptData: LoginAttempt[] = attempts ? JSON.parse(attempts) : [];
    const clientIP = getClientIP();

    attemptData.push({
      timestamp: Date.now(),
      ip: clientIP,
    });

    // Keep only recent attempts
    const recentAttempts = attemptData.filter(
      (attempt) => Date.now() - attempt.timestamp < BLOCK_DURATION
    );

    localStorage.setItem("login-attempts", JSON.stringify(recentAttempts));

    if (
      recentAttempts.filter((a) => a.ip === clientIP).length >= MAX_ATTEMPTS
    ) {
      setIsBlocked(true);
      setBlockTimeRemaining(BLOCK_DURATION);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      setLoginError("Access blocked due to too many failed attempts");
      return;
    }

    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      const sessionData: AdminSession = {
        isAuthenticated: true,
        loginTime: Date.now(),
      };
      localStorage.setItem("admin-session", JSON.stringify(sessionData));
      localStorage.removeItem("login-attempts"); // Clear attempts on successful login
      setIsAuthenticated(true);
      setLoginError("");
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });
    } else {
      recordLoginAttempt();
      setLoginError("Invalid credentials");
      setLoginForm({ username: "", password: "" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-session");
    setIsAuthenticated(false);
    setLoginForm({ username: "", password: "" });
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAddProduct = () => {
    const newProduct: MenuItem = {
      id: `product-${Date.now()}`,
      name: { uz: "", ru: "", en: "" },
      description: { uz: "", ru: "", en: "" },
      price: 0,
      image: "",
      category: "burgers",
      stock: 0,
      popular: false,
    };
    setEditingProduct(newProduct);
    setShowProductDialog(true);
  };

  const handleEditProduct = (product: MenuItem) => {
    setEditingProduct({ ...product });
    setShowProductDialog(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const success = adminManager.deleteProduct(productId);
      if (success) {
        setProducts(adminManager.getAllProducts());
        toast({
          title: "Product Deleted",
          description: "Product has been removed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    // Basic validation
    if (
      !editingProduct.name.en ||
      !editingProduct.price ||
      editingProduct.stock < 0
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      let success = false;
      const isNewProduct = editingProduct.id.startsWith("product-");

      if (isNewProduct) {
        success = adminManager.addProduct(editingProduct);
      } else {
        success = adminManager.updateProduct(editingProduct.id, editingProduct);
      }

      if (success) {
        setProducts(adminManager.getAllProducts());
        toast({
          title: isNewProduct ? "Product Added" : "Product Updated",
          description: `Product has been ${
            isNewProduct ? "added" : "updated"
          } successfully`,
        });
        setShowProductDialog(false);
        setEditingProduct(null);
      } else {
        toast({
          title: "Error",
          description: `Failed to ${isNewProduct ? "add" : "update"} product`,
          variant: "destructive",
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#302dbb] rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#302dbb]">
              Admin Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isBlocked ? (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Access blocked due to too many failed attempts. Try again in{" "}
                  {formatTime(blockTimeRemaining)}.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="Enter username"
                    disabled={isBlocked}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Enter password"
                      disabled={isBlocked}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isBlocked}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {loginError && (
                  <Alert className="border-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-destructive">
                      {loginError}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#302dbb] hover:bg-[#302dbb]/90"
                  disabled={isBlocked}
                >
                  Sign In
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#302dbb] rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[#302dbb]">
                Admin Control Panel
              </h1>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Add Product Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("app.manage")}</h2>
            <Button
              onClick={handleAddProduct}
              className="bg-[#302dbb] hover:bg-[#302dbb]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name.en}
                    className="w-full h-48 object-cover"
                  />
                  {product.popular && (
                    <Badge className="absolute top-2 right-2 bg-[#302dbb]">
                      {t("app.populars")}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{product.name.en}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description.en}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#302dbb]">
                        {new Intl.NumberFormat("uz-UZ").format(product.price)}{" "}
                        so'm
                      </span>
                      <Badge variant="secondary">
                        {product.stock} {t("app.stock")}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleEditProduct(product)}
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:text-shadow-amber-500 cursor-pointer"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t("app.edit")}
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct?.id.startsWith("product-")
                ? "Yangi Mahsulot Qo'shish"
                : "Mahsulotni Tahrirlash"}
            </DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Uzbek</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name-uz">{t("app.pro_name")}</Label>
                    <Input
                      id="name-uz"
                      value={editingProduct.name.uz}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev
                            ? {
                                ...prev,
                                name: { ...prev.name, uz: e.target.value },
                              }
                            : null
                        )
                      }
                      placeholder="Mahsulotning nomi nima?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description-uz">{t("app.pro_des")}</Label>
                    <Textarea
                      id="description-uz"
                      value={editingProduct.description.uz}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev
                            ? {
                                ...prev,
                                description: {
                                  ...prev.description,
                                  uz: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                      placeholder={t("app.pro_desc")}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Narxi (so'm) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev
                          ? {
                              ...prev,
                              price: Number.parseInt(e.target.value) || 0,
                            }
                          : null
                      )
                    }
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Qancha mavjud? *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev
                          ? {
                              ...prev,
                              stock: Number.parseInt(e.target.value) || 0,
                            }
                          : null
                      )
                    }
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={editingProduct.popular || false}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev
                          ? {
                              ...prev,
                              popular: e.target.checked,
                            }
                          : null
                      )
                    }
                    className="rounded"
                  />
                  <Label htmlFor="popular">Mashhurmi?</Label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <ImageUpload
                  value={editingProduct.image}
                  onChange={(url) =>
                    setEditingProduct((prev) =>
                      prev
                        ? {
                            ...prev,
                            image: url,
                          }
                        : null
                    )
                  }
                  label="Mahsulotning rasmini yuklang"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  iloji boricha rasmni bo'sh qoldrimaslikka harakat qiling!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveProduct}
                  disabled={isLoading}
                  className="bg-[#302dbb] hover:bg-[#302dbb]/90 flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Product"}
                </Button>
                <Button
                  onClick={() => setShowProductDialog(false)}
                  variant="outline"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
