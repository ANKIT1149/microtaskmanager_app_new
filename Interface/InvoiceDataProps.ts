import { ClientInfo } from "./ClientInfoProps";

export interface InvoiceData {
  invoice_id: string;
  task_id: string;
  project_id: string;
  user_id: string;
  task_name: string;
  project_name: string;
  project_description: string;
  time_taken: number;
  hourly_rate: number;
  total_cost: number;
  client_info: ClientInfo;
  due_date: string;
  priority: string;
  url: string;
  created_at: string;
  updated_at: string;
  template_type: 'AI' | 'Local';
  emailed: boolean;
}