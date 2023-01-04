import { useIntl } from 'umi';

export const useTranslate = () => {
  const { formatMessage } = useIntl();

  const t = (key: string, options?: any) => {
    return formatMessage(
      {
        id: key,
      },
      options,
    );
  };

  return { t };
};
