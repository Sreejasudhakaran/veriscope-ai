import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  Users, 
  BarChart3,
  Calendar,
  Download,
  Eye,
  Filter,
  Search
} from 'lucide-react'
import { api, endpoints } from '../services/api'
import { Star, Zap } from 'lucide-react'


interface Report {
  id: string
  product: {
    name: string
    brand: string
    category: string
  }
  transparencyScore: number
  createdAt: string
  status: 'completed' | 'pending' | 'draft'
}

export const Dashboard = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const fetchReports = useCallback(async () => {
    try {
  setIsLoading(true)
      const response = await api.get(endpoints.reports.list)
      const raw = response.data?.data ?? response.data
      const arr = Array.isArray(raw) ? raw : []

      const normalized = arr.map((r: any) => ({
        id: r._id || r.id,
        _id: r._id || r.id,
        product: r.productId || r.product || null,
        // ensure numeric transparencyScore (check multiple possible shapes)
        transparencyScore:
          Number(
            r.transparencyScore ?? r.score ?? r.analysis?.transparencyScore ?? r.aiAnalysis?.transparencyScore ?? r.analysis?.score ?? 0
          ) || 0,
        createdAt: r.createdAt,
        status: r.status,
      }))

      setReports(normalized)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()

    const handler = () => {
      fetchReports()
    }

    window.addEventListener('reports:updated', handler as EventListener)

    return () => {
      window.removeEventListener('reports:updated', handler as EventListener)
    }
  }, [fetchReports])
  // removed duplicate fetchReports (normalized fetch implemented above)

  const filteredReports = Array.isArray(reports)
    ? reports.filter(report => {
        if (!report.product) return false
        const matchesSearch =
          report.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === 'all' || report.status === filterStatus
        return matchesSearch && matchesFilter
      })
    : []

  const stats = Array.isArray(reports)
    ? {
        totalReports: reports.length,
        averageScore:
          reports.length > 0
            ? Math.round(
                reports.reduce((sum, r) => sum + r.transparencyScore, 0) / reports.length
              )
            : 0,
        completedReports: reports.filter(r => r.status === 'completed').length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
      }
    : { totalReports: 0, averageScore: 0, completedReports: 0, pendingReports: 0 }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your product transparency reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Reports */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
                <p className="text-gray-600">Total Reports</p>
              </div>
            </div>
          </motion.div>

          {/* Avg Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
                <p className="text-gray-600">Avg Score</p>
              </div>
            </div>
          </motion.div>

          {/* Completed Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.completedReports}</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </motion.div>

          {/* Pending Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                <p className="text-gray-600">Pending</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <Link
            to="/form"
            className="btn-primary inline-flex items-center space-x-2 mb-4 sm:mb-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Report</span>
          </Link>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field w-full sm:w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Filter className="w-4 h-4" />
              <span>{filteredReports.length} reports</span>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first transparency report'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link to="/form" className="btn-primary">
                  Create First Report
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{report.product?.name ?? 'Unknown Product'}</h3>
                        <span className="text-sm text-gray-500">by {report.product?.brand ?? 'Unknown'}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {report.product?.category ?? '—'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : report.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            report.transparencyScore
                          )}`}
                        >
                          {report.transparencyScore}/100
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/report/${report.id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
