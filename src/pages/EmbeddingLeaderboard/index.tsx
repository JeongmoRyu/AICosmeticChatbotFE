import Pagination from 'components/Pagination';
import { EMBEDDING_HISTORY } from 'data/routers';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { listPageCount, pagesList, pageIndex } from 'store/page-data';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { showNotification } from 'utils/common-helper';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import {
  isLoadingState as useIsLoadingState,
} from 'store/pro-ai';

const TABS: toggleListProps[] = [
  { id: 'QaData', label: 'QA 데이터' },
  { id: 'Ranking', label: '랭킹' },
];

export default function EmbeddingLeaderboard() {
  const navigate = useNavigate();
  const [tabActive, setTabActive] = useState('QaData');
  const [modalRect, setModalRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [selectedTdId, setSelectedTdId] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const location = useLocation();
  const leaderboardId = location.state?.id !== undefined ? location.state.id : null;
  const leaderboardTopK = location.state?.topK !== undefined ? location.state.topK : 5;
  // console.log(leaderboardId, leaderboardTopK)
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [qaTotalData, setQaTotalData] = useState<QADetailData[]>([]);
  const [rankingTotalData, setRankingTotalData] = useState<RankingData[]>([]);
  const [qaTotalPage, setQaTotalPage] = useState<number>(0);
  const [rankingTotalPage, setRankingTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);
  const [pageCount, setPageCount] = useRecoilState(listPageCount);
  const resetPageCount = useResetRecoilState(listPageCount);
  const setPages = useSetRecoilState(pagesList);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingState, setIsLoadingState] = useRecoilState(useIsLoadingState);
  const [shouldNavigate, setShouldNavigate] = useState(false);


  const tabClick = (e: React.MouseEvent<HTMLAnchorElement>, tabId: string) => {
    e.preventDefault();
    setTabActive(tabId);
    setCurrentPage(1);
  };

  const handleModalClick = (e, id, text) => {
    const tdRect = e.target.getBoundingClientRect();
    if (selectedTdId === id) {
      setModalRect({
        x: tdRect.left + window.scrollX,
        y: tdRect.top + window.scrollY,
        w: tdRect.width + 15,
        h: tdRect.height + 15,
      });
      setSelectedText(text);
    } else {
      setSelectedTdId(id);
    }
  };
  const handleModalClose = (event) => {
    if (event.target === event.currentTarget) {
      setModalRect({ x: 0, y: 0, w: 0, h: 0 });
      setSelectedText('');
      setSelectedTdId(null); // 모달 닫힘과 동시에 선택 초기화
    }
  };

  // Pagination 추가

  // useEffect(() => {
  //   console.log(currentPage)
  //   getQAData(leaderboardId);
  //   getRankingData(leaderboardId);
  // }, []);
  useEffect(() => {
    setCurrentPage(1);
    const fetchInitialData = async () => {
      setIsLoading(true);
      setIsLoadingState(true);
      const { totalPages: qaPages } = await getQAData(leaderboardId, 0);
      const { totalPages: rankingPages } = await getRankingData(leaderboardId, 0);

      setQaTotalPage(qaPages);
      setRankingTotalPage(rankingPages);

      await Promise.all([
        fetchAllQAData(leaderboardId, qaPages),
        fetchAllRankingData(leaderboardId, rankingPages)
      ]);
      setIsLoading(false);
      setIsLoadingState(false);
    };
    fetchInitialData();

  }, [leaderboardId]);

  const handleNavigateToHistory = () => {
    resetPageCount();
    setShouldNavigate(true); // 상태 변경 후 이동 플래그 설정
  };

  useEffect(() => {
    if (shouldNavigate && pageCount === 1) {
      navigate(EMBEDDING_HISTORY);
    }
  }, [shouldNavigate, pageCount, navigate]);

  const fetchAllQAData = async (data_id: number, totalPages: number) => {
    let allData: QADetailData[] = [];
    for (let page = 0; page < totalPages; page++) {
      const { content } = await getQAData(data_id, page);
      allData = [...allData, ...content];
    }
    setQaTotalData(allData);
  };

  const fetchAllRankingData = async (data_id: number, totalPages: number) => {
    let allData: RankingData[] = [];
    for (let page = 0; page < totalPages; page++) {
      const { content } = await getRankingData(data_id, page);
      allData = [...allData, ...content];
    }
    setRankingTotalData(allData);
  };

  const getQAData = async (data_id: number, page: number) => {
    const params = { page, size: itemsPerPage };
    const response = await sendRequestProAI(`/ranker/evaluate-history/qa/${data_id}`, 'get', undefined, undefined, params);
    if (response && response.data) {
      const { data } = response.data;
      if (page === 0) {
        console.log(`QA Total Pages: ${data.total_pages}`);
      }
      return { totalPages: data.total_pages, content: data.content };
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return { totalPages: 0, content: [] };
    }
  };

  const getRankingData = async (data_id: number, page: number) => {
    const params = { page, size: itemsPerPage };
    const response = await sendRequestProAI(`/ranker/evaluate-history/ranking/${data_id}`, 'get', undefined, undefined, params);
    if (response && response.data) {
      const { data } = response.data;
      if (page === 0) {
        console.log(`Ranking Total Pages: ${data.total_pages}`);
      }
      return { totalPages: data.total_pages, content: data.content };
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return { totalPages: 0, content: [] };
    }
  };

  useEffect(() => {
    const totalPages = tabActive === 'QaData' ? qaTotalPage : rankingTotalPage;
    setPageCount(totalPages);
    setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  }, [tabActive, qaTotalPage, rankingTotalPage, setPageCount, setPages]);

  // 탭별 데이터 상태
  const dataToDisplay = tabActive === 'QaData'
    ? qaTotalData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : rankingTotalData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  // 페이지네이션 업데이트
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 500));
      const totalPages = Math.ceil(
        (tabActive === 'QaData' ? qaTotalData.length : rankingTotalData.length) / itemsPerPage
      );
      setPageCount(totalPages);
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
      setIsLoading(false);
    };
    loadData();
  }, [tabActive, setPageCount, setPages]);


  useEffect(() => {
    const totalPages = Math.ceil(
      (tabActive === 'QaData' ? qaTotalData.length : rankingTotalData.length) / itemsPerPage
    );
    setPageCount(totalPages);
    setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  }, [tabActive, setPageCount, setPages]);

  // excel로 파일 전환
  const exportToExcel = async () => {
    const workbook = new Workbook();

    const qaWorksheet = workbook.addWorksheet('QA Data');
    qaWorksheet.columns = [
      { header: 'No', key: 'id', width: 10 },
      { header: 'Question', key: 'question', width: 30 },
      { header: 'Answer', key: 'answer', width: 30 },
      { header: 'doc_id', key: 'doc_id', width: 15 },
      { header: 'chunk', key: 'chunk', width: 15 },
    ];
    qaTotalData.forEach((data) => {
      qaWorksheet.addRow(data);
    });

    const rankingWorksheet = workbook.addWorksheet('Ranking Data');
    rankingWorksheet.columns = [
      { header: 'No', key: 'id', width: 10 },
      { header: 'Name', key: 'model_name', width: 30 },
      { header: 'Embedding Model', key: 'embedding_model_config', width: 30 },
      { header: 'Hit Accuracy', key: 'hit_accuracy', width: 15 },
      { header: 'Description', key: 'description', width: 15 },
    ];
    rankingTotalData.forEach((data) => {
      rankingWorksheet.addRow(data);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'EmbeddingData.xlsx');
  };

  return (
    <div className='page_ranker bg_white'>
      <div className='head_wrap'>
        <p className='txt_navigation'>
          Embedding Ranker<span className='ico_arrow'>&gt;</span>
          <em>QA 데이터 및 랭킹</em>
        </p>
        <div className='flex flex-row space-x-2'>
          <button type='button' className='btn_type white big' onClick={exportToExcel}>
            {/* {tabActive} 저장하기 */}
            Data 저장하기
          </button>
          <button type='button' className='btn_type white big' onClick={handleNavigateToHistory}>
            히스토리
          </button>
        </div>
      </div>

      <ul className='tab_menu'>
        {TABS.map((item) => (
          <li key={item.id} className={`${tabActive === item.id ? 'active' : ''}`}>
            <a href={`#${item.id}`} onClick={(e) => tabClick(e, item.id)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className='tab_content'>
        {tabActive === 'QaData' && (
          <>
            <div className='flex flex-col justify-between h-full'>

              <div className='table_list'>
                <table>
                  <caption className='screen_hide'>Embedding Model Leaderboard - QA 데이터</caption>
                  <colgroup>
                    <col className='cell_no' />
                    <col className='cell_question' />
                    <col className='cell_answer' />
                    <col className='cell_id' />
                    <col className='cell_chunk' />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope='col' className='cell_no'>
                        No
                      </th>
                      <th scope='col' className='cell_question'>
                        Question
                      </th>
                      <th scope='col' className='cell_answer'>
                        Answer
                      </th>
                      <th scope='col' className='cell_id'>
                        doc_id
                      </th>
                      <th scope='col' className='cell_chunk'>
                        chunk
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={1} className="text-left py-4">로딩중...</td>
                      </tr>
                    ) : dataToDisplay.length === 0 ? (
                      <tr>
                        <td colSpan={1} className="text-left py-4">데이터가 없습니다.</td>
                      </tr>
                    ) : (
                      dataToDisplay.map((item, index) => (
                        <tr key={item.id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `${tabActive}_${item.id}_1`, tabActive === 'QaData' ? (item as QADetailData).question : (item as RankingDetailData).model_name)}
                            >
                              <span className='second_line_ellipsis'>
                                {tabActive === 'QaData' ? (item as QADetailData).question : (item as RankingDetailData).model_name}
                              </span>
                            </button>
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `${tabActive}_${item.id}_2`, tabActive === 'QaData' ? (item as QADetailData).answer : (item as RankingDetailData).embedding_model_config)}
                            >
                              <span className='second_line_ellipsis'>
                                {tabActive === 'QaData' ? (item as QADetailData).answer : (item as RankingDetailData).embedding_model_config}
                              </span>
                            </button>
                          </td>
                          <td>
                            {tabActive === 'QaData' ? (item as QADetailData).doc_id : (item as RankingDetailData).hit_accuracy}
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `${tabActive}_${item.id}_3`, tabActive === 'QaData' ? (item as QADetailData).chunk : (item as RankingDetailData).description)}
                            >
                              <span className='second_line_ellipsis'>
                                {tabActive === 'QaData' ? (item as QADetailData).chunk : (item as RankingDetailData).description}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination />
            </div>
          </>
        )}
        {tabActive === 'Ranking' && (
          <>
            <div className='flex flex-col justify-between h-full'>

              <div className='table_list'>
                <table>
                  <caption className='screen_hide'>Embedding Model Leaderboard - 랭킹</caption>
                  <colgroup>
                    <col className='cell_no' />
                    <col className='cell_name' />
                    <col className='cell_embedding' />
                    <col className='cell_accuracy' />
                    <col className='cell_etc' />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope='col' className='cell_no'>
                        No
                      </th>
                      <th scope='col' className='cell_name'>
                        이름
                      </th>
                      <th scope='col' className='cell_embedding'>
                        임베딩 모델 구성
                      </th>
                      <th scope='col' className='cell_accuracy'>
                        @{leaderboardTopK} hit accuracy (%)
                      </th>
                      <th scope='col' className='cell_etc'>
                        비고
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={1} className="text-left py-4">로딩중...</td>
                      </tr>
                    ) : dataToDisplay.length === 0 ? (
                      <tr>
                        <td colSpan={1} className="text-left py-4">데이터가 없습니다.</td>
                      </tr>
                    ) : (
                      dataToDisplay.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `Ranking_${item.id}_name`, item.model_name)}
                            >
                              <span className='second_line_ellipsis'>{item.model_name}</span>
                            </button>
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `Ranking_${item.id}_embedding`, item.embedding_model_config)}
                            >
                              <span className='second_line_ellipsis'>{item.embedding_model_config}</span>
                            </button>
                          </td>
                          <td>{(item.hit_accuracy).toFixed(2)}</td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `Ranking_${item.id}_etc`, item.description)}
                            >
                              <span className='second_line_ellipsis'>{item.description}</span>
                            </button>
                          </td>
                        </tr>
                      )))}
                  </tbody>
                </table>
              </div>
              <Pagination />
            </div>
          </>
        )}
      </div>
      {selectedText && (
        <div className='cell_modal_wrap' onClick={handleModalClose}>
          <div className='cell_modal' style={{ left: modalRect.x, top: modalRect.y, width: modalRect.w }}>
            <p>{selectedText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
