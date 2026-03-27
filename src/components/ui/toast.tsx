"use client";

import { useEffect, useState } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toastQueue: Toast[] = [];
let listeners: ((toast: Toast | null) => void)[] = [];

export function showToast(
  message: string,
  type: "success" | "error" | "info" = "success",
) {
  const id = Math.random().toString(36).substr(2, 9);
  const toast: Toast = { id, message, type };
  toastQueue.push(toast);
  notifyListeners();

  // 5 秒後に自動削除
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    notifyListeners();
  }, 3000);
}

function notifyListeners() {
  const currentToast = toastQueue.length > 0 ? toastQueue[0] : null;
  listeners.forEach((listener) => listener(currentToast));
}

export function useToast() {
  const [currentToast, setCurrentToast] = useState<Toast | null>(null);

  useEffect(() => {
    const listener = (toast: Toast | null) => setCurrentToast(toast);
    listeners.push(listener);
    setCurrentToast(toastQueue.length > 0 ? toastQueue[0] : null);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return currentToast;
}

export function ToastContainer() {
  const toast = useToast();

  if (!toast) return null;

  const bgColor =
    toast.type === "success"
      ? "bg-green-500"
      : toast.type === "error"
        ? "bg-red-500"
        : "bg-blue-500";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up`}
      >
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
