import { useProductQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetProductFromUrl = () => {
  const productId = useGetIntId();
  return useProductQuery({
    pause: productId === -1,
    variables: {
      id: productId,
    },
  });
};
