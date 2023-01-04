import { ENVIRONMENTS } from '@/utils/constant';
import { useAuth } from '@/utils/hooks/useAuth';
import {
  AlignLeftOutlined,
  GiftOutlined,
  IdcardOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SolutionOutlined,
  TeamOutlined,
  TransactionOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Avatar, Button, MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { useIntl, useLocation } from 'umi';

import { Link } from 'umi';
import styles from './index.less';
import { onSubmitValue } from './service';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    children,
    label,
    icon,
  } as MenuItem;
}

const Sidebar = ({
  children,
  collapsed,
  onToggle,
}: {
  children?: React.ReactNode | React.ReactNode[];
  collapsed: boolean;
  onToggle: () => void;
}) => {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const { onLogout } = useAuth();

  const onCreateMeetR = useRequest(onSubmitValue, {
    manual: true,
    onSuccess(data, params) {
      window.open(data.start_url, '_blank');
    },
  });

  const onCreateMeet = () => {
    onCreateMeetR.run();
  };

  const [currentMenu, setCurrentMenu] = useState<any>([]);
  React.useEffect(() => {
    const authData = window?.localStorage.getItem(
      ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
    );
    let authObj: any = {};
    if (authData) {
      authObj = JSON.parse(authData);
    }
    if (authObj.role === 'ADMIN') {
      setCurrentMenu([
        getItem(
          renderLink('/user', 'Quản lý user'),
          '/user',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/department', 'Quản lý phòng ban'),
          '/department',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/position', 'Quản lý vị trí'),
          '/position',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/policy', 'Quản lý điều khoản'),
          '/policy',
          <IdcardOutlined />,
        ),

        getItem(
          renderLink('/NewUser', 'Danh sách tin tức'),
          '/NewUser',
          <IdcardOutlined />,
        ),
      ]);
    }
    if (authObj.role === 'STAFF') {
      setCurrentMenu([
        getItem(
          renderLink('/checkin', 'Checkin'),
          '/checkin',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/user-user', 'Danh sách nhân viên'),
          '/user-user',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/NewUser', 'Danh sách tin tức'),
          '/NewUser',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/DepartmentUser', 'Danh sách phòng ban'),
          '/DepartmentUser',
          <IdcardOutlined />,
        ),
      ]);
    }
    if (authObj.role === 'EDITER') {
      setCurrentMenu([
        getItem(
          renderLink('/list-salary', 'Danh sách lương nhân viên'),
          '/list-salary',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/salary', 'Tính lương nhân viên'),
          '/salary',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/dot_infomation', 'Danh sách'),
          '/dot_infomation',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/new', 'Quản lý tin tức'),
          '/new',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/user-user', 'Danh sách nhân viên'),
          '/user-user',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/DepartmentUser', 'Danh sách phòng ban'),
          '/DepartmentUser',
          <IdcardOutlined />,
        ),
        getItem(
          <Button
            type="default"
            className={styles.meet}
            loading={onCreateMeetR.loading}
            onClick={() => {
              onCreateMeet();
            }}
          >
            Tạo cuộc họp
          </Button>,
          '',
          '',
        ),
      ]);
    }
  }, []);

  const renderLink: (link: string, title: string) => React.ReactNode = (
    link: string,
    title: string,
  ) => {
    return (
      <Link to={link} key={link}>
        {title}
      </Link>
    );
  };

  // @ts-ignore
  const local = JSON.parse(
    // @ts-ignore
    localStorage.getItem(ENVIRONMENTS.LOCAL_STORAGE_KEY),
  );
  const userName = local?.display_name;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onToggle}
      trigger={null}
      className={styles.layoutSlider}
      breakpoint="md"
      width={250}
    >
      <div className={styles.logoWrapper}>
        <AlignLeftOutlined className={styles.toggleButton} onClick={onToggle} />
      </div>
      <div className={styles.sidebarAvatar}>
        <Avatar icon={<UserOutlined />} />
        {!collapsed && <span>{userName}</span>}
      </div>
      <Menu
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        items={currentMenu}
        className={styles.backgroundPrimary}
      />
      <div
        className={styles.logoutButton}
        onClick={() => {
          onLogout();
        }}
      >
        <LogoutOutlined size={24} />
        {!collapsed && <span>Đăng xuất</span>}
      </div>
    </Sider>
  );
};

export default Sidebar;
