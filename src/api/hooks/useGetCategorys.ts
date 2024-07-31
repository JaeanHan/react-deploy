import { useQuery } from '@tanstack/react-query';

import { fetchInstance } from '@/api/instance';
import { getCategories } from '@/api/utils';

export const getCategoriesPath = () => `${fetchInstance.defaults.baseURL}/api/categories`;

export const useGetCategories = () => {
  const categoriesQueryKey = [getCategoriesPath()];
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: getCategories,
  });
};
