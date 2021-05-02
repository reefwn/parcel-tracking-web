import { CONFIRM_DELETE_TXT, NOT_AUTHORIZE_TXT } from "../constants";
import { useDeleteProductMutation } from "../generated/graphql";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { IconButton, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React from "react";

interface EditDeleteProductButtonsProps {
  productId: number;
}

export const EditDeleteProductButtons: React.FC<EditDeleteProductButtonsProps> = ({
  productId,
}) => {
  const [, deleteProduct] = useDeleteProductMutation();
  const router = useRouter();
  return (
    <>
      <NextLink href="/product/edit/[id]" as={`/product/edit/${productId}`}>
        <IconButton
          as={Link}
          colorScheme="blue"
          icon={<EditIcon />}
          aria-label="Edit Product"
          ml="auto"
        />
      </NextLink>
      <IconButton
        colorScheme="red"
        icon={<DeleteIcon />}
        aria-label="Delete Product"
        ml={2}
        onClick={async () => {
          let sure = confirm(CONFIRM_DELETE_TXT);
          if (sure) {
            const result = await deleteProduct({ id: productId });
            if (!result.data?.deleteProduct) {
              alert(NOT_AUTHORIZE_TXT);
              router.replace("/");
            }
            router.back();
          }
        }}
      />
    </>
  );
};
