import Pagination from 'components/Pagination';
import { EMBEDDING_HISTORY } from 'data/routers';
import EmbeddingHistory from 'pages/EmbeddingHistory';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { listPageCount, pagesList, pageIndex } from 'store/page-data';

interface QAData {
  id: number;
  question: string;
  answer: string;
  doc_id: string;
  chunk: string;
}

interface RankingData {
  id: number;
  name: string;
  embeddingModel: string;
  hitAccuracy: number;
  notes: string;
}


const TABS: toggleListProps[] = [
  { id: 'qaData', label: 'QA 데이터' },
  { id: 'ranking', label: '랭킹' },
];

// QA 데이터 예시
const qaChunkingData: QAData[] = Array.from({ length: 93 }, (_, i) => ({
  id: i + 1,
  question: `질문 ${i + 1}`,
  answer: `답변 ${i + 1}`,
  doc_id: `doc_${i + 1}`,
  chunk: `chunk_${i + 1}`,
}));

// 랭킹 데이터 예시
const rankingModelData: RankingData[] = Array.from({ length: 77 }, (_, i) => ({
  id: i + 1,
  name: `모델 ${i + 1}`,
  embeddingModel: `모델 구성 ${i + 1}`,
  hitAccuracy: Math.floor(Math.random() * 100),
  notes: `비고 ${i + 1}`,
}));



export default function EmbeddingLeaderboard() {
  const navigate = useNavigate();
  const [tabActive, setTabActive] = useState('qaData');
  const [modalRect, setModalRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [selectedTdId, setSelectedTdId] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const location = useLocation();
  const leaderboardId = location.state?.id !== undefined ? location.state.id : null;
  const leaderboardTopK = location.state?.topK !== undefined ? location.state.topK : 5;
  // console.log(leaderboardId, leaderboardTopK)

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
  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);
  const setPageCount = useSetRecoilState(listPageCount);
  const setPages = useSetRecoilState(pagesList);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // 탭별 데이터 상태
  const dataToDisplay = tabActive === 'qaData'
    ? qaChunkingData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : rankingModelData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 페이지네이션 업데이트
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 500));
      const totalPages = Math.ceil(
        (tabActive === 'qaData' ? qaChunkingData.length : rankingModelData.length) / itemsPerPage
      );
      setPageCount(totalPages);
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
      setIsLoading(false);
    };
    loadData();
  }, [tabActive, setPageCount, setPages]);

  // useEffect(() => {
  //   const totalPages = Math.ceil(
  //     (tabActive === 'qaData' ? qaMockData.length : rankingMockData.length) / itemsPerPage
  //   );
  //   setPageCount(totalPages);
  //   setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  // }, [tabActive, setPageCount, setPages]);


  useEffect(() => {
    const totalPages = Math.ceil(
      (tabActive === 'qaData' ? qaChunkingData.length : rankingModelData.length) / itemsPerPage
    );
    setPageCount(totalPages);
    setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  }, [tabActive, setPageCount, setPages]);

  return (
    <div className='page_ranker bg_white'>
      <div className='head_wrap'>
        <p className='txt_navigation'>
          Embedding Ranker<span className='ico_arrow'>&gt;</span>
          <em>QA 데이터 및 랭킹</em>
        </p>
        <button type='button' className='btn_type white big' onClick={() => navigate(EMBEDDING_HISTORY)}>
          히스토리
        </button>
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
        {tabActive === 'qaData' && (
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
                      dataToDisplay.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `${tabActive}_${item.id}_1`, tabActive === 'qaData' ? (item as QAData).question : (item as RankingData).name)}
                            >
                              <span className='second_line_ellipsis'>
                                {tabActive === 'qaData' ? (item as QAData).question : (item as RankingData).name}
                              </span>
                            </button>
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `${tabActive}_${item.id}_2`, tabActive === 'qaData' ? (item as QAData).answer : (item as RankingData).embeddingModel)}
                            >
                              <span className='second_line_ellipsis'>
                                {tabActive === 'qaData' ? (item as QAData).answer : (item as RankingData).embeddingModel}
                              </span>
                            </button>
                          </td>
                          <td>
                            {tabActive === 'qaData' ? (item as QAData).doc_id : (item as RankingData).hitAccuracy}
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `${tabActive}_${item.id}_3`, tabActive === 'qaData' ? (item as QAData).chunk : (item as RankingData).notes)}
                            >
                              <span className='second_line_ellipsis'>
                                {tabActive === 'qaData' ? (item as QAData).chunk : (item as RankingData).notes}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>                  
                  {/* <tbody>
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
                              onClick={(e) => handleModalClick(e, `${tabActive}_${item.id}_1`, tabActive === 'qaData' ? (item as QAData).question : (item as RankingData).name)}
                            >
                              <span className='second_line_ellipsis'>
                                {tabActive === 'qaData' ? (item as QAData).question : (item as RankingData).name}
                              </span>
                            </button>
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `${tabActive}_${item.id}_2`, tabActive === 'qaData' ? (item as QAData).answer : (item as RankingData).embeddingModel)}
                            >
                              <span className='second_line_ellipsis'>
                                {tabActive === 'qaData' ? (item as QAData).answer : (item as RankingData).embeddingModel}
                              </span>
                            </button>
                          </td>
                          <td>
                            {tabActive === 'qaData' ? (item as QAData).doc_id : (item as RankingData).hitAccuracy}
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `${tabActive}_${item.id}_3`, tabActive === 'qaData' ? (item as QAData).chunk : (item as RankingData).notes)}
                            >
                              <span className='second_line_ellipsis'>
                                {tabActive === 'qaData' ? (item as QAData).chunk : (item as RankingData).notes}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>                   */}
                </table>
              </div>
              <Pagination />
            </div>
          </>
        )}
        {tabActive === 'ranking' && (
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
                              onClick={(e) => handleModalClick(e, `ranking_${item.id}_name`, item.name)}
                            >
                              <span className='second_line_ellipsis'>{item.name}</span>
                            </button>
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `ranking_${item.id}_embedding`, item.embeddingModel)}
                            >
                              <span className='second_line_ellipsis'>{item.embeddingModel}</span>
                            </button>
                          </td>
                          <td>{(item.hitAccuracy).toFixed(2)}</td>
                          <td>
                            <button
                              type='button'
                              className='btn_cell_modal'
                              onClick={(e) => handleModalClick(e, `ranking_${item.id}_etc`, item.notes)}
                            >
                              <span className='second_line_ellipsis'>{item.notes}</span>
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
