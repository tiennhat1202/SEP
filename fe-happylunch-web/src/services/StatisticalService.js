import { baseUrl } from './BaseService.js';

const endpoint = {
  statisticalOrderMeal: '/canteenmanager/statisticorder/meal',
  statisticalOrderTotalMoney: '/canteenmanager/statisticorder/totalmoney',
  statisticOrderTotalMoneyByMethodPayment: '/canteenmanager/statisticorder/paymentmethod'
};

class StatisticalService {
  async statisticalOrderMeal(startDate, endDate) {
    try {
      const response = await baseUrl.post(endpoint.statisticalOrderMeal, {
        startDate,
        endDate,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  async statisticalOrderTotalMoney(byDay, startTime, endTime) {
    try {
      const response = await baseUrl.post(endpoint.statisticalOrderTotalMoney, {
        byDay,
        startTime,
        endTime,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  async statisticOrderTotalMoneyByMethodPayment(startTime, endTime, paymentMethod, byDay) {
    try {
      const response = await baseUrl.post(endpoint.statisticOrderTotalMoneyByMethodPayment, {
        startTime,
        endTime,
        paymentMethod,
        byDay
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  } 
}

export default StatisticalService;
