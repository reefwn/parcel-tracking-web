import { useOrderQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetOrderFromUrl = () => {
  const orderId = useGetIntId();
  return useOrderQuery({
    pause: orderId === -1,
    variables: {
      id: orderId,
    },
  });
};
