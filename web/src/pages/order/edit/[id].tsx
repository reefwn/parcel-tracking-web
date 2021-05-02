import { Box, Button, CircularProgress, Flex } from "@chakra-ui/react";
import { SomethingWrong } from "../../../components/SomethingWrong";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { InputField } from "../../../components/InputField";
import { useGetIntId } from "../../../utils/useGetIntId";
import { Layout } from "../../../components/Layout";
import { FILL_ALL_TXT } from "../../../constants";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import React from "react";
import {
  useOrderQuery,
  useUpdateOrderMutation,
} from "../../../generated/graphql";

const EditOrder = ({}) => {
  const router = useRouter();
  const orderId = useGetIntId();
  const [{ data, fetching }] = useOrderQuery({
    pause: orderId === -1,
    variables: {
      id: orderId,
    },
  });
  const [, updateOrder] = useUpdateOrderMutation();

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

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          trackingNumber: data?.order?.trackingNumber,
        }}
        onSubmit={async ({ trackingNumber }) => {
          if (!trackingNumber) {
            alert(FILL_ALL_TXT);
          } else {
            await updateOrder({
              id: orderId,
              input: {
                trackingNumber,
                socialId: 1,
                postalId: 1,
              },
            });
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="trackingNumber"
                placeholder="tracking number"
                label="Tracking Number"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Update Order
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditOrder);
