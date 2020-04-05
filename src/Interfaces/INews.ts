export interface News {
  status: string;
  totalResults: number;
  articles?: Array<ArticlesEntity> | null;
}
export interface ArticlesEntity {
  source: Source;
  author?: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage?: string | null;
  publishedAt: string;
  content: string;
}
export interface Source {
  id?: null;
  name: string;
}
