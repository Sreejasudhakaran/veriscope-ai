import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Download, 
  Share2, 
  Star, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Shield
} from 'lucide-react'
import { api } from '../services/api'
import { generatePDF } from '../utils/pdfGenerator'

interface Report {
  id: string
  productId: string
  product: {
    name: string
    category: string
    brand: string
    ingredients: string[]
    description?: string
  }
  summary: string
  transparencyScore: number
  analysis: {
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
  createdAt: string
}

export const ReportPreview = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    if (id) fetchReport(id)
  }, [id])

  const fetchReport = async (reportId: string) => {
  try {
    const response = await api.get(`/api/reports/${reportId}`)
    console.log('API response:', response.data)

    // Handle both cases: wrapped in data or returned directly
    const reportData = response.data?.data || response.data || null

    if (reportData) {
      // Map backend structure to frontend expected structure and coerce score
      const formattedReport = {
        ...reportData,
        id: reportData._id, // map _id to id
        product: reportData.productId, // map productId to product
        // try several possible fields for the score and coerce to number
        transparencyScore:
          Number(
            reportData.transparencyScore ?? reportData.score ?? reportData.analysis?.transparencyScore ?? reportData.aiAnalysis?.transparencyScore ?? 0
          ) || 0,
      }
      setReport(formattedReport)
    } else {
      setReport(null)
    }
  } catch (error) {
    toast.error('Failed to load report')
    console.error('Error fetching report:', error)
  } finally {
    setIsLoading(false)
  }
}


  const handleDownloadPDF = async () => {
    if (!report) return
    setIsGeneratingPDF(true)
    try {
      await generatePDF(report)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      toast.error('Failed to generate PDF')
      console.error(error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShare = async () => {
    if (!report) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${report.product.name} Transparency Report`,
          text: `Check out the transparency report for ${report.product.name}`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    )
  }

  if (!report || !report.product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-4">The requested report could not be found.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.product.name} Transparency Report</h1>
              <p className="text-gray-600">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button onClick={handleShare} className="btn-outline inline-flex items-center space-x-2">
                <Share2 className="w-4 h-4" /><span>Share</span>
              </button>
              <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="btn-primary inline-flex items-center space-x-2">
                {isGeneratingPDF ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (<Download className="w-4 h-4" />)}
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Transparency Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Transparency Score</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold ${getScoreColor(report.transparencyScore)}`}>
                {report.transparencyScore}
              </div>
              <div className="text-left">
                <div className="text-lg font-semibold text-gray-900">{getScoreLabel(report.transparencyScore)}</div>
                <div className="text-gray-600">Out of 100 points</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-primary-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${report.transparencyScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Product Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Brand</h3>
              <p className="text-gray-600">{report.product.brand}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
              <p className="text-gray-600">{report.product.category}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {report.product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
            {report.product.description && (
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{report.product.description}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Analysis Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Summary</h2>
          <p className="text-gray-600 leading-relaxed">{report.summary}</p>
        </motion.div>

        {/* Strengths */}
        {report.analysis.strengths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              Strengths
            </h2>
            <ul className="space-y-3">
              {report.analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Areas for Improvement */}
        {report.analysis.improvements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-yellow-600 mr-2" />
              Areas for Improvement
            </h2>
            <ul className="space-y-3">
              {report.analysis.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Recommendations */}
        {report.analysis.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 text-primary-600 mr-2" />
              Recommendations
            </h2>
            <ul className="space-y-3">
              {report.analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center py-8"
        >
          <p className="text-gray-500 text-sm">
            Generated by Altibbe Product Transparency System
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <button
              onClick={() => navigate('/form')}
              className="btn-outline"
            >
              Create Another Report
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              View Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
