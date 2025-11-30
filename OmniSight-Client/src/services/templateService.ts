import apiClient, { API_ENDPOINTS, ApiResponse } from "./api";

export const templateService = {
  async getTemplates(): Promise<ApiResponse> {
    try {
      console.log("🔄 Fetching templates from:", API_ENDPOINTS.TEMPLATES.ALL);

      const response = await apiClient.get(API_ENDPOINTS.TEMPLATES.ALL);

      if (response.success && response.data) {
        const data = response.data;
        console.log(
          "✅ Templates fetched successfully. Count:",
          Array.isArray(data) ? data.length : "unknown"
        );
        console.log("📦 Template data structure:", data);
      }

      return response;
    } catch (error) {
      console.error("❌ Error fetching templates:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  async getTemplateById(id: string): Promise<ApiResponse> {
    try {
      console.log(`🔄 Fetching template by ID: ${id}`);
      const response = await apiClient.get(API_ENDPOINTS.TEMPLATES.BY_ID(id));

      if (!response.success) {
        if (response.status === 404) {
          return {
            success: false,
            error: `Template with ID ${id} not found`,
          };
        }
      }

      return response;
    } catch (error) {
      console.error("Error fetching template:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  async getTemplateByWorkflowId(workflowId: string): Promise<ApiResponse> {
    try {
      console.log(`🔄 Fetching template by workflow ID: ${workflowId}`);
      const response = await apiClient.get(
        API_ENDPOINTS.TEMPLATES.BY_WORKFLOW_ID(workflowId)
      );

      if (!response.success) {
        if (response.status === 404) {
          return {
            success: false,
            error: `Template with workflow ID ${workflowId} not found`,
          };
        }
      }

      return response;
    } catch (error) {
      console.error("Error fetching template by workflow ID:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  async getTemplateCategories(): Promise<ApiResponse> {
    try {
      console.log("🔄 Extracting categories from templates...");
      const templatesResponse = await this.getTemplates();

      if (templatesResponse.success && templatesResponse.data) {
        const templatesData = Array.isArray(templatesResponse.data)
          ? templatesResponse.data
          : templatesResponse.data.templates || templatesResponse.data || [];

        const categories = Array.from(
          new Set(
            templatesData
              .map((t: { category?: string }) => t.category || "General")
              .filter(
                (category: string) => category && category !== "undefined"
              )
          )
        );

        console.log("📊 Extracted categories:", categories);
        return { success: true, data: categories };
      }

      return {
        success: false,
        error:
          templatesResponse.error || "Failed to fetch templates for categories",
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
};
