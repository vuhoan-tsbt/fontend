import { LeftOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  message,
  Row, UploadFile
} from 'antd';
import React, { useEffect, useState } from 'react';
import { history, Link, useIntl, useParams } from 'umi';
import styles from './index.less';

import { useTranslate } from '@/utils/hooks/useTranslate';
import { useRequest, useToggle } from 'ahooks';
import Dialog from './Components/Dialog';
import PersonalInfo from './Components/PersonalInfo';
import { getDepartment, getOneUser, getPosition, onSubmitValue } from './service';

export default () => {
  const { formatMessage } = useIntl();

  const params: any = useParams()
  const [listPosition, setListPosition] = useState<any[]>([])
  const [listDepartment, setListDepartment] = useState<any[]>([])
  const [userState, setUserState] = useState<any>(null)

  const getUser = useRequest(getOneUser, {
    manual: true,
    onSuccess: (res: any) => {
      setUserState({
        ...res.payload,
        departmentId: res.payload.department,
        positionId: res.payload.position,
      })
    }
  })

  useEffect(() => {
    if (params.id) {
      getUser.run(params.id)
    }
  }, [params])

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
        message.error('create account error message');
      } else {
        history.push('/user');
        message.success('Create account success message');
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
    requestCreateUser.run(data, params.id);
  };
  const onFinishFailed = (errorInfo: any) => { };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item className={styles.breacrumbItem}>
          <Link to="/user" className={styles.previousEditLink}>
            <LeftOutlined />
            <div>Cập nhật thông tin</div>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.tableComponent}>
        {
          !getUser.loading && userState ? <Form
            name="basic"
            className={styles.itemForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={userState}
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
          </Form> : <></>

        }

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
