import { Modal, Select } from 'antd';
import React, { useState } from 'react';
import { useRequest } from 'umi';
import { deleteAdmin } from '../service';
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
  const id = itemEdit;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(
    'Bạn có chắc chắn muốn xoá tài khoản này',
  );

  const deteteRequest = useRequest(deleteAdmin, {
    manual: true,
  });
  const handleOk = async () => {
    await deteteRequest.run(id);
    setOpen(false);
  };

  const handleCancel = () => {
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
