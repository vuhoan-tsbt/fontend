import { LeftOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  message,
  Row, UploadFile
} from 'antd';
import React, { useState } from 'react';
import { history, Link, useIntl } from 'umi';
import styles from './index.less';

import { useTranslate } from '@/utils/hooks/useTranslate';
import { useRequest, useToggle } from 'ahooks';
import Dialog from './Components/Dialog';
import PersonalInfo from './Components/PersonalInfo';
import { getDepartment, getPosition, onSubmitValue } from './service';

export default () => {

  const [listPosition, setListPosition] = useState<any[]>([])
  const [listDepartment, setListDepartment] = useState<any[]>([])

  useRequest(getDepartment, {
    onSuccess(res) {
      setListDepartment(res?.payload)
    }
  })

  useRequest(getPosition, {
    onSuccess(res) {
      setListPosition(res?.payload?.data)
    }
  })


  const requestCreateUser = useRequest(onSubmitValue, {
    manual: true,
    onSuccess(data: any) {
      if (data.errors) {
        message.error('Tạo tài khoản thất bại');
      } else {
        history.push('/user');
        message.success('Tạo tài khoản thành công');
      }
    },
  });

  const { t } = useTranslate();
  const [openDialog, setOpenDialog] = useToggle(false);
  const [idSelected, setIdSelected] = React.useState<number | string | null>(
    null,
  );
  const handleDelete = () => {
    setOpenDialog.set(true);
  };

  const onFinish = (values: any) => {
    const data = {
      ...values
    };
    requestCreateUser.run(data);
  };
  const onFinishFailed = (errorInfo: any) => { };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item className={styles.breacrumbItem}>
          <Link to="/user" className={styles.previousEditLink}>
            <LeftOutlined />
            <div>Tạo mới nhân viên</div>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.tableComponent}>
        <Form
          name="basic"
          className={styles.itemForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row>
            <Col span={12}>
              <div className={styles.detailAdm}>
                <PersonalInfo listPosition={listPosition} listDepartment={listDepartment} />
              </div>
            </Col>
          </Row>
          <Row
            align="middle"
            justify="center"
            className={styles.submitButtonGroup}
          >
            <Col>
              <Button
                danger
                onClick={handleDelete}
                className={styles.addButton}
              >
                {t('general_cancel')}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.addButton}
              >
                {t('general_save')}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {openDialog && (
        <Dialog
          open={openDialog}
          setOpen={(b) => {
            setOpenDialog.set(b);
          }}
          itemEdit={idSelected}
        />
      )}
    </>
  );
};
