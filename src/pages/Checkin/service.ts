import { API_PATH, privateRequest, request } from '@/utils/apis';

export const onSubmitValue = (data: any) => {
  return privateRequest(request.get, API_PATH.get_keeping);
};
