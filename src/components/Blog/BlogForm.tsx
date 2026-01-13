import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDropzone } from 'react-dropzone'
import { Input } from '../UI/Input'
import { Button } from '../UI/Button'
import { Upload, X } from 'lucide-react'
import { MAX_IMAGE_SIZE } from '../../utils/constants'

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  content: z.string().min(1, 'Content is required').min(10, 'Content must be at least 10 characters'),
})

type BlogFormData = z.infer<typeof blogSchema>

interface BlogFormProps {
  onSubmit: (data: { title: string; content: string; image: File | null }) => void
  isLoading?: boolean
  initialData?: { title: string; content: string; imageUrl?: string | null }
}

export const BlogForm = ({ onSubmit, isLoading = false, initialData }: BlogFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(initialData?.imageUrl || null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
  })

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0])
      setExistingImageUrl(null)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
  })

  const removeImage = () => {
    setImageFile(null)
    setExistingImageUrl(null)
  }

  const handleFormSubmit = (data: BlogFormData) => {
    onSubmit({
      title: data.title,
      content: data.content,
      image: imageFile,
    })
  }

  const displayImage = imageFile
    ? URL.createObjectURL(imageFile)
    : existingImageUrl

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Enter blog title"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          {...register('content')}
          rows={10}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Write your blog content here..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Blog Image (Optional)
        </label>
        {displayImage ? (
          <div className="relative">
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-600">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop an image here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        )}
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        {initialData ? 'Update Blog' : 'Create Blog'}
      </Button>
    </form>
  )
}

