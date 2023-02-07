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
        getItem(renderLink('/user', 'Nhân Viên'), '/user', <IdcardOutlined />),
        getItem(
          renderLink('/department', 'Phòng Ban'),
          '/department',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/position', 'Các Chức Vụ'),
          '/position',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/policy', 'Chính Sách'),
          '/policy',
          <IdcardOutlined />,
        ),

        // getItem(
        //   renderLink('/NewUser', 'Danh sách tin tức'),
        //   '/NewUser',
        //   <IdcardOutlined />,
        // ),
      ]);
    }
    if (authObj.role === 'STAFF') {
      setCurrentMenu([
        getItem(
          renderLink('/checkin', 'Chấm Công'),
          '/checkin',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/user-user', 'Danh Sách Nhân Viên'),
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
          renderLink('/list-salary', 'Lương Nhân Viên'),
          '/list-salary',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/salary', 'Tính Lương Nhân Viên'),
          '/salary',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/dot_infomation', 'Tìm Kiêm Chấm Công'),
          '/dot_infomation',
          <IdcardOutlined />,
        ),
        getItem(
          renderLink('/new', 'Quản Lý Tin Tức'),
          '/new',
          <IdcardOutlined />,
        ),
        // getItem(
        //   renderLink('/user-user', 'Danh Sách Nhân Viên'),
        //   '/user-user',
        //   <IdcardOutlined />,
        // ),
        // getItem(
        //   renderLink('/DepartmentUser', 'Danh sách phòng ban'),
        //   '/DepartmentUser',
        //   <IdcardOutlined />,
        // ),
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
