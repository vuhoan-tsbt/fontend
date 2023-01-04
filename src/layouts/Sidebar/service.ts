import { API_PATH, privateRequest, request } from '@/utils/apis';

export const onSubmitValue = () => {
  return privateRequest(request.get, API_PATH.create_meet);
};
