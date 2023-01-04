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
import React from 'react';
import { history, useParams } from 'umi';
import styles from './index.less';

import { useTranslate } from '@/utils/hooks/useTranslate';
import { useRequest, useToggle } from 'ahooks';
import Dialog from './Components/Dialog';
import { onSubmitValue } from './service';

export default () => {

  const params: any = useParams()

  const [form] = Form.useForm();
  const [currentData, setCurrentData] = React.useState<any>(null)
  const [load, setLoad] = React.useState<any>(true)

  React.useEffect(() => {
    if (params.id) {
      setCurrentData(params.name)
      setLoad(false)
    } else {
      setLoad(false)
    }
  }, [params, params?.id])

  const onRequest = useRequest(onSubmitValue, {
    manual: true,
    onSuccess(data: any) {
      if (data.errors) {
        message.error('Thất bại');
      } else {
        history.push('/list-salary');
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
    onRequest.run(data);
  };
  const onFinishFailed = (errorInfo: any) => { };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item className={styles.breacrumbItem}>
          <div>Tính lương nhân viên</div>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.tableComponent}>
        {
          !load && <Form
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
              <Col md={12} xs={24}>
                <Form.Item
                  label={'Mã nhân viên'}
                  initialValue={currentData}
                  name="staffCode"
                  rules={[
                    {
                      required: true,
                      message: t('error.require', {
                        field: 'Mã nhân viên',
                      }),
                    },
                  ]}
                >
                  <Input placeholder="Mã nhân viên" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} xs={24}>
                <Form.Item
                  label={'Tổng số ngày làm việc trên tháng'}
                  initialValue={currentData}
                  name="totalNumberOfWorkingDaysInTheMonth"
                  rules={[
                    {
                      required: true,
                      message: t('error.require', {
                        field: 'Tổng số ngày làm việc trên tháng',
                      }),
                    },
                  ]}
                >
                  <InputNumber placeholder="Tổng số ngày làm việc trên tháng" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} xs={24}>
                <Form.Item
                  label={'Số giờ làm việc trên 1 ngày'}
                  initialValue={currentData}
                  name="numberOfHoursWorkedInADay"
                  rules={[
                    {
                      required: true,
                      message: t('error.require', {
                        field: 'Số giờ làm việc trên 1 ngày',
                      }),
                    },
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="Số giờ làm việc trên 1 ngày" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} xs={24}>
                <Form.Item
                  label={'Tổng số giờ làm việc'}
                  initialValue={currentData}
                  name="totalWorkingHours"
                  rules={[
                    {
                      required: true,
                      message: t('error.require', {
                        field: 'Tổng số giờ làm việc',
                      }),
                    },
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="Tổng số giờ làm việc" />
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
