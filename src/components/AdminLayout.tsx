import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Space, Avatar } from 'antd';
import {
  DashboardOutlined,
  InboxOutlined,
  UserOutlined,
  NotificationOutlined,
  PercentageOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// 1. Định nghĩa interface cho các liên kết điều hướng
interface SidebarLink {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // 2. MẢNG ĐIỀU HƯỚNG SIDEBAR - Đã cập nhật thêm tính năng Promotions
  const sidebarLinks: SidebarLink[] = [
    { 
      key: '1', 
      label: 'Dashboard', 
      href: '/admin', 
      icon: <DashboardOutlined /> 
    },
    { 
      key: '2', 
      label: 'Inventory', 
      href: '/admin/inventory', 
      icon: <InboxOutlined /> 
    },
    { 
      key: '3', 
      label: 'Customers', 
      href: '/admin/customers', 
      icon: <UserOutlined /> 
    },
    { 
      key: '4', 
      label: 'Orders', 
      href: '/admin/orders', 
      icon: <ShoppingOutlined /> 
    },
    { 
      key: '5', 
      label: 'Marketing', 
      href: '/admin/marketing', 
      icon: <NotificationOutlined /> 
    },
    // THÊM ĐƯỜNG DẪN PROMOTIONS TẠI ĐÂY:
    { 
      key: '6', 
      label: 'Promotions', 
      href: '/admin/promotions', 
      icon: <PercentageOutlined style={{ color: '#ff4d4f' }} /> // Tạo điểm nhấn màu đỏ cho voucher
    },
  ];

  // Tìm key hiện tại dựa vào đường dẫn URL (Router) để highlight menu
  const currentMenu = sidebarLinks.find(link => location.pathname === link.href) || sidebarLinks[0];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Thanh Menu bên trái (Sidebar) */}
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)' }}>
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'OJT' : 'AMAZING OJT'}
          </Title>
        </div>
        
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[currentMenu.key]}
          items={sidebarLinks.map((link) => ({
            key: link.key,
            icon: link.icon,
            label: <Link to={link.href}>{link.label}</Link>,
          }))}
        />
      </Sider>

      {/* Phần nội dung bên phải */}
      <Layout>
        {/* Thanh Header phía trên */}
        <Header style={{ background: '#fff', padding: '0 24px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          {/* Thông tin Admin góc phải */}
          <Space size="large">
            <Space>
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
              <Text strong>Admin Mode</Text>
            </Space>
            <Button type="text" danger icon={<LogoutOutlined />}>
              Logout
            </Button>
          </Space>
        </Header>

        {/* Nội dung các trang Admin quản lý (Render Component con tại đây) */}
        <Content style={{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: 280, borderRadius: '8px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;