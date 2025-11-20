
import { v4 as uuidv4 } from 'uuid';
import { AppDefinition, AppActionType } from '../../types';

export const workflowTemplate: AppDefinition = {
  id: uuidv4(),
  name: "Approval Workflow",
  description: "A workflow for managing approvals",
  type: "workflow",
  sections: [
    {
      id: uuidv4(),
      title: "Request Details",
      fields: [
        {
          id: uuidv4(),
          type: "input",
          label: "Request Title",
          placeholder: "Enter request title",
          required: true
        },
        {
          id: uuidv4(),
          type: "textarea",
          label: "Description",
          placeholder: "Enter request description",
          required: true
        },
        {
          id: uuidv4(),
          type: "select",
          label: "Priority",
          options: ["Low", "Medium", "High", "Critical"],
          required: true
        }
      ]
    },
    {
      id: uuidv4(),
      title: "Approver Information",
      fields: [
        {
          id: uuidv4(),
          type: "select",
          label: "Approver",
          options: ["John Doe", "Jane Smith", "Robert Johnson"],
          required: true
        }
      ]
    }
  ],
  actions: [
    {
      id: uuidv4(),
      type: "submit" as AppActionType,
      label: "Submit for Approval",
      primary: true
    },
    {
      id: uuidv4(),
      type: "save" as AppActionType,
      label: "Save as Draft"
    },
    {
      id: uuidv4(),
      type: "cancel" as AppActionType,
      label: "Cancel"
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
