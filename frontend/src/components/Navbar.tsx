import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Shield, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Start Check', path: '/form' },
    { name: 'Dashboard', path: '/dashboard' },
  ]

  useEffect(() => {
    const handler = () => setUser(JSON.parse(localStorage.getItem('user') || 'null'))
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'authToken' || e.key === 'token') {
        handler()
      }
    }

    window.addEventListener('auth:changed', handler as EventListener)
    window.addEventListener('storage', storageHandler)

    return () => {
      window.removeEventListener('auth:changed', handler as EventListener)
      window.removeEventListener('storage', storageHandler)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // notify other windows/components
    try {
      window.dispatchEvent(new Event('auth:changed'))
    } catch (e) {
      // ignore
    }
    setUser(null)
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Transparency<span className="text-primary-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 text-sm font-medium flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-primary-600 px-3 py-1 rounded-md border border-gray-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-1 px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>


          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="space-y-1">
                  {user ? (
                    <div className="px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            setIsOpen(false)
                            handleLogout()
                          }}
                          className="text-sm text-gray-600 hover:text-primary-600 px-3 py-1 rounded-md border border-gray-200"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
