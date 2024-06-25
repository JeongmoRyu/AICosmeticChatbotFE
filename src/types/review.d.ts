interface SummaryType {
  attribute: string;
  summary: string;
}

interface ReviewProductType {
  doc_id: string;
  ch_nm: string;
  mix_summary: SummaryType[];
  negative_summary: SummaryType[];
  neutral_summary: SummaryType[];
  positive_summary: SummaryType[];
  prd_nm: string;
  product_id: string;
  review_cnt: string;
  an_date: string;
}

interface ReviewAttributeType {
  attribute: string;
  positive: string;
  negative: string;
  mix: string;
  neutral: string;  
}

interface ReviewChartLineType {
  pos?: number;
  neg?: number;
  neu?: number;
  mix?: number;
}

interface ReviewSummaryType {
  [key: string]: ReviewChartLineType
}

interface ReviewRateLineChartType {
  pos: {x: string, y: number}[];
  neg: {x: string, y: number}[];
  neu: {x: string, y: number}[];
  mix: {x: string, y: number}[];
}

interface ReviewRateRadarChartType {
  pos: number[];
  neg: number[];
  neu: number[];
  mix: number[];
}

interface ReviewSortableType {
  [k: string]: number;
}

interface ReleaseNoteType {
  id: string;
  link_url: string;
  partitionkey: string;
  status: string;
  title: string;
}
interface ReviewOriginType {
  totalOriginCount: number;
  labels: object;
  attribute: string;
  sentiment: string;
}

interface ReviewOriginListType {
  content: string;
  rv_date: string;
  rv_id: string;
  star_point: string;
  keyword_sent: [{
    keyword: string;
    sent: string; 
  }]
}