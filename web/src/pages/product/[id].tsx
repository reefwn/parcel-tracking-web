import { EditDeleteProductButtons } from "../../components/EditDeleteProductButtons";
import { useGetProductFromUrl } from "../../utils/useGetProductFromUrl";
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

const Product = ({}) => {
  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.800");

  const [{ data, fetching }] = useGetProductFromUrl();

  if (fetching) {
    return (
      <Flex flex={1} minH="80vh" align="center">
        <CircularProgress isIndeterminate color="teal.300" mx="auto" />
      </Flex>
    );
  }

  if (!data?.product && !fetching) {
    return <SomethingWrong />;
  }

  return (
    <Layout>
      <Flex flex={1} align="center">
        <BackButton />
        <Flex ml={4}>
          <Heading size="lg">
            {data?.product?.name.charAt(0).toUpperCase()}
            {data?.product?.name.slice(1)}
          </Heading>
        </Flex>

        <Flex ml="auto">
          {data?.product?.id ? (
            <EditDeleteProductButtons productId={data.product.id} />
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
        <Flex flex={1} mt={1}>
          <Flex>
            <Text fontWeight={600}>Cost Price:</Text>
          </Flex>
          <Flex ml={4}>
            <Text>&#x0E3F; {data?.product?.price.cost}</Text>
          </Flex>
        </Flex>
        <Flex flex={1} mt={1}>
          <Flex>
            <Text fontWeight={600}>Selling Price:</Text>
          </Flex>
          <Flex ml={4}>
            <Text>&#x0E3F; {data?.product?.price.selling}</Text>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Product);
