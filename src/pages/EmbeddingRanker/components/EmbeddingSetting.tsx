import { useEffect, useState } from 'react';
import EditToggle from 'pages/chatUI/components/EditToggle';
import EditTextInput from 'pages/chatUI/components/EditTextInput';
import EditSelectBox from 'pages/chatUI/components/EditSelectBox';
import EditCounter from 'pages/chatUI/components/EditCounter';
import DragSlider from './DragSlider';
import icon_up from 'assets/images/icons/icon_up.svg';
import icon_x from 'assets/images/icons/ico_x_16.svg';
import icon_pdf from 'assets/images/icons/ico_pdf_24.png';
import useEmbeddingRankerCodeSelect from 'hooks/useEmbeddingRankerCodeSelect';
import EditSelectCodeBox from 'pages/chatUI/components/EditSelectCodeBox';
import { EMBEDDING_HISTORY, EMBEDDING_LEADERBOARD } from 'data/routers';
import { useNavigate } from 'react-router-dom';
import icon_etc from 'assets/images/icons/ico_etc_24.png';
import icon_xls from 'assets/images/icons/ico_xls_24.png';
import { showNotification } from 'utils/common-helper';
import { TailSpin } from 'react-loader-spinner';

interface Props {
  type: 'ranker' | 'history';
  data: IRankerDataJson;
  onChange?: (type: string, key: string, value: any) => void;
  embeddingModelList?: SelectListType[];
  AddModel?: (name: string, type: string, model: ICustomModel) => void;
}

