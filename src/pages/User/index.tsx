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
      title: 'H??? T??n',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'V??? Tr??',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'H??nh ?????ng',
      dataIndex: 'custom',
      align: 'center',
      render: (value: any, record: any, index: number) => {
        return (
          <div className={styles.activeButton}>
            <Tooltip title={"Ch???nh s???a"}>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => handleEditAdmin(record.id)}
              >
                <EditOutlined />
              </div>
            </Tooltip>
            <Tooltip title={"Xo??"}>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => deleteAdmin(record.id)}
              >
                <StopOutlined />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ]


  const searchForm = (
    <div className={styles.searchContainer}>
      <Form form={form} className={styles.searchForm}>
        <Form.Item name="fullName" className={styles.searchItem}>
          <Input.Search
            placeholder={formatMessage({ id: 'form_search_text_admin' })}
            allowClear
            onSearch={submit}
          />
        </Form.Item>
      </Form>
      <Button onClick={() => handleNewAdmin()}>
        {formatMessage({ id: 'general_add_admin' })}
      </Button>
    </div>
  );

  return (
    <>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>
          Qu???n l?? nh??n vi??n
        </Breadcrumb.Item>
      </Breadcrumb>
      {searchForm}
      <div className={styles.tableComponent}>
        {loading || error ? (
          <Skeleton active />
        ) : (
          <Table
            {...tableProps}
            columns={columns}
            locale={{ emptyText: 'Tr???ng' }}
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
