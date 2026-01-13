import type { Blog, PaginationMeta } from '../../types'

export interface BlogState {
  blogs: Blog[]
  currentBlog: Blog | null
  loading: boolean
  error: string | null
  pagination: PaginationMeta | null
}

export interface CreateBlogData {
  title: string
  content: string
  image?: File | null
}

export interface UpdateBlogData {
  title: string
  content: string
  image?: File | null
  existingImageUrl?: string | null
}

