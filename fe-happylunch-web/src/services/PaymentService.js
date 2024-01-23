import { baseUrl } from './BaseService.js';

const endpoint = {
  depositMoney: '/customer/depositsmoney',
  transferMonney: '/customer/transfermoney',
  getBalanceCustomer: '/customer/getthebalance',
  getReceiverIdByEmail: '/customer/transfermoney/getreceiveid',
  paymentOrderCustomer: '/customer/paymentorder',
  paymentOrderByQRCustomer: '/customer/paymentbyqr'
};
class PaymentService {
  async depositMoney(customerId, money) {
    try {
      const response = await baseUrl.post(endpoint.depositMoney, {
        customerId,
        money,
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
  async transferMoney(customerId, money, receiverId) {
    try {
      const response = await baseUrl.post(endpoint.transferMonney, {
        customerId,
        money,
        receiverId,
      });
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }
  async getBalance(customerId) {
    try {
      const response = await baseUrl.post(endpoint.getBalanceCustomer, {
        customerId,
      });
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }

  async getReceiverIdByEmail(receiverEmail) {
    try {
      const response = await baseUrl.post(endpoint.getReceiverIdByEmail, {
        receiverEmail,
      });
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }

  async paymentOrderCustomer(customerId, total, tomorrow) {
    try {
      const response = await baseUrl.post(endpoint.paymentOrderCustomer, {
        customerId,
        total,
        tomorrow
      });

      return response.data;
    } catch (error) {
      throw error.response;
    }
  }
  async paymentOrderByQRCustomer(customerId, total, tomorrow) {
    try {
      const response = await baseUrl.post(endpoint.paymentOrderByQRCustomer, {
        customerId,
        total,
        tomorrow
      });

      return response.data;
    } catch (error) {
      throw error.response;
    }
  }
}

export default PaymentService;
