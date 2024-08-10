import { Flex, Spinner, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { useGetCategories } from '@/api/hooks/useGetCategorys';
import { Container } from '@/components/common/layouts/Container';
import { Grid } from '@/components/common/layouts/Grid';
import { getDynamicPath } from '@/routes/path';
import { breakpoints } from '@/styles/variants';

import { CategoryItem } from './CategoryItem';

export const CategorySection = () => {
  const { data, isLoading, isError } = useGetCategories();

  if (isLoading)
    return (
      <Flex width="100vw" height="240px" justifyContent="center" alignItems="center">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Flex>
    );
  if (isError)
    return (
      <Flex width="100vw" height="240px" justifyContent="center" alignItems="center">
        <Text fontSize="22px" color="blue.600">
          카테고리 불러오기에 실패했습니다. 잠시후 다시 시도해 주세요.
        </Text>
      </Flex>
    );
  if (!data) return null;

  return (
    <Wrapper>
      <Container>
        <Grid
          columns={{
            initial: 4,
            md: 6,
          }}
        >
          {data.map((category) => (
            <Link key={category.id} to={getDynamicPath.category(category.id.toString())}>
              <CategoryItem image={category.imageUrl} label={category.name} />
            </Link>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 14px 14px 3px;

  @media screen and (min-width: ${breakpoints.sm}) {
    padding: 45px 52px 23px;
  }
`;
