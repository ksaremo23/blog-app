import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { createBlog } from '../features/blogs/blogSlice'
import { BlogForm } from '../components/Blog/BlogForm'
import toast from 'react-hot-toast'

export const CreateBlog = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const { loading } = useAppSelector((state) => state.blogs)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleSubmit = async (data: { title: string; content: string; image: File | null }) => {
    if (!user) return

    const result = await dispatch(createBlog({
      blogData: data,
      userId: user.id,
    }))

    if (createBlog.fulfilled.match(result)) {
      toast.success('Blog created successfully!')
      navigate('/')
    } else {
      toast.error('Failed to create blog')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Create New Blog</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <BlogForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  )
}

