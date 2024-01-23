import React from 'react';
import { useState } from 'react';
import RoleService from '../../services/RoleService';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';

import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Tooltip } from 'antd';
function RoleManagement() {
  document.title = 'Manage Role'

  const [openModal, setOpenModal] = useState(false);
  const roleService = new RoleService();
  const [roleData, setRoleData] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roleUpId, setRoleUpId] = useState('');
  const [updateRoleName, setUpdateRoleName] = useState('');
  const [roleDetailById, setRoleDetailById] = useState('');
  const [showCount, setShowCount] = useState('');
  const [roleDataUpdate, setRoleDataUpdate] = useState([]);
  const claimOptions = [
    'Create-Menu',
    'Create-Meal',
    'Create-Order',
    'Create-MenuCate',
    'Create-Role',
    'Update-Meal',
    'Update-Account',
    'Update-Role',
    'Delete-Meal',
    'Delete-Feedback',
    'Delete-Account',
    'Delete-Role',
    'Detail-Menu',
    'Detail-Order',
    'Detail-FeedBack',
    'Detail-Role',
  ];

  const [selectedClaims, setSelectedClaims] = useState({});

  const handleCreateRole = async () => {
    try {
      const roleData = {
        roleName,
      };
      const res = await roleService.createRole(roleData);
      if (res.code === 200) {
        // Only fetch the role list if the creation was successful
        await getRoleList();
        toast.success(`Role name : ${roleName} add successfully`);
        setOpenModal(false);
        setRoleName('');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const deleteRole = async (roleId) => {
    try {
      const res = await roleService.deleteRole(roleId);
      if (res.code === 200) {
        toast.success(`Role name : ${roleName} deleted successfully`);
        await getRoleList();
        setOpenModal(false);
        setRoleName([]);
      }
    } catch (error) {
      toast.error('Deleted Fail!', error);
    }
  };
  const handleDeleteRole = (roleData) => {
    setRoleName(roleData.name);
    setRoleId(roleData.id);
  };
  const handleUpdateRole = (roleData) => {
    setUpdateRoleName(roleData.name);
    setRoleUpId(roleData.id);
  };
  const updateRole = async () => {
    if (roleUpId && updateRoleName) {
      try {
        const updateRoleData = {
          roleId: roleUpId,
          roleName: updateRoleName,
        };
        const res = await roleService.updateRol(updateRoleData);
        if (res.code === 200) {
          await getRoleList();
          toast.success('Update Success!');
          setOpenModal(false);
        }
      } catch (error) {
        toast.error('Update Failed!', error);
      }
    }
  };

  const getRoleList = async () => {
    try {
      const res = await roleService.getListRole();
      if (res) {
        setRoleData(res.response.data);
      }
    } catch (error) {
      toast.error('No fetch data: ', error);
    }
  };

  const getRoleDetailById = async (roleId) => {
    try {
      const res = await roleService.getRoleDetailById(roleId);
      setRoleDetailById(res.response.data);
      console.log(roleDetailById);
    } catch (error) {
      error.message;
    }
  };

  const getRoleClaimById = async (roleId) => {
    try {
      const res = await roleService.getRoleDetailById(roleId);
      const claimData = res.response.data.claims;
      setSelectedClaims(claimData);
    } catch (error) {
      error.message;
    }
  };

  const toggleClaim = (option) => {
    setSelectedClaims((prevSelectedClaims) => {
      // Tạo một bản sao của đối tượng selectedClaims
      const updatedSelectedClaims = { ...prevSelectedClaims };

      if (updatedSelectedClaims[option]) {
        // Nếu claim đã tồn tại, xóa nó
        delete updatedSelectedClaims[option];
      } else {
        // Nếu claim chưa tồn tại, thêm nó vào đối tượng
        updatedSelectedClaims[option] = true;
      }

      return updatedSelectedClaims;
    });
  };

  const handleSelectAll = (actionType) => {
    const optionsToSelect = claimOptions.filter((option) =>
      option.startsWith(actionType)
    );
    const shouldSelectAll = optionsToSelect.every(
      (option) => selectedClaims[option]
    );

    setSelectedClaims((prevState) => {
      const updatedSelectedClaims = { ...prevState };
      optionsToSelect.forEach((option) => {
        updatedSelectedClaims[option] = !shouldSelectAll;
      });
      return updatedSelectedClaims;
    });
  };

  const updateRoleClaims = (claims) => {
    const updatedClaims = { ...selectedClaims };

    // Đặt trạng thái của các checkbox dựa trên danh sách claims
    claimOptions.forEach((option) => {
      updatedClaims[option] = claims.includes(option);
    });

    setSelectedClaims(updatedClaims);
  };

  const isClaimSelected = (claim) => {
    return selectedClaims[claim] === true;
  };

  const updateRoleDetails = async (id, selectedClaims) => {
    if (selectedClaims && typeof selectedClaims === 'object') {
      const roleClaim = [];

      // Duyệt qua các thuộc tính của selectedClaims và chuyển đổi chúng thành mảng roleClaim
      for (const claimType in selectedClaims) {
        if (
          Object.prototype.hasOwnProperty.call(selectedClaims, claimType) &&
          selectedClaims[claimType] === true
        ) {
          // Nếu claimType được chọn (true), thêm nó vào mảng roleClaim
          roleClaim.push({ claimType, claimValue: claimType });
        }
      }

      const updateRoleData = {
        roleId: id,
        roleClaim: roleClaim,
      };

      try {
        const res = await roleService.addRoleClaims(updateRoleData);
        if (res.code === 200) {
          // Cập nhật thành công, sau đó gọi hàm để lấy lại danh sách Claims sau khi đã cập nhật
          await getRoleClaimById(id);
          toast.success('Role Details updated successfully');
          await getRoleDetailById(id);
        }
      } catch (error) {
        toast.error('Update Role Claims Failed!', error);
      }
    } else {
      toast.error('selectedClaims is not a valid object');
    }
  };

  useEffect(() => {
    getRoleList();
  }, []);

  /* useEffect(() => {
    getRoleDetailById(roleId); // Truyền tham số roleId vào hàm
  }, [roleId]); */

  return (
    <div>
      <div className="mb-2">
        <h2 className="font-bold text-2xl">Role Management</h2>

        <div className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-4">
          <div className="2xl:col-span-2 sm:p-6 shadow-sm p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div>
              <h2 className="font-bold text-md text-center mb-2">Role List</h2>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setOpenModal(true);
                  setShowCount('Add role');
                }}
                type="button"
                className="py-2.5 px-5 me-2 mb-2 text-sm font-bold text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Add role
              </button>
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <div className="text-left">Role Name</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="text-center">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {roleData.map((role) => (
                  <tr
                    key={role.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-6 flex justify-left font-medium text-black whitespace-nowrap dark:text-white"
                    >
                      {role.name}
                    </th>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                      <Tooltip title="Detail role">
                        <svg
                          onClick={() => getRoleDetailById(role.id)}
                          cursor="pointer"
                          width="25px"
                          height="25px"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <g id="SVGRepo_iconCarrier">
                            {''}
                            <path
                              fill="#0073ff"
                              fillRule="evenodd"
                              d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm10.01 4a1 1 0 01-1 1H10a1 1 0 110-2h.01a1 1 0 011 1zM11 6a1 1 0 10-2 0v5a1 1 0 102 0V6z"
                            />
                            {''}
                          </g>
                        </svg>
                        </Tooltip>
                        <Tooltip title="Update role">
                        <svg
                          onClick={() => {
                            handleUpdateRole(role);
                            setShowCount('Update role');
                            setOpenModal(true);
                          }}
                          cursor="pointer"
                          width="25px"
                          height="25px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <g id="SVGRepo_iconCarrier">
                            {''}
                            <path
                              d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                              stroke="#ff8800"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {''}
                            <path
                              d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                              stroke="#ff8800"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {''}
                          </g>
                        </svg>
                        </Tooltip>
                        <Tooltip title="Delete role">
                        <svg
                          onClick={() => {
                            setShowCount('Delete role');
                            setOpenModal(true);
                            handleDeleteRole(role);
                          }}
                          cursor="pointer"
                          width="25px"
                          height="25px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <g id="SVGRepo_iconCarrier">
                            {''}
                            <path
                              d="M10 12V17"
                              stroke="#ff0000"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {''}
                            <path
                              d="M14 12V17"
                              stroke="#ff0000"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {''}
                            <path
                              d="M4 7H20"
                              stroke="#ff0000"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {''}
                            <path
                              d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                              stroke="#ff0000"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {''}
                            <path
                              d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                              stroke="#ff0000"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {''}
                          </g>
                        </svg>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-2 max-h-full 2xl:col-span-2 sm:p-6 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div>
              <h2 className="font-bold text-md text-center mb-2">
                Role Claim Update
              </h2>
            </div>
            <div className="p-2 max-h-48 overflow-y-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <div style={{ display: 'flex' }}>
                  {['Create', 'Update', 'Delete', 'Detail'].map(
                    (actionType) => (
                      <table
                        key={actionType}
                        className="text-sm text-left text-gray-500 dark:text-gray-400"
                        style={{ display: 'inline-block', marginRight: '10px' }}
                      >
                        <thead>
                          <tr>
                            <th className="text-lg font-medium text-gray-900 dark:text-gray-300">
                              <input
                                type="checkbox"
                                checked={claimOptions
                                  .filter((option) =>
                                    option.startsWith(actionType)
                                  )
                                  .every(isClaimSelected)}
                                onChange={() => handleSelectAll(actionType)}
                              />
                            </th>
                            <th
                              colSpan="2"
                              className="text-lg font-medium text-gray-900 dark:text-gray-300"
                            >
                              {actionType}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {claimOptions
                            .filter((option) => option.startsWith(actionType))
                            .map((option) => (
                              <tr key={option}>
                                <td className="w-8">
                                  <input
                                    id={`${option}-checkbox-list`}
                                    type="checkbox"
                                    checked={isClaimSelected(option)}
                                    onChange={() => toggleClaim(option)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                  />
                                </td>
                                <td>
                                  <label
                                    htmlFor={`${option}-checkbox-list`}
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                    {option}
                                  </label>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )
                  )}
                </div>
              </table>
            </div>
            <div className="flex items-center justify-center mt-5">
              <button
                onClick={() =>
                  updateRoleDetails(roleDetailById.id, selectedClaims)
                }
                type="button"
                className="text-sm px-10 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg"
              >
                <div className="lg:flex md:flex sm:flex justify-center text-sm">
                  <p className="md:w-max sm:w-max px-10 align-middle mt-0.5">
                    Update Claims
                  </p>
                </div>
              </button>
            </div>
            <div className="mb-5 mt-6 border "></div>
            <div className="mb-2">
              <h2 className="font-bold text-md text-center">Role Detail</h2>
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <div className="text-center">Role Name</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="text-center">Role Claim</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="text-center">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  <tr
                    key={roleDetailById.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-6 flex justify-center font-medium text-black whitespace-nowrap dark:text-white"
                    >
                      {roleDetailById.name}
                    </th>
                    <td className="">
                      <div className="flex justify-center gap-2 text-center">
                        {roleDetailById && roleDetailById.claims
                          ? `${roleDetailById.claims}`
                          : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        {roleDetailById && roleDetailById.claims ? (
                          <button
                            onClick={() =>
                              updateRoleClaims(roleDetailById.claims)
                            }
                            type="button"
                            className="flex  text-sm px-4 py-2 text-center text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                          >
                            <span className="w-32">Grant Role Claims</span>
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
      {showCount === 'Add role' && (
        <>
          <Modal
            show={openModal}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-center text-gray-900 dark:text-white">
                  Add role
                </h3>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email" value="Role name" />
                  </div>
                  <TextInput
                    id="email"
                    placeholder="role name..."
                    value={roleName}
                    onChange={(event) => setRoleName(event.target.value)}
                    required
                  />
                </div>
                <div className="w-full flex justify-center">
                  <Button onClick={handleCreateRole}>Add role</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}

      {showCount === 'Update role' && (
        <>
          <Modal
            show={openModal}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-center text-gray-900 dark:text-white">
                  Update role
                </h3>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email" value="Role name" />
                  </div>
                  <TextInput
                    id="email"
                    placeholder="role name..."
                    value={updateRoleName}
                    onChange={(event) => setUpdateRoleName(event.target.value)}
                    required
                  />
                </div>
                <div className="w-full flex justify-center">
                  <Button onClick={() => updateRole()}>Update role</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
      {showCount === 'Delete role' && (
        <>
          <Modal
            show={openModal}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete role &quot;{roleName}&quot;?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={() => deleteRole(roleId)}>
                    Yes, I&quot;m sure
                  </Button>
                  <Button color="gray" onClick={() => setOpenModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
}

export default RoleManagement;
