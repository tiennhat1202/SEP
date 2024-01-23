import jwtDecode from 'jwt-decode';
import MealService from '../services/MealService';

export async function pushDataFromLocalToDatabase(user) {
  const mealService = new MealService();

  const dataCartLocalStorage = JSON.parse(
    localStorage.getItem('CartLocalStorage')
  );

  const decodedToken = jwtDecode(user.accessToken);

  console.log(decodedToken);

  const data = {
    customerId: decodedToken.CustomerId,
    orderDetails: dataCartLocalStorage?.map((item) => ({
      mealId: item.mealId,
      quantity: item.quantity,
      unitPrice: item.mealPrice,
    })),
  };

  if (data.orderDetails !== undefined) {
    try {
      const res = await mealService.loadDataLocalStorageToDB(data);
      if (res && res.code === 200) {
        // localStorage.setItem('CartLocalStorage', JSON.stringify([]));
      }
    } catch (error) {
      console.log('Save data to local storage error');
    }
  }
}
