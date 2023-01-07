import { DisplayText, Page, Stack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { ActiveSubscriptions } from "../components/ActiveSubscriptions";

const Settings = () => {
  return (
    <Page>
      <TitleBar title="Settings" primaryAction={null} />
      <Stack wrap={false} distribution="fill" alignment="center" vertical>
        <Stack.Item>
          <Stack vertical spacing="extraTight" alignment="center">
            <DisplayText size="small">Settings page</DisplayText>
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
