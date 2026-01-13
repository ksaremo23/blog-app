export interface Blog {
  id: string
  title: string
  content: string
  image_url: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

