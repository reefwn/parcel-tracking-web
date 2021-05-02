import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useMeQuery, useOrders7daysQuery } from "../generated/graphql";
import { SomethingWrong } from "../components/SomethingWrong";
import { createUrqlClient } from "../utils/createUrqlClient";
import OrderChart from "../components/OrderChart";
import { Layout } from "../components/Layout";
import { isServer } from "../utils/isServer";
import { withUrqlClient } from "next-urql";
import React from "react";

const Index = () => {
  const [{ data: ordersCountData }] = useOrders7daysQuery({
    pause: isServer(),
  });

  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  if (fetching) {
    // data is loading
  }

  if (!data && !fetching) {
    return <SomethingWrong />;
  }

  const transformData = (data: any) => {
    let transformed = {
      labels: [],
      datasets: [
        {
          data: [],
          label: "no. of order",
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
        },
      ],
    };

    data.forEach((item) => {
      transformed["labels"].push(item.date.slice(0, 10));
      transformed.datasets[0]["data"].push(item.count);
    });

    return transformed;
  };

  return (
    <Layout>
      {data?.me ? (
        <Box mt={1}>
          <Heading size="lg" mb={4}>
            Connected Services
          </Heading>
          <Flex flex={1}>
            <Button as={Text} colorScheme="blue">
              Facebook
            </Button>
            <Button as={Text} colorScheme="red" mx={2}>
              Thai Post
            </Button>
          </Flex>
          {ordersCountData ? (
            <Flex mt={6}>
              <OrderChart
                chartData={transformData(ordersCountData.orders7days)}
              />
            </Flex>
          ) : null}
        </Box>
      ) : (
        <Flex aling="center" minH="80vh">
          <Heading size="xl" m="auto">
            HomePage
          </Heading>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
