import { Button, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

export const CancelButton: React.FC<{}> = () => {
  const router = useRouter();

  return (
    <Button
      as={Link}
      colorScheme="teal"
      variant="outline"
      aria-label="Cancel"
      onClick={() => router.back()}
    >
      Cancel
    </Button>
  );
};
