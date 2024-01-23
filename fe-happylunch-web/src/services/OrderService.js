import { baseUrl } from './BaseService.js';

const endpoint = {
  viewOrderHistoryCustomer: '/customer/vieworderhistory',
  vieweOrderHistoryDetailsCustomer: '/customer/vieworderdetail',
  cancelOrderCustomer: '/customer/cancelorder',
  feedbackOrderCustomer: '/customer/feedbackmeal',
  getLastOrderCustomer: '/customer/getlastorder',
  reorderCustomer: '/customer/reorder',
  // CanteenManager
  managerOrderCanteenManager: '/canteenmanager/ordermanagement',
  viewOrderDetailCanteenmanager: '/canteenmanager/vieworderdetail',
  rejectOrderCanteenManager: '/canteenmanager/rejectorder',
  handleOrderCanteenManager: '/canteenmanager/handleorder',

  //Payment
  counterPaymentByCash: '/counter/paymentbycash',
  counterPaymentByVNPay: '/counter/paymentbyqr',
  counterSaveOrder: '/counter/saveorder',
  // Headchef
  getProcessingOrderHeadchef: '/head-chef/getprocessingmeal',
};

class OrderService {
  async getViewOrderHistoryCustomer(
    customerId,
    currentPage,
    statusOrder,
    startDate,
    endDate
  ) {
    try {
      const response = await baseUrl.post(
        `${endpoint.viewOrderHistoryCustomer}/${currentPage}`,
        { customerId, statusOrder, startDate, endDate }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.message;
    }
  }

  async getOrderHistoryDetailsCustomer(orderId) {
    try {
      const response = await baseUrl.post(
        endpoint.vieweOrderHistoryDetailsCustomer,
        {
          orderId,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error.response.data;
    }
  }

  async cancelOrderCustomer(orderId) {
    try {
      const response = await baseUrl.post(endpoint.cancelOrderCustomer, {
        orderId,
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
  async feedbackOrderCustomer(orderId, feedbackContent) {
    try {
      const response = await baseUrl.post(endpoint.feedbackOrderCustomer, {
        orderId,
        feedbackContent,
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async managerOrderCanteenManager(status, startDate, endDate, currentPage) {
    try {
      const response = await baseUrl.post(
        `${endpoint.managerOrderCanteenManager}/${currentPage}`,
        {
          status,
          startDate,
          endDate,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }

  async getOrderDetailCanteenManager(orderId) {
    try {
      const response = await baseUrl.post(
        endpoint.viewOrderDetailCanteenmanager,
        {
          orderId,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }

  async handleOrderCanteenManager(orderId, status) {
    try {
      const response = await baseUrl.post(endpoint.handleOrderCanteenManager, {
        orderId,
        status,
      });
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }

  async rejectOrderCanteenManager(orderId) {
    try {
      const response = await baseUrl.post(endpoint.rejectOrderCanteenManager, {
        orderId,
      });
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }
  async counterPaymentByCash(data) {
    try {
      const response = await baseUrl.post(endpoint.counterPaymentByCash, data);
      return response.data;
    } catch (error) {
      console.error(error.response);
      throw error.response;
    }
  }
  async counterPaymentByQR(data) {
    try {
      const response = await baseUrl.post(endpoint.counterPaymentByVNPay, data);
      return response.data;
    } catch (error) {
      console.error(error.response);
      throw error.response;
    }
  }

  async getProcessingOrderHeadchef(status) {
    try {
      const response = await baseUrl.post(endpoint.getProcessingOrderHeadchef, {
        status,
      });
      return response.data;
    } catch (error) {
      return error.response;
    }
  }
  async counterSaveOrder(data) {
    try {
      const response = await baseUrl.post(endpoint.counterSaveOrder, data);
      return response.data;
    } catch (error) {
      return error.response;
    }
  }
  async getLastOrderCustomer(customerId) {
    try {
      const response = await baseUrl.post(endpoint.getLastOrderCustomer, {
        customerId,
      });
      return response.data;
    } catch (error) {
      return error.response;
    }
  }
  async postReOrderCustomer(orderId) {
    try {
      const response = await baseUrl.post(endpoint.reorderCustomer, {
        orderId,
      });
      return response.data;
    } catch (error) {
      return error.response;
    }
  }
}

export default OrderService;
