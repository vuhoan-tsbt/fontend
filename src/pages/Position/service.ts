import { formatTime } from '../../utils/formatTime';
import { privateRequest, request, API_PATH } from '@/utils/apis';
import { ENVIRONMENTS } from '@/utils/constant';

interface Result {
  list: any[];
}

export const getTableData = (
  { current, pageSize }: { current: number; pageSize: number },
  formData: {
    fullName: string;
  },
): Promise<Result> => {
  if (formData.fullName === undefined) {
    formData.fullName = '';
  }
  const data = {
    page: current,
    size: pageSize,
  };

  return privateRequest(request.post, API_PATH.list_position, {
    data: {
      ...data,
      position: formData.fullName,
    },
  }).then((res: any) => {
    console.log('🚀 ~ file: service.ts:30 ~ res', res);
    const result = res?.payload?.data.map((e: any, index: any) => ({
      ...e,
      stt: index + 1,
    }));
    return {
      list: result,
      total: res?.payload?.totalPages,
    };
  });
};

export const deleteAdmin = (id: any) => {
  return privateRequest(request.delete, API_PATH.delete_position + id);
};

export const switchStatusAdmin = (id: any) => {
  const query = `
    mutation {
      switch_status_admin(id: "${id}")
    }
  `;
  return privateRequest(request.post, API_PATH.default, {
    data: {
      query,
    },
  });
};
