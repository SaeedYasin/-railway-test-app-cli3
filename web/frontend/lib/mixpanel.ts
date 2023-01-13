import type { Mixpanel } from "mixpanel-browser";

const mixpanel: Promise<Mixpanel> = (async () => {
  const mixpanel_browser = await import("mixpanel-browser");

  const mixpanel = mixpanel_browser.init(
    import.meta.env.VITE_MP_TOKEN,
    {
      debug: import.meta.env.DEV,
      ignore_dnt: true,
    },
    import.meta.env.VITE_APP_SLUG
  );

  mixpanel.register({ development: import.meta.env.DEV });

  return mixpanel;
})();

export default mixpanel;
