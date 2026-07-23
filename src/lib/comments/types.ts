export type ReactionKind = "like" | "insightful";

export type CommentReportStatus = "open" | "resolved" | "dismissed";

export type NormCommentRow = {
  id: string;
  norm_id: string;
  section_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  author_display_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CommentReactionCounts = {
  like: number;
  insightful: number;
};

export type NormCommentView = {
  id: string;
  body: string;
  authorDisplayName: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  reactions: CommentReactionCounts;
  viewerReaction: ReactionKind | null;
  replies: NormCommentView[];
};

export const MAX_COMMENT_LENGTH = 4000;
export const MAX_REPORT_REASON_LENGTH = 1000;
