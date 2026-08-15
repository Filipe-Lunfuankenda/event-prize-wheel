/**
 * Toaster Component (shadcn/ui adapted)
 * 
 * A global container that renders active toast notifications.
 * It reads the state from `useToast` and maps over the array of active toasts,
 * rendering each one in the appropriate location defined by `ToastViewport`.
 * 
 * Usually mounted once high up in the component tree (e.g., in App.jsx).
 */

import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {/* Map through all currently active toasts in the state */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {/* Optional Title */}
              {title && <ToastTitle>{title}</ToastTitle>}
              
              {/* Optional Description */}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            
            {/* Optional Action Button */}
            {action}
            
            {/* Standard Dismiss X Button */}
            <ToastClose />
          </Toast>
        );
      })}
      {/* Defines where in the DOM the toasts actually appear (usually fixed bottom-right) */}
      <ToastViewport />
    </ToastProvider>
  );
}