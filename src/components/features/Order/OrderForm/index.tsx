import styled from '@emotion/styled';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';

import { createOrder, getPoints } from '@/api/utils';
import { Spacing } from '@/components/common/layouts/Spacing';
import { SplitLayout } from '@/components/common/layouts/SplitLayout';
import { RouterPath } from '@/routes/path';
import type { OrderFormData, OrderHistory } from '@/types';

import { HEADER_HEIGHT } from '../../Layout/Header';
import { GoodsInfo } from './GoodsInfo';
import { OrderFormMessageCard } from './MessageCard';
import { OrderFormOrderInfo } from './OrderInfo';

type Props = {
  orderHistory: OrderHistory;
};

export const OrderForm = ({ orderHistory }: Props) => {
  const { id, count } = orderHistory;
  const { data } = useQuery({
    queryFn: getPoints,
    queryKey: ['points'],
  });
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      alert('주문이 완료되었습니다.');
      window.location.href = RouterPath.myAccount;
    },
    onError: () => alert('주문에 실패했습니다.'),
  });

  const methods = useForm<OrderFormData>({
    defaultValues: {
      optionId: id,
      productQuantity: count,
      senderId: 0,
      receiverId: 0,
      hasCashReceipt: false,
    },
  });
  const { handleSubmit } = methods;

  const handleForm = (values: OrderFormData) => {
    const { errorMessage, isValid } = validateOrderForm(values, data?.points);

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    createOrderMutation.mutate({
      optionId: values.optionId,
      message: values.messageCardTextMessage,
      quantity: values.productQuantity,
      points: isNaN(values.points) ? 0 : values.points,
    });
  };

  // Submit 버튼을 누르면 form이 제출되는 것을 방지하기 위한 함수
  const preventEnterKeySubmission = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLFormElement;
    if (e.key === 'Enter' && !['TEXTAREA'].includes(target.tagName)) {
      e.preventDefault();
    }
  };

  return (
    <FormProvider {...methods}>
      <form action="" onSubmit={handleSubmit(handleForm)} onKeyDown={preventEnterKeySubmission}>
        <SplitLayout sidebar={<OrderFormOrderInfo orderHistory={orderHistory} />}>
          <Wrapper>
            <OrderFormMessageCard />
            <Spacing height={8} backgroundColor="#ededed" />
            <GoodsInfo orderHistory={orderHistory} />
          </Wrapper>
        </SplitLayout>
      </form>
    </FormProvider>
  );
};

export const validateOrderForm = (
  values: OrderFormData,
  currentPoints = 0,
): { errorMessage?: string; isValid: boolean } => {
  if (values.hasCashReceipt) {
    if (!values.cashReceiptNumber) {
      return {
        errorMessage: '현금영수증 번호를 입력해주세요.',
        isValid: false,
      };
    }

    if (!/^\d+$/.test(values.cashReceiptNumber)) {
      return {
        errorMessage: '현금영수증 번호는 숫자로만 입력해주세요.',
        isValid: false,
      };
    }
  }

  if (values.messageCardTextMessage.length < 1) {
    return {
      errorMessage: '메시지를 입력해주세요.',
      isValid: false,
    };
  }

  if (values.messageCardTextMessage.length > 100) {
    return {
      errorMessage: '메시지는 100자 이내로 입력해주세요.',
      isValid: false,
    };
  }

  if (values.points && values.points > currentPoints) {
    return {
      errorMessage: `사용할 수 있는 최대 포인트는 ${currentPoints}점입니다.`,
      isValid: false,
    };
  }

  if (values.points && values.points > values.totalPrice / 2) {
    return {
      errorMessage: `결제 금액의 50% (${values.totalPrice / 2}원) 이하의 포인트만 사용할 수 있습니다.`,
      isValid: false,
    };
  }

  return {
    isValid: true,
  };
};

const Wrapper = styled.div`
  border-left: 1px solid #e5e5e5;
  height: calc(100vh - ${HEADER_HEIGHT});
`;
