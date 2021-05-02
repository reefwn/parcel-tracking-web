import { IconButton, Flex, Heading, Link } from "@chakra-ui/react";
import { SOMETHING_WRONG_TXT } from "../constants";
import { AddIcon } from "@chakra-ui/icons";
import { Layout } from "./Layout";
import NextLink from "next/link";
import React from "react";

interface SomethingWrongProps {
  wording?: string;
  createButton?: string | null;
}

export const SomethingWrong: React.FC<SomethingWrongProps> = ({
  wording = SOMETHING_WRONG_TXT,
  createButton,
}) => {
  return (
    <Layout>
      <Flex flex={1}>
        <Flex>
          <Heading>{wording}</Heading>
        </Flex>
        {createButton ? (
          <Flex ml="auto">
            <NextLink href={`${createButton}/create`}>
              <IconButton
                as={Link}
                colorScheme="teal"
                aria-label={`New ${createButton
                  .charAt(0)
                  .toUpperCase()}${createButton.slice(1)}`}
                icon={<AddIcon />}
              />
            </NextLink>
          </Flex>
        ) : null}
      </Flex>
    </Layout>
  );
};
