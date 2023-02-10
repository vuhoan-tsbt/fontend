import { extend } from 'umi-request';
import axios from 'axios';
import { ENVIRONMENTS } from '../constant';
import TokenManagement from './TokenManagement';

const localeInfo = localStorage.getItem('umi_locale') || 'vi-VN';

const request = extend({
  prefix: ENVIRONMENTS.API_URL,
});

const injectBearer = (token: string, configs: any) => {
  console.log(localeInfo);
  if (!configs) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': localeInfo,
      },
    };
  }

  if (configs.headers) {
    return {
      ...configs,
      headers: {
        ...configs.headers,
        Authorization: `Bearer ${token}`,
        'Accept-Language': localeInfo,
      },
    };
  }

  return {
    ...configs,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': localeInfo,
    },
  };
};

const TokenManager = new TokenManagement({
  isTokenValid: () => {
    const localInfo = window?.localStorage.getItem(
      ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
    );
    let localInfoObject;

    if (localInfo) {
      localInfoObject = JSON.parse(localInfo);
    }
    return !!localInfoObject?.token;
  },
  getAccessToken: () => {
    const localInfo = window?.localStorage.getItem(
      ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
    );
    let localInfoObject;

    if (localInfo) {
      localInfoObject = JSON.parse(localInfo);
    }

    return localInfoObject?.token || '';
  },
  onRefreshToken(done) {
    const localInfo = window?.localStorage.getItem(
      ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
    );
    let localInfoObject;
    if (localInfo) {
      localInfoObject = JSON.parse(localInfo);
    }
    const refreshToken =
      localInfoObject?.data?.login_admin?.data?.refresh_token;
    request
      .post('/graphql', {
        data: {
          query: `
            mutation {
              refresh_token(input: "${refreshToken}", type: 1) {
                token
                refresh_token
              }
            }
          `,
        },
      })
      .then((result) => {
        if (
          result.data?.refresh_token.refresh_token &&
          result.data?.refresh_token.token
        ) {
          done(result.data?.refresh_token);
          return;
        }
        done(null);
      })
      .catch((err) => {
        console.error(err);
        done(null);
      });
  },
});

const privateRequest = async (
  request: any,
  suffixUrl: string,
  configs?: any,
) => {
  const token: string = (await TokenManager.getToken()) as string;
  return request(suffixUrl, injectBearer(token, configs)).then(
    async (res: any) => {
      if (
        res.errors &&
        res.errors[0].extensions?.response?.statusCode === 401
      ) {
        await TokenManager.getNewToken().then((res: any) => {
          if (!res) return;
          const localInfo = window?.localStorage.getItem(
            ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
          );
          let localInfoObject;

          if (localInfo) {
            localInfoObject = JSON.parse(localInfo);
          }
          if (localInfoObject?.data?.login_admin?.data) {
            localInfoObject.data.login_admin.data.token = res.token;
            localInfoObject.data.login_admin.data.refresh_token =
              res.refresh_token;
          }
          window?.localStorage.setItem(
            ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
            JSON.stringify(localInfoObject),
          );
          window?.location.reload();
        });
      }
      return res;
    },
  );
};

const API_PATH = {
  default: '/graphql',
  // Auth
  createUser: '/api/admin/create-employee',
  updateProfile: '/api/user/information',
  chain_password: '/api/user/chain_password',
  updateUser: '/api/admin/user',
  getUser: '/api/user/get-user/',
  deleteUser: '/api/admin/user/',

  list_department: '/api/department/list_department',
  list_department_user: '/api/user/department',
  createDepartment: '/api/department/create',
  updateDepartment: '/api/department/update',
  deleteDepartment: '/api/department/delete/',

  list_position: '/api/position/list-position',
  create_position: '/api/position/create-position',
  update_position: '/api/position/update-position',
  delete_position: '/api/position/delete-position/',

  list_policy: '/api/policy/list-policy',
  create_policy: '/api/policy/create-policy',
  update_policy: '/api/policy/update-policy',
  delete_policy: '/api/policy/delete-policy/',

  list_news: '/api/news/list-news',
  list_news_user: '/api/user/news',
  create_news: '/api/news/create-news',
  update_news: '/api/news/update-news',
  delete_news: '/api/news/delete-news/',

  create_meet: '/zoom/meeting',

  forgot_email: '/api/auth/forgot_password',
  reset_pass: '/api/auth/reset-otp',
  forgot_phone: '/api/auth/forgot-otp',

  my_profile: '/api/user/profile',

  list_salary: '/api/dot/list-salary',
  dot_information: '/api/dot/dot_information',

  get_keeping: '/api/timekeeping/get-keeping',

  salary: '/api/dot/salary',
  keepingDay: '/api/dot/keeping-day',
  checkin: '/api/timekeeping/entry',
  checkout: '/api/timekeeping/out',

  UPLOAD: '/api/avatar/upload_images',
  LOGIN: '/api/auth/login',
  LIST_USER: '/api/admin/list-user',
  LIST_USER_USER: '/api/user/list-employee',
  REFRESH_TOKEN: '/auth/refreshToken',
  FORGOT_PASSWORD: '/auth/forgotPassword',
  department: '/api/user/department',
  RESET_PASSWORD: '/auth/resetPassword',
  LOGOUT: '/auth/logout',
  USER: '/user',
  ADMIN_USER: 'admin/user',
};

export { API_PATH, request, privateRequest };
