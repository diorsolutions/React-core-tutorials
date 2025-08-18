"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MapPin } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface LocationPermissionDialogProps {
  isOpen: boolean
  onAllow: () => void
  onDeny: () => void
}

export function LocationPermissionDialog({ isOpen, onAllow, onDeny }: LocationPermissionDialogProps) {
  const { t } = useLanguage()

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-[#302dbb]">
            <MapPin className="h-5 w-5" />
            {t("alert.location_permission")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            We need access to your location to provide accurate delivery service. This will help us find your exact
            address.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDeny}>{t("alert.deny")}</AlertDialogCancel>
          <AlertDialogAction onClick={onAllow} className="bg-[#302dbb] hover:bg-[#302dbb]/90">
            {t("alert.allow")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
