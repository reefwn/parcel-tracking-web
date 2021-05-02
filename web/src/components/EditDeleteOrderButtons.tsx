import { CONFIRM_DELETE_TXT, NOT_AUTHORIZE_TXT } from "../constants";
import { useDeleteOrderMutation } from "../generated/graphql";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { IconButton, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React from "react";

interface EditDeleteOrderButtonsProps {
  orderId: number;
}

export const EditDeleteOrderButtons: React.FC<EditDeleteOrderButtonsProps> = ({
  orderId,
}) => {
  const [, deleteOrder] = useDeleteOrderMutation();
  const router = useRouter();
  return (
    <>
      <NextLink href="/order/edit/[id]" as={`/order/edit/${orderId}`}>
        <IconButton
          as={Link}
          colorScheme="blue"
          icon={<EditIcon />}
          aria-label="Edit Order"
          ml="auto"
        />
      </NextLink>
      <IconButton
        colorScheme="red"
        icon={<DeleteIcon />}
        aria-label="Delete Order"
        ml={2}
        onClick={async () => {
          let sure = confirm(CONFIRM_DELETE_TXT);
          if (sure) {
            const result = await deleteOrder({ id: orderId });
            if (!result.data?.deleteOrder) {
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
