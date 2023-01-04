import { Layout } from 'antd';
import AuthHeader from '../Header/auth.header';

import styles from './index.less';
import { useLayoutEffect } from 'react';

const { Content } = Layout;

const AuthLayout = ({ children }: any) => {
  useLayoutEffect(() => {
    const localeInfo = localStorage.getItem('umi_locale');
    if (!localeInfo) {
      localStorage.setItem('umi_locale', 'vi-VN');
      window.location.reload();
    }
  }, []);
  return (
    <Layout>
      <AuthHeader />
      <Content className={styles.authContent}>
        <div>{children}</div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
