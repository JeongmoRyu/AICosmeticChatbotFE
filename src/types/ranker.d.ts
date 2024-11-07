interface IRankerData {
  files: FileType[];
  jsonMap: IRankerDataJson;
}

interface IRankerDataJson {
  name: string;
  top_k: number;
  chunking_settings: IChunkingSettings;
  embedding_models: (string | ICustomModel)[];
  client_id: string;
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


