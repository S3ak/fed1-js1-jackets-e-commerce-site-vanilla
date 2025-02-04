export interface RootObject {
  data: Datum[];
  meta: Meta;
}

export interface Datum {
  baseColor: string;
  description: string;
  discountedPrice: number;
  favorite: boolean;
  gender: Gender;
  id: string;
  image: Image;
  onSale: boolean;
  price: number;
  sizes: Size[];
  tags: Tag[];
  title: string;
}

export enum Gender {
  Female = "Female",
  Male = "Male",
}

export interface Image {
  alt: string;
  url: string;
}

export enum Size {
  L = "L",
  M = "M",
  S = "S",
  Xl = "XL",
  Xs = "XS",
  Xxl = "XXL",
}

export enum Tag {
  Jacket = "jacket",
  Mens = "mens",
  Womens = "womens",
}

export interface Meta {
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  nextPage: null;
  pageCount: number;
  previousPage: null;
  totalCount: number;
}
