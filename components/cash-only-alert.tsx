"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLanguage } from "@/components/language-provider"

interface CashOnlyAlertProps {
  isOpen: boolean
  onConfirm: () => void
}

export function CashOnlyAlert({ isOpen, onConfirm }: CashOnlyAlertProps) {
  const { t } = useLanguage()

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#302dbb]">{t("alert.cash_only")}</AlertDialogTitle>
          <AlertDialogDescription>{t("alert.cash_only")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm} className="bg-[#302dbb] hover:bg-[#302dbb]/90">
            {t("alert.ok")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
