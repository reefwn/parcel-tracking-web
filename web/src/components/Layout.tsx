import { Flex, useColorMode } from "@chakra-ui/react";
import { Wrapper, WrapperVariant } from "./Wrapper";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { Navbar } from "./Navbar";
import React from "react";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.100", dark: "gray.900" };
  const color = { light: "black", dark: "white" };

  return (
    <Flex
      flex={1}
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      minH="100vh"
    >
      <Navbar />
      <Wrapper variant={variant}>
        <DarkModeSwitch />
        {children}
      </Wrapper>
    </Flex>
  );
};
