# Architecture Overview - Nagyique Boutique

## 🏗️ System Architecture

### **High-Level Architecture**

Nagyique Boutique follows a modern, microservices-inspired architecture built on the JAMstack principles, ensuring scalability, performance, and maintainability.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │  External APIs  │
│   (Next.js)     │◄──►│   (Strapi CMS)  │◄──►│  & Services     │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ UI/UX       │ │    │ │ API Layer   │ │    │ │ Stripe      │ │
│ │ Components  │ │    │ │             │ │    │ │ PayPal      │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ │ Canada Post │ │
│                 │    │                 │    │ │ Currency    │ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ │ APIs        │ │
│ │ State Mgmt  │ │    │ │ Database    │ │    │ └─────────────┘ │
│ │ (Zustand)   │ │    │ │ (SQLite/    │ │    │                 │
│ └─────────────┘ │    │ │ PostgreSQL) │ │    │ ┌─────────────┐ │
│                 │    │ └─────────────┘ │    │ │ IP Geo      │ │
│ ┌─────────────┐ │    │                 │    │ │ Location    │ │
│ │ Auth        │ │    │ ┌─────────────┐ │    │ │ Service     │ │
│ │ (NextAuth)  │ │    │ │ File        │ │    │ └─────────────┘ │
│ └─────────────┘ │    │ │ Storage     │ │    │                 │
└─────────────────┘    │ └─────────────┘ │    └─────────────────┘
                       └─────────────────┘
```

## 🎯 Frontend Architecture

### **Next.js 14+ Application Structure**

#### **Framework Foundation**
- **Next.js 14+**: React framework with App Router for modern routing
- **React 18**: Latest React features including Suspense and Concurrent Rendering
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

#### **Directory Structure**
```
src/
├── app/                     # Next.js App Router pages
│   ├── (auth)/             # Authentication route group
│   ├── shop/               # Product catalog pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout process
│   ├── profile/            # User account management
│   └── api/                # API routes (Backend for Frontend)
├── components/             # Reusable UI components
│   ├── common/             # Shared components
│   ├── layout/             # Layout components
│   ├── auth/               # Authentication components
│   ├── shop/               # Shopping components
│   ├── cart/               # Cart components
│   └── checkout/           # Checkout components
├── lib/                    # Utility libraries
│   ├── auth.ts             # NextAuth configuration
│   ├── api.ts              # API client functions
│   ├── utils.ts            # Helper utilities
│   └── constants.ts        # Application constants
├── store/                  # State management
│   ├── cart/               # Cart state (Zustand)
│   ├── location/           # Location state
│   └── shop/               # Shopping state
├── types/                  # TypeScript type definitions
│   ├── api.ts              # API response types
│   ├── product.ts          # Product types
│   ├── cart.ts             # Cart types
│   └── checkout.ts         # Checkout types
└── styles/                 # Global styles
    └── globals.css         # Global CSS and Tailwind imports
```

### **Component Architecture**

#### **Design Patterns**
- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Container/Presentational**: Separation of logic and presentation
- **Compound Components**: Complex components with multiple child components
- **Render Props**: Flexible component composition patterns

#### **Component Categories**
```typescript
// Layout Components
Header                 // Navigation and user controls
Footer                 // Site footer and links
Sidebar                // Category navigation
Layout                 // Page layout wrapper

// Common Components
Button                 // Reusable button component
Input                  // Form input fields
Modal                  // Modal dialogs
LoadingSpinner         // Loading indicators
ErrorBoundary          // Error handling

// Business Components
ProductCard            // Product display card
CartItem               // Shopping cart item
CheckoutForm           // Checkout form
UserProfile            // User profile management
OrderSummary           // Order summary display
```

### **State Management Strategy**

#### **Zustand Stores**
```typescript
// Cart Store
interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

// Location Store
interface LocationStore {
  country: string
  currency: string
  exchangeRate: number
  setLocation: (country: string) => void
  setCurrency: (currency: string) => void
  updateExchangeRate: () => Promise<void>
}

