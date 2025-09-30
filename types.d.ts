interface SessionPayload {
  userId: string;
  username: string;
  role: "ADMIN" | "HEAD_MASTER";
  expiresAt: Date;
}

interface FormState {
  error: string | null;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemsPerPageOptions?: number[];
  className?: string;
  preserveParams?: Record<string, string | number | boolean | undefined>;
  labels?: {
    itemsLabel?: string;
    showingText?: string;
    displayingText?: string;
    ofText?: string;
    prevText?: string;
    nextText?: string;
  };
}

interface PaginationParams {
  take: string;
  skip: string;
  sortBy: string;
  sortOrder: string;
}

interface StudentsPaginationParams extends PaginationParams {
  search?: string;
  grade?: string;
}
