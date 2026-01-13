import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store'
import { AppRoutes } from './routes/AppRoutes'
import { Header } from './components/Layout/Header'
import { Footer } from './components/Layout/Footer'
import { checkSession } from './features/auth/authSlice'
import './App.css'

function App() {
  useEffect(() => {
    // Check for existing session on app load
    store.dispatch(checkSession())
  }, [])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow bg-gray-50">
            <AppRoutes />
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App
