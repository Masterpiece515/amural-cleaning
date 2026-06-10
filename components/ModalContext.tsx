"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ModalCtx {
  isOpen: boolean;
  open: (service?: string) => void;
  close: () => void;
  defaultService: string;
}

export const ModalContext = createContext<ModalCtx>({
  isOpen: false,
  open: () => {},
  close: () => {},
  defaultService: "",
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultService, setDefaultService] = useState("");

  const open = (service = "") => {
    setDefaultService(service);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, open, close, defaultService }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalCtx {
  return useContext(ModalContext);
}
