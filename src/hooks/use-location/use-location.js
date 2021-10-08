import React, { useContext } from "react";

const LocationContext = React.createContext();

export function LocationProvider({ location, children }) {
  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
