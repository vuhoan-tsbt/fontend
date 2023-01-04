import { useTranslate } from '@/utils/hooks/useTranslate';
import { Form, Input, Select } from 'antd';
import { useIntl } from 'umi';
import styles from '../index.less';
type Props = {
  listPosition: any[]
  listDepartment: any[]
};

const PersonalInfo = (props: Props) => {
  const { t } = useTranslate();
  const { formatMessage } = useIntl();

  return (
    <div className={styles.formGeneric}>
      <Form.Item
        label={formatMessage({ id: 'fullname' })}
        name="fullName"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('fullname'),
            }),
          },
        ]}
      >
        <Input placeholder="Full Name" />
      </Form.Item>
      <Form.Item
        label={formatMessage({ id: 'email' })}
        name="email"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('address'),
            }),
          },
          {
            type: 'email',
          },
        ]}
      >
        <Input placeholder="email" />
      </Form.Item>
      <Form.Item
        name="status"
        label={'Trạng thái'}
      >
        <Select>
          <Select.Option value={'0'} >
            Tạm khoá
          </Select.Option>
          <Select.Option value={'1'} >
            Được đăng nhập
          </Select.Option>
          <Select.Option value={'2'} >
            Bị Cấm
          </Select.Option>
        </Select>
      </Form.Item>
    </div>
  );
};

export default PersonalInfo;
