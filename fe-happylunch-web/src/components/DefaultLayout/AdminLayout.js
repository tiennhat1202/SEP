import React, { useState } from 'react';
import { UserContext } from '../../store/UserContext';
import {
  CommentOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  SettingOutlined,
  UserOutlined,
  AlertOutlined,
  SwitcherOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import AvatarDropDownComponent from '../Commons/AvatarDropDown';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../Commons/LogoBtn';
import { useContext } from 'react';
import { useEffect } from 'react';

const LayoutAdmin = ({ initialComponent: InitialComponent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { user } = useContext(UserContext);
  const [items, setItems] = useState();
  const RL_Admin = 'RL_Admin';
  const RL_HeadChef = 'RL_HeadChef';
  const RL_Counter = 'RL_Counter';
  const RL_CanteenManager = 'RL_CanteenManager';

  function getItem(label, key, icon, children, disabled) {
    return {
      label,
      key,
      icon,
      children,
      disabled,
    };
  }

  useEffect(() => {
    switch (user.roleName) {
      case RL_Admin:
        setItems([
          getItem('Dashboard', '/admin/dashboard', <PieChartOutlined />, null, false),
          getItem('Manage Menu', 'subMenu', <SwitcherOutlined />, [
            getItem('Manage Category', '/admin/menu_category', '', null, false ),
            getItem('Manage Menu (HC)', '/admin/menu_management', '', null, false),
            getItem('Manage Menu (CM)', '/admin/menu_management_canteen_manager', '', null, false),
          ]),
          getItem('Manage Meal', 'subMeal', <CoffeeOutlined />, [
            getItem('Manage Category', '/admin/mealCate_management','', null, false),
            getItem('Manage Meal', '/admin/meal_management','', null, false),
          ]),
          getItem('Manage Order', 'subOrder', <OrderedListOutlined />, [
            getItem('Order Processing', '/admin/orderprocessing','', null, false),
            getItem('Order History', '/admin/ordermanagement','', null, false),
            getItem('Manage Serve Meal', '/admin/serve_meal','', null, false),
          ]),
          getItem('Manage Feedback', '/admin/feedback', <CommentOutlined />, null, false),
          getItem('Manage Report', '/admin/report', <AlertOutlined />, null, false),
          getItem('Manage User', '/admin/user_management', <UserOutlined />, null, false),
          getItem('Manage Role', '/admin/role_management', <SettingOutlined />, null, false),
        ]);
        break;
      case RL_CanteenManager:
        setItems([
          getItem('Manage Menu', 'subMenu', <SwitcherOutlined />, [
            getItem('Manage Menu (CM)', '/admin/menu_management_canteen_manager', '', null, false),
          ]),
          getItem('Manage Feedback', '/admin/feedback', <CommentOutlined />, null, false),
          getItem('Manage Order', 'subOrder', <OrderedListOutlined />, [
            getItem('Order Processing', '/admin/orderprocessing','', null, false),
            getItem('Order History', '/admin/ordermanagement','', null, false),
            getItem('Manage Serve Meal', '/admin/serve_meal','', null, false),
          ]),
        ])
        break;
        case RL_HeadChef:
          setItems([
            getItem('Manage Menu', 'subMenu', <SwitcherOutlined />, [
              getItem('Menu Category', '/admin/menu_category', '', null, false ),
              getItem('Manage Menu (HC)', '/admin/menu_management', '', null, false),
            ]),
            getItem('Manage Meal', 'subMeal', <CoffeeOutlined />, [
              getItem('Meal Category', '/admin/mealCate_management','', null, false),
              getItem('Manage Meal', '/admin/meal_management','', null, false),
            ]),
            getItem('Manage Order', 'subOrder', <OrderedListOutlined />, [
              getItem('Order Processing', '/admin/orderprocessing','', null, false),
              getItem('Manage Serve Meal', '/admin/serve_meal','', null, false),
            ])
          ])
        break;
          default:
    }
  }, [user.roleName]);                                      

  
  const onClick = (e) => {
    if (e.key == '') {
      return;
    } else {
      navigate(e.key);
    }
  };
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        collapsible
        theme='light'
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className='demo-logo-vertical'>
          <Logo></Logo>
        </div>
        <Menu
          onClick={onClick}
          theme='light'
          defaultSelectedKeys={[location.pathname]}
          mode='inline'
          items={items}
        ></Menu>
      </Sider>
      <Layout>
        <Header
          className='flex justify-end items-center'
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <AvatarDropDownComponent></AvatarDropDownComponent>
        </Header>
        <Content
          style={{
            margin: '16px 16px',
          }}
        >
          {/* <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <div
            style={{
              padding: 24,
              minHeight: 750,
              background: colorBgContainer,
            }}
          >
            {InitialComponent && <InitialComponent />}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Happy Lunch ©2023 SEP_G59
        </Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;
