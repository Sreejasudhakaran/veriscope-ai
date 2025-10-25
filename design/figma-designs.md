# Figma Design Files

## 🎨 Design System Components

### 1. Landing Page Design
**File**: `Landing-Page.fig`

**Components**:
- Hero Section with gradient background
- Feature cards with icons
- Statistics section
- Call-to-action buttons
- Navigation header
- Footer with links

**Key Elements**:
- Trust indicators (certifications, testimonials)
- Clear value proposition
- Visual hierarchy
- Mobile-responsive layout

### 2. Product Form Design
**File**: `Product-Form.fig`

**Components**:
- Multi-step wizard interface
- Progress indicator
- Form validation states
- Question cards
- Navigation buttons

**Key Elements**:
- Step-by-step flow
- Real-time validation feedback
- Save draft functionality
- Accessibility considerations

### 3. Report Preview Design
**File**: `Report-Preview.fig`

**Components**:
- Score visualization
- Analysis breakdown
- Download buttons
- Share options
- Report sections

**Key Elements**:
- Clear score display
- Visual data representation
- Action buttons
- Professional layout

### 4. Dashboard Design
**File**: `Dashboard.fig`

**Components**:
- Statistics cards
- Recent reports list
- Search and filters
- Quick actions
- Navigation sidebar

**Key Elements**:
- Overview metrics
- Data visualization
- Interactive elements
- Responsive grid

## 🎨 Style Guide

### Color System
```
Primary Colors:
- Emerald: #10B981
- Blue: #3B82F6
- Amber: #F59E0B

Neutral Colors:
- Gray 50: #F9FAFB
- Gray 100: #F3F4F6
- Gray 200: #E5E7EB
- Gray 300: #D1D5DB
- Gray 400: #9CA3AF
- Gray 500: #6B7280
- Gray 600: #4B5563
- Gray 700: #374151
- Gray 800: #1F2937
- Gray 900: #111827

Semantic Colors:
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Info: #3B82F6
```

### Typography Scale
```
Headings:
- H1: 48px / 60px line-height
- H2: 36px / 44px line-height
- H3: 30px / 36px line-height
- H4: 24px / 32px line-height
- H5: 20px / 28px line-height
- H6: 18px / 24px line-height

Body Text:
- Large: 18px / 28px line-height
- Base: 16px / 24px line-height
- Small: 14px / 20px line-height
- XS: 12px / 16px line-height
```

### Spacing System
```
Spacing Scale:
- 0: 0px
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px
- 16: 64px
- 20: 80px
- 24: 96px
- 32: 128px
```

## 📱 Responsive Breakpoints

### Mobile (320px - 768px)
- Single column layout
- Stacked navigation
- Touch-friendly buttons
- Optimized forms

### Tablet (768px - 1024px)
- Two-column layout
- Sidebar navigation
- Larger touch targets
- Grid layouts

### Desktop (1024px+)
- Multi-column layout
- Full navigation
- Hover states
- Advanced interactions

## 🎯 Component Specifications

### Button Components
```
Primary Button:
- Background: #10B981
- Text: White
- Padding: 12px 24px
- Border-radius: 8px
- Font-weight: 500

Secondary Button:
- Background: #3B82F6
- Text: White
- Padding: 12px 24px
- Border-radius: 8px
- Font-weight: 500

Outline Button:
- Background: Transparent
- Border: 2px solid #10B981
- Text: #10B981
- Padding: 10px 22px
- Border-radius: 8px
```

### Card Components
```
Default Card:
- Background: White
- Border: 1px solid #E5E7EB
- Border-radius: 12px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

Elevated Card:
- Background: White
- Border-radius: 12px
- Padding: 24px
- Shadow: 0 10px 15px rgba(0, 0, 0, 0.1)
```

### Form Components
```
Input Field:
- Background: White
- Border: 1px solid #D1D5DB
- Border-radius: 8px
- Padding: 12px 16px
- Font-size: 16px

Focus State:
- Border: 2px solid #10B981
- Box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1)

Error State:
- Border: 2px solid #EF4444
- Box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)
```

## 🎨 Icon System

### Icon Library
- **Heroicons**: Primary icon set
- **Lucide**: Secondary icon set
- **Custom**: Brand-specific icons

### Icon Specifications
- **Size**: 16px, 20px, 24px, 32px
- **Style**: Outline, filled, duotone
- **Color**: Inherit from parent
- **Accessibility**: Alt text, ARIA labels

## 📐 Layout Grid

### 12-Column Grid
- **Gutter**: 24px
- **Margin**: 24px (mobile), 48px (desktop)
- **Max-width**: 1200px
- **Breakpoints**: 320px, 768px, 1024px, 1280px

### Component Spacing
- **Section spacing**: 64px
- **Component spacing**: 32px
- **Element spacing**: 16px
- **Text spacing**: 8px

## 🎯 User Experience Patterns

### Navigation
- **Primary**: Top navigation bar
- **Secondary**: Sidebar navigation
- **Breadcrumbs**: Page hierarchy
- **Pagination**: Content navigation

### Feedback
- **Success**: Green toast notifications
- **Error**: Red alert messages
- **Warning**: Amber caution messages
- **Info**: Blue information messages

### Loading States
- **Skeleton**: Content placeholders
- **Spinner**: Loading indicators
- **Progress**: Step indicators
- **Skeleton**: Form placeholders

## 🔧 Development Handoff

### Assets
- **Icons**: SVG format, optimized
- **Images**: WebP format, responsive
- **Logos**: Multiple formats and sizes
- **Illustrations**: Vector graphics

### Specifications
- **Measurements**: Pixel-perfect
- **Colors**: Hex codes provided
- **Typography**: Font specifications
- **Spacing**: Exact pixel values

### Code Examples
- **HTML**: Semantic structure
- **CSS**: Utility classes
- **React**: Component props
- **Accessibility**: ARIA attributes
