import React, { createContext, useContext, useState, useCallback } from "react";

const UILoaderContext = createContext({
  isVisible: false,
  show: () => {},
  hide: () => {},
});

export const UILoaderProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);

  return (
    <UILoaderContext.Provider value={{ isVisible, show, hide }}>
      {children}
    </UILoaderContext.Provider>
  );
};

export const useUILoader = () => useContext(UILoaderContext);
