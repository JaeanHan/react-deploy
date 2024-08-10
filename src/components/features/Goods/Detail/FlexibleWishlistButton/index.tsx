import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import type { ProductDetailRequestParams } from '@/api/types';
import { addToWishlist, getWishlist } from '@/api/utils';
import { Button } from '@/components/common/Button';

export interface IFlexibleWishlistButton extends ProductDetailRequestParams {}

const page = 0;
const size = 10;

export const FlexibleWishlistButton = ({ productId }: IFlexibleWishlistButton) => {
  const addWishlistMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      alert('관심 등록 완료');
    },
    onError: () => {
      alert('위시리스트 추가 실패(서버)');
    },
  });

  const { data } = useSuspenseQuery({
    queryKey: ['wishlist', page, size],
    queryFn: () => getWishlist(page, size),
  });

  const handleAddToWishlist = async () => {
    addWishlistMutation.mutate(productId);
  };

  const hasItemAlreadyBeenAdded =
    data.contents.find((item) => item.product.id === parseInt(productId)) !== undefined;

  return (
    <Button
      theme={hasItemAlreadyBeenAdded ? 'darkGray' : 'kakao'}
      disabled={hasItemAlreadyBeenAdded}
      onClick={handleAddToWishlist}
    >
      {hasItemAlreadyBeenAdded ? '위시리스트에 추가됨 ✓' : '위시리스트에 추가'}
    </Button>
  );
};
