import { API_PATH } from '@/utils/apis';
import { ENVIRONMENTS } from '@/utils/constant';
import { useTranslate } from '@/utils/hooks/useTranslate';
import { LeftOutlined } from '@ant-design/icons';
import { useRequest, useToggle } from 'ahooks';
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Row
} from 'antd';
import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import { history, Link } from 'umi';
import Dialog from './Components/Dialog';
import PersonalInfo from './Components/PersonalInfo';
import styles from './index.less';
import { getMyProfile, onSubmitValue } from './service';

export default () => {

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [avatarLink, setAvatarLink] = React.useState<any>(null);
  const [myProfile, setMyProfile] = useState(null)
  useRequest(getMyProfile, {
    onSuccess(data: any) {
      setMyProfile(data.payload)
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: data.payload.avatar,
        },
      ])
    },
  });


  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onChange: UploadProps['onChange'] = ({
    file,
    fileList: newFileList,
    event,
  }) => {
    if (file.response) {
      setAvatarLink(file.response.payload);
    }
    setFileList(newFileList);
  };
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
      ...values,
      avatar: avatarLink
    };
    requestCreateUser.run(data);
  };
  const onFinishFailed = (errorInfo: any) => { };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item className={styles.breacrumbItem}>
          <div>Thông tin cá nhân</div>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.tableComponent}>
        {
          !!myProfile && <Form
            name="basic"
            className={styles.itemForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={myProfile}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row>
              <Col span={12}>
                <div className={styles.detailAdm}>
                  <div className={styles.uploadFileWrapper}>
                    {/* @ts-ignore */}
                    <Upload
                      action={ENVIRONMENTS.API_URL + API_PATH.UPLOAD}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      className={styles.uploadFile}
                      onRemove={() => {
                        setAvatarLink(null);
                      }}
                    >
                      {fileList.length < 1 && 'Upload Avatar'}
                    </Upload>
                  </div>
                  <PersonalInfo />
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
                  onClick={() => {
                    setOpenDialog.set(true);
                  }}
                  className={styles.addButton}
                >
                  Đổi mật khẩu
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
