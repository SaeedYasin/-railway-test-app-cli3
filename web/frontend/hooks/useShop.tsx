import { createContext, useContext, useMemo, useReducer } from "react";
import type { ShopUpdate } from "../../@types/shop";
import { PropsWithChildren } from "react";

type Action = {
  type: "GET_SHOP" | "UPDATE_SHOP";
  payload?: ShopUpdate;
};

const initialState = {};
const shopContext = createContext(initialState);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: any, action: Action) {
  switch (action.type) {
    case "GET_SHOP": {
      return {
        ...state,
      };
    }

    case "UPDATE_SHOP": {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return null;
  }
}

export const ShopProvider = (props: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // METHODS
  const getShop = () => {
    dispatch({ type: "GET_SHOP" });
  };

  const updateShop = (payload: ShopUpdate) => {
    dispatch({ type: "UPDATE_SHOP", payload });
  };

  const value = useMemo(
    () => ({
      state,
      getShop,
      updateShop,
    }),
    [state]
  );

  return <shopContext.Provider value={value} {...props} />;
};

export const useShop = () => {
  const context = useContext(shopContext);

  if (context === undefined) {
    throw new Error(`useShop must be used within ShopProvider`);
  }

  return context;
};

export const ShopContextProvider = ({ children }: PropsWithChildren) => (
  <ShopProvider>{children}</ShopProvider>
);