export default function EmbeddingSetting({ type, data, onChange, embeddingModelList, AddModel }: Props) {
  const SELECT_TYPE_LIST = useEmbeddingRankerCodeSelect('SEMANTIC_CHUNKING_BP_TYPE');
  const SELECT_EMBEDDING_LIST = useEmbeddingRankerCodeSelect('SEMANTIC_CHUNKING_EMBEDDING');
  const navigate = useNavigate();
  const [selectedRrfModels, setSelectedRrfModels] = useState<IModelWeight[]>([]);
  const [rrfSelectValue, setRrfSelectValue] = useState<number>(0);
  const [rrfModelName, setRrfModelName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    const timer = setInterval(() => {
    }, 1000);

    const timeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(timer);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  const handleChange = (type: string, key: string, value: any) => {
    if (onChange && type !== 'history') {
      onChange(type, key, value);
    }
  };
  const min = 100;
  const max = 4000;
  // const currValue = 2100;
  const [openAccordion, setOpenAccordion] = useState({
    chunkSettings: false,
    retrieverSettings: false,
    rpf: false,
    fileList: false,
    embeddingList: false,
  });

  const handleAccordion = (e) => {
    const id = e.currentTarget.parentNode.getAttribute('id');
    setOpenAccordion((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'xls':
      case 'xlsx':
        return icon_xls;
      case 'pdf':
        return icon_pdf;
      case 'txt':
        return icon_etc;
      default:
        return icon_etc;
    }
  };


  const getByteSize = (size: number) => {
    const byteUnits = ['KB', 'MB', 'GB', 'TB'];

    for (let i = 0; i < byteUnits.length; i++) {
      size = size / 1024;
      if (size < 1024) return size.toFixed(1) + ' ' + byteUnits[i];
    }
    return size + ' B';
  };

  const handleModelSelect = (value: number, list: SelectListType[]) => {
    setRrfSelectValue(value);
    const selectedRrfModel = list.find(model => model.value === value);
    if (selectedRrfModel && !selectedRrfModels.find(model => model.model === selectedRrfModel.id)) {
      setSelectedRrfModels(prev => [...prev, {
        model: selectedRrfModel.id,
        weight: 0.1
      }]);
    }
  };

  const handleModelDelete = (modelName: string) => {
    setSelectedRrfModels(prev => prev.filter(model => model.model !== modelName));
  };

  const handleWeightChange = (modelName: string, weight: number) => {
    setSelectedRrfModels(prev =>
      prev.map(model =>
        model.model === modelName ? { ...model, weight } : model
      )
    );
  };


  const files = [{ name: 'test.pdf', size: 100 }, { name: 'test.pdf', size: 100 }, { name: 'test.pdf', size: 100 }, { name: 'test.pdf', size: 100 }];
  return (
    // <>
    <div className='w-full h-full relative'>

      {/* {isLoading && (
        <div className='flex justify-center items-center z-[15] fixed top-0 left-0 w-full h-full bg-black bg-opacity-20'>
        <TailSpin
          height='80'
          width='80'
          color='#4262FF'
          ariaLabel='tail-spin-loading'
          radius='2'
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
        />
      </div>
      )} */}
      {type === 'history' && isLoading && (
        <div className='absolute inset-0 flex justify-center items-center z-10 overflow-hidden'>
          <TailSpin
            height='80'
            width='80'
            color='#4262FF'
            ariaLabel='tail-spin-loading'
            radius='2'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
        </div>
      )}
      <EditTextInput
        id='rankName'
        labelText='이름'
        isEssential={true}
        isDisabled={type === 'history'}
        value={data.name}
        onChange={(e) => handleChange('name', '', e.target.value)}
      />
      <div id='chunkSettings' className={`accordion_box ${openAccordion.chunkSettings ? 'open' : ''}`}>
        <button type='button' className='accordion_btn' onClick={handleAccordion}>
          Chunk Settings
          <img className='ico_up' src={icon_up} alt={openAccordion.chunkSettings ? '접기' : '펼치기'} />
        </button>
        <div className='accordion_content'>
          <EditToggle
            title='Fixed-size chunking'
            id='fixedSizeChunking'
            value={data.chunking_settings.use_fixed_chunk}
            onChange={(value) => handleChange('chunking_settings', 'use_fixed_chunk', value)}
          />
          <DragSlider
            label='Chunk 사이즈'
            smallText='단위 : 토큰'
            min={min}
            max={max}
            initialValue={data.chunking_settings.fixed_chunk_size}
            onChange={(value) => handleChange('chunking_settings', 'fixed_chunk_size', value)}
            isDisabled={type === 'history'}
          />
          <DragSlider
            label='Chunk overlap'
            smallText='단위 : 토큰'
            min={min}
            max={max}
            initialValue={data.chunking_settings.fixed_chunk_overlap}
            onChange={(value) => handleChange('chunking_settings', 'fixed_chunk_overlap', value)}
            isDisabled={type === 'history'}
          />
          <EditToggle
            title='Semantic chunking'
            id='semanticChunking'
            value={data.chunking_settings.use_semantic_chunk}
            onChange={(value) => handleChange('chunking_settings', 'use_semantic_chunk', value)}
          />
          <EditSelectCodeBox
            // type=''
            list={SELECT_TYPE_LIST}
            labelText='타입'
            name='chunkSettingType'
            activeValue={data.chunking_settings.semantic_chunk_bp_type}
            onChange={(value) => handleChange('chunking_settings', 'semantic_chunk_bp_type', value)}
          />
          <EditSelectCodeBox
            // type=''
            list={SELECT_EMBEDDING_LIST}
            labelText='사용할 임베딩'
            name='useEmbedding'
            activeValue={data.chunking_settings.semantic_chunk_embedding}
            onChange={(value) => handleChange('chunking_settings', 'semantic_chunk_embedding', value)}
          />
        </div>
      </div>
      <div id='retrieverSettings' className={`accordion_box ${openAccordion.retrieverSettings ? 'open' : ''}`}>
        <button type='button' className='accordion_btn' onClick={handleAccordion}>
          Retriever Settings
          <img className='ico_up' src={icon_up} alt={openAccordion.retrieverSettings ? '접기' : '펼치기'} />
        </button>
        <div className='accordion_content'>
          <div className='rank_box'>
            <div className='box_left'>
              <p>가져오는 문서의 갯수</p>
            </div>
            <div className='box_right'>
              <EditCounter
                title='Top K'
                id='retrieverDocumentNumber'
                value={String(data.top_k)}
                onChange={(value) => handleChange('top_k', '', parseInt(value))}
              />
            </div>
          </div>
          {/* <div className='btn_box'>
            <button type='button' className='btn_type white big'>
              적용하기
            </button>
          </div> */}
        </div>
      </div>
      {type === 'ranker' && (
        <>
          <div id='rpf' className={`accordion_box ${openAccordion.rpf ? 'open' : ''}`}>
            <button type='button' className='accordion_btn' onClick={handleAccordion}>
              앙상블 리트리버 추가하기 (RRF)
              <img className='ico_up' src={icon_up} alt={openAccordion.rpf ? '접기' : '펼치기'} />
            </button>
            <div className='accordion_content'>
              {embeddingModelList && (
                <EditSelectBox
                  type=''
                  list={embeddingModelList}
                  labelText='임베딩 모델 선택'
                  name='embeddingModel'
                  activeValue={rrfSelectValue || embeddingModelList[0]?.value}
                  onChange={(value) => handleModelSelect(value, embeddingModelList)}
                />
              )}
              <div className='selected_list'>
                <ul>
                  {selectedRrfModels.map((model) => (
                    <li key={model.model}>
                      {model.model}
                      <button
                        type='button'
                        className='btn_list_delete'
                        onClick={() => handleModelDelete(model.model)}
                      >
                        <img src={icon_x} alt='삭제' />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {selectedRrfModels.map((model, index) => (
                <div className='rank_box' key={`weight_${model.model}`}>
                  <div className='box_left'>
                    <p>{index === 0 ? '모델 가중치 조절' : ''}</p>
                  </div>
                  <div className='box_right'>
                    <EditCounter
                      title={model.model}
                      id={`weight_${model.model}`}
                      value={String(model.weight.toFixed(1))}
                      step={0.1}
                      onChange={(value) => handleWeightChange(model.model, Number(value))}
                    />
                  </div>
                </div>
              ))}
              <EditTextInput
                labelText='사용할 모델명'
                id='useModel'
                value={rrfModelName}
                onChange={(e) => setRrfModelName(e.target.value)}
              />
              <div className='btn_box'>
                <button
                  type='button'
                  className='btn_type white big'
                  onClick={() => {
                    if (!rrfModelName) {
                      showNotification('모델명을 입력해주세요.', 'error');
                      return;
                    }
                    if (selectedRrfModels.length === 0) {
                      showNotification('하나 이상의 모델을 선택해주세요.', 'error');
                      return;
                    }
                    const customModel: ICustomModel = {
                      name: rrfModelName,
                      ensemble: selectedRrfModels
                    };

                    AddModel && AddModel(rrfModelName, 'ranker', customModel);
                    setRrfModelName('');
                  }}
                >
                  추가하기
                </button>
              </div>
            </div>

          </div >
        </>
      )
      }
      {
        type === 'history' && (
          <>
            <div id='embeddingList' className={`accordion_box ${openAccordion.embeddingList ? 'open' : ''}`}>
              <button type='button' className='accordion_btn' onClick={handleAccordion}>
                사용한 임베딩 모델
                <img className='ico_up' src={icon_up} alt={openAccordion.embeddingList ? '접기' : '펼치기'} />
              </button>
              <div className='accordion_content bg-[#f2f3f7] p-2'>
                <ul className='list-disc p-5'>
                  {data.embedding_models.map((model, index) => (
                    <li key={index}>
                      {typeof model === 'string' ? (
                        <strong>{model}</strong>
                      ) : (
                        <div>
                          <strong>{model.name}</strong>
                          <ul className='list-disc pl-5'>
                            {model.ensemble.map((weightItem, weightIndex) => (
                              <li key={weightIndex}>
                                {weightItem.model} (weight: {weightItem.weight})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div id='fileList' className={`accordion_box ${openAccordion.fileList ? 'open' : ''}`}>
              <button type='button' className='accordion_btn' onClick={handleAccordion}>
                첨부 파일 목록
                <img className='ico_up' src={icon_up} alt={openAccordion.fileList ? '접기' : '펼치기'} />
              </button>
              <div className='accordion_content'>
                <ul className='file_list'>
                  {files.length > 0 &&
                    files.map((item, index) => (
                      <div key={`${item.name}_${index}`} className={`flex ${index > 0 ? 'mt-[15px]' : 'mt-[5px]'}`}>
                        <img src={getFileIcon(item.name)} alt={item.name} className='mr-2 w-5 h-5' />
                        <p>
                          {item.name} ({getByteSize(item.size)})
                        </p>
                      </div>
                    ))}


                  {/* <li>
                  <img className='ico' src={icon_pdf} alt='' />
                  <span className='file_name'>이름 길면 이렇게 잘립니다.pdf</span>
                  <span className='file_size'>0.5GB</span>
                </li> */}
                </ul>
              </div>
            </div>
            <div className='flex flex-row justify-end space-x-2'>
              <div className='btn_box'>
                {/* <button type='button' className='btn_type white big' onClick={() => navigate(EMBEDDING_LEADERBOARD)}> */}
                <button type='button' className='btn_type red big' onClick={() => console.log('hello')}>
                  삭제하기
                </button>
              </div>
              <div className='btn_box'>
                {/* <button type='button' className='btn_type white big' onClick={() => navigate(EMBEDDING_LEADERBOARD)}> */}
                <button type='button' className='btn_type white big' onClick={() => navigate(EMBEDDING_LEADERBOARD, { state: { id: 0, topK: 3 } })}>
                  QA 데이터/랭킹
                </button>
              </div>
            </div>


          </>
        )
      }
      {/* </> */}
    </div>
  );
}
