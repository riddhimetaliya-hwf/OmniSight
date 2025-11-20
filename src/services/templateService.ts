const API_BASE_URL = 'https://localhost:7104/api';

export const templateService = {
  async getTemplates(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log('🔄 Fetching templates from:', `${API_BASE_URL}/templates`);
      
      const response = await fetch(`${API_BASE_URL}/templates`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Templates fetched successfully. Count:', Array.isArray(data) ? data.length : 'unknown');
      console.log('📦 Template data structure:', data);
      
      return { success: true, data };
    } catch (error) {
      console.error('❌ Error fetching templates:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async getTemplateById(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log(`🔄 Fetching template by ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/templates/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Template with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching template:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async getTemplateByWorkflowId(workflowId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log(`🔄 Fetching template by workflow ID: ${workflowId}`);
      const response = await fetch(`${API_BASE_URL}/templates/workflow/${workflowId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Template with workflow ID ${workflowId} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching template by workflow ID:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async getTemplateCategories(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log('🔄 Extracting categories from templates...');
      const templatesResponse = await this.getTemplates();
      
      if (templatesResponse.success && templatesResponse.data) {
        const templatesData = Array.isArray(templatesResponse.data) 
          ? templatesResponse.data 
          : templatesResponse.data.templates || templatesResponse.data || [];
        
        const categories = Array.from(new Set(
          templatesData
            .map((t: any) => t.category || 'General')
            .filter((category: string) => category && category !== 'undefined')
        ));
        
        console.log('📊 Extracted categories:', categories);
        return { success: true, data: categories };
      }
      
      return { 
        success: false, 
        error: templatesResponse.error || 'Failed to fetch templates for categories'
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};