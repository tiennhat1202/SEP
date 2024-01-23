import { baseUrl, baseUrlUnAuthorized } from './BaseService';

const endpoint = {
  getListMealToOrderCustomer:
    '/head-chef/view-list-menus-available-today-by-category',
  addToCartCustomer: '/customer/addtocart',
  getListMealCartCustomer: '/customer/getlistmealcart',
  changeQuantityCartCustomer: '/customer/changequantity',
  removeCartCustomer: '/customer/removecart',
  removeAllCartCustomer: '/customer/removeallcart',
  viewListMealHeadChef: '/head-chef/view-list-all-meals',
  createMealHeadChef: '/head-chef/create-meal',
  viewListMealCateHeadChef: '/head-chef/view-list-meal-categorys',
  createMealCateHeadChef: '/head-chef/create-meal-category',
  viewListAllMealByMenuCate: '/head-chef/view-list-all-meals-by-menu-category',
  viewListMealsFromMenuCateByMealCate:
    '/head-chef/view-list-meals-from-menu-category-by-meal-category',
  viewMealByMealId: '/head-chef/view-meal-by-mealid',
  headchefStopServingMeal: '/head-chef/on-off-serving-meal',
  deleteMeal: '/head-chef/delete-meal',
  updateMeal: '/head-chef/update-meal',
  loadCartLocalToDBCustomer: '/customer/addtocartbeforelogin',
};

class MealService {
  async getListMealToOrderCustomer(menuCategoryId) {
    try {
      const response = await baseUrlUnAuthorized.get(
        endpoint.getListMealToOrderCustomer +
          '?menuCategoryId=' +
          menuCategoryId
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async addToCartCustomer(mealId, customerId) {
    try {
      const response = await baseUrl.post(endpoint.addToCartCustomer, {
        mealId,
        customerId,
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async loadDataLocalStorageToDB(data) {
    try {
      const response = await baseUrl.post(
        endpoint.loadCartLocalToDBCustomer,
        data
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async getListMealCartCustomer(customerId) {
    try {
      const response = await baseUrl.post(endpoint.getListMealCartCustomer, {
        customerId,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async changeQuantityCartCustomer(customerId, mealId, quantity) {
    try {
      const response = await baseUrl.put(
        endpoint.changeQuantityCartCustomer,
        {
          customerId: customerId,
          mealId: mealId,
          quantity: quantity,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async removeCartCustomer(customerId, mealId) {
    try {
      const response = await baseUrl.delete(endpoint.removeCartCustomer, {
        data: {
          customerId: customerId,
          mealId: mealId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async removeAllCartCustomer() {
    try {
      const response = await baseUrl.delete(endpoint.removeAllCartCustomer, {
        data: {},
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getListMealManagementForHeadChef() {
    try {
      const response = await baseUrl.get(endpoint.viewListMealHeadChef);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async createMealForHeadChef(formData) {
    try {
      const response = await baseUrl.post(
        endpoint.createMealHeadChef,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }, // Set headers here
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getListMealCate() {
    try {
      const response = await baseUrl.get(endpoint.viewListMealCateHeadChef);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async createMealCate(mealCateData) {
    try {
      const response = await baseUrl.post(
        endpoint.createMealCateHeadChef,
        mealCateData
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async viewListAllMealByMenuCate(menuCateId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListAllMealByMenuCate}?menuCategory=${menuCateId}`
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async viewListMealsFromMenuCateByMealCate(menuCateId, mealCateId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewListMealsFromMenuCateByMealCate}?menuCategory=${menuCateId}&mealCategoryId=${mealCateId}`
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  async viewMealByMealId(mealId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.viewMealByMealId}?mealId=${mealId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async deleteMeal(mealId) {
    try {
      const response = await baseUrl.post(endpoint.deleteMeal, mealId);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async updateMeal(mealUpdateForm) {
    try {
      const response = await baseUrl.put(endpoint.updateMeal, mealUpdateForm, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Set headers here
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async updateHeadchefStopServingMeal(mealId) {
    try {
      const response = await baseUrl.post(endpoint.headchefStopServingMeal, {
        mealId,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
export default MealService;
