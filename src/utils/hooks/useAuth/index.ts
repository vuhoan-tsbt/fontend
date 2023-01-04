import { ENVIRONMENTS } from '@/utils/constant';
import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { isBrowser, history } from 'umi';

const authCache =
  isBrowser() &&
  window?.localStorage.getItem(ENVIRONMENTS.LOCAL_STORAGE_KEY as string);

interface IAuth {
  loading?: boolean;
  token: string | null;
  refreshToken: string | null;
  expiredTime?: number | null;
}

let initialAuth: IAuth = {
  loading: true,
  token: null,
  refreshToken: null,
  expiredTime: 0,
};

if (authCache) {
  initialAuth = JSON.parse(authCache);
}

export const authAtom = atom({
  key: `${ENVIRONMENTS.LOCAL_STORAGE_KEY}_AUTH`,
  default: {
    ...initialAuth,
  },
});

const getAuthLocalStorage = () => {
  try {
    const authData = window?.localStorage.getItem(
      ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
    );
    let authObj = {};
    if (authData) {
      authObj = JSON.parse(authData);
    }
    return authObj;
  } catch (error) { }
};

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authAtom);

  useEffect(() => {
    const authData = getAuthLocalStorage() as IAuth;
    setAuth({
      ...auth,
      ...authData,
      loading: false,
    });
  }, []);

  const setAuthData = (data: IAuth): void => {
    setAuth({ ...auth, ...data });

    window?.localStorage.setItem(
      ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
      JSON.stringify(data),
    );
  };

  const getAccessToken = () => {
    const authData: any = getAuthLocalStorage();
    return authData?.token;
  };

  const onLogout = () => {
    setAuthData({
      token: null,
      refreshToken: null,
      expiredTime: 0,
    });
    window?.localStorage.removeItem(ENVIRONMENTS.LOCAL_STORAGE_KEY as string);
    history.push('/login');
  };

  const onLogin = (data: IAuth) => {
    setAuthData(data);
    history.push('/account');
  };

  return {
    auth,
    setAuthData,
    onLogin,
    onLogout,
    getAccessToken,
  };
};
