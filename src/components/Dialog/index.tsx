import { Modal, ModalProps } from 'antd';
import React from 'react';
import styles from './index.less';

const Dialog: React.FC<ModalProps> = ({
  visible,
  children,
  title,
  onCancel,
  ...rest
}) => {
  return (
    <>
      <Modal
        title={title}
        centered
        width={720}
        onCancel={onCancel}
        visible={visible}
        footer={null}
        className={styles.modal}
      >
        {children}
      </Modal>
    </>
  );
};

export default React.memo(Dialog);