// Shop Store
interface ShopStore {
  products: Product[]
  categories: Category[]
  filters: FilterState
  setProducts: (products: Product[]) => void
  setFilters: (filters: FilterState) => void
  resetFilters: () => void
}
```

## 🔧 Backend Architecture

### **Strapi CMS Configuration**

#### **Content Types**
```javascript
// Product Content Type
{
  name: 'Product',
  attributes: {
    title: 'string',
    description: 'richtext',
    price: 'decimal',
    currency: 'string',
    images: 'media',
    category: 'relation',
    tags: 'relation',
    variants: 'component',
    inventory: 'integer',
    sku: 'string',
    status: 'enumeration'
  }
}

// Order Content Type
{
  name: 'Order',
  attributes: {
    orderNumber: 'string',
    customerEmail: 'string',
    items: 'json',
    total: 'decimal',
    status: 'enumeration',
    shippingAddress: 'json',
    billingAddress: 'json',
    paymentMethod: 'string',
    shippingCost: 'decimal'
  }
}

// Category Content Type
{
  name: 'Category',
  attributes: {
    name: 'string',
    slug: 'string',
    description: 'text',
    image: 'media',
    parent: 'relation',
    products: 'relation'
  }
}
```

#### **API Structure**
```
/api/
├── products              # Product management
│   ├── GET /             # List products with filtering
│   ├── GET /:id          # Get single product
│   ├── POST /            # Create product (admin)
│   ├── PUT /:id          # Update product (admin)
│   └── DELETE /:id       # Delete product (admin)
├── categories            # Category management
│   ├── GET /             # List categories
│   ├── GET /:slug        # Get category by slug
│   └── GET /:id/products # Get products in category
├── orders                # Order management
│   ├── GET /             # List orders (admin/user)
│   ├── GET /:id          # Get single order
│   ├── POST /            # Create order
│   └── PUT /:id/status   # Update order status
└── reviews               # Product reviews
    ├── GET /product/:id  # Get product reviews
    ├── POST /            # Create review
    └── PUT /:id          # Update review
```

### **Database Design**

#### **Entity Relationship Diagram**
```sql
Users
├── id (Primary Key)
├── name
├── email (Unique)
├── phone
├── address (JSON)
├── created_at
└── updated_at

Products
├── id (Primary Key)
├── title
├── description
├── price
├── currency
├── category_id (Foreign Key)
├── inventory
├── sku (Unique)
├── status
├── created_at
└── updated_at

Orders
├── id (Primary Key)
├── order_number (Unique)
├── customer_email
├── items (JSON)
├── total
├── status
├── shipping_address (JSON)
├── payment_method
├── created_at
└── updated_at

Categories
├── id (Primary Key)
├── name
├── slug (Unique)
├── parent_id (Self-referencing)
├── created_at
└── updated_at
```

#### **Database Optimization**
- **Indexing Strategy**: Optimized indexes for frequently queried fields
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Minimized N+1 queries and optimized joins
- **Caching Layer**: Redis/Memory caching for frequently accessed data

## 🔐 Authentication Architecture

### **NextAuth.js Configuration**

#### **Authentication Flow**
```typescript
// NextAuth Configuration
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      authorize: async (credentials) => {
        // Custom authentication logic
        return authenticateUser(credentials)
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    jwt: ({ token, user }) => {
      // JWT callback logic
    },
    session: ({ session, token }) => {
      // Session callback logic
    }
  }
}
```

#### **User Management System**
- **Prisma Integration**: User data managed through Prisma ORM
- **Session Management**: JWT-based sessions with automatic refresh
- **Role-Based Access**: Admin and customer role differentiation
- **Security Features**: Password hashing, session validation, CSRF protection

## 🌐 API Integration Architecture

### **External Service Integration**

#### **Payment Processing**
```typescript
// Stripe Integration
interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret: string
  currency: string
}

// PayPal Integration
interface PayPalConfig {
  clientId: string
  clientSecret: string
  environment: 'sandbox' | 'production'
}

