import { format, formatDistanceToNow } from 'date-fns'

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

export const formatRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

