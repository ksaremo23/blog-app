import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logoutUser } from '../../features/auth/authSlice'
import { Button } from '../UI/Button'
import { LogOut, Plus, Home } from 'lucide-react'

export const Header = () => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            My Blog
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/">
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Home size={18} />
                    Home
                  </Button>
                </Link>
                <Link to="/create">
                  <Button variant="primary" className="flex items-center gap-2">
                    <Plus size={18} />
                    Create Blog
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Button variant="secondary" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

