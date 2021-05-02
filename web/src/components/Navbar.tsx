import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { removeUnderlineCss } from "../utils/removeUnderlineCss";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";

interface NavBarProps {}

export const Navbar: React.FC<NavBarProps> = () => {
  const bg = useColorModeValue("teal.500", "teal.200");
  const text = useColorModeValue("white", "black");
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;
  let menus = null;

  if (fetching) {
    // data is loading
  }

  if (!data?.me) {
    // user is not logged in
    body = (
      <Flex ml="auto">
        <NextLink href="/login">
          <Link
            style={removeUnderlineCss()}
            px={2}
            color={text}
            borderRight="1px"
          >
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link style={removeUnderlineCss()} px={2} color={text}>
            Register
          </Link>
        </NextLink>
      </Flex>
    );
  }

  if (data?.me) {
    // logged in user
    menus = (
      <Flex>
        <NextLink href="/order">
          <Button
            as={Link}
            size="sm"
            ml={2}
            style={removeUnderlineCss()}
            colorScheme="teal"
          >
            Order
          </Button>
        </NextLink>
        <NextLink href="/product">
          <Button
            as={Button}
            size="sm"
            ml={2}
            style={removeUnderlineCss()}
            colorScheme="teal"
          >
            Product
          </Button>
        </NextLink>
      </Flex>
    );

    body = (
      <Flex ml="auto">
        <Box p={1} mr={2} color={text}>
          {data.me.email}
        </Box>
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          colorScheme="teal"
          size="sm"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Box
      backgroundColor={bg}
      p={6}
      position="sticky"
      top="0"
      w="100%"
      zIndex={1}
    >
      <Flex flex={1} m="auto" maxW={800} align="center">
        <NextLink href="/">
          <Link style={removeUnderlineCss()}>
            <Heading size="md" borderRight="1px" pr={2} color={text}>
              Parcel Tracking
            </Heading>
          </Link>
        </NextLink>
        {menus}
        {body}
      </Flex>
    </Box>
  );
};
