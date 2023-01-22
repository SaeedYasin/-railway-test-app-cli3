import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import { GlobalLoadingIndicator } from "./components/GlobalLoadingIndicator.jsx";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
  DiscountProvider,
} from "./providers";
import { ShopContextProvider } from "./hooks/index.js";
import { HelmetProvider } from "react-helmet-async";
import type { Route } from "./Routes";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob<Route>(
    "./pages/**/!(*.test.[jt]sx)*.([jt]sx)",
    {
      eager: true,
    }
  );

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <DiscountProvider>
            <QueryProvider>
              <GlobalLoadingIndicator />
              <ShopContextProvider>
                <HelmetProvider>
                  <NavigationMenu
                    navigationLinks={[
                      {
                        label: "Volume Discounts",
                        destination: "/volume/new",
                      },
                      {
                        label: "Settings",
                        destination: "/settings",
                      },
                    ]}
                  />
                  <Routes pages={pages} />
                </HelmetProvider>
              </ShopContextProvider>
            </QueryProvider>
          </DiscountProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
