import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchBlogs } from '../features/blogs/blogSlice'
import { BlogCard } from '../components/Blog/BlogCard'
import { Loader } from '../components/UI/Loader'
import { Button } from '../components/UI/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const BlogList = () => {
  const dispatch = useAppDispatch()
  const { blogs, loading, pagination } = useAppSelector((state) => state.blogs)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchBlogs(currentPage))
  }, [dispatch, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && blogs.length === 0) {
    return <Loader />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">All Blogs</h1>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No blogs found. Be the first to create one!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Previous
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'secondary'}
                        onClick={() => handlePageChange(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>
                  }
                  return null
                })}
              </div>

              <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight size={18} />
              </Button>
            </div>
          )}

          {pagination && (
            <div className="text-center mt-4 text-gray-600">
              Showing {((currentPage - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(currentPage * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} blogs
            </div>
          )}
        </>
      )}
    </div>
  )
}

