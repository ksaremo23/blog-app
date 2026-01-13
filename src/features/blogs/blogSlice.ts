import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '../../services/supabaseClient'
import type { BlogState, CreateBlogData, UpdateBlogData } from './blogTypes'
import type { Blog, PaginationMeta } from '../../types'
import { PAGINATION_LIMIT } from '../../utils/constants'

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  pagination: null,
}

// Fetch blogs with pagination
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const from = (page - 1) * PAGINATION_LIMIT
      const to = from + PAGINATION_LIMIT - 1

      const { data, error, count } = await supabase
        .from('blogs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      const total = count || 0
      const totalPages = Math.ceil(total / PAGINATION_LIMIT)

      const pagination: PaginationMeta = {
        page,
        pageSize: PAGINATION_LIMIT,
        total,
        totalPages,
      }

      return { blogs: data as Blog[], pagination }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch blogs')
    }
  }
)

// Fetch single blog
export const fetchBlogById = createAsyncThunk(
  'blogs/fetchBlogById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Blog
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch blog')
    }
  }
)

// Create blog
export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async ({ blogData, userId }: { blogData: CreateBlogData; userId: string }, { rejectWithValue }) => {
    try {
      let imageUrl: string | null = null

      // Upload image if provided
      if (blogData.image) {
        const fileExt = blogData.image.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        const filePath = fileName

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, blogData.image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      // Create blog record
      const { data, error } = await supabase
        .from('blogs')
        .insert({
          title: blogData.title,
          content: blogData.content,
          image_url: imageUrl,
          user_id: userId,
        })
        .select()
        .single()

      if (error) throw error
      return data as Blog
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create blog')
    }
  }
)

// Update blog
export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, blogData }: { id: string; blogData: UpdateBlogData }, { rejectWithValue }) => {
    try {
      let imageUrl: string | null = blogData.existingImageUrl || null

      // Upload new image if provided
      if (blogData.image) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const fileExt = blogData.image.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = fileName

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, blogData.image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl

        // Delete old image if exists
        if (blogData.existingImageUrl) {
          try {
            // Extract file path from public URL
            // URL format: https://[project].supabase.co/storage/v1/object/public/blog-images/[path]
            const urlParts = blogData.existingImageUrl.split('/blog-images/')
            if (urlParts.length > 1) {
              const filePath = urlParts[1]
              await supabase.storage
                .from('blog-images')
                .remove([filePath])
            }
          } catch (error) {
            // Ignore deletion errors, continue with update
            console.error('Error deleting old image:', error)
          }
        }
      }

      // Update blog record
      const { data, error } = await supabase
        .from('blogs')
        .update({
          title: blogData.title,
          content: blogData.content,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Blog
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update blog')
    }
  }
)

// Delete blog
export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      // Get blog to find image URL
      const { data: blog } = await supabase
        .from('blogs')
        .select('image_url')
        .eq('id', id)
        .single()

      // Delete image if exists
      if (blog?.image_url) {
        try {
          // Extract file path from public URL
          const urlParts = blog.image_url.split('/blog-images/')
          if (urlParts.length > 1) {
            const filePath = urlParts[1]
            await supabase.storage
              .from('blog-images')
              .remove([filePath])
          }
        } catch (error) {
          // Ignore deletion errors, continue with blog deletion
          console.error('Error deleting image:', error)
        }
      }

      // Delete blog record
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete blog')
    }
  }
)

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false
        state.blogs = action.payload.blogs
        state.pagination = action.payload.pagination
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch blog by ID
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false
        state.currentBlog = action.payload
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Create blog
    builder
      .addCase(createBlog.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false
        state.blogs.unshift(action.payload)
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update blog
    builder
      .addCase(updateBlog.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false
        const index = state.blogs.findIndex((blog) => blog.id === action.payload.id)
        if (index !== -1) {
          state.blogs[index] = action.payload
        }
        if (state.currentBlog?.id === action.payload.id) {
          state.currentBlog = action.payload
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Delete blog
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload)
        if (state.currentBlog?.id === action.payload) {
          state.currentBlog = null
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentBlog, clearError } = blogSlice.actions
export default blogSlice.reducer

