import { useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
  Button,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

function useProductCount() {
  const fetch = useAuthenticatedFetch();
  return useQuery(["api", "products", "count"], async () => {
    const { count } = await fetch("/api/products/count").then((res) =>
      res.json()
    );
    return count as number;
  });
}

function useProductCreate(noOfProducts = 2, showToast: () => void) {
  const queryClient = useQueryClient();
  const fetch = useAuthenticatedFetch();
  return useMutation(
    ["api", "product"],
    async () => {
      await fetch("/api/products/create/" + noOfProducts);
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(["api", "products", "count"]);
        const previousCount: number = +queryClient.getQueryData([
          "api",
          "products",
          "count",
        ]);
        queryClient.setQueryData(
          ["api", "products", "count"],
          () => previousCount + 2
        );
        return { previousCount };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(
          ["api", "products", "count"],
          context.previousCount
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["api", "products", "count"]);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(["api", "products", "count"]);
        showToast();
      },
    }
  );
}

export function ProductsCard() {
  const [hasResults, setHasResults] = useState(false);
  const showToast = () => setHasResults(true);
  const { mutate } = useProductCreate(2, showToast);
  const { data: count, isLoading, error } = useProductCount();

  const toastMarkup = hasResults && (
    <Toast
      content="2 products created!"
      onDismiss={() => setHasResults(false)}
    />
  );

  return (
    <>
      {toastMarkup}
      <Card title="Product Counter" sectioned>
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price. You can
            remove them at any time.
          </p>
          <Heading element="h4">
            TOTAL PRODUCTS
            <DisplayText size="medium">
              <TextStyle variation="strong">
                {isLoading && ".."}
                {error && "??"}
                {!isLoading && count}
              </TextStyle>
            </DisplayText>
          </Heading>
          <Button outline loading={isLoading} onClick={mutate}>
            Populate 2 products
          </Button>
        </TextContainer>
      </Card>
    </>
  );
}
