export type Category =
  | "Fiction"
  | "Science"
  | "History"
  | "Kids"
  | "Drama"
  | "Thriller"
  | "Others";

export interface IBookForm {
  title: string;
  author: string;
  category: Category;
  image: string;
  publisher: string;
  publishedDate: string;
  language: string;
  totalPages: string;
  totalCopies: string;
  description: string;
}

// A book as returned by the API (MongoDB adds _id).
export interface IBook extends IBookForm {
  _id: string;
}