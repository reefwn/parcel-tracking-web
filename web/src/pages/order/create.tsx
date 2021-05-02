import { createUrqlClient } from "../../utils/createUrqlClient";
import { CancelButton } from "../../components/CancelButton";
import { InputField } from "../../components/InputField";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useIsAuth } from "../../utils/useIsAuth";
import { Layout } from "../../components/Layout";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";
import {
  useCreateOrderMutation,
  useMyProductsQuery,
} from "../../generated/graphql";

const CreateOrder: React.FC<{}> = ({}) => {
  useIsAuth();
  const router = useRouter();
  const [, createOrder] = useCreateOrderMutation();
  const [{ data }] = useMyProductsQuery();

  const productInfo = { productId: 0, quantity: 1 };
  const [productList, setProductList] = useState([productInfo]);

  // handle input change
  const handleProductChange = (e: any, index: number) => {
    const { value } = e.target;
    const list = [...productList];
    list[index].productId = value;
    setProductList(list);
  };

  const handleQuantityChange = (val: string, index: number) => {
    const value = parseInt(val);
    const list = [...productList];
    list[index].quantity = value;
  };

  const handleAddProduct = () => {
    setProductList([...productList, productInfo]);
  };

  const handleRemoveProduct = (index: number) => {
    const list = [...productList];
    list.splice(index, 1);
    setProductList(list);
  };

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          trackingNumber: "",
          socialId: 1,
          postalId: 1,
          productsIds: [],
          productQtys: [],
        }}
        onSubmit={async (values) => {
          let productsIds = productList.map((item) => parseInt(item.productId));
          let productQtys = productList.map((item) => item.quantity as number);
          const { error } = await createOrder({
            input: {
              trackingNumber: values.trackingNumber,
              socialId: values.socialId,
              postalId: values.postalId,
              productIds: productsIds,
              productQtys,
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
                name="trackingNumber"
                placeholder="tracking number"
                label="Tracking Number"
              />
            </Box>
            <Box mt={4}>
              <Flex flex={1} align="center" justifyContent="space-between">
                <FormLabel m={0}>Product</FormLabel>
                <IconButton
                  colorScheme="blue"
                  aria-label="Add Product"
                  icon={<AddIcon />}
                  onClick={handleAddProduct}
                />
              </Flex>
              {productList.map((_, index) => {
                return (
                  <Flex mt={4} key={index}>
                    <Select
                      onChange={(e) => handleProductChange(e, index)}
                      name="productIds"
                      placeholder="Select Product"
                    >
                      {data &&
                        data.myProducts &&
                        data?.myProducts.map((prod) => {
                          return (
                            <option key={prod.id} value={prod.id}>
                              {prod.name}
                            </option>
                          );
                        })}
                    </Select>
                    <NumberInput
                      onChange={(val) => handleQuantityChange(val, index)}
                      ml={2}
                      name="quantity"
                      defaultValue={1}
                      step={1}
                      min={1}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <IconButton
                      ml={2}
                      colorScheme="red"
                      aria-label="Remove Product"
                      icon={<MinusIcon />}
                      onClick={() => handleRemoveProduct(index)}
                    />
                  </Flex>
                );
              })}
            </Box>
            <Flex mt={6}>
              <Button
                mr={2}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Create Order
              </Button>
              <CancelButton />
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreateOrder);
