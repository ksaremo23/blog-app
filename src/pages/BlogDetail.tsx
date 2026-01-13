import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchBlogById, deleteBlog, clearCurrentBlog } from '../features/blogs/blogSlice'
import { formatDate } from '../utils/helpers'
import { Loader } from '../components/UI/Loader'
import { Button } from '../components/UI/Button'
import { Edit, Trash2, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export const BlogDetail = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentBlog, loading } = useAppSelector((state) => state.blogs)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id))
    }

    return () => {
      dispatch(clearCurrentBlog())
    }
  }, [dispatch, id])

  const handleDelete = async () => {
    if (!id || !currentBlog) return

    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return
    }

    const result = await dispatch(deleteBlog(id))

    if (deleteBlog.fulfilled.match(result)) {
      toast.success('Blog deleted successfully!')
      navigate('/')
    } else {
      toast.error('Failed to delete blog')
    }
  }

  const isOwner = user && currentBlog && user.id === currentBlog.user_id

  if (loading && !currentBlog) {
    return <Loader />
  }

  if (!currentBlog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h1>
        <Link to="/">
          <Button variant="primary">Go back to blogs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {currentBlog.image_url && (
          <div className="h-96 overflow-hidden">
            <img
              src={currentBlog.image_url}
              alt={currentBlog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-800">{currentBlog.title}</h1>
            {isOwner && (
              <div className="flex gap-2">
                <Link to={`/edit/${currentBlog.id}`}>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Edit size={18} />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(currentBlog.created_at)}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {currentBlog.content}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/">
          <Button variant="secondary">← Back to Blogs</Button>
        </Link>
      </div>
    </div>
  )
}

