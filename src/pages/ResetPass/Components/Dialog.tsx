import {
  Button, Form, Input, Modal, Select
} from 'antd';
import React, { useState } from 'react';
import { useTranslate } from '@/utils/hooks/useTranslate';
import { history } from 'umi';
import styles from '../index.less';
const { Option } = Select;

interface Iprops {
  open: boolean;
  setOpen: (b: boolean) => void;
  itemEdit: any;
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
  const { t } = useTranslate();
  const handleOk = () => {
    setOpen(false);
    history.push('/admin');
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const onFinish = (value: any) => {
    console.log("🚀 ~ file: Dialog.tsx:36 ~ onFinish ~ value", value)
    return {
    }
  }

  return (
    <>
      <Modal
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        cancelText="Đóng"
      >
        <Form
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="OTP"
            name="phone_number"
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
          <Button
            type="primary"
            htmlType="submit"
            className={styles.btnSubmit}
          >
            Gửi thông tin
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(Dialog);
