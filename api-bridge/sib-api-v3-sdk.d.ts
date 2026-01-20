// Type declarations for sib-api-v3-sdk
// The official SDK doesn't include TypeScript definitions, so we declare them here

declare module 'sib-api-v3-sdk' {
  // Main API client
  export interface ApiClientInstance {
    authentications: {
      'api-key': {
        apiKey: string;
      };
    };
  }

  export interface ApiClientStatic {
    instance: ApiClientInstance;
  }

  // Transactional Emails API
  export class TransactionalEmailsApi {
    sendTransacEmail(email: SendSmtpEmail): Promise<{ messageId: string }>;
  }

  // Account API
  export class AccountApi {
    getAccount(): Promise<AccountData>;
  }

  // Email Campaigns API (for completeness)
  export class EmailCampaignsApi {
    // Add methods as needed
  }

  // Email model
  export class SendSmtpEmail {
    sender?: {
      name?: string;
      email: string;
    };
    to: Array<{
      email: string;
      name?: string;
    }>;
    subject?: string;
    htmlContent?: string;
    textContent?: string;
    tags?: string[];
    params?: Record<string, any>;
    attachment?: Array<{
      content?: string;
      name?: string;
      url?: string;
    }>;
  }

  // Email template model
  export class CreateEmailTemplate {
    templateName?: string;
    subject?: string;
    htmlContent?: string;
    sender?: {
      name?: string;
      email: string;
    };
    isActive?: boolean;
  }

  // Account data interface
  export interface AccountData {
    planType?: string[];
    emails?: number;
    [key: string]: any;
  }

  // Default export - the SDK exports a default object containing all classes
  const SibApiV3Sdk: {
    ApiClient: ApiClientStatic;
    TransactionalEmailsApi: typeof TransactionalEmailsApi;
    AccountApi: typeof AccountApi;
    EmailCampaignsApi: typeof EmailCampaignsApi;
    SendSmtpEmail: typeof SendSmtpEmail;
    CreateEmailTemplate: typeof CreateEmailTemplate;
  };

  export default SibApiV3Sdk;
}
