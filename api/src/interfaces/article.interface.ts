export interface AddArticleInterface {
  backgroundImage: string;
  title: string;
  titleFont: string;
  article: string;
  textFont: string;
  category: string;
  status: string;
  createdBy: string;
}

export interface DeleteArticleInterface {
  email: string;
  id: string;
}
