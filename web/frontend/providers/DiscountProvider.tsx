import { AppProvider } from "@shopify/discount-app-components";
import "@shopify/discount-app-components/build/esm/styles.css";
import { PropsWithChildren } from "react";

export function DiscountProvider({ children }: PropsWithChildren) {
  return (
    <AppProvider locale="en-US" ianaTimezone="America/Toronto">
      {children}
    </AppProvider>
  );
}
