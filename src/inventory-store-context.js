import { createContext, useContext } from "react";

export const InventoryContext = createContext(null);

export function useInventoryStore() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventoryStore must be used within InventoryProvider");
  }
  return context;
}
