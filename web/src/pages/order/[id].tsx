import { EditDeleteOrderButtons } from "../../components/EditDeleteOrderButtons";
import { useGetOrderFromUrl } from "../../utils/useGetOrderFromUrl";
import { SomethingWrong } from "../../components/SomethingWrong";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { BackButton } from "../../components/BackButton";
import { Layout } from "../../components/Layout";
import { withUrqlClient } from "next-urql";
import React from "react";
import {
  useColorModeValue,
  CircularProgress,
  Heading,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";

const Order = ({}) => {
  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.800");

  const [{ data, fetching }] = useGetOrderFromUrl();

  if (fetching) {
    return (
      <Flex flex={1} minH="80vh" align="center">
        <CircularProgress isIndeterminate color="teal.300" mx="auto" />
      </Flex>
    );
  }

  if (!data?.order && !fetching) {
    return <SomethingWrong />;
  }

  return (
    <Layout>
      <Flex flex={1} align="center">
        <BackButton />
        <Flex ml={4}>
          <Heading size="lg">Order # {data?.order?.id}</Heading>
        </Flex>
        <Flex ml="auto">
          {data?.order?.id ? (
            <EditDeleteOrderButtons orderId={data.order.id} />
          ) : null}
        </Flex>
      </Flex>
      <Box
        p={4}
        mt={4}
        backgroundColor={bg}
        shadow="lg"
        borderWidth="1px"
        borderColor={border}
        borderRadius="lg"
      >
        <Heading fontSize="xl"># {data?.order?.id}</Heading>
        <Flex flex={1} mt={4}>
          <Flex>
            <Text fontWeight={600}>Customer Account:</Text>
          </Flex>
          <Flex ml={4}>
            <Text>{data?.order?.customerAcc}</Text>
          </Flex>
        </Flex>
        <Flex flex={1} mt={1}>
          <Flex>
            <Text fontWeight={600}>Chatroom ID:</Text>
          </Flex>
          <Flex ml={4}>
            <Text>{data?.order?.chatroomId}</Text>
          </Flex>
        </Flex>
        <Flex flex={1} mt={1}>
          <Flex>
            <Text fontWeight={600}>Social Platform:</Text>
          </Flex>
          <Flex ml={4}>
            <Text>{data?.order?.socialId === 1 ? "Facebook" : "Unknown"}</Text>
          </Flex>
        </Flex>
        <Flex flex={1} mt={1}>
          <Flex>
            <Text fontWeight={600}>Postal Service:</Text>
          </Flex>
          <Flex ml={4}>
            <Text>{data?.order?.postalId === 1 ? "Thai Post" : "Unknown"}</Text>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Order);
