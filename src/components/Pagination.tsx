import { useState, useEffect } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';
import { getListParams as useGetListParams } from 'store/list-data';
import { listPageCount, pagesList, pageIndex } from 'store/page-data';

function Pagination() {
  const [pageGroup, setPageGroup] = useState([]);

  const [getListParams, setListParams] = useRecoilState(useGetListParams);
  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);

  const pageCount = useRecoilValue(listPageCount);
  const pages = useRecoilValue(pagesList);

  // 5개 페이징 버튼 그룹 생성
  const makePageInfo = (pages) => {
    const pageArr: number[] = [];
    const pagination: any = () => {
      for (let i = 0; i < pages.length; i += 5) {
        pageArr.push(pages.slice(i, i + 5));
      }
      return pageArr;
    };

    const currentGroup = pagination(pageArr)[Math.floor((currentPage - 1) / 5)];

    // let pageInfo = { arr: currentGroup.map((el) => el) };

    return { arr: currentGroup.map((el) => el) };
  };

  // 페이징 처리
  useEffect(() => {
    if (pages.length > 0) {
      makePageInfo(pages);
      setPageGroup(makePageInfo(pages)?.arr);
    }
  }, [pages, currentPage]);

  // 현재 페이지 변경 시 워크플로우 목록 불러오는 파라미터 변경
  useEffect(() => {
    if (currentPage) {
      setListParams((prevState) => ({
        ...prevState,
        skip: (currentPage - 1) * getListParams.limit,
      }));
    }
  }, [currentPage]);

  return (
    <div className='paging'>
      <nav>
        <ul>
          <li className='page-item'>
            <a
              className={currentPage === 1 ? 'page-link prev-first disabled' : 'page-link prev-first'}
              href='#'
              onClick={() => setCurrentPage(1)}
            />
          </li>
          <li className='page-item'>
            <a
              className={currentPage === 1 ? 'page-link prev disabled' : 'page-link prev'}
              href='#'
              onClick={() => setCurrentPage(currentPage - 1)}
            />
          </li>

          <>
            {pageGroup.length &&
              pageGroup.map((page) => {
                if (pages.length > 0) {
                  return (
                    <li key={page} className='page-item'>
                      <a
                        className={currentPage === page ? 'page-link active' : 'page-link'}
                        href='#'
                        onClick={() => {
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </a>
                    </li>
                  );
                }
              })}
          </>

          <li className='page-item'>
            <a
              className={currentPage === pageCount ? 'page-link next disabled' : 'page-link next'}
              href='#'
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </li>
          <li className='page-item'>
            <a
              className={currentPage === pageCount ? 'page-link next-end disabled' : 'page-link next-end'}
              href='#'
              onClick={() => setCurrentPage(pageCount)}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
