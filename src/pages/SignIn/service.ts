import { useAuth } from '@/utils/hooks/useAuth';
import { API_PATH, request } from '@/utils/apis';
import { useRequest } from 'ahooks';
import { message } from 'antd';

export const useLogin = () => {
  const { onLogin } = useAuth();

  return useRequest(
    async (values) => {
      return request.post(API_PATH.LOGIN, {
        data: {
          email: values?.phone_number?.trim(),
          password: values?.password
        },
      });
    },
    {
      manual: true,
      onSuccess: (result) => {
        if (!result.payload || result?.code === 400 || result?.code === 404) throw new Error('Account not found');
        console.log("🚀 ~ file: service.ts:32 ~ useLogin ~ result", result)
        const loginItem = {
          token: result.payload.token,
          refreshToken: result.payload.refresh_token,
          role: result.payload.role,
          fullName: result.payload.fullName,
        };
        onLogin(loginItem);
      },
      onError: (err) => {
        message.error(err?.message || 'Login failed');
      },
    },
  );
};
