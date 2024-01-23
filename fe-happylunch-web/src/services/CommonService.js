import { baseUrl } from './BaseService.js';

const endpoint = {
  reportProblemCustomer: '/common/reportproblem',
};

class CommonService {
  async reportProblemCustomer(data) {
    try {
      const response = await baseUrl.post(endpoint.reportProblemCustomer, data);
      return response.data;
    } catch (error) {
      // console.log(error.response);
      throw error.response;
    }
  }
}


export default CommonService;