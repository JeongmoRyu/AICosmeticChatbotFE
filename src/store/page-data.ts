import { atom } from 'recoil';

const listTotalCount = atom({
  key: 'listTotalCount',
  default: 0,
});

const listPageCount = atom({
  key: 'listPageCount',
  default: 1,
});

const pagesList = atom({
  key: 'pagesList',
  default: [1],
});

const pageIndex = atom({
  key: 'pageIndex',
  default: 1,
});

export { listTotalCount, listPageCount, pagesList, pageIndex };
