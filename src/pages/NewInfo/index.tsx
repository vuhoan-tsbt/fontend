import { LeftOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row
} from 'antd';
import React, { useState } from 'react';
import { history, Link, useLocation, useParams } from 'umi';
import styles from './index.less';

import { useTranslate } from '@/utils/hooks/useTranslate';
import { useRequest, useToggle } from 'ahooks';
import Dialog from './Components/Dialog';
import { getDepartment, getPosition, onEditValue, onSubmitValue } from './service';

export default () => {

  const params: any = useParams()

  const location: any = useLocation()
  const [form] = Form.useForm();
  const [currentData, setCurrentData] = React.useState<any>(null)
  const [load, setLoad] = React.useState<any>(true)

  React.useEffect(() => {
    initData()

  }, [params, params?.id])

  const initData = () => {
    if (params?.id) {
      if (!!location.state) {
        setCurrentData(location.state.record)
        return
      }
    }
    setCurrentData({})
  }


  const requestCreateDep = useRequest(onSubmitValue, {
    manual: true,
    onSuccess(data: any) {
      if (data.errors) {
        message.error('Thất bại');
      } else {
        history.push('/new');
        message.success('Thành công');
      }
    },
  });
  const requestEditDep = useRequest(onEditValue, {
    manual: true,
    onSuccess(data: any) {
      if (data.errors) {
        message.error('Thất bại');
      } else {
        history.push('/new');
        message.success('Thành công');
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
    if (!!params.id) {
      requestEditDep.run(data, params.id);
    } else {
      requestCreateDep.run(data);
    }
  };
  const onFinishFailed = (errorInfo: any) => { };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item className={styles.breacrumbItem}>
          <Link to="/new" className={styles.previousEditLink}>
            <LeftOutlined />
            <div>Tin tức</div>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.tableComponent}>
        {
          currentData && <Form
            name="basic"
            className={styles.itemForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={currentData}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row>
              <Col md={12} xs={24}>
                <Form.Item
                  label={'Tiêu đề'}
                  name="typeOfNews"
                  rules={[
                    {
                      required: true,
                      message: t('error.require', {
                        field: 'Tiêu đề',
                      }),
                    },
                  ]}
                >
                  <Input placeholder="Tiêu đề" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} xs={24}>
                <Form.Item
                  label={'Nội dung'}
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: t('error.require', {
                        field: 'Nội dung',
                      }),
                    },
                  ]}
                >
                  <Input.TextArea placeholder="Nội dung" />
                </Form.Item>
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
