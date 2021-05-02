import { createUrqlClient } from "../utils/createUrqlClient";
import { useCreateUserMutation } from "../generated/graphql";
import { InputField } from "../components/InputField";
import { toErrorMap } from "../utils/toErrorMap";
import { Box, Button } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import React from "react";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useCreateUserMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.createUser.errors) {
            setErrors(toErrorMap(response.data.createUser.errors));
          } else if (response.data?.createUser.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="email"
              placeholder="example@email.com"
              label="Email Address"
            ></InputField>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="********"
                label="Password"
                type="password"
              ></InputField>
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
