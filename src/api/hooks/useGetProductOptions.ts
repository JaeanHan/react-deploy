import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchInstance } from '@/api/instance';
import type { ProductDetailRequestParams } from '@/api/types';
import { getProductOptions } from '@/api/utils';

export const getProductOptionsPath = (productId: string) =>
  `${fetchInstance.defaults.baseURL}/api/products/${productId}/options`;

export const useGetProductOptions = ({ productId }: ProductDetailRequestParams) =>
  useSuspenseQuery({
    queryKey: [getProductOptionsPath(productId)],
    queryFn: () => getProductOptions({ productId }),
  });
