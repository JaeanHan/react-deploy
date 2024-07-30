import type { CategoryData, OrderData, ProductData, ProductOptionsData } from '@/types';

export type RegisterUserRequest = {
  email: string;
  password: string;
};

export type RegisterUserResponse = {
  token: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  token: string;
};

export type AddToWishlistResponse = {
  success: boolean;
  message: string;
};

export type ProductRequestParams = {
  categoryId: string;
  pageToken?: string;
  maxResults?: number;
};

export type OrderListRequestParams = {
  page: number;
  size: number;
  sort: string;
};

export type PaginationResponseData<T> = {
  products: T[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

export type PaginationRawResponse<T> = {
  content: T[];
  number: number;
  totalElements: number;
  size: number;
  last: boolean;
};

export type ProductsResponseRawData = PaginationRawResponse<ProductData>;
export type OrdersResponseRawData = PaginationRawResponse<OrderData>;

export type ProductDetailRequestParams = {
  productId: string;
};

export type ProductDetailResponseData = ProductData;

export type ProductOptionsResponseData = ProductOptionsData[];

export type CategoryResponseData = CategoryData[];
