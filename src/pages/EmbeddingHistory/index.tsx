import Pagination from 'components/Pagination';
import { EMBEDDING_RANKER } from 'data/routers';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import EmbeddingSetting from 'pages/EmbeddingRanker/components/EmbeddingSetting';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { listPageCount, pagesList, pageIndex } from 'store/page-data';
import { showNotification } from 'utils/common-helper';
import {
  isLoadingState as useIsLoadingState,
} from 'store/pro-ai';
import Modal from 'components/Modal';

export default function EmbeddingHistory() {
  const navigate = useNavigate();
  const [isMyHistory, setIsMyHistory] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoadingState, setIsLoadingState] = useRecoilState(useIsLoadingState);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [totalHistoryData, setTotalHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useRecoilState(listPageCount);
  const [pageData, setPages] = useRecoilState(pagesList);
  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);
  const itemsPerPage = 10;
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [isFirstPageLoad, setIsFirstPageLoad] = useState(true);
  const [processingDataList, setProcessingDataList] = useState<HistoryItem[]>([]);
  const [tempPageDataList, setTempPageDataList] = useState<HistoryItem[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [settingData, setSettingData] = useState<IRankerData>({
    files: [],
    jsonData: {
      name: '',
      top_k: 5,
      chunking_settings: {
        use_semantic_chunk: false,
        use_fixed_chunk: true,
        fixed_chunk_size: 2100,
        fixed_chunk_overlap: 2000,
        semantic_chunk_bp_type: 'percentile',
        semantic_chunk_embedding: 'text-embedding-ada-002'
      },
      embedding_models: [],
      client_id: ''
    },
    id: 0
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

  useEffect(() => {
    setCurrentPage(1);
    getHistoryData(0, 1, true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setCurrentPage(1);
      await getHistoryData(0, pageCount, true);
    };
    fetchData();
  }, [pageCount]);

  useEffect(() => {
    if (isFirstPageLoad && historyData.length > 0) {
      const firstItem = historyData[0];
      getEvaluateData(firstItem.id)
      setIsFirstPageLoad(false);
    }
  }, [historyData, isFirstPageLoad]);

  useEffect(() => {
    loadHistoryData();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentPage, isMyHistory, totalHistoryData]);


  useEffect(() => {
    const updateProcessingData = async () => {
      const embeddingPData = historyData.filter(item => item.embedding_status === 'P');
      setProcessingDataList(embeddingPData);
    };
    updateProcessingData();
  }, [historyData]);

  useEffect(() => {
    if (processingDataList.length === 0) {
      return;
    } else {
      timerRef.current = setInterval(embeddingRefreshCheck, 5000);
      console.log('Processing data list:', processingDataList);
      console.log('Current page:', currentPage);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [processingDataList]);

  const trackPagesForProcessingData = () => {
    const pagesToCheck = new Set<number>();
    processingDataList.forEach(item => {
      const index = totalHistoryData.findIndex(totalItem => totalItem.id === item.id);
      if (index !== -1) {
        const page = Math.floor(index / itemsPerPage);
        pagesToCheck.add(page);
      }
    });
    return Array.from(pagesToCheck);
  };

  const embeddingRefreshCheck = async () => {
    const pagesToCheck = trackPagesForProcessingData();
    for (const page of pagesToCheck) {
      await fetchPageData(page, itemsPerPage, false);
    }
    const updatedProcessingDataList = processingDataList.map(item => {
      const updatedItem = totalHistoryData.find(totalItem => totalItem.id === item.id);
      if (updatedItem && updatedItem.embedding_status !== 'P') {
        getHistoryData(0, pageCount, true);
        return updatedItem;
      }
      return item;
    });
    setProcessingDataList(updatedProcessingDataList);
  };

  const loadHistoryData = useCallback(async () => {
    try {
      const filteredData = isMyHistory
        ? totalHistoryData.filter(item => item.is_mine === true)
        : totalHistoryData;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      setHistoryData(paginatedData);
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isMyHistory, itemsPerPage, totalHistoryData, pageCount]);


  const getHistoryData = async (startPage: number, endPage: number, isFirstPage: boolean = false) => {
    for (let page = startPage; page < endPage; page++) {
      await fetchPageData(page, itemsPerPage, isFirstPage);
    }
  };

  const fetchPageData = async (page: number, size: number, isFirstPage: boolean = false) => {
    if (isFirstPage) {
      setIsLoadingState(true);
    }
    const params = {
      page: page,
      size: size
    };
    const response = await sendRequestProAI('/ranker/evaluate-history', 'get', undefined, undefined, params);
    if (response && response.data) {
      const { data } = response.data;
      // console.log(data)
      if (isFirstPage) {
        setPageCount(data.total_pages);
        setIsLoadingState(false);
      }
      const tempData = data.content.map((item: HistoryItem) => {
        return {
          id: item.id,
          name: item.name,
          time_stamp: item.time_stamp,
          creator: item.creator,
          embedding_status: item.embedding_status,
          user_key: item.user_key,
          is_mine: item.is_mine
        };
      });
      setTempPageDataList(tempData);
      // console.log(tempData)
      setTotalHistoryData(prevTotalHistoryData => {
        const existingIds = new Set(prevTotalHistoryData.map(item => item.id));
        const updatedData = prevTotalHistoryData.map(item => {
          const newItem = tempData.find(tempItem => tempItem.id === item.id);
          if (newItem && newItem.embedding_status !== item.embedding_status) {
            return {
              ...item,
              embedding_status: newItem.embedding_status,
              time_stamp: newItem.time_stamp
            };
          }
          return item;
        });
        const newData = tempData.filter(item => !existingIds.has(item.id));
        const result = [...updatedData, ...newData];
        return result;
      });
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };



  const getEvaluateData = async (data_id: number) => {
    const response = await sendRequestProAI(`/ranker/evaluate-history/${data_id}`, 'get', undefined, undefined, undefined);
    if (response && response.data) {
      const { data } = response.data;
      const rankerDetail: IRankerDetail = {
        file_path: data.file_path,
        embedding_models: data.embedding_models,
        id: data.id,
        name: data.name,
        use_semantic_chunk: data.use_semantic_chunk,
        use_fixed_chunk: data.use_fixed_chunk,
        fixed_chunk_size: data.fixed_chunk_size,
        fixed_chunk_overlap: data.fixed_chunk_overlap,
        semantic_chunk_bp_type: data.semantic_chunk_bp_type,
        semantic_chunk_embedding: data.semantic_chunk_embedding,
        top_k: data.top_k
      };
      setFileList(rankerDetail.file_path)
      setSettingData({
        files: [],
        jsonData: {
          name: rankerDetail.name,
          top_k: rankerDetail.top_k,
          chunking_settings: {
            use_semantic_chunk: rankerDetail.use_semantic_chunk,
            use_fixed_chunk: rankerDetail.use_fixed_chunk,
            fixed_chunk_size: rankerDetail.fixed_chunk_size,
            fixed_chunk_overlap: rankerDetail.fixed_chunk_overlap,
            semantic_chunk_bp_type: rankerDetail.semantic_chunk_bp_type,
            semantic_chunk_embedding: rankerDetail.semantic_chunk_embedding
          },
          embedding_models: rankerDetail.embedding_models,
          client_id: ''
        },
        id: rankerDetail.id
      });
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };



  const handleRowClick = (item) => {
    if (item.embedding_status === 'P') {
      return;
    }
    getEvaluateData(item.id)
    // console.log('*************cliked*************:', item);
  };

  useEffect(() => {
    loadHistoryData();
  }, [loadHistoryData]);



  // delete modal
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleRankerDetailDeleteAPI = async () => {
    const index = settingData.id;
    console.log(index);
    if (!index) {
      return false;
    }
    const response = await sendRequestProAI(`/ranker/evaluate-history/${index}`, 'delete', undefined);
    if (response && response.data) {
      if (response.data.code === 'EA01') {
        showNotification('삭제 권한이 없습니다.', 'error');
        setIsModalVisible(false);
        return false;
      }
      if (response.data.code !== 'F002' && response.data.result !== false) {
        showNotification('정상적으로 삭제되었습니다.', 'success');
        return true;
      } else {
        showNotification('정상적으로 챗봇을 삭제하지 못하였습니다.', 'error');
        return false;
      }
    } else {
      showNotification('정상적으로 챗봇을 삭제하지 못하였습니다.', 'error');
      return false;
    }
  };

  const handleModalCheck = async () => {
    const deleteSuccess = await handleRankerDetailDeleteAPI();

    if (deleteSuccess) {
      setIsModalVisible(false);
      setTimeout(() => {
        setTotalHistoryData(prevTotalHistoryData =>
          prevTotalHistoryData.filter(item => item.id !== settingData.id)
        );
        setCurrentPage(1);
        setIsFirstPageLoad(true);
        getHistoryData(0, pageCount, true);
        // const fetchData = async () => {
        //   setCurrentPage(1);
        //   await getHistoryData(0, pageCount, true);
        // };
        // fetchData();
      }, 1000);
    }
  };


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
                            {item.embedding_status === 'P' ? (
                              <span className='state'>생성중...</span>
                            ) : (
                              <span className='second_line_ellipsis'>{item.time_stamp}</span>
                            )}
                          </td>
                          <td onClick={() => handleRowClick(item)} className="cursor-pointer">{item.creator}</td>
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
            <EmbeddingSetting type='history' data={settingData.jsonData} files={fileList} data_id={settingData.id} setIsModalVisible={setIsModalVisible} />
          </div>
        </div>
      </div>
      <Modal
        isShow={isModalVisible}
        title={
          settingData.id
            ? `Delete ${settingData.jsonData.name.length > 20 ? settingData.jsonData.name.slice(0, 19) + '...' : settingData.jsonData.name}`
            : ''
        }
        width={400}
        onClose={handleModalClose}
        okButtonText='Delete'
        okButtonClick={handleModalCheck}
        cancelButtonText='Close'
        cancleButtonClick={handleModalClose}
      >
        <div className='text-center mb-2 px-[10px] break-keep'>
          {/* <p className='text-[#fe4336]'>{caption} 챗봇을 지우신다면 되돌릴 수 없습니다.</p> */}
          {settingData.id && (
            <div>
              <p className='truncate max-w-full' title={settingData.jsonData.name}>
                {settingData.jsonData.name.length > 36 ? `${settingData.jsonData.name.slice(0, 35)}...` : settingData.jsonData.name}
              </p>
              <p>지우신다면 되돌릴 수 없습니다.</p>
            </div>
          )}
        </div>
        <div className='file_list_box'>
          <div className='txt_center text-[#fe4336]'>
            <p className='mb-2'>
              {settingData.id && (
                <span className='truncate inline-block max-w-full' title={settingData.jsonData.name}>
                  {settingData.jsonData.name.length > 36
                    ? `${settingData.jsonData.name.slice(0, 35)}... 지우시겠습니까?`
                    : `${settingData.jsonData.name} 지우시겠습니까?`}
                </span>
              )}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
