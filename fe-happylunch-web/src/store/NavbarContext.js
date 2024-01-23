import React, { createContext, useState, useContext } from 'react';

const NavbarContext = createContext();

export function NavbarProvider({ children }) {
  const [reloadNavbar, setReloadNavbar] = useState(false);

  return (
    <NavbarContext.Provider value={{ reloadNavbar, setReloadNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  return useContext(NavbarContext);
}
