import { Box, Button, CircularProgress, Flex } from "@chakra-ui/react";
import { SomethingWrong } from "../../../components/SomethingWrong";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { CancelButton } from "../../../components/CancelButton";
import { InputField } from "../../../components/InputField";
import { useGetIntId } from "../../../utils/useGetIntId";
import { Layout } from "../../../components/Layout";
import { FILL_ALL_TXT } from "../../../constants";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import React from "react";
import {
  useProductQuery,
  useUpdateProductMutation,
} from "../../../generated/graphql";

const EditProduct = ({}) => {
  const router = useRouter();
  const productId = useGetIntId();
  const [{ data, fetching }] = useProductQuery({
    pause: productId === -1,
    variables: {
      id: productId,
    },
  });
  const [, updateProduct] = useUpdateProductMutation();

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
          name: data?.product?.name,
          cost: data?.product?.price.cost,
          selling: data?.product?.price.selling,
        }}
        onSubmit={async ({ name, cost, selling }) => {
          if (!name || !cost || !selling) {
            alert(FILL_ALL_TXT);
          } else {
            await updateProduct({
              id: productId,
              input: {
                name,
                cost,
                selling,
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
                name="name"
                placeholder="name of product"
                label="Product's Name"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="cost"
                type="number"
                placeholder="0.00"
                label="Cost Price"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="selling"
                type="number"
                placeholder="0.00"
                label="Selling Price"
              />
            </Box>
            <Flex mt={6}>
              <Button
                mr={2}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Update Product
              </Button>
              <CancelButton />
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditProduct);
