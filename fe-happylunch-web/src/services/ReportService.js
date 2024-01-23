import { baseUrl } from './BaseService';

const endpoint = {
  getListReportAdmin: '/admin/list-reports',
  getReportDetailAdmin: '/admin/report-detail',
};

class ReportService {
  async getListReportAdmin(currentPage, startDate, endDate) {
    try {
      const response = await baseUrl.post(
        `${endpoint.getListReportAdmin}/${currentPage}`,
        {
          startDate,
          endDate,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  async getReportDetailAdmin(reportId) {
    try {
      const response = await baseUrl.post(`${endpoint.getReportDetailAdmin}`, {
        reportId,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
export default ReportService;
