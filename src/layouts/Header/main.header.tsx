import { DownOutlined, FlagOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Row, Dropdown, Space, Menu, Select } from 'antd';
import { useIntl } from 'umi';
import { useAuth } from '@/utils/hooks/useAuth';
import React from 'react';
import { Link, setLocale } from 'umi';
import styles from './index.less';
import { Option } from 'antd/lib/mentions';

const MainHeader = () => {
  const { formatMessage } = useIntl();
  const { onLogout } = useAuth();
  const menu = () => (
    <Menu
      items={[
        {
          label: (
            <Button type="text">
              <Link to="/account">{formatMessage({ id: 'account' })}</Link>
            </Button>
          ),
          key: '0',
        },
        {
          label: (
            <Button type="text" onClick={onLogout}>
              {formatMessage({ id: 'logout' })}
            </Button>
          ),
          key: '1',
        },
      ]}
    />
  );
  const menuLanguage = () => (
    <Menu
      items={[
        {
          label: (
            <Button type="text" onClick={() => setLocale('vi-VN', true)}>
              {formatMessage({ id: 'vietnamese' })}
            </Button>
          ),
          key: 'vi',
        },
        {
          label: (
            <Button type="text" onClick={() => setLocale('en-US', true)}>
              {formatMessage({ id: 'english' })}
            </Button>
          ),
          key: 'en',
        },
      ]}
    />
  );

  return (
    <Row justify="space-between" align="middle" className={styles.layoutHeader}>
      <Col></Col>
      <Col>
        <Dropdown overlay={menuLanguage} trigger={['click']}>
          <Button
            type="text"
            shape="circle"
            icon={
              <FlagOutlined color="white" className={styles.buttonSetting} />
            }
          />
        </Dropdown>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button
            type="text"
            shape="circle"
            icon={
              <SettingOutlined color="white" className={styles.buttonSetting} />
            }
          />
        </Dropdown>
      </Col>
    </Row>
  );
};

export default MainHeader;
