// Frontend workflow service for n8n direct integration
class WorkflowService {
  private n8nBaseURL: string;
  private baseURL: string;
  private apiKey?: string;
  private username?: string;
  private password?: string;
  private webhookURL: string;

  constructor() {
    this.baseURL = import.meta.env?.VITE_N8N_URL || "http://localhost:5678";
    this.n8nBaseURL = this.baseURL;
    this.apiKey = import.meta.env?.VITE_N8N_API_KEY;
    this.username = import.meta.env?.VITE_N8N_USERNAME;
    this.password = import.meta.env?.VITE_N8N_PASSWORD;
    this.webhookURL =
      import.meta.env?.VITE_N8N_WEBHOOK_URL || "http://localhost:5678/webhook";
  }

  // Get headers with authentication
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      // Use API Key auth
      headers["X-N8N-API-KEY"] = this.apiKey;
    } else if (this.username && this.password) {
      // Use Basic Auth
      const credentials = btoa(`${this.username}:${this.password}`);
      headers["Authorization"] = `Basic ${credentials}`;
    } else {
      console.warn("⚠️ No n8n authentication method configured!");
    }

    return headers;
  }

  // Convert OmniSight workflow to proper n8n format
  private convertToN8NFormat(workflowData: {
    name: string;
    nodes: Array<{
      id: string;
      position: { x: number; y: number };
      data?: {
        type?: string;
        label?: string;
        parameters?: Record<string, unknown>;
      };
    }>;
    edges: Array<{
      source: string;
      target: string;
    }>;
    tags?: string[];
  }) {
    console.log("🔄 Converting to n8n format...", workflowData);

    const n8nNodes: Record<string, unknown> = {};

    // Convert each node properly
    workflowData.nodes.forEach((node) => {
      console.log("📝 Processing node:", node);

      const nodeType = node.data?.type || "default";
      const nodeLabel = node.data?.label || nodeType;

      // Create proper n8n node structure
      const n8nNode = {
        id: node.id,
        name: nodeLabel,
        type: this.mapNodeTypeToN8N(nodeType),
        typeVersion: 1,
        position: [Math.round(node.position.x), Math.round(node.position.y)],
        parameters: this.getNodeParameters(
          nodeType,
          node.data?.parameters || {}
        ),
      };

      console.log("🎯 Created n8n node:", n8nNode);
      n8nNodes[node.id] = n8nNode;
    });

    // Convert edges to n8n connections
    const connections: Record<string, unknown> = {};
    workflowData.edges.forEach((edge) => {
      const sourceNode = edge.source;
      const targetNode = edge.target;

      if (!connections[sourceNode]) {
        connections[sourceNode] = {};
      }

      const sourceConnections = connections[sourceNode] as Record<
        string,
        unknown
      >;
      if (!sourceConnections.main) {
        sourceConnections.main = [];
      }

      // Add connection
      (sourceConnections.main as Array<unknown>).push([
        {
          node: targetNode,
          type: "main",
          index: 0,
        },
      ]);
    });

    const n8nWorkflow = {
      name: workflowData.name,
      nodes: n8nNodes,
      connections,
      active: false,
      settings: {},
      staticData: null,
      tags: workflowData.tags || [],
    };

    console.log("📦 Final n8n workflow:", n8nWorkflow);
    return n8nWorkflow;
  }

  // Map node types with proper n8n node identifiers
  private mapNodeTypeToN8N(nodeType: string): string {
    const typeMap: Record<string, string> = {
      http: "n8n-nodes-base.httpRequest",
      email: "n8n-nodes-base.emailSend",
      data: "n8n-nodes-base.function",
      trigger: "n8n-nodes-base.manualTrigger",
      ai: "n8n-nodes-base.openAi",
      webhook: "n8n-nodes-base.webhook",
      schedule: "n8n-nodes-base.scheduleTrigger",
      slack: "n8n-nodes-base.slack",
      notion: "n8n-nodes-base.notion",
      "google-sheets": "n8n-nodes-base.googleSheets",
      default: "n8n-nodes-base.noOp",
    };

    return typeMap[nodeType] || "n8n-nodes-base.noOp";
  }

  // Get proper parameters for each node type
  private getNodeParameters(
    nodeType: string,
    parameters: Record<string, unknown>
  ): Record<string, unknown> {
    const defaultParams: Record<string, Record<string, unknown>> = {
      email: {
        subject: parameters.subject || "Default Subject",
        text: parameters.text || "Default email content",
        to: parameters.to || "recipient@example.com",
      },
      http: {
        url: parameters.url || "https://jsonplaceholder.typicode.com/posts",
        method: parameters.method || "GET",
      },
      trigger: {
        // Manual trigger has no parameters
      },
      data: {
        functionCode:
          parameters.functionCode || `// Your code here\nreturn items;`,
      },
      ai: {
        model: parameters.model || "gpt-3.5-turbo",
        prompt: parameters.prompt || "Hello, AI!",
      },
      default: {},
    };

    return defaultParams[nodeType] || {};
  }

  // Test n8n connection
  async testN8NConnection(): Promise<boolean> {
    try {
      console.log("🔍 Testing n8n connection...");

      const response = await fetch(`${this.n8nBaseURL}/rest/workflows`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      console.log("🌐 n8n connection status:", response.status);

      if (response.ok) {
        console.log("✅ n8n is accessible!");
        return true;
      } else {
        console.log("❌ n8n returned status:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Cannot connect to n8n:", error);
      return false;
    }
  }

  // Create workflow - direct to n8n
  async createWorkflow(workflowData: {
    name: string;
    description?: string;
    nodes: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      data: {
        label: string;
        type: string;
        parameters: Record<string, unknown>;
      };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      sourceHandle?: string;
      targetHandle?: string;
    }>;
    category?: string;
    tags?: string[];
    settings?: Record<string, unknown>;
    status?: string;
  }) {
    try {
      console.log("🚀 Sending workflow directly to n8n...", workflowData);

      // Convert to n8n format
      const n8nWorkflow = this.convertToN8NFormat(workflowData);

      console.log("📤 Sending to n8n API...");

      const response = await fetch(`${this.n8nBaseURL}/rest/workflows`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(n8nWorkflow),
      });

      console.log("📡 n8n API response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Workflow saved to n8n successfully!", result);

        return {
          success: true,
          data: {
            id: result.data?.id || result.id,
            ...workflowData,
            n8nWorkflowId: result.data?.id || result.id,
            n8nSyncStatus: "synced" as const,
          },
          message: "Workflow created successfully in n8n",
        };
      } else {
        const errorText = await response.text();
        console.error("❌ n8n API error:", errorText);

        if (response.status === 401) {
          throw new Error(
            "n8n requires authentication. Please either:\n\n" +
              "1. Restart n8n without auth: n8n start --tunnel\n" +
              "2. Or add authentication credentials to your .env file"
          );
        }

        throw new Error(`n8n API error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("❌ Create workflow error:", error);
      throw error;
    }
  }

  // Update workflow in n8n
  async updateWorkflow(
    workflowId: string,
    updateData: {
      name: string;
      nodes: Array<{
        id: string;
        type: string;
        position: { x: number; y: number };
        data: {
          label: string;
          type: string;
          parameters: Record<string, unknown>;
        };
      }>;
      edges: Array<{
        id: string;
        source: string;
        target: string;
        sourceHandle?: string;
        targetHandle?: string;
      }>;
      n8nWorkflowId?: string;
      n8nSyncStatus?: string;
      n8nSyncError?: string | null;
    }
  ) {
    try {
      console.log("🔄 Updating workflow in n8n...", workflowId);

      const n8nWorkflow = this.convertToN8NFormat(updateData);
      // Add ID for update
      (n8nWorkflow as { id: string }).id = workflowId;

      const response = await fetch(
        `${this.n8nBaseURL}/rest/workflows/${workflowId}`,
        {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify(n8nWorkflow),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update in n8n: ${response.status} - ${errorText}`
        );
      }

      await response.json();

      return {
        success: true,
        data: {
          ...updateData,
          n8nSyncStatus: "synced" as const,
        },
        message: "Workflow updated successfully in n8n",
      };
    } catch (error) {
      console.error("Update workflow error:", error);
      throw error;
    }
  }

  // Get workflow from n8n
  async getWorkflow(workflowId: string) {
    try {
      const response = await fetch(
        `${this.n8nBaseURL}/rest/workflows/${workflowId}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get workflow from n8n: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Get workflow error:", error);
      throw error;
    }
  }

  // Get workflow with sync status
  async getWorkflowWithSyncStatus(workflowId: string) {
    try {
      const workflow = await this.getWorkflow(workflowId);
      return {
        success: true,
        data: {
          ...workflow,
          n8nSyncStatus: "synced" as const,
          n8nSyncError: null,
        },
      };
    } catch (error) {
      console.error("Get workflow sync status error:", error);
      throw error;
    }
  }

  // Sync workflows
  async syncWorkflows() {
    return {
      success: true,
      message: "Direct n8n integration - no sync needed",
    };
  }

  // Get all workflows from n8n
  async getWorkflows(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      search?: string;
    } = {}
  ) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.status) queryParams.append("status", params.status);
      if (params.category) queryParams.append("category", params.category);
      if (params.search) queryParams.append("search", params.search);

      const url = `${this.n8nBaseURL}/rest/workflows${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get workflows from n8n: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Get workflows error:", error);
      throw error;
    }
  }

  // Delete workflow from n8n
  async deleteWorkflow(workflowId: string) {
    try {
      const response = await fetch(
        `${this.n8nBaseURL}/rest/workflows/${workflowId}`,
        {
          method: "DELETE",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete from n8n: ${response.status}`);
      }

      return {
        success: true,
        message: "Workflow deleted successfully from n8n",
      };
    } catch (error) {
      console.error("Delete workflow error:", error);
      throw error;
    }
  }

  // Execute workflow
  async executeWorkflow(
    workflowId: string,
    triggerData: Record<string, unknown> = {}
  ) {
    try {
      const response = await fetch(
        `${this.n8nBaseURL}/rest/workflows/${workflowId}/execute`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ triggerData }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to execute workflow: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Execute workflow error:", error);
      throw error;
    }
  }

  // Get workflow executions
  async getWorkflowExecutions(
    workflowId: string,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const url = `${this.n8nBaseURL}/rest/workflows/${workflowId}/executions${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to get workflow executions: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Get workflow executions error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const workflowService = new WorkflowService();
export default workflowService;
