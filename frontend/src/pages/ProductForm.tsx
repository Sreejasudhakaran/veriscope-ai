import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Loader2,
  Brain,
  FileText
} from 'lucide-react'
import { api, endpoints } from '../services/api'

interface ProductData {
  name: string
  category: string
  brand: string
  ingredients: string[] | string
  description?: string
  certifications?: string[]
  packaging?: string
  sustainability?: string
}

interface AIQuestion {
  id: string
  question: string
  type: 'text' | 'select' | 'multiselect'
  options?: string[]
  required: boolean
}

export const ProductForm = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([])
  const [productId, setProductId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const { register, handleSubmit, formState: { errors } } = useForm<ProductData>()
  const totalSteps = 3

  const onSubmit = async (data: ProductData) => {
    setIsLoading(true)

    try {
      // Normalize ingredients
      const ingredientsArray: string[] =
        typeof data.ingredients === 'string'
          ? data.ingredients.split(',').map(s => s.trim()).filter(Boolean)
          : Array.isArray(data.ingredients)
          ? data.ingredients
          : []

      const payload = { ...data, ingredients: ingredientsArray }

      // 1️⃣ Create product
      const response = await api.post(endpoints.products.create, payload)
      const createdProduct = response.data?.data
      console.log('Create product response:', response.data)
      if (!createdProduct) {
        toast.error('Product created but no ID returned from server')
      }
      const id = createdProduct?._id || createdProduct?.id || null
      setProductId(id)

      // 2️⃣ Generate AI questions
      const questionsResponse = await api.post(endpoints.ai.generateQuestions, { productData: payload })
      console.log('AI response:', questionsResponse.data)

      let fetchedQuestions = questionsResponse.data?.questions || questionsResponse.data?.data?.questions || []
      // Build product-specific questions (frontend augmentation) to ensure relevance
      const buildProductSpecificQuestions = (p: ProductData) => {
        const qs: string[] = []
        const cat = (p.category || '').toLowerCase()
        // category-specific prompts
        if (cat.includes('skincare')) {
          qs.push(`List active ingredients and their concentrations for this ${p.category} product.`)
          qs.push(`Describe any allergy warnings or regulatory ingredients relevant to skincare products from ${p.brand || 'this brand'}.`)
        } else if (cat.includes('food')) {
          qs.push(`Provide source country/region for primary food ingredients in this product.`)
          qs.push(`Are there any known allergens or cross-contamination risks? Please list.`)
        } else if (cat.includes('personal') || cat.includes('care')) {
          qs.push(`Does this product contain any preservatives or fragrance components? List them.`)
          qs.push(`Describe recommended usage and any safety precautions for ${p.brand || 'the brand'}.`)
        } else if (cat.includes('cleaning')) {
          qs.push(`List active chemical agents used in this cleaning product and dilution instructions.`)
          qs.push(`Are there any disposal or environmental instructions customers should follow?`)
        } else if (cat.includes('clothing') || cat.includes('apparel')) {
          qs.push(`What materials/fibers make up the primary fabric and their country of origin?`)
          qs.push(`Are there any chemical treatments (e.g., flame retardants, waterproofing) applied to the fabric?`)
        } else if (cat.includes('electronics')) {
          qs.push(`List key components and whether any contain restricted substances (e.g., lead, mercury).`)
          qs.push(`Provide end-of-life recycling or disposal instructions for this electronic product.`)
        } else {
          qs.push(`Please list any additional ingredients, materials, or components not in the main list.`)
          qs.push(`Are there certifications or test reports relevant to this product? If so, please list them.`)
        }

        // add a brand-specific follow-up when brand provided
        if (p.brand) qs.push(`Does ${p.brand} have any public sourcing or sustainability statements relevant to this product? If yes, summarise.`)

        return qs
      }

      const productSpecific = buildProductSpecificQuestions(payload)
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        toast('AI did not return explicit questions; using a local fallback so you can continue.', { icon: '🤖' })
        console.warn('AI returned no questions, fetchedQuestions:', fetchedQuestions)

        // Local fallback questions so the UI always advances and user can continue
        fetchedQuestions = [
          `Please list any additional ingredients or chemicals not in the main list and their concentration if known.`,
          `Where are the primary raw materials sourced from? (country/region)`,
          `Does the product have any sustainability certifications? If so, list them.`,
        ]
      }

      // 3️⃣ Map strings to AIQuestion objects if needed
      // Prepend product-specific questions so the user gets tailored prompts first
      const mergedQuestions = [...productSpecific, ...fetchedQuestions]

      const formattedQuestions: AIQuestion[] = mergedQuestions.map((q: any, idx: number) => {
        if (typeof q === 'string') {
          return {
            id: `q-${idx}-${Date.now()}`,
            question: q,
            type: 'text', // default
            required: false
          }
        }
        return {
          id: q.id || `q-${idx}-${Date.now()}`,
          question: q.question,
          type: q.type || 'text',
          options: q.options || [],
          required: q.required || false
        }
      })

      setAiQuestions(formattedQuestions)
      setCurrentStep(2)
      toast.success('Product data saved! Now answer the AI-generated questions.')
    } catch (error) {
      toast.error('Failed to save product data. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleAnswerSubmit = async () => {
    if (!productId) {
      toast.error('Missing created product ID — cannot generate report')
      console.error('handleAnswerSubmit called but productId is null')
      return
    }
    setIsLoading(true)
    try {
      const response = await api.post(endpoints.reports.create, { productId, answers })
      console.log('Create report response:', response.data)
      const createdReport = response.data?.data
      const reportId = createdReport?._id || createdReport?.id
      if (!reportId) {
        toast.error('Report created but no ID returned')
        console.error('No report id in response', createdReport)
      } else {
        // notify other parts of the app (Dashboard) to refresh
        try {
          window.dispatchEvent(new CustomEvent('reports:updated', { detail: createdReport }))
        } catch (e) {
          // older browsers fallback
          window.dispatchEvent(new Event('reports:updated'))
        }

        navigate(`/report/${reportId}`)
      }
      toast.success('Report generated successfully!')
    } catch (error) {
      toast.error('Failed to generate report. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Product Info */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="card">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Information</h1>
                  <p className="text-gray-600">Let's start with the basic details about your product</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input {...register('name', { required: 'Product name is required' })} className="input-field" placeholder="e.g., Organic Face Cream" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select {...register('category', { required: 'Category is required' })} className="input-field">
                      <option value="">Select a category</option>
                      <option value="Skincare">Skincare</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Cleaning Products">Cleaning Products</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                    <input {...register('brand', { required: 'Brand is required' })} className="input-field" placeholder="e.g., EcoBeauty" />
                    {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                  </div>

                  {/* Ingredients */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients *</label>
                    <textarea {...register('ingredients', { required: 'Ingredients are required' })} className="input-field h-24" placeholder="List ingredients separated by commas (e.g., Aloe Vera, Coconut Oil)" />
                    {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea {...register('description')} className="input-field h-24" placeholder="Brief description of your product" />
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={isLoading} className="btn-primary inline-flex items-center space-x-2">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 2: AI Questions */}
          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="card">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-secondary-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Generated Questions</h1>
                  <p className="text-gray-600">Our AI has generated personalized questions to ensure complete transparency</p>
                </div>

                {aiQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
                    <p className="text-gray-600">Generating intelligent questions...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {aiQuestions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {index + 1}. {question.question}{question.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>

                        {question.type === 'text' && (
                          <textarea
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="input-field h-24"
                            placeholder="Your answer..."
                            required={question.required}
                          />
                        )}

                        {question.type === 'select' && (
                          <select
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="input-field"
                            required={question.required}
                          >
                            <option value="">Select an option</option>
                            {question.options?.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        )}

                        {question.type === 'multiselect' && (
                          <div className="space-y-2">
                            {question.options?.map(option => (
                              <label key={option} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={(answers[question.id] || []).includes(option)}
                                  onChange={(e) => {
                                    const currentValues = answers[question.id] || []
                                    const newValues = e.target.checked
                                      ? [...currentValues, option]
                                      : currentValues.filter((v: string) => v !== option)
                                    handleAnswerChange(question.id, newValues)
                                  }}
                                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-between">
                      <button onClick={() => setCurrentStep(1)} className="btn-outline inline-flex items-center space-x-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button onClick={handleAnswerSubmit} disabled={isLoading} className="btn-primary inline-flex items-center space-x-2">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                          <span>Generate Report</span>
                          <CheckCircle className="w-4 h-4" />
                        </>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
