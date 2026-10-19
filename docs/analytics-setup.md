# Optional GA4 setup

Updated October 11, 2026. Live pages contained measurement ID G-K4KZYMTFBZ. The source now preserves that public ID through NEXT_PUBLIC_GA_MEASUREMENT_ID. A blank value disables the analytics UI and loader. This is a public measurement ID, not a private API credential.

The footer offers equally styled No thanks and Allow analytics controls. No Google script is rendered until consent is allowed. The choice is stored locally and can be changed through Analytics choices. Tools require no consent. Withdrawing disables collection, expires accessible first-party GA cookies and reloads to unload the script. Previously transmitted data is not deleted by this action. If browser storage is blocked, choices cannot persist across navigation/reload.

Our explicit page-view events use origin plus pathname for the page URL and referrer, excluding queries and fragments. They send no file content, filenames, passwords, form fields or extracted text. Ads/signals/personalization flags are denied or disabled in configuration. Read the visible privacy policy. This optional analytics preference is not an AdSense-certified CMP.

Before enabling collection in the live account, open Admin > Data streams > the web stream and **disable Enhanced Measurement**, especially form interactions, site search, file downloads and history-based page changes. These remotely configured automatic events are outside the custom page-view code. Do not enable user-provided data, User-ID, Google Signals or advertising personalization for this release. Use no extra analytics plugins or raw gtag snippets. Replacing the exported HTML should replace the previously unconditional tag; verify Hostinger is not injecting another copy.

Verify in an ordinary fresh browser profile: before choosing, no googletagmanager/google-analytics requests; after No thanks, still none; after Allow analytics, one loader and page visits; after withdrawal/reload, no loader. Inspect actual event parameters in the account without sensitive documents. Development/browser automation must use a mocked loader or denied consent, not pollute the real property. Avoid reading reduced opt-in counts as a loss of actual users.

Consent/account/legal configuration and a receiving mailbox are owner tasks. This source does not confirm their external state. [Google tag reference](https://developers.google.com/tag-platform/gtagjs/reference).
