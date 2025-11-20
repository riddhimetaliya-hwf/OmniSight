
import { v4 as uuidv4 } from 'uuid';
import { AppDefinition, AppActionType } from '../../types';

export const formTemplate: AppDefinition = {
  id: uuidv4(),
  name: "Contact Form",
  description: "A form to collect contact information",
  type: "form",
  sections: [
    {
      id: uuidv4(),
      title: "Contact Information",
      fields: [
        {
          id: uuidv4(),
          type: "input",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true
        },
        {
          id: uuidv4(),
          type: "input",
          label: "Email",
          placeholder: "Enter your email address",
          required: true,
          validation: "email"
        },
        {
          id: uuidv4(),
          type: "textarea",
          label: "Message",
          placeholder: "Enter your message",
          required: true
        }
      ]
    }
  ],
  actions: [
    {
      id: uuidv4(),
      type: "submit" as AppActionType,
      label: "Submit",
      primary: true
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
