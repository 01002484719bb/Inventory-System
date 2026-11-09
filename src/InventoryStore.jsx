import { useEffect, useRef, useState } from "react";
import { CARS } from "./data.js";
import { InventoryContext } from "./inventory-store-context.js";

const STORAGE_KEY = "elite-inventory-v1";

function getInitialState() {
  const defaults = { cars: CARS, favorites: [], compare: [], reviews: [] };

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...defaults, storageError: "" };

    const parsed = JSON.parse(saved);
    if (
      !Array.isArray(parsed.cars) ||
      !Array.isArray(parsed.favorites) ||
      !Array.isArray(parsed.compare) ||
      !Array.isArray(parsed.reviews)
    ) {
      throw new Error("بيانات الموقع المحفوظة غير صالحة.");
    }

    return { ...defaults, ...parsed, storageError: "" };
  } catch (error) {
    return {
      ...defaults,
      storageError: `تعذر تحميل بيانات المتصفح: ${error.message}`,
    };
  }
}

export function InventoryProvider({ children }) {
  const [initialStore] = useState(getInitialState);
  const [store, setStore] = useState(() => ({
    cars: initialStore.cars,
    favorites: initialStore.favorites,
    compare: initialStore.compare,
    reviews: initialStore.reviews,
  }));
  const [initialStorageError] = useState(initialStore.storageError);
  const firstSave = useRef(true);

  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }

    let message = "";
    try {
      const { cars, favorites, compare, reviews } = store;
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cars, favorites, compare, reviews }),
      );
    } catch (error) {
      message = `تعذر حفظ التغييرات في المتصفح: ${error.message}`;
    }
    window.dispatchEvent(new CustomEvent("inventory-storage-status", { detail: message }));
  }, [store]);

  return (
    <InventoryContext.Provider
      value={{
        ...store,
        initialStorageError,
        setCars: (cars) => setStore((current) => ({ ...current, cars })),
        setFavorites: (favorites) => setStore((current) => ({ ...current, favorites })),
        setCompare: (compare) => setStore((current) => ({ ...current, compare })),
        setReviews: (reviews) => setStore((current) => ({ ...current, reviews })),
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}
