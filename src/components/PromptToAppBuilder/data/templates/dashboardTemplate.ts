
import { v4 as uuidv4 } from 'uuid';
import { AppDefinition, AppActionType } from '../../types';

export const dashboardTemplate: AppDefinition = {
  id: uuidv4(),
  name: "Sales Dashboard",
  description: "A dashboard to visualize sales data",
  type: "dashboard",
  sections: [
    {
      id: uuidv4(),
      title: "Sales Overview",
      fields: [
        {
          id: uuidv4(),
          type: "card",
          label: "Total Sales",
          defaultValue: "$12,345"
        },
        {
          id: uuidv4(),
          type: "card",
          label: "Average Order Value",
          defaultValue: "$123"
        }
      ]
    },
    {
      id: uuidv4(),
      title: "Sales by Region",
      fields: [
        {
          id: uuidv4(),
          type: "table",
          label: "Sales Table",
          options: ["Region", "Q1", "Q2", "Q3", "Q4"]
        }
      ]
    }
  ],
  actions: [
    {
      id: uuidv4(),
      type: "export" as AppActionType,
      label: "Export to CSV",
      primary: true
    },
    {
      id: uuidv4(),
      type: "print" as AppActionType,
      label: "Print"
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
