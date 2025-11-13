
import { v4 as uuidv4 } from 'uuid';
import { AppDefinition, AppActionType } from '../../types';

export const crmTemplate: AppDefinition = {
  id: uuidv4(),
  name: "Customer Relationship Management",
  description: "A CRM interface for managing customer details",
  type: "form",
  sections: [
    {
      id: uuidv4(),
      title: "Customer Information",
      fields: [
        {
          id: uuidv4(),
          type: "input",
          label: "Customer Name",
          placeholder: "Enter customer name",
          required: true
        },
        {
          id: uuidv4(),
          type: "input",
          label: "Email",
          placeholder: "Enter email address",
          validation: "email"
        },
        {
          id: uuidv4(),
          type: "input",
          label: "Phone",
          placeholder: "Enter phone number"
        },
        {
          id: uuidv4(),
          type: "select",
          label: "Status",
          options: ["Active", "Inactive", "Prospect", "Lead"],
          required: true
        }
      ]
    },
    {
      id: uuidv4(),
      title: "Additional Details",
      fields: [
        {
          id: uuidv4(),
          type: "textarea",
          label: "Notes",
          placeholder: "Enter any additional notes"
        },
        {
          id: uuidv4(),
          type: "select",
          label: "Account Manager",
          options: ["John Doe", "Jane Smith", "Robert Johnson"]
        }
      ]
    }
  ],
  actions: [
    {
      id: uuidv4(),
      type: "save" as AppActionType,
      label: "Update Status",
      primary: true
    },
    {
      id: uuidv4(),
      type: "export" as AppActionType,
      label: "Export Customer Data"
    },
    {
      id: uuidv4(),
      type: "email" as AppActionType,
      label: "Send Email"
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
