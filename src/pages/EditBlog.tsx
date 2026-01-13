import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchBlogById, updateBlog, clearCurrentBlog } from '../features/blogs/blogSlice'
import { BlogForm } from '../components/Blog/BlogForm'
import { Loader } from '../components/UI/Loader'
import toast from 'react-hot-toast'

export const EditBlog = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentBlog, loading } = useAppSelector((state) => state.blogs)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (id) {
      dispatch(fetchBlogById(id))
    }

    return () => {
      dispatch(clearCurrentBlog())
    }
  }, [dispatch, id, user, navigate])

  useEffect(() => {
    if (currentBlog && user && currentBlog.user_id !== user.id) {
      toast.error('You do not have permission to edit this blog')
      navigate('/')
    }
  }, [currentBlog, user, navigate])

  const handleSubmit = async (data: { title: string; content: string; image: File | null }) => {
    if (!id || !currentBlog) return

    const result = await dispatch(updateBlog({
      id,
      blogData: {
        ...data,
        existingImageUrl: currentBlog.image_url,
      },
    }))

    if (updateBlog.fulfilled.match(result)) {
      toast.success('Blog updated successfully!')
      navigate(`/blog/${id}`)
    } else {
      toast.error('Failed to update blog')
    }
  }

  if (!user) {
    return null
  }

  if (loading && !currentBlog) {
    return <Loader />
  }

  if (!currentBlog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Edit Blog</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <BlogForm
          onSubmit={handleSubmit}
          isLoading={loading}
          initialData={{
            title: currentBlog.title,
            content: currentBlog.content,
            imageUrl: currentBlog.image_url,
          }}
        />
      </div>
    </div>
  )
}

