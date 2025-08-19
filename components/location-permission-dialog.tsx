import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MapPin, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface LocationPermissionDialogProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPermissionDialog({
  isOpen,
  onAllow,
  onDeny,
}: LocationPermissionDialogProps) {
  const { t } = useLanguage();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t("alert.location_permission") || "Allow location access?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("form.map_instructions") || "We need your location to proceed."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onDeny} className="w-1/2">
            {t("alert.deny") || "Deny"}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={onAllow}
            className="w-1/2 bg-[#302dbb] hover:bg-[#302dbb]/90"
          >
            {t("alert.allow") || "Allow"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface LocationRequiredAlertProps {
  isOpen: boolean;
  onRetry: () => void;
}

export function LocationRequiredAlert({
  isOpen,
  onRetry,
}: LocationRequiredAlertProps) {
  const { t } = useLanguage();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            {t("alert.location_required") || "Joylashuv talab qilinadi"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center py-4">
            {t("alert.location_required_message") ||
              "Manzilingizni avto aniqlashimiz uchun joylashuvga ruxsat berishingiz kerak"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onRetry}
            className="w-full bg-[#302dbb] hover:bg-[#302dbb]/90"
          >
            {t("common.ok") || "OK"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
