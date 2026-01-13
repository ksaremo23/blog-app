import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { Register } from '../pages/Register'
import { Login } from '../pages/Login'
import { BlogList } from '../pages/BlogList'
import { CreateBlog } from '../pages/CreateBlog'
import { BlogDetail } from '../pages/BlogDetail'
import { EditBlog } from '../pages/EditBlog'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth)
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BlogList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        }
      />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

