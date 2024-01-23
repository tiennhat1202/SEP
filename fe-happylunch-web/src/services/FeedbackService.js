import { baseUrl } from './BaseService';

const endpoint = {
  getListFeedbackCanteenManager: '/canteenmanager/viewlistfeedback',
  getViewFeedbackDetailCanteenManager: '/canteenmanager/viewfeedbackdetail',
  postRepesonseFeedbackCanteenManager: '/canteenmanager/responsefeedback',
  getReciveNoti: '/common/receivenoti',
  getListNoti: '/common/getlistnoti',
  updateStatusNoti: '/common/viewednoti',
};

class FeedbackService {
  async getListFeedbackCanteenManager(
    currentPage,
    startDate,
    endDate,
    cusName,
    isResponsed
  ) {
    try {
      const response = await baseUrl.post(
        `${endpoint.getListFeedbackCanteenManager}/${currentPage}`,
        {
          startDate,
          endDate,
          cusName,
          isResponsed,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getViewFeedbackDetailCanteenManager(orderId) {
    try {
      const response = await baseUrl.post(
        endpoint.getViewFeedbackDetailCanteenManager,
        {
          orderId,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  async getRecieveNoti(messageId, receiveId, messageContent) {
    console.log(messageId, receiveId, messageContent)

    try {
      const response = await baseUrl.post(endpoint.getReciveNoti, {
        messageId,
        receiveId,
        messageContent,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  async getListNoti(receiveId) {
    try {
      const response = await baseUrl.post(endpoint.getListNoti, {
        receiveId,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async updateStatusNoti(orderId) {
    try {
      const response = await baseUrl.post(endpoint.updateStatusNoti, {
        orderId,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async postRepesonseFeedbackCanteenManager(orderId, responseContent) {
    try {
      const response = await baseUrl.post(
        endpoint.postRepesonseFeedbackCanteenManager,
        {
          orderId,
          responseContent,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export default FeedbackService;
