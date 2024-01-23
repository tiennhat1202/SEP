import React, { createContext, useContext, useEffect, useState } from 'react';

const MealReadyContext = createContext();

export const MealReadyProvider = ({ children }) => {
  const [mealReady, setMealReady] = useState({});

  // Load mealReady from local storage when component mounts
  useEffect(() => {
    const storedMealReady = localStorage.getItem('mealReady');
    if (storedMealReady) {
      setMealReady(JSON.parse(storedMealReady));
    }
  }, []);

  const updateMealReady = (newReadyMeals) => {
    setMealReady(newReadyMeals);
  };

  // Save mealReady to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('mealReady', JSON.stringify(mealReady));
  }, [mealReady]);

  return (
    <MealReadyContext.Provider value={{ mealReady, updateMealReady }}>
      {children}
    </MealReadyContext.Provider>
  );
};

export const useMealReadyContext = () => {
  const context = useContext(MealReadyContext);
  if (!context) {
    throw new Error('useMealReadyContext must be used within a MealReadyProvider');
  }
  return context;
};
