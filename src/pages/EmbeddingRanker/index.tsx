import { useCallback, useEffect, useRef, useState } from 'react';
import EditTextInput from 'pages/chatUI/components/EditTextInput';
import FileUploadList from './components/FileUploadList';
import { useNavigate } from 'react-router-dom';
import { EMBEDDING_HISTORY, EMBEDDING_LEADERBOARD } from 'data/routers';
import EmbeddingSetting from './components/EmbeddingSetting';
import io from "socket.io-client";
import useEREngineSelect from 'hooks/useEREngineSelect';
import { useRecoilState, useRecoilValue } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';
import { showNotification } from 'utils/common-helper';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { userLoginState as useUserLoginState } from 'store/pro-ai';


export default function EmbeddingRanker() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<FileType[] | undefined>(undefined);
  const [connectionInfoState, setConnectionInfoState] = useRecoilState(useConnectionInfoStore);
  const [progress, setProgress] = useState(0);
  const [progressTitle, setProgressTitle] = useState('임베딩 모델에 대한 리트리버 생성중...');
  const [modelList, setModelList] = useState<(string | ICustomModel)[]>([]);
  // 선택된 임베딩 모델 리스트
  const [selectedModels, setSelectedModels] = useState<(string | ICustomModel)[]>([]);
  // 선택된 임베딩 모델 중 click된 모델 리스트
  const SELECT_EMBEDDING_MODEL_LIST = useEREngineSelect();
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [getRankerId, setGetRankerId] = useState<number>(0);
  const userLoginState = useRecoilValue(useUserLoginState);

  useEffect(() => {
    const initializeModelList = async () => {
      if (SELECT_EMBEDDING_MODEL_LIST && SELECT_EMBEDDING_MODEL_LIST.length > 0) {
        const initialModels = SELECT_EMBEDDING_MODEL_LIST.map(item => item.id);
        setModelList(initialModels);
      }
    };
    initializeModelList();
    console.log(`modelList: ${modelList}`);
  }, [SELECT_EMBEDDING_MODEL_LIST]);

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


  const runRankerWithSocket = () => {
    setShowProgress(true);
    runRanker()
    console.log(settingData)

    return () => {
      // clearInterval(timer);
      setShowProgress(false);
    };
  };
  useEffect(() => {
    if (progress > 100) {
      if (getRankerId !== 0) {
        navigate(EMBEDDING_LEADERBOARD, { state: { id: getRankerId, topK: settingData.jsonData.top_k } });
      } else {
        navigate(EMBEDDING_HISTORY);
      }
    }
  }, [progress, progressTitle, navigate]);

  const runRanker = async () => {
    const missingFields: string[] = [];
    if (settingData.files.length === 0) {
      missingFields.push('파일');
    }
    if (!settingData.jsonData.name) {
      missingFields.push('이름');
    }
    if (settingData.jsonData.embedding_models.length === 0) {
      missingFields.push('임베딩 모델');
    }
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(', ');
      showNotification(`${missingFieldsString}은 Embedding Ranker의 필수 항목입니다.`, 'info');
      setShowProgress(false);
      return;
    }

    const formData = new FormData();
    settingData.files.forEach((item) => {
      if (item.file) {
        formData.append('files', item.file);
      } else {
        console.warn('File is undefined for item:', item);
      }
    });
    formData.append('jsonData', JSON.stringify(settingData.jsonData));

    // 파일 업로드를 위한 Content-Type 설정
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userLoginState.accessToken}`,
    };

    console.log(settingData)
    const response = await sendRequestProAI('/ranker/evaluate-embeddings', 'post', headers, formData, undefined);
    if (response && response.data) {
      if (response.data.code === 'F000') {
        const { data } = response.data;
        console.log(data)
        if (data.history_id) {
          console.log(`***********생성된 id: ${data.history_id}***********`);
          setGetRankerId(data.history_id);
        }
        showNotification(`${response.data.message}`, 'success');
      } else {
        showNotification(`${response.data.message}`, 'error');
      }
    } else {
      showNotification(`${response.data.message}`, 'error');
      return;
    }
  };



  // 선택된 임베딩 모델 중 click된 모델 리스트 변경
  const handleModelCheck = (modelId: string, checked: boolean, selectedModel?: any) => {
    console.log(`Model ID: ${modelId}, Checked: ${checked}`);

    setSelectedModels(prev => {
      let newSelected;
      if (checked) {
        if (selectedModel) {
          newSelected = [...prev, { name: modelId, ensemble: selectedModel }];
        } else {
          newSelected = [...prev, modelId];
        }
      } else {
        newSelected = prev.filter(selected =>
          typeof selected === 'string' ? selected !== modelId : selected.name !== modelId
        );
      }
      setSettingData(prevData => ({
        ...prevData,
        jsonData: {
          ...prevData.jsonData,
          embedding_models: newSelected
        }
      }));
      return newSelected;
    });
  };

  const handleAddModel = (name: string, type: string, customModel: ICustomModel) => {
    if (type !== 'ranker') {
      showNotification('임베딩 모델 추가는 Ranker Page에서만 가능합니다.', 'error');
      return;
    }
    const weights = customModel.ensemble.map(model => model.weight);
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

    if (totalWeight !== 1) {
      console.log(totalWeight)
      showNotification('모델의 가중치 합은 1이어야 합니다.', 'error');
      return;
    }

    console.log('Adding custom model:', customModel);

    setModelList(prev => {
      const exists = prev.some(model =>
        typeof model !== 'string' && model.name === name
      );

      if (exists) {
        showNotification('이미 존재하는 모델명입니다.', 'error');
        return prev;
      }
      const newList = [...prev, customModel];

      return newList;
    });
  };


  const handleChangeFile = (fileList: FileType[], isDelete?: boolean) => {
    if (isDelete) {
      setFileList(fileList);
      setSettingData(prev => ({
        ...prev,
        files: fileList
      }));
    } else {
      setFileList((prevFileList) => {
        const newFileList = prevFileList ? [...prevFileList, ...fileList] : fileList;
        setSettingData(prev => ({
          ...prev,
          files: newFileList
        }));
        return newFileList;
      });
    }
  };
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => {
  //       if (prevProgress >= 100) {
  //         clearInterval(timer);
  //         return 100;
  //       }
  //       return prevProgress + 5;
  //     });
  //   }, 1000);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);


  interface SOCKET_DATA {
    title: string;
    content: JSON | string;
  }
  // Socket 연결 관련 함수

  const SOCKET_EVENT = {
    FETCH_ROOM_ID: "message",
    NEURON_STATUS: "chat",
    NEURON_STATUS_END: "neuron_status_end",
  };
  const [socket, setSocket] = useState<any>(null);
  // const [roomId, setRoomId] = useState<string>("");
  // const socketRef = useRef<Socket | null>(null);
  const fetchController = useRef<AbortController>();
  // const [ChatPlayChatTimelineState, setChatPlayChatTimelineState] = useRecoilState(useChatPlayChatTimelineStore);

  const connectSocketIo = useCallback(() => {
    console.log("*** Connecting Socket ***");

    try {
      const connectionUrl = connectionInfoState.socket;
      const connectedSocket = io(connectionUrl, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        // timeout: 10000
        query: {
          is_ranker: true,
        }
      });

      connectedSocket.on('connect', () => {
        console.log("*** Socket Connected Successfully ***");
        console.log(connectedSocket.id);
        console.log(connectedSocket);
      });

      connectedSocket.on('connect_error', (error) => {
        console.error("Socket connection error:", error);
      });

      connectedSocket.on(SOCKET_EVENT.FETCH_ROOM_ID, (data) => {
        setSocket(connectedSocket);
        console.log("*** Socket Fetch Room ID ***");
        console.log(data)
        console.log(connectedSocket)
        setSettingData(prevData => ({
          ...prevData,
          jsonData: {
            ...prevData.jsonData,
            client_id: data.room
          }
        }));
        // console.log(`*** Socket Fetch Room ID *** ${connectedSocket.id}`);
      });
      connectedSocket.on(SOCKET_EVENT.NEURON_STATUS, (data: SOCKET_DATA) => {
        if (data.title === "result") {
          const content = JSON.parse(data.content as string);
          if (content.process !== undefined) {
            setProgress(content.process);
          }
          if (content.message) {
            setProgressTitle(content.message);
          }
        }
      });


      return connectedSocket;
    } catch (error) {
      console.error("Socket Connection failed:", error);
      return null;
    }
  }, [connectionInfoState.socket]);

  // 소켓 연결 설정
  useEffect(() => {
    let mounted = true;
    const newSocket = connectSocketIo();

    return () => {
      mounted = false;
      if (fetchController.current) {
        console.log("%c *** Stream 강제 종료 ***", "color:red");
        fetchController.current.abort();
      }

      if (newSocket) {
        console.log("*** Disconnecting Socket ***");
        newSocket.disconnect();
        setSocket(null);
      }
    };
  }, [connectSocketIo]);

  // const handleChangeSetting = (data: IRankerDataJson) => {
  //   setSettingData(prev => ({
  //     ...prev,
  //     jsonMap: data
  //   }));
  // }

  const handleChangeSetting = (type: string, key: string, value: any) => {
    setSettingData((prev) => {
      if (type === 'chunking_settings') {
        return {
          ...prev,
          jsonData: {
            ...prev.jsonData,
            chunking_settings: {
              ...prev.jsonData.chunking_settings,
              [key]: value
            }
          }
        };
      }
      if (key === '') {
        return {
          ...prev,
          jsonData: {
            ...prev.jsonData,
            [type]: value
          }
        };
      }
      if (type === 'embedding_models') {
        return {
          ...prev,
          jsonData: {
            ...prev.jsonData,
            embedding_models: value
          }
        };
      }
      return {
        ...prev,
        jsonData: {
          ...prev.jsonData,
          [type]: {
            ...prev.jsonData[type],
            [key]: value
          }
        }
      };
    });
  };

  useEffect(() => {
    if (!socket) return;

    const eventHandlers = {
      [SOCKET_EVENT.NEURON_STATUS]: (data: SOCKET_DATA) => {
        if (data) {
          console.log("here is socketevent", data);
          const showingData = typeof data.content === "string"
            ? data.content
            : JSON.stringify(data.content);
          const socketdata = {
            title: data.title,
            response: showingData,
          };
          console.log(socketdata);
        }
      },
      [SOCKET_EVENT.NEURON_STATUS_END]: (data: string) => {
        console.log("Neuron status end:", data);
      }
    };

    // 이벤트 리스너 등록
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // 클린업: 이벤트 리스너 제거
    return () => {
      if (socket) {
        Object.keys(eventHandlers).forEach(event => {
          socket.off(event);
        });
      }
    };
  }, [socket]);

  let ChunkingType = '';
  const useFixedChunk = settingData.jsonData.chunking_settings.use_fixed_chunk;
  const useSemanticChunk = settingData.jsonData.chunking_settings.use_semantic_chunk;

  if (!useFixedChunk && !useSemanticChunk) {
    showNotification('Chunk 방식은 필수입니다.', 'info')
    setSettingData(prev => ({
      ...prev,
      jsonData: {
        ...prev.jsonData,
        chunking_settings: {
          ...prev.jsonData.chunking_settings,
          use_fixed_chunk: true
        }
      }
    }));
    ChunkingType = 'Fixed-size chunking만 수행';
  } else if (useFixedChunk && useSemanticChunk) {
    ChunkingType = 'Semantic chunking 수행 후 Fixed-size chunking 수행';
  } else if (useFixedChunk) {
    ChunkingType = 'Fixed-size chunking만 수행';
  } else if (useSemanticChunk) {
    ChunkingType = 'Semantic chunking만 수행';
  }

  const chunkSize = settingData.jsonData.chunking_settings.fixed_chunk_size;
  const overlapSize = settingData.jsonData.chunking_settings.fixed_chunk_overlap;
  if (chunkSize <= overlapSize && overlapSize >= 150) {
    setSettingData(prev => ({
      ...prev,
      jsonData: {
        ...prev.jsonData,
        chunking_settings: {
          ...prev.jsonData.chunking_settings,
          fixed_chunk_overlap: chunkSize - 100
        }
      }
    }));
  }


  return (
    <div className='page_ranker'>
      <div className='head_wrap'>
        {/* <h3 className='page_title'>Embedding Ranker</h3> */}
        <p className='txt_navigation'>
          Embedding Ranker<span className='ico_arrow'>&gt;</span>
          <em>Create</em>
        </p>
        <button type='button' className='btn_type white big' onClick={() => navigate(EMBEDDING_HISTORY)}>
          히스토리
        </button>
      </div>
      <div className='row_box'>
        <div className='round_border_box'>
          <div className='scroll_wrap'>
            <EmbeddingSetting type='ranker' data={settingData.jsonData} onChange={handleChangeSetting} embeddingModelList={SELECT_EMBEDDING_MODEL_LIST} AddModel={handleAddModel} />
          </div>
        </div>
        <div className='round_border_box'>
          <div className='scroll_wrap flex_box'>
            <div>
              <EditTextInput
                labelText='Chunk 방식'
                id='chunk_method'
                value=''
                onChange={(e) => console.log(e.target.value)}
                isDisabled
                placeholder={ChunkingType}
              />
              <div className='selected_model_box'>
                <em className='txt_label'>선택된 임베딩 모델</em>
                <ul>
                  {modelList.map((model, index) => {
                    if (typeof model === 'string') {
                      return (
                        <li key={model} className='input_box_check'>
                          <input
                            type='checkbox'
                            id={`selected_embeddingModel_${model}`}
                            checked={selectedModels.includes(model)}
                            onChange={(e) => {
                              handleModelCheck(model, e.target.checked);
                            }}
                          />
                          <label htmlFor={`selected_embeddingModel_${model}`}>
                            {model}
                          </label>
                        </li>
                      );
                    } else {
                      return (
                        <li key={model.name} className='input_box_check'>
                          <input
                            type='checkbox'
                            id={`selected_embeddingModel_${model.name}`}
                            checked={selectedModels.some(selected =>
                              typeof selected !== 'string' && selected.name === model.name
                            )}
                            onChange={(e) => {
                              handleModelCheck(model.name, e.target.checked, model.ensemble);
                            }}
                          />
                          <label htmlFor={`selected_embeddingModel_${model.name}`}>
                            {model.name}
                          </label>
                        </li>
                      );
                    }
                  })}
                </ul>
                <FileUploadList
                  onChangeFile={handleChangeFile}
                  fileList={fileList}
                  textInfo='*RAG용 자료를 업로드하세요. 각 1GB 이내의 PDF 파일만 업로드 가능합니다.'
                  isMultiple={true}
                  accept='.pdf'
                />
              </div>

            </div>
            {showProgress && (
              <div className='progress_box'>
                <p className='text-[16px] font-[500] mb-[10px] mt-[10px]'>
                  {progressTitle}
                </p>

                <div className="relative h-2 bg-[#F2F3F7] rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-500 transition-all duration-1000 ease-in-out rounded-[7px]"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #4262FF, #6483FF)'
                    }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600 text-right">
                  {progress.toFixed(1)}%
                </div>
              </div>
            )}

            <div className='btn_bottom_box'>
              <button
                type='button'
                className='btn_type white big'
                disabled={showProgress}
                onClick={showProgress ? undefined : runRankerWithSocket}
              >
                {showProgress ? '실행중...' : '실행하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
