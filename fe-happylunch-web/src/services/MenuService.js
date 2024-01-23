import { baseUrl, baseUrlUnAuthorized } from './BaseService';

const endpoint = {
  createMenuCate: '/head-chef/create-menu-category',
  viewListCateGory: '/head-chef/view-list-menu-categorys',
  viewListMenu: '/head-chef/view-list-menus',
  getMenuDetailById: '/head-chef/view-menu-detail',
  createMenu: '/head-chef/create-menu',
  viewListMenusByCategory: '/head-chef/view-list-menus-by-category',
  viewListMenusDoingByCategory: '/head-chef/view-list-menus-doing-by-category',
  viewListMenusAvailableTodayByCategory:
    '/head-chef/view-list-menus-available-today-by-category',
  viewListMenusAvailableByCategory:
    '/head-chef/view-list-menus-available-by-category',
  viewListMenusUnavailableByCategory:
    '/head-chef/view-list-menus-unavailable-by-category',
  viewMenusDoingDetailById: '/head-chef/view-menus-doing-detail-by-id',
  updateMenu: '/head-chef/update-menu',
  deleteMenu: '/head-chef/delete-menu-doing',
  sendRequestMenuToPending: '/head-chef/sent-request-menu-to-pending',
  viewListMenusPendingByCategory:
    '/head-chef/view-list-menus-pending-by-category',
  approveMenu: '/canteenmanager/approve-menus',
  rejectMenu: '/canteenmanager/reject-menus',
  viewListMenuApprovedByCategory:
    '/head-chef/view-all-list-menus-available-by-category',
  viewListMenuRejectByCategory:
    '/head-chef/view-list-menus-unavailable-by-category',
  viewListMenuHistoryById: '/head-chef/view-list-menus-history-by-id',
  sentRequestMenuUnavailableToPending:
    '/head-chef/sent-request-menu-unavailable-to-pending',
  viewListMenusAvailableSelectedByCategory:
    '/head-chef/view-list-menus-available-selected-by-category',
  createMenuAndPending: '/head-chef/create-menu-and-pending'
};
class MenuService {
  async createMenuCate(menuCateData) {
    try {
      const response = await baseUrl.post(
        endpoint.createMenuCate,
        menuCateData
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async createMenu(newMenu) {
    try {
      const response = await baseUrl.post(endpoint.createMenu, newMenu);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
  async createMenuAndPending(newMenu) {
    try {
      const response = await baseUrl.post(endpoint.createMenuAndPending, newMenu);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenu() {
    try {
      const response = await baseUrl.get(endpoint.viewListMenu);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListCateMenu() {
    try {
      const response = await baseUrlUnAuthorized.get(endpoint.viewListCateGory);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
  async getMenuDetailById(menuId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.getMenuDetailById}?menuId=${menuId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenusByCategory(menuCateId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenusByCategory}?menuCategoryId=${menuCateId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenusAvailableTodayByCategory(menuCateId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenusAvailableTodayByCategory}?menuCategoryId=${menuCateId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenusDoingByCategory(menuCateId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenusDoingByCategory}?menuCategoryId=${menuCateId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenusAvailableByCategory(menuCateId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenusAvailableByCategory}?menuCategoryId=${menuCateId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenusUnavailableByCategory(menuCateId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenusUnavailableByCategory}?menuCategoryId=${menuCateId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewMenusDoingDetailById(menuId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewMenusDoingDetailById}?menuId=${menuId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async updateMenu(menuDataUpdate) {
    try {
      const response = await baseUrl.put(endpoint.updateMenu, menuDataUpdate);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async deleteMenu(deleteData) {
    try {
      const response = await baseUrl.post(endpoint.deleteMenu, deleteData);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async sendRequestMenuToPending(listMenuIds) {
    try {
      const response = await baseUrl.post(
        endpoint.sendRequestMenuToPending,
        listMenuIds
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenusPendingByCategory(menuCategoryId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenusPendingByCategory}?menuCategoryId=${menuCategoryId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async approveMenu(listMenuIds) {
    try {
      const response = await baseUrl.post(endpoint.approveMenu, listMenuIds);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async rejectMenu(rejectData) {
    try {
      const response = await baseUrl.post(endpoint.rejectMenu, rejectData);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenuApprovedByCategory(menuCategoryId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenuApprovedByCategory}?menuCategoryId=${menuCategoryId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenuRejectByCategory(menuCategoryId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenuRejectByCategory}?menuCategoryId=${menuCategoryId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenuHistoryById(menuId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenuHistoryById}?menuId=${menuId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async sentRequestMenuUnavailableToPending(restoreData) {
    try {
      const response = await baseUrl.post(
        endpoint.sentRequestMenuUnavailableToPending,
        restoreData
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async viewListMenusAvailableSelectedByCategory(menuCategoryId, dateTime) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMenusAvailableSelectedByCategory}?menuCategoryId=${menuCategoryId}&dateTime=${dateTime}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

}

export default MenuService;
