import { OPTION_STATUS_ACTIVE } from '@/utils/constant';
import { StatusAccount } from '@/utils/enum';
import {
  CheckOutlined,
  EditOutlined,
  EyeOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useAntdTable, useToggle } from 'ahooks';
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  message,
  Select,
  Skeleton,
  Switch,
  Table,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';
import { useIntl, useHistory, useRequest } from 'umi';
import Dialog from './Components/Dialog';
import styles from './index.less';
import { getTableData, switchStatusAdmin } from './service';

const { Option } = Select;

interface Item {
  name: {
    last: string;
  };
  email: string;
  phone: string;
  gender: 'male' | 'female';
}
interface DataType {
  key: string;
  stt: number;
  full_name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  status: string;
}
export default () => {
  const [openDialog, setOpenDialog] = useToggle(false);
  const [idSelected, setIdSelected] = React.useState<number | string | null>(
    null,
  );
  const [form] = Form.useForm();

  const switchActiveRequest = useRequest(switchStatusAdmin, {
    manual: true,
    onSuccess() {
      search.submit();
    },
    onError() {
      search.submit();
    },
  });

  const history = useHistory();
  const { tableProps, search, params, refresh, error, loading } = useAntdTable(
    getTableData,
    {
      form,
      onError: (error: any) => {
        message.error(
          error.errors ? error.errors[0] : formatMessage({ id: 'error' }),
        );
      },
    },
  );

  const { formatMessage } = useIntl();

  const { type, changeType, submit, reset } = search;

  const handleViewAdmin = (idAdmin: number | string) => {
    history.push('/admin-detail/' + idAdmin.toString());
  };
  const handleEditAdmin = (idAdmin: number | string) => {
    history.push('/user_edit/' + idAdmin.toString());
  };
  const handleNewAdmin = () => {
    history.push('/user_new/');
  };
  const deleteAdmin = (isAdmin: number | string) => {
    setIdSelected(isAdmin);
    setOpenDialog.set(true);
  };

  const onSwitchStatus = (id: string) => {
    switchActiveRequest.run(id);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'STT',
      width: 100,
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
    },
    {
      title: 'Họ Tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Vị Trí',
      dataIndex: 'position',
      key: 'position',
    },
  ];

  const searchForm = (
    <div className={styles.searchContainer}>
      <Form form={form} className={styles.searchForm}></Form>
    </div>
  );

  return (
    <>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>Thông Tin Nhân Viên Công Ty</Breadcrumb.Item>
      </Breadcrumb>
      {searchForm}
      <div className={styles.tableComponent}>
        {loading || error ? (
          <Skeleton active />
        ) : (
          <Table
            {...tableProps}
            columns={columns}
            locale={{ emptyText: 'Trống' }}
            scroll={{ x: 1000 }}
          />
        )}
      </div>
      {openDialog && (
        <Dialog
          open={openDialog}
          setOpen={(b) => {
            setOpenDialog.set(b);
            refresh();
          }}
          itemEdit={idSelected}
        />
      )}
    </>
  );
};
