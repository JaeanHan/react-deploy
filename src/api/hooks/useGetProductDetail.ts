import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchInstance } from '@/api/instance';
import type { ProductDetailRequestParams } from '@/api/types';
import { getProductDetail } from '@/api/utils';

export const getProductDetailPath = (productId: string) =>
  `${fetchInstance.defaults.baseURL}/api/products/${productId}`;

export const useGetProductDetail = ({ productId }: ProductDetailRequestParams) =>
  useSuspenseQuery({
    queryKey: [getProductDetailPath(productId)],
    queryFn: () => getProductDetail({ productId }),
  });
