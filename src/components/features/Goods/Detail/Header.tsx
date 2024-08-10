import { Divider } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

import { useGetProductDetail } from '@/api/hooks/useGetProductDetail';
import type { ProductDetailRequestParams } from '@/api/types';
import { addToWishlist, getWishlist } from '@/api/utils';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/provider/Auth';
import { breakpoints } from '@/styles/variants';

type Props = ProductDetailRequestParams;

const page = 0;
const size = 10;

export const GoodsDetailHeader = ({ productId }: Props) => {
  const { data: detail } = useGetProductDetail({ productId });
  const authInfo = useAuth();
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

  const hasItemAlreadyAddedToWishList =
    data.contents.find((item) => item.id === parseInt(productId)) === undefined;

  const handleAddToWishlist = async () => {
    addWishlistMutation.mutate(productId);
  };

  return (
    <Wrapper>
      <GoodsImage src={detail.imageUrl} alt={detail.name} />
      <InfoWrapper>
        <Title>{detail.name}</Title>
        <Price>{detail.price.toLocaleString()}원</Price>
        <Divider color="#f5f5f5" />
        <Notice>카톡 친구가 아니어도 선물 코드로 선물 할 수 있어요!</Notice>
        <Divider color="#f5f5f5" />
        <Suspense fallback={<div>위시리스트 확인중...</div>}>
          {authInfo && (
            <Button
              theme={'darkGray'}
              disabled={hasItemAlreadyAddedToWishList}
              onClick={handleAddToWishlist}
            >
              {hasItemAlreadyAddedToWishList ? '위시리스트에 추가됨 ✓' : '위시리스트에 추가'}
            </Button>
          )}
        </Suspense>
      </InfoWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${breakpoints.sm}) {
    flex-direction: row;
  }
`;

const GoodsImage = styled.img`
  width: 100%;
  max-width: 450px;
`;

const InfoWrapper = styled.div`
  width: 100%;

  @media screen and (min-width: ${breakpoints.sm}) {
    padding-left: 24px;
  }
`;

const Title = styled.h2`
  padding-top: 24px;
  font-size: 24px;
  line-height: 33px;
  color: #111;
  font-weight: 400;
  word-break: break-all;
`;

const Price = styled.p`
  width: 100%;
  min-height: 120px;
  padding-top: 16px;
  font-size: 30px;
  font-weight: 400;
  line-height: 52px;
  color: #222;
`;

const Notice = styled.p`
  padding: 24px 12px;
  font-size: 14px;
  font-weight: 700;
  color: #111;
`;