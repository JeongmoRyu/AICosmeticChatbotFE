interface IRankerData {
  files: FileType[];
  jsonData: IRankerDataJson;
  id: number;
}
interface IRankerDataJson {
  name: string;
  top_k: number;
  chunking_settings: IChunkingSettings;
  embedding_models: (string | ICustomModel)[];
  client_id: string;
}

interface IRankerDetail {
  file_path: string[];
  embedding_models: (string | ICustomModel)[];
  id: number;
  name: string;
  use_semantic_chunk: boolean;
  use_fixed_chunk: boolean;
  fixed_chunk_size: number;
  fixed_chunk_overlap: number;
  semantic_chunk_bp_type: string;
  semantic_chunk_embedding: string;
  top_k: number;
}

interface HistoryItem {
  id: number;
  name: string;
  time_stamp: string;
  creator: string;
  embedding_status: string;
  user_key: number;
  is_mine: boolean;
}


interface ICustomModel {
  name: string; 
  ensemble: IModelWeight[];
}
interface IChunkingSettings {
  use_semantic_chunk: boolean;
  use_fixed_chunk: boolean;
  fixed_chunk_size: number;
  fixed_chunk_overlap: number;
  semantic_chunk_bp_type: string;
  semantic_chunk_embedding: string;
}

interface IModelWeight {
  model: string;
  weight: number;
}


interface QADetailData {
  id: number;
  question: string;
  answer: string;
  doc_id: string;
  chunk: string;
}
interface QAData {
  content: QADetailData[];
  total_pages: number;
}
interface RankingDetailData {
  id: number;
  model_name: string;
  embedding_model_config: string;
  hit_accuracy: number;
  description: string;
}

interface RankingData {
  content: RankingDetailData[];
  total_pages: number;
}

