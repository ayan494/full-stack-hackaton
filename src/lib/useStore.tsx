import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loadStore, saveStore, type Role } from "./store";

type Store = ReturnType<typeof loadStore>;

interface Ctx {
  store: Store;
  setStore: (updater: (s: Store) => Store) => void;
  currentUser: Store["users"][number];
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStoreState] = useState<Store>(() => loadStore());

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const setStore = (updater: (s: Store) => Store) =>
    setStoreState((prev) => updater(prev));

  const currentUser = store.users.find((u) => u.id === store.session.userId) ?? store.users[0];

  return (
    <StoreCtx.Provider value={{ store, setStore, currentUser }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export type { Role };
