import { getCategoriesPath } from '@/api/hooks/useGetCategorys';
import { getProductDetailPath } from '@/api/hooks/useGetProductDetail';
import { getProductOptionsPath } from '@/api/hooks/useGetProductOptions';
import { getProductsPath } from '@/api/hooks/useGetProducts';
import { fetchInstance } from '@/api/instance';
import type {
  AddToWishlistResponse,
  CategoryResponseData,
  LoginUserRequest,
  LoginUserResponse,
  PaginationRawResponse,
  PaginationResponseData,
  ProductDetailRequestParams,
  ProductDetailResponseData,
  ProductOptionsResponseData,
  ProductRequestParams,
  RegisterUserRequest,
  RegisterUserResponse,
} from '@/api/types';
import type { OrderListRequestParams } from '@/api/types';
import type { CreateOrderRequestParams } from '@/api/types';
import type { WishlistItem } from '@/components/features/MyAccount/WhishList';
import type { OrderData, ProductData } from '@/types';

export const registerUser = async ({ email, password }: RegisterUserRequest) => {
  try {
    const response = await fetchInstance.post<RegisterUserResponse>('/api/members/register', {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem('token', token);

    return response.data;
  } catch (error) {
    throw new Error('회원가입에 실패했습니다.');
  }
};

export const loginUser = async ({ email, password }: LoginUserRequest) => {
  try {
    const response = await fetchInstance.post<LoginUserResponse>('/api/members/login', {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem('token', token);

    return response.data;
  } catch (error) {
    throw new Error('로그인에 실패했습니다.');
  }
};

export const getCategories = async (): Promise<CategoryResponseData> => {
  const response = await fetchInstance.get(getCategoriesPath());

  return response.data.data;
};

export const getProducts: (
  params: ProductRequestParams,
) => Promise<PaginationResponseData<ProductData>> = async (
  params: ProductRequestParams,
): Promise<PaginationResponseData<ProductData>> => {
  const response = await fetchInstance.get(getProductsPath(params));
  const data = response.data.data;

  return {
    products: data.content,
    nextPageToken: data.last === false ? (data.number + 1).toString() : undefined,
    pageInfo: {
      totalResults: data.totalElements,
      resultsPerPage: data.size,
    },
  };
};

export const getProductDetail = async (params: ProductDetailRequestParams) => {
  const response = await fetchInstance.get<ProductDetailResponseData>(
    getProductDetailPath(params.productId),
  );

  return response.data;
};

export const getProductOptions = async (params: ProductDetailRequestParams) => {
  const response = await fetchInstance.get<ProductOptionsResponseData>(
    getProductOptionsPath(params.productId),
  );

  return response.data;
};

export const addToWishlist = async (productId: string) => {
  try {
    const response = await fetchInstance.post<AddToWishlistResponse>('/api/wishes', { productId });

    return response.data;
  } catch (error) {
    throw new Error('위시 리스트 추가에 실패했습니다.');
  }
};

export const getWishlist = async (page: number, size: number) => {
  try {
    const response = await fetchInstance.get<PaginationRawResponse<WishlistItem>>(`/api/wishes`, {
      params: {
        page,
        size,
        sort: 'createdDate,desc',
      },
    });

    const data = response.data;

    return {
      wishlist: data.content,
      nextPageToken: data.last === false ? (data.number + 1).toString() : undefined,
      pageInfo: {
        totalResults: data.totalElements,
        resultsPerPage: data.size,
      },
    };
  } catch (error) {
    throw new Error('위시 리스트 조회에 실패했습니다.');
  }
};

export const deleteFromWishlist = async (productId: number): Promise<void> => {
  try {
    const response = await fetchInstance.delete(`/api/wishes/${productId}`);

    return response.data;
  } catch (error) {
    throw new Error('위시 리스트 삭제에 실패했습니다.');
  }
};

export const createOrder = async (order: CreateOrderRequestParams) => {
  try {
    const response = await fetchInstance.post<OrderData>('/api/orders', order);

    return response.data;
  } catch (error) {
    throw new Error('주문하기에 실패했습니다.');
  }
};

// TODO: 아직 사용하지 않는 함수
// export const getOrderList: Promise<PaginationResponseData<OrderData>> = async (
export const getOrderList = async (params: OrderListRequestParams) => {
  try {
    const response = await fetchInstance.get<PaginationRawResponse<OrderData>>('/api/orders', {
      params: params,
    });
    const data = response.data;

    return {
      orders: data.content,
      nextPageToken: data.last === false ? (data.number + 1).toString() : undefined,
      pageInfo: {
        totalResults: data.totalElements,
        resultsPerPage: data.size,
      },
    };
  } catch (error) {
    throw new Error('주문 목록 조회에 실패했습니다.');
  }
};
