import { VStack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetProductDetail } from '@/api/hooks/useGetProductDetail';
import { useGetProductOptions } from '@/api/hooks/useGetProductOptions';
import type { ProductDetailRequestParams } from '@/api/types';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/provider/Auth';
import { getDynamicPath, RouterPath } from '@/routes/path';
import { orderHistorySessionStorage } from '@/utils/storage';

import { CountOptionItem } from './OptionItem/CountOptionItem';

type Props = ProductDetailRequestParams;

export const OptionSection = ({ productId }: Props) => {
  const { data: detail } = useGetProductDetail({ productId });
  const { data: options } = useGetProductOptions({ productId });
  const prevOrderHistory = orderHistorySessionStorage.get();
  const [selectedOption, setSelectedOption] = useState<{ id: number; count: string }>(() =>
    prevOrderHistory
      ? {
          id: prevOrderHistory.id,
          count: String(prevOrderHistory.count),
        }
      : {
          id: options?.[0].id || 0,
          count: '1',
        },
  );

  const totalPrice = useMemo(() => {
    return detail.price * Number(selectedOption.count);
  }, [selectedOption, detail]);

  const navigate = useNavigate();
  const authInfo = useAuth();
  const handleClick = () => {
    if (!authInfo) {
      const isConfirm = window.confirm(
        '로그인이 필요한 메뉴입니다.\n로그인 페이지로 이동하시겠습니까?',
      );

      if (!isConfirm) return;

      orderHistorySessionStorage.set({
        id: selectedOption.id,
        count: parseInt(selectedOption.count),
        productId: parseInt(productId),
      });

      return navigate(getDynamicPath.login());
    }

    orderHistorySessionStorage.set({
      id: selectedOption.id,
      count: parseInt(selectedOption.count),
      productId: parseInt(productId),
    });

    navigate(RouterPath.order);
  };

  const handleCountChange = (optionId: number) => (newCount: string) => {
    setSelectedOption({ id: optionId, count: newCount });
  };

  return (
    <Wrapper>
      <VStack spacing={4}>
        {options.map((option) => (
          <Fragment key={option.id}>
            <CountOptionItem
              name={option.name}
              onChange={handleCountChange(option.id)}
              value={selectedOption.id === option.id ? selectedOption.count : '0'}
              maxValues={option.quantity}
            />
          </Fragment>
        ))}
      </VStack>
      <BottomWrapper>
        <PricingWrapper>
          총 결제 금액 <span>{totalPrice}원</span>
        </PricingWrapper>
        <Button theme="black" size="large" disabled={totalPrice === 0} onClick={handleClick}>
          나에게 선물하기
        </Button>
      </BottomWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 30px 12px 30px 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomWrapper = styled.div`
  padding: 12px 0 0;
`;

const PricingWrapper = styled.div`
  margin-bottom: 20px;
  padding: 18px 20px;
  border-radius: 4px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;

  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  color: #111;

  & span {
    font-size: 20px;
    letter-spacing: -0.02em;
  }
`;
