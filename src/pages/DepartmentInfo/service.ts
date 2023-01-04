import { API_PATH, privateRequest, request } from '@/utils/apis';

export const onSubmitValue = (data: any) => {
  return privateRequest(request.post, API_PATH.createDepartment, {
    data,
  });
};
export const onEditValue = (data: any, id: any) => {
  return privateRequest(request.put, API_PATH.updateDepartment + '/' + id, {
    data,
  });
};

export const getDepartment = () => {
  return privateRequest(request.get, API_PATH.department);
};

export const getPosition = () => {
  return privateRequest(request.get, API_PATH.list_position);
};
