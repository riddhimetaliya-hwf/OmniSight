
import { v4 as uuidv4 } from 'uuid';
import { AppDefinition, AppActionType } from '../../types';

export const leaveRequestTemplate: AppDefinition = {
  id: uuidv4(),
  name: "Leave Request Form",
  description: "HR leave request form with manager approval flow",
  type: "workflow",
  sections: [
    {
      id: uuidv4(),
      title: "Employee Information",
      fields: [
        {
          id: uuidv4(),
          type: "input",
          label: "Employee Name",
          placeholder: "Enter your name",
          required: true
        },
        {
          id: uuidv4(),
          type: "input",
          label: "Employee ID",
          placeholder: "Enter your employee ID",
          required: true
        },
        {
          id: uuidv4(),
          type: "select",
          label: "Department",
          options: ["HR", "IT", "Finance", "Marketing", "Operations"],
          required: true
        }
      ]
    },
    {
      id: uuidv4(),
      title: "Leave Details",
      fields: [
        {
          id: uuidv4(),
          type: "select",
          label: "Leave Type",
          options: ["Annual Leave", "Sick Leave", "Personal Leave", "Bereavement", "Other"],
          required: true
        },
        {
          id: uuidv4(),
          type: "input",
          label: "From Date",
          placeholder: "Start date",
          required: true
        },
        {
          id: uuidv4(),
          type: "input",
          label: "To Date",
          placeholder: "End date",
          required: true
        },
        {
          id: uuidv4(),
          type: "textarea",
          label: "Reason",
          placeholder: "Please provide a reason for your leave request"
        }
      ]
    },
    {
      id: uuidv4(),
      title: "Manager Information",
      fields: [
        {
          id: uuidv4(),
          type: "select",
          label: "Manager",
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
      label: "Submit Request",
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
