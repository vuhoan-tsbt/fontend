import { useRequest, useSetState, useToggle } from 'ahooks';
import {
  Col,
  Modal,
  Form,
  Image,
  Input,
  message,
  Row,
  Select,
  Skeleton,
  Button,
} from 'antd';
import React, { useState } from 'react';
import { paternPhone } from '@/utils/patern';
import { history, useIntl } from 'umi';
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

  const handleOk = () => {
    setOpen(false);
    history.push('/admin');
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};

export default React.memo(Dialog);
