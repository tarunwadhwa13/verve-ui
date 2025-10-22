interface SSOProviderConfig {
  clientId: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  scope: string;
  responseType: string;
  grantType: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SSOConfig {
  enabled: boolean;
  providers: {
    [key in 'google' | 'microsoft' | 'okta']: {
      enabled: boolean;
      config: SSOProviderConfig;
    };
  };
}

export const SSO_CONFIG: SSOConfig = {
  enabled: true,
  providers: {
    google: {
      enabled: true,
      config: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        scope: 'openid email profile',
        responseType: 'code',
        grantType: 'authorization_code'
      }
    },
    microsoft: {
      enabled: true,
      config: {
        clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
        authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        scope: 'openid email profile',
        responseType: 'code',
        grantType: 'authorization_code'
      }
    },
    okta: {
      enabled: true,
      config: {
        clientId: import.meta.env.VITE_OKTA_CLIENT_ID || '',
        authorizationEndpoint: `https://${import.meta.env.VITE_OKTA_DOMAIN}/oauth2/default/v1/authorize`,
        tokenEndpoint: '/auth/sso/token', // This endpoint will be handled by your backend
        scope: 'openid email profile',
        responseType: 'code',
        grantType: 'authorization_code'
      }
    }
  }
};

// Function to validate SSO configuration
export function validateSSOConfig(provider: 'google' | 'microsoft' | 'okta'): { isValid: boolean; error?: string } {
  const providerConfig = SSO_CONFIG.providers[provider];

  if (!SSO_CONFIG.enabled) {
    return { isValid: false, error: 'SSO is not enabled in the application' };
  }

  if (!providerConfig.enabled) {
    return { isValid: false, error: `${provider} SSO is not enabled` };
  }

  const { clientId, authorizationEndpoint, tokenEndpoint } = providerConfig.config;

  if (!clientId) {
    return { isValid: false, error: `${provider} client ID is not configured` };
  }

  if (!authorizationEndpoint) {
    return { isValid: false, error: `${provider} authorization endpoint is not configured` };
  }

  if (!tokenEndpoint) {
    return { isValid: false, error: `${provider} token endpoint is not configured` };
  }

  return { isValid: true };
}

// Function to get SSO login URL
export function getSSOLoginURL(provider: 'google' | 'microsoft' | 'okta'): string {
  const { config } = SSO_CONFIG.providers[provider];
  const redirectUri = `${window.location.origin}/auth/callback/${provider}`;

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: config.responseType,
    scope: config.scope,
    state: generateState(provider),
  });

  return `${config.authorizationEndpoint}?${params.toString()}`;
}

// Helper function to generate state parameter
function generateState(provider: string): string {
  const state = {
    provider,
    nonce: Math.random().toString(36).substring(2),
    timestamp: Date.now()
  };
  return btoa(JSON.stringify(state));
}
