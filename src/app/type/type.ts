type Category =   "Fiction" | "Science" | "History" |  "Kids" |  "Drama" |  "Thriller" |  "Others";

export interface IBookForm {
  title: string;
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
// `author` is optional until you add an Author field to the Add Book form.
export interface IBook extends IBookForm {
  _id: string;
  author?: string;
}
 