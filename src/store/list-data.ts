import { atom } from 'recoil';

interface filterProps {
  field: string | undefined;
  value: string | undefined;
}

interface periodProps {
  field: string;
  start_date: string;
  end_date: string;
}

interface orderProps {
  field: string;
  order: number;
}

export interface getListParamsProps {
  skip: number;
  limit: number;
  timezone: string;
  app_id: string;
  filter: filterProps[];
  period: periodProps;
  order: orderProps[];
}

const getListParams = atom<getListParamsProps>({
  key: 'getListParams',
  default: {
    skip: 0,
    limit: 10,
    timezone: 'Asia/Seoul',
    app_id: 'bonus_app_id',
    filter: [],
    period: {
      field: 'createdAt',
      start_date: '',
      end_date: '',
    },
    order: [
      {
        field: 'createdAt',
        order: -1,
      },
    ],
  },
});

const fetchListData = atom<any>({
  key: 'fetchListData',
  default: [],
});

export { getListParams, fetchListData };
