import { Select } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { fetchInstance, queryClient } from '@/api/instance';
import { Container } from '@/components/common/layouts/Container';
import { useAuth } from '@/provider/Auth';
import { getDynamicPath, RouterPath } from '@/routes/path';

const BACKEND_URLS: { [key: string]: string } = {
  김태윤: process.env.REACT_APP_BACKEND_URL_KIM_TAEYUN!,
  강수민: process.env.REACT_APP_BACKEND_URL_KANG_SUMIN!,
  유경미: process.env.REACT_APP_BACKEND_URL_YOO_KYUNGMI!,
};
export const Header = () => {
  const navigate = useNavigate();
  const authInfo = useAuth();
  const [selectedName, setSelectedName] = useState(() => {
    const currentBaseUrl = sessionStorage.getItem('baseUrl') || fetchInstance.defaults.baseURL;
    return Object.keys(BACKEND_URLS).find((key) => BACKEND_URLS[key] === currentBaseUrl);
  });

  const handleLogin = () => {
    navigate(getDynamicPath.login());
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedName(selectedValue);
    queryClient.invalidateQueries().then(() => {
      navigate(RouterPath.home);
      fetchInstance.defaults.baseURL = BACKEND_URLS[selectedValue];
      sessionStorage.setItem('baseUrl', BACKEND_URLS[selectedValue]);
    });
  };

  return (
    <Wrapper>
      <Container flexDirection="row" alignItems="center" justifyContent="space-between">
        <Link to={RouterPath.home}>
          <Logo
            src="https://gift-s.kakaocdn.net/dn/gift/images/m640/pc_gift_logo.png"
            alt="카카오 선물하기 로고"
          />
        </Link>
        <RightWrapper>
          <Select onChange={handleSelectChange} value={selectedName}>
            {Object.keys(BACKEND_URLS).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
          {authInfo ? (
            <LinkButton onClick={() => navigate(RouterPath.myAccount)}>내 계정</LinkButton>
          ) : (
            <LinkButton onClick={handleLogin}>로그인</LinkButton>
          )}
        </RightWrapper>
      </Container>
    </Wrapper>
  );
};

export const HEADER_HEIGHT = '54px';

export const Wrapper = styled.header`
  position: fixed;
  z-index: 9999;
  width: 100%;
  max-width: 100vw;
  height: ${HEADER_HEIGHT};
  background-color: #fff;
  padding: 0 16px;
`;

const Logo = styled.img`
  height: ${HEADER_HEIGHT};
`;
const RightWrapper = styled.div`
  display: flex;
`;

const LinkButton = styled.p`
  margin-left: 10px;
  align-items: center;
  font-size: 14px;
  color: #000;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  height: 100%;
  display: block;

  padding: 8px 16px;
  border: 1px solid #000;
  border-radius: 4px;
  background-color: white;
  transition:
    background-color 0.3s,
    color 0.3s;

  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }
`;
