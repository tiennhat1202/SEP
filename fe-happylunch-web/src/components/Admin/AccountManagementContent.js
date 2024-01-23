import React, { useEffect, useState } from 'react';
import SearchFieldComponent from '../Commons/SearchField';
import UserService from '../../services/RoleService';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Modal, Select, Table, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { text } from '@files-ui/core';
const { Option } = Select;

function AccountManagementContent() {
  document.title = 'Manage Customer';
  const userService = new UserService();
  const [dataUser, setDataUser] = useState([]);
  const [dataRole, setDataRole] = useState([]);
  const [dataRoleByUserId, setDataRoleByUserId] = useState({});
  const [editingRole, setEditingRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [dataUserByRole, setDataUserByRole] = useState([]);
  const [selectUserIdStatus, setSelectedUserIdStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [roleName, setRoleName] = useState('')
  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'isDelete',
      dataIndex: 'isDelete',
      key: 'isDelete',
      render: (isDelete) =>
        isDelete ? (
          <Tag icon={<CloseCircleOutlined />} color='error'>
            inActive
          </Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color='success'>
            Active
          </Tag>
        ),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Button
          type='primary'
          danger
          onClick={() => {
            showModal();
            setSelectedUserIdStatus(record.id);
          }}
        >
          Inactive
        </Button>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: 'hidden',
    },
  ];

  const handleOk = async () => {
    setConfirmLoading(true);
    const id = {
      customerId: selectUserIdStatus
    }
    try {
      const res = await userService.deleteUser(id)
      if(res.code === 200) {
        setTimeout(() => {
          setOpen(false);
          if (dataUser.length > 0) {
            getListUser()
          } else if (dataUserByRole.length > 0 ) {
            listUserByRoleName(roleName)
          }
          setConfirmLoading(false);
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setConfirmLoading(false);
  };

  const RoleSelector = ({ id, editing }) => {
    const rolesData = dataRoleByUserId[id] || [];
    const [selectedRoles, setSelectedRoles] = useState(rolesData);

    useEffect(() => {
      if (!editing) {
        setSelectedRoles([]);
      }
    }, [editing]);

    const handleRoleChange = async (selectedRoleNames) => {
      setSelectedRoles(selectedRoleNames);

      if (isEditing) {
        const roleData = {
          userId: selectedUserId,
          roleNameRequest: selectedRoleNames,
        };
        try {
          const res = await userService.addRoleForUser(roleData);
          if (res.code === 200) {
            /* console.log('Saved!'); */
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    const getOptionDisabled = (roleName) => {
      if (selectedRoles.includes('RL_Admin')) {
        return !(roleName === 'RL_Admin');
      } else if (selectedRoles.includes('RL_Counter')) {
        return !(roleName === 'RL_Counter');
      } else if (selectedRoles.includes('RL_HeadChef')) {
        return !(
          roleName === 'RL_HeadChef' || roleName === 'RL_CanteenManager'
        );
      } else if (selectedRoles.includes('RL_CanteenManager')) {
        return !(
          roleName === 'RL_CanteenManager' || roleName === 'RL_HeadChef'
        );
      }
      return false;
    };

    if (editing) {
      return (
        <Select
          mode='multiple'
          value={selectedRoles}
          onChange={handleRoleChange}
          style={{ width: '100%' }}
        >
          {dataRole.map((role) => (
            <Option
              key={role.id}
              value={role.name}
              disabled={getOptionDisabled(role.name)}
            >
              {role.name}
            </Option>
          ))}
        </Select>
      );
    } else {
      return (
        <div>
          {selectedRoles.map((role, index) => (
            <p key={index}>{role}</p>
          ))}
        </div>
      );
    }
  };

  const showModal = () => {
    setOpen(true);
  };
  const roleColumns = [
    {
      title: 'Role Name',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div>
          {editingRole === record.id ? (
            <RoleSelector id={id} editing={true} />
          ) : (
            <div className='flex'>
              {dataRoleByUserId[record.id]?.map((role, index) => (
                <p key={index}>{role}, </p>
              ))}
            </div>
          )}
        </div>
      ),
      width: 1000,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div>
          {editingRole === record.id ? (
            <div>
              <Button
                type='primary'
                style={{ backgroundColor: 'green', borderColor: 'green' }}
                onClick={() => {
                  setIsEditing(false);
                  setEditingRole(null);
                  handleSave();
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <Button
              type='primary'
              style={{ backgroundColor: 'blue', borderColor: 'blue' }}
              onClick={() => {
                setIsEditing(true);
                setEditingRole(record.id);
              }}
            >
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  const getListUser = async () => {
    try {
      const response = await userService.listUser();
      if (response.code === 200) {
        setDataUser(response.response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getListRole = async () => {
    try {
      const response = await userService.getListRole();
      if (response.code === 200) {
        setDataRole(response.response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const listRolesByUserId = async (userId) => {
    try {
      const response = await userService.listRoleByUserId(userId);
      if (response.code === 200) {
        return response.response.data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const listUserByRoleName = async (roleName) => {
    try {
      const response = await userService.listUsersByRole(roleName);
      if (response.code === 200) {
        setDataUserByRole(response.response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getListUser();
    getListRole();
  }, []);

  const handleExpandRow = async (record) => {
    if (!dataRoleByUserId[record.id]) {
      try {
        const rolesData = await listRolesByUserId(record.id);
        setDataRoleByUserId((prevData) => ({
          ...prevData,
          [record.id]: rolesData,
        }));
      } catch (error) {
        console.error('Error fetching rolesData:', error);
      }
    }

    setEditingRole(null);
    setSelectedUserId(record.id);

    // Fetch roles data immediately when expanding the row if in editing mode
    if (isEditing) {
      try {
        const rolesData = await listRolesByUserId(record.id);
        setDataRoleByUserId((prevData) => ({
          ...prevData,
          [record.id]: rolesData,
        }));
      } catch (error) {
        console.error('Error fetching rolesData:', error);
      }
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    setEditingRole(null);

    // Fetch roles data immediately when saving
    if (selectedUserId) {
      try {
        const rolesData = await listRolesByUserId(selectedUserId);
        setDataRoleByUserId((prevData) => ({
          ...prevData,
          [selectedUserId]: rolesData,
        }));
        toast.success('Save roles successfully');
      } catch (error) {
        console.error('Error fetching rolesData:', error);
      }
    }
  };

  const onChangeSelectRole = (value) => {
    listUserByRoleName(value);
    setRoleName(value)
    setDataUser([]);
  };
  console.log('dataUser: ', dataUser);
  console.log('dataUserByRole: ', dataUserByRole);
  console.log('roleId', roleName);
  return (
    <div>
      <div className='mb-2'>
        <div className='pb-2'>
          <h2 className='font-bold text-2xl'>Manage User</h2>
        </div>
        <div className='pb-4 lg:flex md:flex sm:flex gap-4 max-sm:inline-block place-items-center'>
          <div>
            <Select
              defaultValue='Select a role name'
              onChange={onChangeSelectRole}
              style={{ width: 200 }}
            >
              {dataRole.map((role) => (
                <Option key={role.id} value={role.name}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className='p-4 border-2 border-gray-200 border-dashed rounded-lg'>
          {dataUser.length > 0 && (
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <Table
                      columns={roleColumns}
                      dataSource={[{ id: record.id }]}
                      rowKey={(item) => item.id}
                      pagination={false}
                    />
                  );
                },
                onExpand: (_, record) => handleExpandRow(record),
              }}
              dataSource={dataUser}
            />
          )}
          {dataUserByRole.length > 0 && (
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <Table
                      columns={roleColumns}
                      dataSource={[{ id: record.id }]}
                      rowKey={(item) => item.id}
                      pagination={false}
                    />
                  );
                },
                onExpand: (_, record) => handleExpandRow(record),
              }}
              dataSource={dataUserByRole}
            />
          )}
          {dataUserByRole.length === 0 && dataUser.length === 0 && (
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <Table
                      columns={roleColumns}
                      dataSource={[{ id: record.id }]}
                      rowKey={(item) => item.id}
                      pagination={false}
                    />
                  );
                },
                onExpand: (_, record) => handleExpandRow(record),
              }}
              dataSource={[]}
            />
          )}
        </div>
      </div>
      <ToastContainer></ToastContainer>
      <Modal
        title={
          <div style={{ textAlign: 'center', color: 'red' }}>
            Do you want to inactivate user account?
          </div>
        }
        open={open}
        onOk={handleOk}
        okButtonProps={{ style: { background: 'red', borderColor: 'red' } }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  );
}

export default AccountManagementContent;
