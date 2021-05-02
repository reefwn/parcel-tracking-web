import { removeUnderlineCss } from "../utils/removeUnderlineCss";
import { SomethingWrong } from "../components/SomethingWrong";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useProductsQuery } from "../generated/graphql";
import { HAVE_NO_TXT, YET_TXT } from "../constants";
import { Layout } from "../components/Layout";
import { withUrqlClient } from "next-urql";
import { AddIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const Product = () => {
  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.800");
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = useProductsQuery({
    variables,
  });

  if (fetching) {
    return (
      <Flex flex={1} minH="80vh" align="center">
        <CircularProgress isIndeterminate color="teal.300" mx="auto" />
      </Flex>
    );
  }

  if (!data && !fetching) {
    return <SomethingWrong />;
  }

  if (data?.products.products.length === 0) {
    return (
      <Flex flex={1} direction="column">
        <SomethingWrong
          wording={`${HAVE_NO_TXT} product ${YET_TXT}`}
          createButton="product"
        />
      </Flex>
    );
  }

  return (
    <Layout>
      <Flex flex={1} align="center">
        <Flex>
          <Heading size="lg">Products</Heading>
        </Flex>
        <Flex ml="auto">
          <NextLink href="/product/create">
            <IconButton
              as={Link}
              colorScheme="teal"
              aria-label="New Product"
              icon={<AddIcon />}
            />
          </NextLink>
        </Flex>
      </Flex>
      <Stack spacing={3} mt={4}>
        {data?.products.products.map((p) =>
          !p ? null : (
            <Flex flex={1} direction="column" key={p.id}>
              <NextLink href="/product/[id]" as={`/product/${p.id}`}>
                <Link style={removeUnderlineCss()}>
                  <Box
                    p={4}
                    backgroundColor={bg}
                    shadow="lg"
                    borderWidth="1px"
                    borderColor={border}
                    borderRadius="lg"
                  >
                    <Heading fontSize="xl">{p.name}</Heading>
                    <Flex flex={1} mt={4}>
                      <Flex>
                        <Text fontWeight={600}>Cost Price:</Text>
                      </Flex>
                      <Flex ml={4}>
                        <Text>&#x0E3F;{p.price.cost.toFixed(2)}</Text>
                      </Flex>
                    </Flex>
                    <Flex flex={1} mt={1}>
                      <Flex>
                        <Text fontWeight={600}>Selling Price:</Text>
                      </Flex>
                      <Flex ml={4}>
                        <Text>&#x0E3F;{p.price.selling.toFixed(2)}</Text>
                      </Flex>
                    </Flex>
                  </Box>
                </Link>
              </NextLink>
            </Flex>
          )
        )}
      </Stack>

      {data && data.products.hasMore ? (
        <Flex>
          <Button
            isLoading={fetching}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor:
                  data.products.products[data.products.products.length - 1]
                    .created_at,
              });
            }}
            my={8}
            mx="auto"
            colorScheme="teal"
          >
            Load More ...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Product);
