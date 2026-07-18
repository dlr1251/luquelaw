export type LucyPersonality = {
  aggressiveness: number;
  technicality: number;
  flexibility: number;
};

export type LucyProject = {
  id: string;
  user_id: string;
  title: string;
  locale: "en" | "es";
  created_at: string;
  updated_at: string;
};

export type LucyChat = {
  id: string;
  project_id: string;
  title: string;
  aggressiveness: number;
  technicality: number;
  flexibility: number;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
};

export type LucyMessage = {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  token_in: number;
  token_out: number;
  cost_cents: number;
  created_at: string;
};

export type LucyFile = {
  id: string;
  project_id: string;
  chat_id: string | null;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export type TicketReviewStatus =
  | "pending_lawyer"
  | "ready_for_payment"
  | "unlocked"
  | "closed";
