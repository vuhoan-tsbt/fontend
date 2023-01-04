import {
  Button, Form, Input, message, Modal, Select
} from 'antd';
import styles from '../index.less';

import { useTranslate } from '@/utils/hooks/useTranslate';
import React, { useState } from 'react';
import { history, useIntl, useRequest } from 'umi';
import { changePass } from '../service';
const { Option } = Select;

interface Iprops {
  open: boolean;
  setOpen: (b: boolean) => void;
  itemEdit: any;
}

interface IUser {
  address?: string;
  avatar?: any;
  createdAt?: string;
  dateOfBirth?: string;
  email?: string;
  fullName?: string;
  gender?: string;
  id?: string | number;
  identificationCode?: string;
  isActive?: true;
  phone?: string;
  points?: number;
  referralCode?: string;
  roles?: Array<any>;
  status?: string;
  updatedAt?: string;
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
  const { formatMessage } = useIntl();
  const handleOk = () => {
    setOpen(false);
    history.push('/admin');
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const submit = useRequest(changePass, {
    manual: true,
    onSuccess(data: any) {
      console.log("🚀 ~ file: Dialog.tsx:61 ~ onSuccess ~ data", data)
      setOpen(false)
      message.success('Thành công');
    },
    onError(e, params) {
    },
  });

  const onFinish = (value: any) => {
    submit.run(value)
  }
  return (
    <>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={<></>}
      >
        <Form
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label={formatMessage({ id: 'password' })}
            name="oldPassword"
            rules={[
              {
                required: true,
                message: t('error.require', {
                  field: t('password'),
                }),
              },
              {
                min: 8,
                max: 99,
                message: t('error.password', {
                  field: t('password'),
                }),
              },
            ]}
          >
            <Input.Password placeholder={'Mật khẩu cũ'} />
          </Form.Item>
          <Form.Item
            label={'Mật khẩu mới'}
            name="newPassword"
            rules={[
              {
                required: true,
                message: t('error.require', {
                  field: t('password'),
                }),
              },
              {
                min: 8,
                max: 99,
                message: t('error.password', {
                  field: t('password'),
                }),
              },
            ]}
          >
            <Input.Password placeholder={'Mật khẩu mới'} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className={styles.btnSubmit}
          >
            Đổi mật khẩu
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(Dialog);
