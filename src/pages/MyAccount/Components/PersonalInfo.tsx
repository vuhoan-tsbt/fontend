import { useTranslate } from '@/utils/hooks/useTranslate';
import { Form, Input, Select } from 'antd';
import { useIntl } from 'umi';
import styles from '../index.less';


const PersonalInfo = (props: any) => {
  const { t } = useTranslate();
  const { formatMessage } = useIntl();

  return (
    <div className={styles.formGeneric}>
      <Form.Item
        label={'Họ tên'}
        name="fullName"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('address'),
            }),
          },
        ]}
      >
        <Input placeholder="Họ tên" />
      </Form.Item>
      <Form.Item
        label={'Địa chỉ'}
        name="address"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: 'Địa chỉ',
            }),
          },
        ]}
      >
        <Input placeholder="Địa chỉ" />
      </Form.Item>
      <Form.Item
        label={'Ngày sinh'}
        name="dateOfBirth"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('dateOfBirth'),
            }),
          },
          {
            pattern: /^((19|2[0-9])[0-9]{2})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
            message: t('error.patern', {
              field: 'Ngày sinh',
            }),
          },
        ]}
      >
        <Input placeholder={'Ngày sinh'} />
      </Form.Item>
      <Form.Item
        label={'Số điện thoại'}
        name="phone"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('phone'),
            }),
          },
          {
            pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
            message: t('error.patern', {
              field: t('phone'),
            }),
          },
        ]}
      >
        <Input
          placeholder={'Số điện thoại'}
        />
      </Form.Item>
      {/* <Form.Item
        label={formatMessage({ id: 'phone' })}
        name="phone"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('phone'),
            }),
          },
          {
            pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
            message: t('error.patern', {
              field: t('phone'),
            }),
          },
        ]}
      >
        <Input
          placeholder={formatMessage({
            id: 'phone',
          })}
        />
      </Form.Item> */}
      {/* <Form.Item
        label={formatMessage({ id: 'dateOfBirth' })}
        name="dateOfBirth"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('dateOfBirth'),
            }),
          },
          {
            pattern: /^((19|2[0-9])[0-9]{2})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
            message: t('error.patern', {
              field: t('dateOfBirth'),
            }),
          },
        ]}
      >
        <Input placeholder={formatMessage({ id: 'dateOfBirth' })} />
      </Form.Item> */}
    </div>
  );
};

export default PersonalInfo;
