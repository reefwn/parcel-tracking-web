import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from "@chakra-ui/react";

const ForgetPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Alert
              status="info"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Reset Password Request is Submitted!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Email is sent if given email exists in our database. You can get
                a reset password link from your inbox.
              </AlertDescription>
            </Alert>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="example@email.com"
                label="Email Address"
                type="email"
              ></InputField>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Forgot Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgetPassword);
