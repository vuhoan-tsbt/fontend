import { Button, Col, message, Row } from 'antd';
import React from 'react';
import { history } from 'umi';
import styles from './index.less';

import { API_PATH, privateRequest, request } from '@/utils/apis';
import { useTranslate } from '@/utils/hooks/useTranslate';
import { useRequest, useToggle } from 'ahooks';
import { onSubmitValue } from './service';
import moment from 'moment';

export default () => {
  const [data, setData] = React.useState<any>(null);
  console.log('🚀 ~ file: index.tsx:16 ~ data', data);

  const initValue = useRequest(onSubmitValue, {
    onSuccess(data: any) {
      if (data.errors) {
        message.error('Thất bại');
      } else {
        setData(data.payload);
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

  const onCheckin = async () => {
    const res = await privateRequest(request.post, API_PATH.checkin);
    initValue.refresh();
    message.success(res.message);
  };
  const onCheckout = async () => {
    const res = await privateRequest(request.post, API_PATH.checkout);
    initValue.refresh();
    message.success(res.message);
  };

  return (
    <>
      <Row>
        <Col>
          {data == 0 ? (
            <Button
              type="primary"
              onClick={onCheckin}
              className={styles.addButton}
            >
              Checkin
            </Button>
          ) : data == 1 ? (
            <Button
              type="dashed"
              onClick={onCheckout}
              className={styles.addButton}
            >
              Checkout
            </Button>
          ) : (
            <> Da check out truoc do</>
          )}
        </Col>
      </Row>
      {/* {data.entryTime != 'null' && (
          <Row style={{ marginTop: 16 }}>
            <Col>
              Thời gian checkin{' '}
              {moment(data.entryTime).format('YYYY-MM-DD HH:mm')}
            </Col>
          </Row>
        )}
        {data.timeout != 'null' && (
          <Row style={{ marginTop: 16 }}>
            <Col>
              Thời gian checkout{' '}
              {moment(data.timeout).format('YYYY-MM-DD HH:mm')}
            </Col>
          </Row>
        )} */}
    </>
  );
};
