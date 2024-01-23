import React, { useState, useEffect } from 'react';
import { useMealReadyContext } from '../../store/MealReadyContext';

function OrderProcessingSummaryComponent({ data }) {
  const [inputValues, setInputValues] = useState({});
  const { mealReady, updateMealReady } = useMealReadyContext();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);

  const calculateTotalQuantity = (orderData) => {
    const mealTotals = {};
    orderData.forEach((order) => {
      if (order.status === 0) {
        order.listMealOrder.forEach((meal) => {
          const { mealId, quantity } = meal;
          if (!mealTotals[mealId]) {
            mealTotals[mealId] = {
              mealId,
              mealName: meal.mealName,
              totalQuantity: quantity,
              readyQuantity: mealReady[mealId] || 0,
            };
          } else {
            mealTotals[mealId].totalQuantity += quantity;
          }
        });
      }
    });
    return mealTotals;
  };

  // const handleReadyClick = (mealId) => {
  //   const quantityToAdd = parseInt(inputValues[mealId], 10) || 0;

  //   // Update the mealReady state with the new quantity
  //   updateMealReady({
  //     ...mealReady,
  //     [mealId]: quantityToAdd,
  //   });

  //   // Reset the input value for the specific meal
  //   setInputValues((prevInputValues) => ({
  //     ...prevInputValues,
  //     [mealId]: '',
  //   }));
  // };

  const mealTotals = calculateTotalQuantity(data);

  const mealSelected = (mealId) => {
    setSelectedMeal(mealId);
  };
  const mealIds = Object.keys(calculateTotalQuantity(data));

  const handleKeyDown = (event, mealId) => {
    if (event.key === 'Enter') {
      updateMealReady({
        ...mealReady,
        [mealId]: inputValues[mealId] || 0,
      });
      setSelectedMeal(null);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const increment = event.key === 'ArrowUp' ? 1 : -1;
      const currentValue =
        inputValues[mealId] !== undefined
          ? inputValues[mealId]
          : mealReady[mealId] || 0;
      const updatedValue = currentValue + increment;
      const newReadyValue = updatedValue < 0 ? 0 : updatedValue;

      setInputValues({
        ...inputValues,
        [mealId]: newReadyValue,
      });

      // Cập nhật giá trị trong mealReady tương ứng
      updateMealReady({
        ...mealReady,
        [mealId]: newReadyValue,
      });
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {mealTotals &&
        Object.keys(mealTotals).map((mealId) => {
          const meal = mealTotals[mealId];
          const isSelected = selectedMeal === mealId;
          return (
            <div
              key={mealId}
              className={`w-full cursor-pointer border-[1px] ${
                isSelected
                  ? 'border-black rounded-sm border-[1px] scale-110'
                  : ''
              }`}
              onClick={() => mealSelected(mealId)}
              onKeyDown={(e) => handleKeyDown(e, mealId)}
              tabIndex={0}
            >
              <div className="p-2 bg-[#009689]">
                <div className="flex font-semibold text-[14px] text-white ">
                  Meal: {meal.mealName}
                </div>
                <div className="flex font-semibold text-[14px] text-white py-1">
                  Requested: {meal.totalQuantity}
                </div>
                <div className="flex font-semibold text-[14px] text-white">
                  Ready: {meal.readyQuantity}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default OrderProcessingSummaryComponent;
