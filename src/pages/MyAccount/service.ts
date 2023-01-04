import { API_PATH, privateRequest, request } from '@/utils/apis';

export const onSubmitValue = (data: any) => {
  return privateRequest(request.post, API_PATH.updateProfile, {
    data,
  });
};
export const changePass = (data: any) => {
  return privateRequest(request.post, API_PATH.chain_password, {
    data,
  });
};

export const getMyProfile = () => {
  return privateRequest(request.get, API_PATH.my_profile);
}

export const getDepartment = () => {
  return privateRequest(request.get, API_PATH.department);
};

export const getPosition = () => {
  return privateRequest(request.get, API_PATH.list_position);
};