// Payment Service Layer
class PaymentService {
  async createStripePayment(amount: number, currency: string): Promise<PaymentIntent>
  async createPayPalPayment(orderData: OrderData): Promise<PayPalOrder>
  async verifyPayment(paymentId: string): Promise<PaymentVerification>
}
```

#### **Shipping Integration**
```typescript
// Canada Post API Integration
interface ShippingRequest {
  originPostalCode: string
  destinationPostalCode: string
  destinationCountry: string
  destinationProvince: string
  weight: number
  serviceCode: string
}

interface ShippingResponse {
  services: ShippingService[]
  recommendedService: ShippingService
  estimatedDelivery: string
}

class ShippingService {
  async calculateRates(request: ShippingRequest): Promise<ShippingResponse>
  async trackPackage(trackingNumber: string): Promise<TrackingInfo>
}
```

#### **Currency Conversion**
```typescript
// Currency API Integration
interface ExchangeRateAPI {
  getExchangeRates(baseCurrency: string): Promise<ExchangeRates>
  convertAmount(amount: number, from: string, to: string): Promise<number>
}

class CurrencyService {
  private api: ExchangeRateAPI
  
  async getConversionRate(from: string, to: string): Promise<number>
  async convertPrice(price: number, fromCurrency: string, toCurrency: string): Promise<number>
}
```

## 📊 Performance Architecture

### **Optimization Strategies**

#### **Frontend Performance**
- **Code Splitting**: Route-based and component-based code splitting
- **Image Optimization**: Next.js Image component with WebP conversion
- **Lazy Loading**: Progressive loading of images and components
- **Bundle Analysis**: Webpack bundle analyzer for optimization
- **Caching Strategy**: Browser caching and service worker implementation

#### **Backend Performance**
- **API Caching**: Response caching for frequently accessed endpoints
- **Database Optimization**: Query optimization and connection pooling
- **CDN Integration**: Static asset delivery through CDN
- **Load Balancing**: Horizontal scaling with load balancers
- **Performance Monitoring**: Real-time performance tracking and alerts

### **Scalability Considerations**

#### **Horizontal Scaling**
- **Microservices Ready**: Architecture supports service separation
- **Container Support**: Docker containerization for easy deployment
- **Load Balancing**: Multiple instance support with session affinity
- **Database Scaling**: Read replicas and connection pooling

#### **Vertical Scaling**
- **Resource Optimization**: Efficient memory and CPU usage
- **Caching Layers**: Multiple levels of caching (browser, CDN, application, database)
- **Database Tuning**: Index optimization and query performance
- **Code Optimization**: Bundle size reduction and execution efficiency

## 🔒 Security Architecture

### **Security Layers**

#### **Application Security**
- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: CSRF tokens and SameSite cookie attributes
- **Rate Limiting**: API rate limiting to prevent abuse

#### **Data Security**
- **Encryption**: Data encryption in transit and at rest
- **Authentication**: Multi-factor authentication support
- **Authorization**: Role-based access control (RBAC)
- **Session Security**: Secure session management and timeout
- **Audit Logging**: Comprehensive security event logging

#### **Infrastructure Security**
- **HTTPS Enforcement**: SSL/TLS encryption for all connections
- **Security Headers**: HSTS, CSP, and other security headers
- **Vulnerability Scanning**: Regular security vulnerability assessments
- **Dependency Management**: Regular updates and security patches
- **Backup Security**: Encrypted backups with secure storage

## 📈 Monitoring & Analytics

### **Application Monitoring**
- **Performance Metrics**: Page load times, API response times
- **Error Tracking**: Real-time error monitoring and alerting
- **User Analytics**: User behavior and conversion tracking
- **Business Metrics**: Sales, revenue, and customer analytics
- **Infrastructure Monitoring**: Server health and resource usage

### **Logging Strategy**
- **Structured Logging**: JSON-formatted logs for easy parsing
- **Log Aggregation**: Centralized log collection and analysis
- **Error Reporting**: Automated error reporting and notifications
- **Audit Trails**: Complete audit trail for sensitive operations
- **Performance Logging**: Detailed performance metrics and bottleneck identification

---

*This architecture provides a robust, scalable, and maintainable foundation for Nagyique Boutique's continued growth and evolution.*
