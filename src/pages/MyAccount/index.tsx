import { Heading } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

import { getPoints } from '@/api/utils';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { Button } from '@/components/common/Button';
import { Spacing } from '@/components/common/layouts/Spacing';
import { Options } from '@/components/features/MyAccount/Options';
import { Wishlist } from '@/components/features/MyAccount/WhishList';
import { useAuth } from '@/provider/Auth';
import { RouterPath } from '@/routes/path';
import { authSessionStorage } from '@/utils/storage';

export const MyAccountPage = () => {
  const authInfo = useAuth();
  const { data: pointsData } = useQuery({
    queryFn: getPoints,
    queryKey: ['points'],
  });

  const handleLogout = () => {
    authSessionStorage.set(undefined);

    const redirectURL = `${window.location.origin}/react-deploy${RouterPath.home}`;
    window.location.replace(redirectURL);
  };

  return (
    <Wrapper>
      {authInfo?.name}님 안녕하세요!
      <div>현재 포인트: {pointsData?.points?.toLocaleString() ?? 0} 점</div>
      <Spacing height={64} />
      <Button
        size="small"
        theme="darkGray"
        onClick={handleLogout}
        style={{
          maxWidth: '200px',
        }}
      >
        로그아웃
      </Button>
      <Spacing />
      <Heading>찜 목록</Heading>
      <Spacing />
      <AsyncBoundary
        pendingFallback={<div>불러오는 중...</div>}
        rejectedFallback={<div>에러가 발생했습니다.</div>}
      >
        <Wishlist />
      </AsyncBoundary>
      <Spacing />
      <Heading>주문 목록</Heading>
      <Spacing />
      <AsyncBoundary
        pendingFallback={<div>불러오는 중...</div>}
        rejectedFallback={<div>에러가 발생했습니다.</div>}
      >
        <Options />
        <Spacing />
      </AsyncBoundary>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 80px 0 120px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 36px;
`;
