// Service for fetching credential types from n8n API
import apiClient, { API_ENDPOINTS } from "./api";

export interface CredentialProperty {
  name: string;
  displayName?: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
  placeholder?: string;
}

export interface CredentialTypeInfo {
  name: string;
  displayName: string;
  properties: CredentialProperty[];
  nodes: string[];
}

export interface CredentialTypesResponse {
  credentialTypes: CredentialTypeInfo[];
}

class CredentialService {
  /**
   * Fetch credential types from n8n based on workflow JSON
   */
  async getCredentialTypesFromWorkflow(
    workflowJson: string
  ): Promise<CredentialTypeInfo[]> {
    try {
      const response = await apiClient.post<CredentialTypesResponse>(
        API_ENDPOINTS.CREDENTIALS.TYPES_FROM_WORKFLOW,
        { workflowJson }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch credential types");
      }

      return response.data.credentialTypes || [];
    } catch (error) {
      console.error("❌ Error fetching credential types from workflow:", error);
      throw error;
    }
  }

  /**
   * Get all available credential types from n8n
   */
  async getAllCredentialTypes(): Promise<CredentialTypeInfo[]> {
    try {
      const response = await apiClient.get<CredentialTypesResponse>(
        API_ENDPOINTS.CREDENTIALS.TYPES
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch credential types");
      }

      return response.data.credentialTypes || [];
    } catch (error) {
      console.error("❌ Error fetching all credential types:", error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific credential type
   */
  async getCredentialTypeDetails(
    credentialType: string
  ): Promise<CredentialTypeInfo> {
    try {
      const response = await apiClient.get<CredentialTypeInfo>(
        API_ENDPOINTS.CREDENTIALS.TYPE_DETAILS(credentialType)
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch credential type details"
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching credential type details for ${credentialType}:`,
        error
      );
      throw error;
    }
  }
}

// Export singleton instance
export const credentialService = new CredentialService();
export default credentialService;
