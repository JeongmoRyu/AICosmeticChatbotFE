import Pagination from 'components/Pagination';
import { EMBEDDING_RANKER } from 'data/routers';
import EmbeddingSetting from 'pages/EmbeddingRanker/components/EmbeddingSetting';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { listPageCount, pagesList, pageIndex } from 'store/page-data';

export default function EmbeddingHistory() {
  const navigate = useNavigate();
  const [isMyHistory, setIsMyHistory] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [settingData, setSettingData] = useState<IRankerData>({
    files: [],
    jsonMap: {
      name: '',
      top_k: 5,
      chunking_settings: {
        use_semantic_chunk: false,
        use_fixed_chunk: true,
        fixed_chunk_size: 2100,
        fixed_chunk_overlap: 2100,
        semantic_chunk_bp_type: 'percentile',
        semantic_chunk_embedding: 'text-embedding-ada-002'
      },
      embedding_models: [],
      client_id: ''
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // const handleTimeStampClick = () => {
  //   console.log('Clicked timestamp:');
  //   // setIsMyHistory(!isMyHistory);
  //   setIsMyHistory(prev => !prev);
  //   // 여기에 필요한 로직 추가
  // };


  const handleChangeSetting = (type: string, key: string, value: any) => {
    return;
  };

  // Pagination
  interface HistoryItem {
    id: number;
    name: string;
    timestamp: string;
    author: string;
    status?: 'completed' | 'processing';
  }


  const mockData: HistoryItem[] = Array.from({ length: 70 }, (_, i) => ({
    id: i + 1,
    name: `Embedding Model Test #${i + 1} - ${['BERT', 'KoBERT', 'RoBERTa', 'XLM'][i % 4]} 기반 임베딩 ${i + 1}`,
    timestamp: new Date(2024, 0, 15 - i).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.'),
    author: i % 3 === 0 ? '홍길동' : i % 3 === 1 ? '김철수' : '이영희',
    status: i % 5 === 0 ? 'processing' : 'completed'
  }));
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const setPageCount = useSetRecoilState(listPageCount);
  const setPages = useSetRecoilState(pagesList);
  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const loadHistoryData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 대기 시간 추가
      // await new Promise(resolve => setTimeout(resolve, 500));
      // 내 히스토리만 보기 필터링
      const filteredData = isMyHistory
        ? mockData.filter(item => item.author === '홍길동')
        : mockData;
      // console.log('필터링된 데이터:', filteredData); 
      // 현재 페이지에 해당하는 데이터만 슬라이싱
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      setHistoryData(paginatedData);
      // 전체 페이지 수 계산
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      setPageCount(totalPages);
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isMyHistory, itemsPerPage]);

  const handleRowClick = (item) => {
    if (item.status === 'processing') {
      return;
    }
    console.log('*************hello*************:', item);
  };

  useEffect(() => {
    loadHistoryData();
  }, [loadHistoryData, currentPage, isMyHistory]);

  return (
    <div className='page_ranker'>
      <div className='head_wrap'>
        <p className='txt_navigation'>
          Embedding Ranker<span className='ico_arrow'>&gt;</span>
          <em>History</em>
        </p>
        <button type='button' className='btn_type white big' onClick={() => navigate(EMBEDDING_RANKER)}>
          생성하기
        </button>
      </div>

      <div className='row_box'>
        <div className='round_border_box'>
          <div className='scroll_wrap'>
            <div className='flex flex-col justify-between h-full'>
              <div className='table_list table_history_list'>

                <table>
                  <caption className='screen_hide'>Embedding Model Leaderboard - History</caption>
                  <colgroup>
                    <col className='cell_no' />
                    <col className='cell_history_name' />
                    <col className='cell_timestamp' />
                    <col className='cell_author' />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope='col' className='cell_no'>
                        No
                      </th>
                      <th scope='col' className='cell_history_name'>
                        Name
                      </th>
                      <th scope='col' className='cell_timestamp'>
                        Timestamp
                      </th>
                      <th scope='col' className='cell_author relative'>
                        <div ref={dropdownRef} className='w-full'>
                          <button
                            className='w-full text-left font-medium hover:text-primary-darkblue flex items-center justify-between'
                            onClick={() => setIsDropdownOpen(prev => !prev)}
                          >
                            <span>작성자</span>
                            <span className='text-xs'>▼</span>
                          </button>

                          {isDropdownOpen && (
                            <div className='absolute top-full left-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-10'>
                              <div className='p-3'>
                                <div className='flex items-center justify-between mb-2'>
                                  <span className='text-sm font-medium'>내 히스토리만 보기</span>
                                  <button
                                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${isMyHistory ? 'bg-primary-darkblue' : 'bg-[#F4F6F8]'
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsMyHistory(prev => !prev);
                                      setCurrentPage(1);
                                    }}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isMyHistory ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                    />
                                  </button>
                                </div>
                                <div className='text-xs text-gray-500'>
                                  {isMyHistory ? '내가 작성한 히스토리만 표시됩니다' : '모든 히스토리가 표시됩니다'}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">로딩중...</td>
                      </tr>
                    ) : historyData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">데이터가 없습니다.</td>
                      </tr>
                    ) : (
                      historyData.map((item, index) => (
                        <tr key={item.id}>                          
                          <td onClick={() => handleRowClick(item)} className="cursor-pointer">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td onClick={() => handleRowClick(item)} className="cursor-pointer">
                            <span className='second_line_ellipsis'>
                              {item.name}
                            </span>
                          </td>
                          <td onClick={() => handleRowClick(item)} className="cursor-pointer">
                            {item.status === 'processing' ? (
                              <span className='state'>생성중...</span>
                            ) : (
                              <span className='second_line_ellipsis'>{item.timestamp}</span>
                            )}
                          </td>
                          <td onClick={() => handleRowClick(item)} className="cursor-pointer">{item.author}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination />
            </div>
          </div>
        </div>
        <div className='round_border_box'>
          <div className='scroll_wrap'>
            <EmbeddingSetting type='history' data={settingData.jsonMap} />
          </div>
        </div>
      </div>
    </div>
  );
}
