"use client";

import { Moon, Sun, Globe, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/language-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemsCount, onCartClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        {/* Logo / Title */}
        <div className="flex items-center">
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-[#302dbb] tracking-tight">
              {t("app.title")}
            </h1>
            {/* Subtitle (responsive hidden on small) */}
            <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground">
              {t("app.subtitle")}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 hover:!bg-amber-100"
              >
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => setLanguage("uz")}>
                O'zbek
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ru")}>
                Русский
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 sm:h-10 sm:w-10 hover:!bg-amber-100"
              >
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                {t("theme.light")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                {t("theme.dark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                {t("theme.system")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 sm:h-10 sm:w-10 hover:!bg-amber-100"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {cartItemsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] sm:text-xs !bg-red-600 hover:bg-[#302dbb]/90"
              >
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
