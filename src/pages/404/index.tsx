import { Button, Result } from 'antd';
import { useHistory } from 'umi';
import React from 'react';

const App: React.FC = () => {
  const history = useHistory();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button onClick={() => history.push('/')} type="primary">
          Back Home
        </Button>
      }
    />
  );
};

export default App;
