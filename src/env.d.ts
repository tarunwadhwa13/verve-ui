/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SSO_ENABLED: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_MICROSOFT_CLIENT_ID: string
  readonly VITE_OKTA_CLIENT_ID: string
  readonly VITE_OKTA_DOMAIN: string
}
