import { API_PATH, privateRequest, request } from '@/utils/apis';



export const onSubmitValue = (data: any, id: any) => {
  return privateRequest(request.post, API_PATH.updateUser + '/' + id, {
    data,
  });
};

export const getOneUser = (id: any) => {
  return privateRequest(request.get, API_PATH.getUser + id);
};

export const getDepartment = () => {
  return privateRequest(request.get, API_PATH.department);
};

export const getPosition = () => {
  return privateRequest(request.get, API_PATH.list_position);
};
