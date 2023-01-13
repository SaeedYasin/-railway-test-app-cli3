import {
  Card,
  Heading,
  Image,
  Layout,
  Page,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import { useNavigate } from "react-router";
import trophyImgUrl from "../assets/home-trophy.png";
import mixpanel from "../lib/mixpanel.js";

const updateMixPanel = () => {
  mixpanel.then((mp) => {
    mp.track("General Page View", {
      source: "Some source",
    });
  });
};

export default function PageGeneral() {
  updateMixPanel();

  const navigate = useNavigate();
  return (
    <Page
      fullWidth
      breadcrumbs={[
        {
          content: "Back",
          onAction: () => navigate(-1),
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading>Page General Example</Heading>
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={trophyImgUrl}
                    alt="Nice work on building a Shopify app"
                    width={120}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading>Secondary Section</Heading>
                </TextContainer>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
