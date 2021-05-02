import { useCreateProductMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { CancelButton } from "../../components/CancelButton";
import { InputField } from "../../components/InputField";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useIsAuth } from "../../utils/useIsAuth";
import { Layout } from "../../components/Layout";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import React from "react";

const CreateProduct: React.FC<{}> = ({}) => {
  useIsAuth();
  const router = useRouter();
  const [, createPost] = useCreateProductMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ name: "", cost: 0.0, selling: 0.0 }}
        onSubmit={async ({ name, cost, selling }) => {
          const { error } = await createPost({
            input: {
              name,
              cost,
              selling,
            },
          });
          if (!error) {
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
                Create Product
              </Button>
              <CancelButton />
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreateProduct);
