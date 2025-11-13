import { ExecutiveRole } from '@/types/executive-roles';

export interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  category: 'navigation' | 'data' | 'analysis' | 'control';
  keywords: string[];
  handler: (role: ExecutiveRole) => void;
  executeAction?: (role: ExecutiveRole) => Promise<void>;
}

export interface VoiceCommandResult {
  success: boolean;
  message: string;
  action?: string;
  data?: Record<string, unknown>;
}

class VoiceCommandService {
  private commands: VoiceCommand[] = [
    {
      id: '1',
      phrase: 'Show KPI dashboard',
      action: 'Navigate to KPIs',
      category: 'navigation',
      keywords: ['kpi', 'dashboard', 'show', 'display', 'metrics', 'key performance'],
      handler: (role: ExecutiveRole) => {
        // Navigate to KPI dashboard
        console.log(`Navigating to KPI dashboard for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to KPI tracker page
        console.log(`Navigating to KPI tracker for ${role}`);
        window.location.href = '/kpi-tracker';
      }
    },
    {
      id: '2',
      phrase: 'What are my alerts?',
      action: 'Open alerts panel',
      category: 'data',
      keywords: ['alerts', 'notifications', 'warnings', 'issues', 'problems'],
      handler: (role: ExecutiveRole) => {
        // Open alerts panel
        console.log(`Opening alerts panel for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Open alerts page
        console.log(`Opening alerts for ${role}`);
        window.location.href = '/alerts';
      }
    },
    {
      id: '3',
      phrase: 'Analyze revenue trends',
      action: 'Generate revenue analysis',
      category: 'analysis',
      keywords: ['revenue', 'trends', 'analyze', 'analysis', 'financial', 'money'],
      handler: (role: ExecutiveRole) => {
        // Generate revenue analysis
        console.log(`Generating revenue analysis for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to performance analytics for financial analysis
        console.log(`Opening performance analytics for revenue analysis - ${role}`);
        window.location.href = '/performance-analytics';
      }
    },
    {
      id: '4',
      phrase: 'Switch to CFO view',
      action: 'Change role perspective',
      category: 'control',
      keywords: ['switch', 'cfo', 'role', 'view', 'perspective', 'change'],
      handler: (role: ExecutiveRole) => {
        // Switch to CFO view
        console.log(`Switching to CFO view from ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // This would typically be handled by the parent component
        // For now, we'll navigate to performance hub which is CFO-focused
        console.log(`Switching to CFO-focused view from ${role}`);
        window.location.href = '/performance-hub';
      }
    },
    {
      id: '5',
      phrase: 'Generate briefing report',
      action: 'Create executive briefing',
      category: 'analysis',
      keywords: ['briefing', 'report', 'generate', 'create', 'summary', 'executive'],
      handler: (role: ExecutiveRole) => {
        // Generate briefing report
        console.log(`Generating briefing report for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to data briefings page
        console.log(`Opening data briefings for ${role}`);
        window.location.href = '/data-briefings';
      }
    },
    {
      id: '6',
      phrase: 'Show competitive analysis',
      action: 'Display competitor data',
      category: 'navigation',
      keywords: ['competitive', 'competitor', 'analysis', 'market', 'rivals', 'competition'],
      handler: (role: ExecutiveRole) => {
        // Show competitive analysis
        console.log(`Showing competitive analysis for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to market intelligence page
        console.log(`Opening market intelligence for competitive analysis - ${role}`);
        window.location.href = '/market-intel';
      }
    },
    {
      id: '7',
      phrase: 'Show company overview',
      action: 'Display company metrics',
      category: 'navigation',
      keywords: ['company', 'overview', 'summary', 'metrics', 'business'],
      handler: (role: ExecutiveRole) => {
        // Show company overview
        console.log(`Showing company overview for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to insights page for company overview
        console.log(`Opening insights for company overview - ${role}`);
        window.location.href = '/insights';
      }
    },
    {
      id: '8',
      phrase: 'Analyze market trends',
      action: 'Review market analysis',
      category: 'analysis',
      keywords: ['market', 'trends', 'analyze', 'analysis', 'industry'],
      handler: (role: ExecutiveRole) => {
        // Analyze market trends
        console.log(`Analyzing market trends for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to market intelligence page
        console.log(`Opening market intelligence for trend analysis - ${role}`);
        window.location.href = '/market-intel';
      }
    },
    {
      id: '9',
      phrase: 'Show team performance',
      action: 'View team metrics',
      category: 'data',
      keywords: ['team', 'performance', 'metrics', 'people', 'staff'],
      handler: (role: ExecutiveRole) => {
        // Show team performance
        console.log(`Showing team performance for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to talent onboard pulse for team metrics
        console.log(`Opening talent onboard pulse for team performance - ${role}`);
        window.location.href = '/talent-onboard-pulse';
      }
    },
    {
      id: '10',
      phrase: 'Show financial summary',
      action: 'Display financial overview',
      category: 'navigation',
      keywords: ['financial', 'summary', 'finance', 'money', 'budget'],
      handler: (role: ExecutiveRole) => {
        // Show financial summary
        console.log(`Showing financial summary for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to performance hub for financial overview
        console.log(`Opening performance hub for financial summary - ${role}`);
        window.location.href = '/performance-hub';
      }
    },
    {
      id: '11',
      phrase: 'Open workflows',
      action: 'Navigate to workflow management',
      category: 'navigation',
      keywords: ['workflows', 'workflow', 'process', 'automation'],
      handler: (role: ExecutiveRole) => {
        // Open workflows
        console.log(`Opening workflows for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to workflows page
        console.log(`Opening workflows for ${role}`);
        window.location.href = '/workflows';
      }
    },
    {
      id: '12',
      phrase: 'Show data quality',
      action: 'Display data quality metrics',
      category: 'data',
      keywords: ['data quality', 'data', 'quality', 'clean', 'validation'],
      handler: (role: ExecutiveRole) => {
        // Show data quality
        console.log(`Showing data quality for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to data quality page
        console.log(`Opening data quality for ${role}`);
        window.location.href = '/data-quality';
      }
    },
    {
      id: '13',
      phrase: 'Open integrations',
      action: 'Navigate to integration hub',
      category: 'navigation',
      keywords: ['integrations', 'integration', 'connect', 'api', 'data source'],
      handler: (role: ExecutiveRole) => {
        // Open integrations
        console.log(`Opening integrations for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to integrations page
        console.log(`Opening integrations for ${role}`);
        window.location.href = '/integrations';
      }
    },
    {
      id: '14',
      phrase: 'Show system map',
      action: 'Display system link map',
      category: 'navigation',
      keywords: ['system map', 'system', 'map', 'architecture', 'connections'],
      handler: (role: ExecutiveRole) => {
        // Show system map
        console.log(`Showing system map for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to system link map page
        console.log(`Opening system link map for ${role}`);
        window.location.href = '/system-link-map';
      }
    },
    {
      id: '15',
      phrase: 'Open executive copilot',
      action: 'Launch executive AI assistant',
      category: 'control',
      keywords: ['executive copilot', 'copilot', 'ai assistant', 'assistant'],
      handler: (role: ExecutiveRole) => {
        // Open executive copilot
        console.log(`Opening executive copilot for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to exec copilot page
        console.log(`Opening exec copilot for ${role}`);
        window.location.href = '/exec-copilot';
      }
    },
    {
      id: '16',
      phrase: 'Show decision support',
      action: 'Open decision support tools',
      category: 'analysis',
      keywords: ['decision support', 'decision', 'support', 'scenarios', 'modeling'],
      handler: (role: ExecutiveRole) => {
        // Show decision support
        console.log(`Showing decision support for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to decision support page
        console.log(`Opening decision support for ${role}`);
        window.location.href = '/decision-support';
      }
    },
    {
      id: '17',
      phrase: 'Open opportunity responder',
      action: 'Launch opportunity management',
      category: 'control',
      keywords: ['opportunity responder', 'opportunity', 'responder', 'leads', 'sales'],
      handler: (role: ExecutiveRole) => {
        // Open opportunity responder
        console.log(`Opening opportunity responder for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to opportunity responder page
        console.log(`Opening opportunity responder for ${role}`);
        window.location.href = '/opportunity-responder';
      }
    },
    {
      id: '18',
      phrase: 'Show IT metrics',
      action: 'Display IT performance metrics',
      category: 'data',
      keywords: ['it metrics', 'it', 'technology', 'infrastructure', 'systems'],
      handler: (role: ExecutiveRole) => {
        // Show IT metrics
        console.log(`Showing IT metrics for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to IT services page
        console.log(`Opening IT services for ${role}`);
        window.location.href = '/it-metrics';
      }
    },
    {
      id: '19',
      phrase: 'Open learning resources',
      action: 'Access learning materials',
      category: 'navigation',
      keywords: ['learning resources', 'learning', 'resources', 'training', 'help'],
      handler: (role: ExecutiveRole) => {
        // Open learning resources
        console.log(`Opening learning resources for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to learning resources page
        console.log(`Opening learning resources for ${role}`);
        window.location.href = '/learning-resources';
      }
    },
    {
      id: '20',
      phrase: 'Show user feedback',
      action: 'Display user feedback and suggestions',
      category: 'data',
      keywords: ['user feedback', 'feedback', 'user', 'suggestions', 'comments'],
      handler: (role: ExecutiveRole) => {
        // Show user feedback
        console.log(`Showing user feedback for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to user feedback page
        console.log(`Opening user feedback for ${role}`);
        window.location.href = '/user-feedback';
      }
    },
    {
      id: '21',
      phrase: 'Open settings',
      action: 'Access application settings',
      category: 'control',
      keywords: ['settings', 'configuration', 'preferences', 'setup'],
      handler: (role: ExecutiveRole) => {
        // Open settings
        console.log(`Opening settings for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to settings page
        console.log(`Opening settings for ${role}`);
        window.location.href = '/settings';
      }
    },
    {
      id: '22',
      phrase: 'Open admin panel',
      action: 'Access administrative functions',
      category: 'control',
      keywords: ['admin panel', 'admin', 'administrative', 'management'],
      handler: (role: ExecutiveRole) => {
        // Open admin panel
        console.log(`Opening admin panel for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to admin page
        console.log(`Opening admin panel for ${role}`);
        window.location.href = '/admin';
      }
    },
    {
      id: '23',
      phrase: 'Clean data',
      action: 'Open data cleaning tools',
      category: 'data',
      keywords: ['clean data', 'data cleaning', 'clean', 'data processing'],
      handler: (role: ExecutiveRole) => {
        // Clean data
        console.log(`Opening data cleaning for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to data cleaning page
        console.log(`Opening data cleaning for ${role}`);
        window.location.href = '/data-cleaning';
      }
    },
    {
      id: '24',
      phrase: 'Show reports',
      action: 'Display available reports',
      category: 'navigation',
      keywords: ['reports', 'report', 'documentation', 'analytics'],
      handler: (role: ExecutiveRole) => {
        // Show reports
        console.log(`Showing reports for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to reports page
        console.log(`Opening reports for ${role}`);
        window.location.href = '/reports';
      }
    },
    {
      id: '25',
      phrase: 'Open voice dashboard',
      action: 'Access voice command dashboard',
      category: 'navigation',
      keywords: ['voice dashboard', 'voice', 'dashboard', 'speech'],
      handler: (role: ExecutiveRole) => {
        // Open voice dashboard
        console.log(`Opening voice dashboard for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to voice dashboard page
        console.log(`Opening voice dashboard for ${role}`);
        window.location.href = '/voice-dashboard';
      }
    },
    {
      id: '26',
      phrase: 'Show performance briefing',
      action: 'Generate performance briefing',
      category: 'analysis',
      keywords: ['performance briefing', 'briefing', 'performance', 'summary'],
      handler: (role: ExecutiveRole) => {
        // Show performance briefing
        console.log(`Showing performance briefing for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to performance briefing page
        console.log(`Opening performance briefing for ${role}`);
        window.location.href = '/performance-briefing';
      }
    },
    {
      id: '27',
      phrase: 'Open workflow studio',
      action: 'Access workflow design studio',
      category: 'control',
      keywords: ['workflow studio', 'studio', 'design', 'workflow builder'],
      handler: (role: ExecutiveRole) => {
        // Open workflow studio
        console.log(`Opening workflow studio for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to workflow studio page
        console.log(`Opening workflow studio for ${role}`);
        window.location.href = '/workflow-studio';
      }
    },
    {
      id: '28',
      phrase: 'Show policy intelligence',
      action: 'Display policy analysis',
      category: 'analysis',
      keywords: ['policy intelligence', 'policy', 'intelligence', 'compliance'],
      handler: (role: ExecutiveRole) => {
        // Show policy intelligence
        console.log(`Showing policy intelligence for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to policy intelligence page
        console.log(`Opening policy intelligence for ${role}`);
        window.location.href = '/policy-intel';
      }
    },
    {
      id: '29',
      phrase: 'Open prompt to app builder',
      action: 'Access AI app builder',
      category: 'control',
      keywords: ['prompt to app', 'app builder', 'prompt', 'ai builder'],
      handler: (role: ExecutiveRole) => {
        // Open prompt to app builder
        console.log(`Opening prompt to app builder for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to prompt to app builder page
        console.log(`Opening prompt to app builder for ${role}`);
        window.location.href = '/prompt-to-app';
      }
    },
    {
      id: '30',
      phrase: 'Show order flow tracker',
      action: 'Display order tracking system',
      category: 'data',
      keywords: ['order flow tracker', 'order', 'flow', 'tracker', 'orders'],
      handler: (role: ExecutiveRole) => {
        // Show order flow tracker
        console.log(`Showing order flow tracker for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // Navigate to order flow tracker page
        console.log(`Opening order flow tracker for ${role}`);
        window.location.href = '/order-flow-tracker';
      }
    },
    {
      id: '31',
      phrase: 'Stop listening',
      action: 'Stop voice recognition',
      category: 'control',
      keywords: ['stop listening', 'stop', 'listening', 'end', 'quit', 'exit'],
      handler: (role: ExecutiveRole) => {
        // Stop listening
        console.log(`Stopping voice recognition for ${role}`);
      },
      executeAction: async (role: ExecutiveRole) => {
        // This will be handled by the VoiceCommandPanel component
        // We'll emit a custom event that the component can listen to
        console.log(`Stopping voice recognition for ${role}`);
        window.dispatchEvent(new CustomEvent('stopVoiceListening'));
      }
    }
  ];

  // Valid executive roles
  private validRoles: ExecutiveRole[] = ['CEO', 'CFO', 'COO', 'CTO', 'CMO'];

  /**
   * Process a voice command and return the result
   */
  processCommand(command: string, role: ExecutiveRole): VoiceCommandResult {
    const lowerCommand = command.toLowerCase();
    
    // Find matching command - optimized search
    const matchedCommand = this.commands.find(cmd => 
      cmd.keywords.some(keyword => lowerCommand.includes(keyword))
    );

    if (matchedCommand) {
      try {
        // Execute the handler immediately
        matchedCommand.handler(role);
        
        // Execute the action immediately (no await needed for navigation)
        if (matchedCommand.executeAction) {
          // Execute without await for immediate response
          matchedCommand.executeAction(role).catch(error => {
            console.error('Navigation error:', error);
          });
        }
        
        return {
          success: true,
          message: `Executed: ${matchedCommand.action}`,
          action: matchedCommand.action,
          data: { command: matchedCommand, role }
        };
      } catch (error) {
        return {
          success: false,
          message: `Error executing command: ${error}`,
          data: { command: matchedCommand, role, error }
        };
      }
    }

    // Check for role switching commands with proper validation
    if (lowerCommand.includes('switch') && lowerCommand.includes('view')) {
      const roleMatch = lowerCommand.match(/(ceo|cfo|cto|coo|cmo)/i);
      if (roleMatch) {
        const targetRole = roleMatch[0].toUpperCase() as ExecutiveRole;
        
        // Validate that the target role is valid
        if (this.validRoles.includes(targetRole)) {
          return {
            success: true,
            message: `Switching to ${targetRole} view`,
            action: 'role_switch',
            data: { targetRole }
          };
        } else {
          return {
            success: false,
            message: `Invalid role: ${targetRole}. Valid roles are: ${this.validRoles.join(', ')}`,
            data: { attemptedRole: targetRole, validRoles: this.validRoles }
          };
        }
      }
    }

    // Check for help command
    if (lowerCommand.includes('help') || lowerCommand.includes('commands')) {
      const commandList = this.commands.map(cmd => `"${cmd.phrase}"`).join(', ');
      return {
        success: true,
        message: `Available voice commands: ${commandList}. You can also say "Switch to [CEO/CFO/COO/CTO/CMO] view" to change your role perspective.`,
        action: 'help',
        data: { availableCommands: this.commands }
      };
    }

    return {
      success: false,
      message: `Command not recognized: "${command}". Try saying "Help" for available commands.`,
      data: { command, role }
    };
  }

  /**
   * Get all available commands
   */
  getAllCommands(): VoiceCommand[] {
    return this.commands;
  }

  /**
   * Get role-specific commands
   */
  getRoleSpecificCommands(): VoiceCommand[] {
    // All commands are available to all roles for now
    // This can be enhanced with role-specific filtering
    return this.commands;
  }

  /**
   * Add a custom command
   */
  addCommand(command: VoiceCommand): void {
    this.commands.push(command);
  }

  /**
   * Remove a command by ID
   */
  removeCommand(commandId: string): boolean {
    const index = this.commands.findIndex(cmd => cmd.id === commandId);
    if (index !== -1) {
      this.commands.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const voiceCommandService = new VoiceCommandService(); 