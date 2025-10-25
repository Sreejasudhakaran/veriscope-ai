import jsPDF from 'jspdf'

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

export const generatePDF = async (report: Report): Promise<void> => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * (fontSize * 0.4))
  }

  // Helper function to add a new page if needed
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage()
      yPosition = 20
      return true
    }
    return false
  }

  // Header
  doc.setFillColor(16, 185, 129) // Primary color
  doc.rect(0, 0, pageWidth, 30, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Product Transparency Report', 20, 20)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated on ${new Date(report.createdAt).toLocaleDateString()}`, 20, 25)
  
  yPosition = 40

  // Product Information Section
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  yPosition = addText('Product Information', 20, yPosition, pageWidth - 40, 18)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  yPosition = addText(`Product Name: ${report.product.name}`, 20, yPosition, pageWidth - 40)
  yPosition = addText(`Brand: ${report.product.brand}`, 20, yPosition, pageWidth - 40)
  yPosition = addText(`Category: ${report.product.category}`, 20, yPosition, pageWidth - 40)
  
  yPosition = addText(`Ingredients: ${report.product.ingredients.join(', ')}`, 20, yPosition, pageWidth - 40)
  
  if (report.product.description) {
    yPosition = addText(`Description: ${report.product.description}`, 20, yPosition, pageWidth - 40)
  }
  
  yPosition += 15

  // Transparency Score Section
  checkNewPage(60)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  yPosition = addText('Transparency Score', 20, yPosition, pageWidth - 40, 18)
  yPosition += 10

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  yPosition = addText(`${report.transparencyScore}/100`, 20, yPosition, pageWidth - 40, 14)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  const scoreLabel = report.transparencyScore >= 80 ? 'Excellent' : 
                    report.transparencyScore >= 60 ? 'Good' : 
                    report.transparencyScore >= 40 ? 'Fair' : 'Needs Improvement'
  yPosition = addText(`Rating: ${scoreLabel}`, 20, yPosition, pageWidth - 40)
  
  yPosition += 15

  // Analysis Summary Section
  checkNewPage(80)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  yPosition = addText('Analysis Summary', 20, yPosition, pageWidth - 40, 18)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  yPosition = addText(report.summary, 20, yPosition, pageWidth - 40)
  yPosition += 15

  // Strengths Section
  if (report.analysis.strengths.length > 0) {
    checkNewPage(60)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    yPosition = addText('Strengths', 20, yPosition, pageWidth - 40, 18)
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    report.analysis.strengths.forEach((strength, index) => {
      yPosition = addText(`• ${strength}`, 20, yPosition, pageWidth - 40)
      if (index < report.analysis.strengths.length - 1) yPosition += 5
    })
    yPosition += 15
  }

  // Areas for Improvement Section
  if (report.analysis.improvements.length > 0) {
    checkNewPage(60)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    yPosition = addText('Areas for Improvement', 20, yPosition, pageWidth - 40, 18)
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    report.analysis.improvements.forEach((improvement, index) => {
      yPosition = addText(`• ${improvement}`, 20, yPosition, pageWidth - 40)
      if (index < report.analysis.improvements.length - 1) yPosition += 5
    })
    yPosition += 15
  }

  // Recommendations Section
  if (report.analysis.recommendations.length > 0) {
    checkNewPage(60)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    yPosition = addText('Recommendations', 20, yPosition, pageWidth - 40, 18)
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    report.analysis.recommendations.forEach((recommendation, index) => {
      yPosition = addText(`• ${recommendation}`, 20, yPosition, pageWidth - 40)
      if (index < report.analysis.recommendations.length - 1) yPosition += 5
    })
    yPosition += 15
  }

  // Footer
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(128, 128, 128)
  doc.text('Generated by Altibbe Product Transparency System', 20, pageHeight - 10)

  // Save the PDF
  const fileName = `${report.product.name.replace(/[^a-zA-Z0-9]/g, '_')}_Transparency_Report.pdf`
  doc.save(fileName)
}
