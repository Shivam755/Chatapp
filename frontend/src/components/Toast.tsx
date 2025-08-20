"use client";
import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type ToastProps = {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
  duration?: number;
  position?: ToastPosition;
};

type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-middle"
  | "bottom-right"
  | "bottom-left"
  | "bottom-middle";

const toastColors = {
  success: "bg-[#e0e5ec] border-green-400 text-green-700",
  error: "bg-[#e0e5ec] border-red-400 text-red-700",
  info: "bg-[#e0e5ec] border-blue-400 text-blue-700",
};

type ToastContextType = {
  showToast: (
    message: string,
    type?: ToastProps["type"],
    duration?: number,
    position?: ToastPosition
  ) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function getPositionClasses(position: ToastPosition) {
  switch (position) {
    case "top-right":
      return "top-8 right-8 items-end";
    case "top-left":
      return "top-8 left-8 items-start";
    case "top-middle":
      return "top-8 left-1/2 transform -translate-x-1/2 items-center";
    case "bottom-right":
      return "bottom-8 right-8 items-end";
    case "bottom-left":
      return "bottom-8 left-8 items-start";
    case "bottom-middle":
      return "bottom-8 left-1/2 transform -translate-x-1/2 items-center";
    default:
      return "top-8 left-1/2 transform -translate-x-1/2 items-center";
  }
}

// Animation classes based on position
function getToastAnimation(position: ToastPosition, show: boolean) {
  const base = "transition-all duration-300";
  switch (position) {
    case "top-right":
      return `${base} ${show ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"}`;
    case "top-left":
      return `${base} ${show ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"}`;
    case "top-middle":
      return `${base} ${show ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`;
    case "bottom-right":
      return `${base} ${show ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"}`;
    case "bottom-left":
      return `${base} ${show ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"}`;
    case "bottom-middle":
      return `${base} ${show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`;
    default:
      return `${base} ${show ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`;
  }
}

export function ToastProvider({
  children,
  position = "bottom-right",
}: {
  children: ReactNode;
  position?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<
    (ToastProps & { position: ToastPosition })[]
  >([]);

  const showToast = (
    message: string,
    type: ToastProps["type"] = "info",
    duration = 3000,
    toastPosition: ToastPosition = position
  ) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [
      ...prev,
      { id, message, type, duration, position: toastPosition },
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  // Group toasts by position
  const groupedToasts: Record<ToastPosition, ToastProps[]> = {
    "top-right": [],
    "top-left": [],
    "top-middle": [],
    "bottom-right": [],
    "bottom-left": [],
    "bottom-middle": [],
  };
  toasts.forEach((toast) => {
    groupedToasts[toast.position].push(toast);
  });

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {Object.entries(groupedToasts).map(([pos, list]) =>
        list.length > 0 ? (
          <div
            key={pos}
            className={`fixed z-50 flex flex-col ${getPositionClasses(
              pos as ToastPosition
            )}`}
          >
            {list.map((toast) => (
              <Toast
                key={toast.id}
                {...toast}
                position={pos as ToastPosition}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </div>
        ) : null
      )}
    </ToastContext.Provider>
  );
}

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 3000,
  position = "bottom-right",
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    if (onClose) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation before removing
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  return (
    <div
      className={`neumorphic px-6 py-3 rounded-2xl border ${toastColors[type]} shadow-lg flex items-center gap-2 mb-3 ${getToastAnimation(position, show)}`}
      style={{ minWidth: "220px", maxWidth: "90vw" }}
    >
      <span className="flex-1 text-center font-medium">{message}</span>
      {onClose && (
        <span
          className="ml-2 px-2 py-1 rounded-full neumorphic border border-gray-300 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
          onMouseDown={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          aria-label="Close"
        >
          ×
        </span>
      )}
    </div>
  );
}