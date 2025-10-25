# Product Transparency Website

A comprehensive full-stack web application that collects detailed product information through intelligent AI-driven questions and generates structured transparency reports.

## 🚀 Project Overview

This platform enables companies to create detailed transparency reports for their products, helping consumers make informed, ethical decisions. The system uses AI to generate intelligent follow-up questions based on product data, ensuring comprehensive transparency reporting.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Node.js + Express + MongoDB
- **AI Service**: Python + FastAPI
- **Database**: MongoDB with Mongoose ODM
- **PDF Generation**: jsPDF
- **Deployment**: Vercel (Frontend), Railway (Backend & AI)

## 📁 Project Structure

```
/
├── frontend/          # React + TypeScript + TailwindCSS
├── backend/           # Node.js + Express + MongoDB
├── ai-service/        # Python + FastAPI
├── design/            # Figma designs and assets
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

### Environment Variables

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_AI_SERVICE_URL=http://localhost:8000
```

#### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product-transparency
JWT_SECRET=your-jwt-secret
AI_SERVICE_URL=http://localhost:8000
```

#### AI Service (.env)
```
PORT=8000
OPENAI_API_KEY=your-openai-key
```

## ✨ Features

### Core Features
- **Dynamic Multi-Step Form**: Intelligent form with conditional logic
- **AI-Generated Questions**: Smart follow-up questions based on product data
- **PDF Report Generation**: Professional transparency reports
- **Real-time Validation**: Instant form validation and progress tracking
- **Responsive Design**: Mobile-first, accessible UI/UX

### Advanced Features
- **Authentication**: JWT-based company login/register
- **Role-based Access**: Company-specific dashboards
- **Transparency Scoring**: AI-powered transparency analysis
- **Export Options**: Multiple report formats

## 🤖 AI Service Documentation

### `/generate-questions` Endpoint

**Input:**
```json
{
  "productData": {
    "name": "Organic Face Cream",
    "category": "Skincare",
    "brand": "EcoBeauty",
    "ingredients": ["Aloe Vera", "Coconut Oil", "Vitamin E"]
  }
}
```

**Output:**
```json
{
  "questions": [
    "What is the source of your coconut oil?",
    "Are your ingredients certified organic?",
    "What is your packaging material?",
    "Do you test on animals?"
  ]
}
```

### `/transparency-score` Endpoint

Analyzes product responses and computes a transparency score (0-100) based on:
- Ingredient transparency
- Ethical practices
- Sustainability claims
- Certifications

## 📊 Sample Product Entry

### Input Data
```json
{
  "name": "Eco-Friendly Shampoo",
  "category": "Personal Care",
  "brand": "GreenLife",
  "ingredients": ["Coconut Oil", "Aloe Vera", "Natural Fragrance"],
  "certifications": ["USDA Organic", "Cruelty-Free"],
  "packaging": "Recyclable Bottle",
  "sustainability": "Carbon Neutral"
}
```

### Generated Report
The system generates a comprehensive PDF report including:
- Product overview
- Ingredient analysis
- Sustainability metrics
- Transparency score
- Recommendations

## 🎨 Design System

### Color Palette
- Primary: #10B981 (Emerald)
- Secondary: #3B82F6 (Blue)
- Accent: #F59E0B (Amber)
- Neutral: #6B7280 (Gray)

### Typography
- Headings: Inter, sans-serif
- Body: Inter, sans-serif
- Code: JetBrains Mono, monospace

### Components
- Modern card-based layout
- Smooth animations with Framer Motion
- Accessible form controls
- Responsive grid system

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
cd backend
# Deploy to Railway with MongoDB Atlas
```

### AI Service (Railway)
```bash
cd ai-service
# Deploy to Railway with Python runtime
```

## 🔒 Security Features

- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- JWT authentication
- Rate limiting
- Environment variable protection

## 📈 Performance Optimizations

- Code splitting and lazy loading
- Image optimization
- Database indexing
- Caching strategies
- CDN integration

## 🧠 AI Development Reflection

### How AI Tools Were Used in Development

Throughout this project, AI tools played a crucial role in enhancing productivity and code quality:

1. **Code Generation**: AI-assisted in generating boilerplate code, API endpoints, and component structures
2. **Documentation**: AI helped create comprehensive documentation and README files
3. **Error Handling**: AI suggested robust error handling patterns and validation logic
4. **Design System**: AI assisted in creating consistent design tokens and component specifications
5. **Testing**: AI-generated test cases and validation scenarios

### Guiding Principles for Architecture, Design, and Transparency Logic

**Architecture Principles:**
- **Modular Design**: Separated concerns with clear boundaries between frontend, backend, and AI service
- **Scalability**: Built with microservices architecture to handle growing user base
- **Security**: Implemented comprehensive security measures including JWT authentication and input validation
- **Performance**: Optimized for speed with caching, lazy loading, and efficient database queries

**Design Principles:**
- **User-Centric**: Focused on creating intuitive, accessible interfaces
- **Consistency**: Maintained design system with reusable components
- **Accessibility**: Ensured WCAG compliance for inclusive user experience
- **Responsive**: Mobile-first approach with progressive enhancement

**Transparency Logic:**
- **Ethical AI**: Implemented fair and unbiased scoring algorithms
- **Data Privacy**: Ensured user data protection and GDPR compliance
- **Transparency**: Made scoring methodology clear and explainable
- **Continuous Improvement**: Built feedback loops for system enhancement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For questions or support, contact: people@altibbe.com

---

**Built with ❤️ for Altibbe | Hedamo Product Transparency Initiative**
