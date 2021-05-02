import { IconButton, Link } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import React from "react";

export const BackButton: React.FC<{}> = () => {
  const router = useRouter();

  return (
    <IconButton
      as={Link}
      colorScheme="yellow"
      icon={<ArrowBackIcon />}
      aria-label="Go Back"
      onClick={() => router.back()}
    />
  );
};
