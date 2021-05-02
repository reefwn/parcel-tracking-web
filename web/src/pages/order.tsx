import { removeUnderlineCss } from "../utils/removeUnderlineCss";
import { SomethingWrong } from "../components/SomethingWrong";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useOrdersQuery } from "../generated/graphql";
import { HAVE_NO_TXT, YET_TXT } from "../constants";
import { Layout } from "../components/Layout";
import { AddIcon } from "@chakra-ui/icons";
import { withUrqlClient } from "next-urql";
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

const Order = () => {
  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.800");
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = useOrdersQuery({
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

  if (data?.orders.orders.length === 0) {
    return (
      <Flex flex={1} direction="column">
        <SomethingWrong
          wording={`${HAVE_NO_TXT} order ${YET_TXT}`}
          createButton="order"
        />
      </Flex>
    );
  }

  return (
    <Layout>
      <Flex flex={1} align="center">
        <Flex>
          <Heading size="lg">Orders</Heading>
        </Flex>
        <Flex ml="auto">
          <NextLink href="/order/create">
            <IconButton
              as={Link}
              colorScheme="teal"
              aria-label="New Order"
              icon={<AddIcon />}
            />
          </NextLink>
        </Flex>
      </Flex>
      <Stack spacing={3} mt={6}>
        {data?.orders.orders.map((o) =>
          !o ? null : (
            <Flex flex={1} direction="column" key={o.id}>
              <NextLink href="/order/[id]" as={`/order/${o.id}`}>
                <Link style={removeUnderlineCss()}>
                  <Box
                    p={4}
                    backgroundColor={bg}
                    shadow="lg"
                    borderWidth="1px"
                    borderColor={border}
                    borderRadius="lg"
                  >
                    <Heading fontSize="xl"># {o.id}</Heading>
                    <Flex flex={1} mt={4}>
                      <Flex>
                        <Text fontWeight={600}>Customer Account:</Text>
                      </Flex>
                      <Flex ml={4}>
                        <Text>{o.customerAcc}</Text>
                      </Flex>
                    </Flex>
                    <Flex flex={1} mt={1}>
                      <Flex>
                        <Text fontWeight={600}>Chatroom ID:</Text>
                      </Flex>
                      <Flex ml={4}>
                        <Text>{o.chatroomId}</Text>
                      </Flex>
                    </Flex>
                    <Flex flex={1} mt={1}>
                      <Flex>
                        <Text fontWeight={600}>Social Platform:</Text>
                      </Flex>
                      <Flex ml={4}>
                        <Text>{o.socialId === 1 ? "Facebook" : "Unknown"}</Text>
                      </Flex>
                    </Flex>
                    <Flex flex={1} mt={1}>
                      <Flex>
                        <Text fontWeight={600}>Postal Service:</Text>
                      </Flex>
                      <Flex ml={4}>
                        <Text>
                          {o.postalId === 1 ? "Thai Post" : "Unknown"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                </Link>
              </NextLink>
            </Flex>
          )
        )}
      </Stack>

      {data && data.orders.hasMore ? (
        <Flex>
          <Button
            isLoading={fetching}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor:
                  data.orders.orders[data.orders.orders.length - 1].createdAt,
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Order);
