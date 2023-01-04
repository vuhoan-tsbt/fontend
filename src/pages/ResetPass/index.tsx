import { Button, Form, Input, message, Radio, RadioChangeEvent } from 'antd';
import React, { useState } from 'react';
import { useLogin } from './service';

import styles from './index.less';
import { useTranslate } from '@/utils/hooks/useTranslate';
import axios from 'axios';
import { API_PATH } from '@/utils/apis';
import { ENVIRONMENTS } from '@/utils/constant';
import Dialog from './Components/Dialog';
import { useHistory, useParams } from 'umi';

const Login: React.FC = () => {
  const { t } = useTranslate();
  const params: any = useParams()
  const history = useHistory()
  const { loading, run } = useLogin();
  const onFinish = (values: any) => {
    axios.post(ENVIRONMENTS.API_URL + '/api/auth/reset_password', {
      email: params.email,
      token: params.token,
      password: values.password,
    }).then(res => {
      message.success(res.data.message)
      history.push('/login')
    }).catch(err => {
    })
  };

  return (
    <div className={styles.loginWrap}>
      <h1>Chấm công</h1>
      <Form
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label={t('password')}
          name="password"
          rules={[
            {
              required: true,
              message: t('error.require', {
                field: t('password'),
              }),
            },
          ]}
        >
          <Input.Password placeholder={t('password')} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className={styles.btnSubmit}
        >
          Đặt lại mật khẩu
        </Button>
      </Form>
    </div>
  );
};

export default Login;
