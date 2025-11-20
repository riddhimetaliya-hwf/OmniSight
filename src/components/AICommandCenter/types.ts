
export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  format?: "text" | "chart" | "table";
  data?: any;
}
