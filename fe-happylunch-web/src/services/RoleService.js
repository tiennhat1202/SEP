import { baseUrl } from './BaseService';

const endpoint = {
  getListRole: '/admin/list-role',
  createRole: '/admin/create-role',
  deleteRole: '/admin/delete-role-by-id',
  updateRole: '/admin/edit-role-by-id',
  getRoleDetailById: '/admin/get-role-detail-by-id',
  addRoleClaims: '/admin/add-role-claims',
  listUser: '/admin/list-users',
  listRoleByUserId: '/admin/list-roles-by-user',
  addRoleForUser: '/admin/add-roles-for-user',
  listUsersByRole: '/admin/list-users-by-role',
  deleteUser: '/admin/delete-user'
};

class RoleService {
  async getListRole() {
    try {
      const response = await baseUrl.get(endpoint.getListRole);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }

  async createRole(roleData) {
    try {
      const response = await baseUrl.post(endpoint.createRole, roleData);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  }

  async deleteRole(roleId) {
    try {
      const response = await baseUrl.delete(
        `${endpoint.deleteRole}?roleId=${roleId}`
      );
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
  async updateRol(roleData) {
    try {
      const response = await baseUrl.put(endpoint.updateRole, roleData);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
  async getRoleDetailById(roleId) {
    try {
      const response = await baseUrl.get(
        `${endpoint.getRoleDetailById}?roleId=${roleId}`
      );
      return response.data;
    } catch (error) {
      throw error.message
    }
  }
  async addRoleClaims(roleData) {
    try {
      const response = await baseUrl.post(endpoint.addRoleClaims, roleData);
      return response.data;
    } catch (error) {
      throw error.message
    }
  }
  async listUser () {
    try {
      const response = await baseUrl.get(endpoint.listUser)
      return response.data;
    } catch (error) {
      throw error.message
    }
  }
  async listRoleByUserId (userId) {
    try {
      const response = await baseUrl.get(`${endpoint.listRoleByUserId}?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.message
    }
  }
  async addRoleForUser(roleData) {
    try {
      const response = await baseUrl.post(endpoint.addRoleForUser, roleData)
      return response.data;
    } catch (error) {
      throw error.message
    }
  }
  async listUsersByRole(roleName) {
    try {
      const response = await baseUrl.get(`${endpoint.listUsersByRole}?roleName=${roleName}`)
      return response.data;
    } catch (error) {
      throw error.message
    }
  }
  async deleteUser(userId) {
    try {
      const response = await baseUrl.post(endpoint.deleteUser, userId)
      return response.data;
    } catch (error) {
      throw error.message
    }
  }
}
export default RoleService