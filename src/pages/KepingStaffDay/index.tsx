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
import moment from 'moment';
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
  staffCode: string;
  entryTime: string;
  timeout: string;
  workingTime: number;
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
      title: 'Mã Nhân Viên',
      dataIndex: 'staffCode',
      key: 'staffCode',
    },
    {
      title: 'Checkin',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render: (_: any, record: any) => {
        return moment(record.entryTime).format('YYYY/MM/DD HH:mm:ss');
      },
    },
    {
      title: 'CheckOut',
      dataIndex: 'timeout',
      key: 'timeout',
      render: (_: any, record: any) => {
        return moment(record.timeout).format('YYYY/MM/DD HH:mm:ss');
      },
    },
    {
      title: 'Thời Gian Làm Việc',
      dataIndex: 'workingTime',
      key: 'workingTime',
    },
  ];
  return (
    <>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>Danh sách chấm công theo ngày </Breadcrumb.Item>
      </Breadcrumb>

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
