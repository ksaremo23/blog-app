import { Link } from 'react-router-dom'
import type { Blog } from '../../types'
import { formatDate, truncateText } from '../../utils/helpers'
import { Calendar } from 'lucide-react'

interface BlogCardProps {
  blog: Blog
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${blog.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {blog.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {truncateText(blog.content, 120)}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formatDate(blog.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

