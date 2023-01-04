import { Button, Form, Input, message, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { useTranslate } from '@/utils/hooks/useTranslate';
import { history, useHistory } from 'umi';
import styles from '../index.less';
import axios from 'axios';
import { ENVIRONMENTS } from '@/utils/constant';
import { API_PATH } from '@/utils/apis';
const { Option } = Select;

interface Iprops {
  open: boolean;
  setOpen: (b: boolean) => void;
  itemEdit: any;
  idForgot: any;
}
const Dialog: React.FC<Iprops> = ({
  open,
  setOpen,
  itemEdit,
  children,
  ...rest
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Bạn có chắc chắn muốn huỷ ?');
  const history = useHistory();
  const { t } = useTranslate();
  const handleOk = () => {
    setOpen(false);
    history.push('/admin');
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const onFinish = async (value: any) => {
    await axios
      .post(ENVIRONMENTS.API_URL + API_PATH.reset_pass, {
        ...value,
        id: parseInt(rest.idForgot),
      })
      .then((data) => {
        message.success(data.data.message);
        window.location.reload();
      });
  };

  return (
    <>
      <Modal
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={<></>}
        cancelText="Đóng"
      >
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="OTP"
            name="otp"
            rules={[
              {
                required: true,
                message: t('error.require', {
                  field: 'OTP',
                }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
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
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" className={styles.btnSubmit}>
            Gửi thông tin
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(Dialog);
