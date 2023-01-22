import type { Session } from "@shopify/shopify-api";
import type { Request, Response } from "express";
import shopify from "../shopify.js";
import express from "express";

const discountRoutes = express.Router();

const CREATE_CODE_MUTATION = `
    mutation CreateCodeDiscount($discount: DiscountCodeAppInput!) {
      discountCreate: discountCodeAppCreate(codeAppDiscount: $discount) {
        userErrors {
          code
          message
          field
        }
      }
    }
  `;

const CREATE_AUTOMATIC_MUTATION = `
    mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {
      discountCreate: discountAutomaticAppCreate(
        automaticAppDiscount: $discount
      ) {
        userErrors {
          code
          message
          field
        }
      }
    }
  `;

const runDiscountMutation = async (
  req: Request,
  res: Response,
  mutation: string
) => {
  const session: Session = res.locals.shopify.session;

  const client = new shopify.api.clients.Graphql({
    session,
  });

  const data = await client.query({
    data: {
      query: mutation,
      variables: req.body,
    },
  });

  res.send(data.body);
};

discountRoutes.post("/code", async (req, res) => {
  await runDiscountMutation(req, res, CREATE_CODE_MUTATION);
});

discountRoutes.post("/automatic", async (req, res) => {
  await runDiscountMutation(req, res, CREATE_AUTOMATIC_MUTATION);
});

export default discountRoutes;
