import { Text, Page, Stack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { ActiveSubscriptions } from "../components/ActiveSubscriptions";

const Settings = () => {
  return (
    <Page>
      <TitleBar title="Settings" primaryAction={null} />
      <Stack wrap={false} distribution="fill" alignment="center" vertical>
        <Stack.Item>
          <Stack vertical spacing="extraTight" alignment="center">
            <Text variant="heading2xl" as="h1">
              Settings page
            </Text>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <ActiveSubscriptions />
        </Stack.Item>
      </Stack>
    </Page>
  );
};

export default Settings;
