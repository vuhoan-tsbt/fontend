import { formatTime } from '../../utils/formatTime';
import { privateRequest, request, API_PATH } from '@/utils/apis';
import { ENVIRONMENTS } from '@/utils/constant';

interface Result {
  list: any[];
}

export const getTableData = (
  { current, pageSize }: { current: number; pageSize: number },
  formData: {
    months: string;
  },
): Promise<Result> => {
  if (formData.months === undefined) {
    formData.months = '';
  }
  const data = {
    page: current,
    size: pageSize
  };

  return privateRequest(request.post, API_PATH.list_salary, {
    data: {
      ...data,
      months: formData.months
    }
  }).then(
    (res: any) => {
      console.log("🚀 ~ file: service.ts:37 ~ res", res)
      const result = res?.payload?.data.map(
        (e: any, index: any) => ({
          ...e,
          stt: index + 1,
        }),
      );
      return {
        list: result,
        total: res?.payload?.totalElements,
      }
    },
  );
};

export const deleteAdmin = (id: any) => {
  return privateRequest(request.delete, API_PATH.deleteDepartment + id);
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
