import * as React from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: string;
};

const ToastContext = React.createContext<{
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: () => void;
}>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = (toast: Omit<Toast, "id">) => {
    setToasts([{ ...toast, id: Date.now().toString() }]);
  };
  const dismiss = () => setToasts([]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}
