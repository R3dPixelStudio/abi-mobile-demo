import type { StateStorage } from "zustand/middleware";
export const browserStorage: StateStorage = {
  getItem(name) {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(name, value);
    } catch {
      window.dispatchEvent(new Event("abi-storage-error"));
    }
  },
  removeItem(name) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(name);
    } catch {
      window.dispatchEvent(new Event("abi-storage-error"));
    }
  },
};
