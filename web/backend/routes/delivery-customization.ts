import type { Session } from "@shopify/shopify-api";
import type { Request, Response } from "express";
import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
import express from "express";

const deliveryCustomizationRoutes = express.Router();

// const CREATE_CODE_MUTATION = `
//     mutation CreateCodeDiscount($discount: DiscountCodeAppInput!) {
//       discountCreate: discountCodeAppCreate(codeAppDiscount: $discount) {
//         userErrors {
//           code
//           message
//           field
//         }
//       }
//     }
//   `;

// const CREATE_AUTOMATIC_MUTATION = `
//     mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {
//       discountCreate: discountAutomaticAppCreate(
//         automaticAppDiscount: $discount
//       ) {
//         userErrors {
//           code
//           message
//           field
//         }
//       }
//     }
//   `;

// Helper function for handling any user-facing errors in GraphQL responses
function handleUserError(
  userErrors: [
    {
      message: string;
    }
  ],
  res: Response
) {
  if (userErrors && userErrors.length > 0) {
    const message = userErrors.map((error) => error.message).join(" ");
    res.status(500).send({ error: message });
    return true;
  }
  return false;
}

// Endpoint for the delivery customization UI to invoke
const createDeliveryCustomization = async (req: Request, res: Response) => {
  const payload = req.body;
  console.log("createDeliveryCustomization Payload", payload);
  const graphqlClient = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  try {
    // Create the delivery customization for the provided function ID
    const createResponse = await graphqlClient.query({
      data: {
        query: `mutation DeliveryCustomizationCreate($input: DeliveryCustomizationInput!) {
          deliveryCustomizationCreate(deliveryCustomization: $input) {
            deliveryCustomization {
              id
            }
            userErrors {
              message
            }
          }
        }`,
        variables: {
          input: {
            functionId: payload.functionId,
            title: `Display message for ${payload.stateProvinceCode}`,
            enabled: true,
          },
        },
      },
    });
    const createResult = (createResponse as any).body.data
      .deliveryCustomizationCreate;
    if (handleUserError(createResult.userErrors, res)) {
      return;
    }
    console.log("createDeliveryCustomization createResult", createResult);

    // Populate the function configuration metafield for the delivery customization
    const customizationId = createResult.deliveryCustomization.id;
    const metafieldResponse = await graphqlClient.query({
      data: {
        query: `mutation MetafieldsSet($customizationId: ID!, $configurationValue: String!) {
          metafieldsSet(metafields: [
            {
              ownerId: $customizationId
              namespace: "delivery-customization"
              key: "function-configuration"
              value: $configurationValue
              type: "json"
            }
          ]) {
            metafields {
              id
            }
            userErrors {
              message
            }
          }
        }`,
        variables: {
          customizationId,
          configurationValue: JSON.stringify({
            stateProvinceCode: payload.stateProvinceCode,
            message: payload.message,
          }),
        },
      },
    });
    const metafieldResult = (metafieldResponse as any).body.data.metafieldsSet;
    if (handleUserError(metafieldResult, res)) {
      return;
    }
    console.log("createDeliveryCustomization metafieldResult", metafieldResult);
  } catch (error) {
    // Handle errors thrown by the graphql client
    if (!(error instanceof GraphqlQueryError)) {
      throw error;
    }
    return res.status(500).send({ error: error.response });
  }

  return res.status(200).send();
};

deliveryCustomizationRoutes.post("/create", async (req, res) => {
  await createDeliveryCustomization(req, res);
});

// const runDiscountMutation = async (
//   req: Request,
//   res: Response,
//   mutation: string
// ) => {
//   const session: Session = res.locals.shopify.session;

//   const client = new shopify.api.clients.Graphql({
//     session,
//   });

//   const data = await client.query({
//     data: {
//       query: mutation,
//       variables: req.body,
//     },
//   });

//   res.send(data.body);
// };

// deliveryCustomizationRoutes.post("/code", async (req, res) => {
//   await runDiscountMutation(req, res, CREATE_CODE_MUTATION);
// });

// deliveryCustomizationRoutes.post("/automatic", async (req, res) => {
//   await runDiscountMutation(req, res, CREATE_AUTOMATIC_MUTATION);
// });

export default deliveryCustomizationRoutes;
