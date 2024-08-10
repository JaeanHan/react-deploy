import { Checkbox, Input, Select, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { Controller } from 'react-hook-form';

import { getPoints } from '@/api/utils';
import { Spacing } from '@/components/common/layouts/Spacing';
import { useOrderFormContext } from '@/hooks/useOrderFormContext';

import { LabelText } from '../Common/LabelText';

export interface ICashReceiptFields {
  totalPrice: number;
}

export const CashReceiptFields = ({ totalPrice }: ICashReceiptFields) => {
  const { register, control, watch } = useOrderFormContext();
  const { data: pointsData } = useQuery({
    queryFn: getPoints,
    queryKey: ['points'],
  });
  const hasCashReceipt = watch('hasCashReceipt');

  return (
    <Wrapper>
      <Controller
        control={control}
        name="hasCashReceipt"
        render={({ field: { onChange, value, ref } }) => (
          <Checkbox ref={ref} onChange={onChange} isChecked={value} colorScheme="yellow" size="lg">
            <LabelText>현금영수증 신청</LabelText>
          </Checkbox>
        )}
      />
      <Spacing />
      <Controller
        control={control}
        name="cashReceiptType"
        render={({ field }) => (
          <Select {...field} disabled={!hasCashReceipt} data-testid="cashReceiptType">
            <option value="PERSONAL">개인소득공제</option>
            <option value="BUSINESS">사업자증빙용</option>
          </Select>
        )}
      />
      <Spacing height={8} />
      <Input
        {...register('cashReceiptNumber')}
        placeholder="(-없이) 숫자만 입력해주세요."
        disabled={!hasCashReceipt}
      />
      <Spacing height={16} />
      <Text fontWeight={500}>현재 보유 포인트: {pointsData?.points.toLocaleString() ?? 0}</Text>
      <Spacing />
      <Input
        type="number"
        placeholder="사용할 포인트 입력"
        {...register('points', { valueAsNumber: true })}
      />
      <input value={totalPrice} disabled={true} type="hidden" {...register('totalPrice')} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
`;
