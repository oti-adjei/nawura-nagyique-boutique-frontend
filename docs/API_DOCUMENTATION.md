# API Documentation - Nagyique Boutique

## 🔗 API Overview

Nagyique Boutique provides a comprehensive REST API built on Strapi CMS and Next.js API routes. The API supports both internal frontend operations and potential third-party integrations.

## 🔐 Authentication

### **Authentication Methods**

#### **Session-Based Authentication (Frontend)**
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "userpassword"
}
```

#### **API Token Authentication (Strapi)**
```http
GET /api/products
Authorization: Bearer your-jwt-token
Content-Type: application/json
```

#### **Google OAuth**
```http
GET /api/auth/signin/google
# Redirects to Google OAuth flow
```

### **Session Management**

#### **Get Current Session**
```http
GET /api/auth/session
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "profile-image-url"
  },
  "expires": "2025-09-06T00:00:00.000Z"
}
```

## 🛍️ Product API

### **Product Endpoints**

#### **Get All Products**
```http
GET /api/products
```

**Query Parameters:**
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page
- `category` (string): Filter by category slug
- `sort` (string): Sort order (price_asc, price_desc, newest, popular)
- `search` (string): Search term for product title/description

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Premium Silk Blouse",
        "description": "Elegant silk blouse perfect for professional wear",
        "price": 129.99,
        "currency": "CAD",
        "sku": "SLK-BLS-001",
        "inventory": 15,
        "status": "active",
        "images": {
          "data": [
            {
              "attributes": {
                "url": "/uploads/blouse-1.jpg",
                "alternativeText": "Silk blouse front view"
              }
            }
          ]
        },
        "category": {
          "data": {
            "attributes": {
              "name": "Tops",
              "slug": "tops"
            }
          }
        },
        "variants": [
          {
            "size": "S",
            "color": "White",
            "inventory": 5
          }
        ]
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 100
    }
  }
}
```

#### **Get Single Product**
```http
GET /api/products/:id
```

#### **Get Products by Category**
```http
GET /api/categories/:slug/products
```

### **Product Search**

#### **Advanced Product Search**
```http
POST /api/products/search
Content-Type: application/json

{
  "query": "silk blouse",
  "filters": {
    "price": {
      "min": 50,
      "max": 200
    },
    "category": ["tops", "dresses"],
    "size": ["S", "M"],
    "color": ["white", "black"],
    "inStock": true
  },
  "sort": "price_asc",
  "page": 1,
  "limit": 20
}
```

## 🛒 Cart API

### **Cart Management**

#### **Get Cart Contents**
```http
GET /api/cart
```

**Response:**
```json
{
  "items": [
    {
      "id": "item-uuid",
      "productId": 1,
      "title": "Premium Silk Blouse",
      "price": 129.99,
      "currency": "CAD",
      "quantity": 2,
      "variant": {
        "size": "M",
        "color": "White"
      },
      "image": "/uploads/blouse-1.jpg",
      "total": 259.98
    }
  ],
  "summary": {
    "itemCount": 2,
    "subtotal": 259.98,
    "currency": "CAD"
  }
}
```

#### **Add Item to Cart**
```http
POST /api/cart/items
Content-Type: application/json

{
  "productId": 1,
  "quantity": 1,
  "variant": {
    "size": "M",
    "color": "White"
  }
}
```

#### **Update Cart Item**
```http
PUT /api/cart/items/:itemId
Content-Type: application/json

{
  "quantity": 3
}
```

#### **Remove Cart Item**
```http
DELETE /api/cart/items/:itemId
```

#### **Clear Cart**
```http
DELETE /api/cart
```

## 📦 Order API

### **Order Management**

#### **Create Order**
```http
POST /api/orders
Content-Type: application/json

{
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "M5V 3A8",
    "country": "CA"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "M5V 3A8",
    "country": "CA"
  },
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 129.99,
      "variant": {
        "size": "M",
        "color": "White"
      }
    }
  ],
  "paymentMethod": "stripe",
  "paymentIntentId": "pi_stripe_payment_intent_id",
  "shippingCost": 15.00,
  "taxAmount": 33.80,
  "totalAmount": 293.78,
  "currency": "CAD"
}
```

**Response:**
```json
{
  "order": {
    "id": 123,
    "orderNumber": "NGB-2025-001234",
    "status": "confirmed",
    "customerEmail": "john@example.com",
    "items": [...],
    "total": 293.78,
    "currency": "CAD",
    "createdAt": "2025-08-06T12:00:00.000Z",
    "estimatedDelivery": "2025-08-13T12:00:00.000Z"
  }
}
```

#### **Get User Orders**
```http
GET /api/user/orders
Authorization: Required (Session)
```

#### **Get Order by ID**
```http
GET /api/orders/:orderId
Authorization: Required (Session or Admin)
```

#### **Update Order Status (Admin)**
```http
PUT /api/orders/:orderId/status
Authorization: Required (Admin)
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "1Z999AA1234567890",
  "carrier": "canada-post"
}
```

## 👤 User API

### **User Profile Management**

#### **Get User Profile**
```http
GET /api/user/profile
Authorization: Required (Session)
```

**Response:**
```json
{
  "profile": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "Toronto",
      "province": "ON",
      "postalCode": "M5V 3A8",
      "country": "CA"
    },
    "preferences": {
      "currency": "CAD",
      "newsletter": true,
      "promotions": true
    }
  }
}
```

#### **Update User Profile**
```http
POST /api/user/profile
Authorization: Required (Session)
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "M5V 3A8",
    "country": "CA"
  }
}
```

## 💳 Payment API

### **Payment Processing**

#### **Create Stripe Payment Intent**
```http
POST /api/payment/stripe/create-intent
Authorization: Required (Session)
Content-Type: application/json

{
  "amount": 29378,
  "currency": "cad",
  "orderData": {
    "items": [...],
    "shipping": {...},
    "customer": {...}
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_1234567890_secret_abcdef",
  "paymentIntentId": "pi_1234567890"
}
```

#### **Create PayPal Order**
```http
POST /api/payment/paypal/create-order
Authorization: Required (Session)
Content-Type: application/json

{
  "amount": 293.78,
  "currency": "CAD",
  "orderData": {...}
}
```

#### **Verify Payment**
```http
POST /api/payment/verify
Authorization: Required (Session)
Content-Type: application/json

{
  "paymentMethod": "stripe",
  "paymentIntentId": "pi_1234567890",
  "orderData": {...}
}
```

## 🚚 Shipping API

### **Shipping Calculation**

#### **Calculate Shipping Rates**
```http
POST /api/shipping/calculate
Content-Type: application/json

{
  "originPostalCode": "K1A0A6",
  "destinationPostalCode": "M5V3A8",
  "destinationCountry": "CA",
  "destinationProvince": "ON",
  "weight": 1500,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "weight": 750
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "serviceCode": "DOM.RP",
      "serviceName": "Regular Parcel",
      "price": 15.00,
      "currency": "CAD",
      "estimatedDelivery": "2025-08-13",
      "deliveryDays": 5
    },
    {
      "serviceCode": "DOM.EP",
      "serviceName": "Expedited Parcel",
      "price": 25.00,
      "currency": "CAD",
      "estimatedDelivery": "2025-08-10",
      "deliveryDays": 2
    }
  ],
  "recommendedService": {
    "serviceCode": "DOM.RP",
    "price": 15.00
  }
}
```

#### **Track Package**
```http
GET /api/shipping/track/:trackingNumber
```

## 🏷️ Category API

### **Category Management**

#### **Get All Categories**
```http
GET /api/categories
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Women's Clothing",
        "slug": "womens-clothing",
        "description": "Fashion-forward clothing for women",
        "image": {
          "data": {
            "attributes": {
              "url": "/uploads/womens-category.jpg"
            }
          }
        },
        "parent": null,
        "children": {
          "data": [
            {
              "attributes": {
                "name": "Tops",
                "slug": "tops"
              }
            }
          ]
        },
        "productCount": 45
      }
    }
  ]
}
```

#### **Get Category by Slug**
```http
GET /api/categories/:slug
```

## 🌍 Location API

### **Location Services**

#### **Get Exchange Rates**
```http
GET /api/location/exchange-rates?base=CAD
```

**Response:**
```json
{
  "rates": {
    "USD": 0.74,
    "EUR": 0.68,
    "GBP": 0.58,
    "JPY": 108.5
  },
  "base": "CAD",
  "lastUpdated": "2025-08-06T12:00:00.000Z"
}
```

#### **Convert Currency**
```http
POST /api/location/convert
Content-Type: application/json

{
  "amount": 100,
  "from": "CAD",
  "to": "USD"
}
```

**Response:**
```json
{
  "originalAmount": 100,
  "convertedAmount": 74.00,
  "fromCurrency": "CAD",
  "toCurrency": "USD",
  "exchangeRate": 0.74
}
```

#### **Detect Location**
```http
GET /api/location/detect
```

**Response:**
```json
{
  "country": "CA",
  "countryName": "Canada",
  "region": "ON",
  "city": "Toronto",
  "currency": "CAD",
  "timezone": "America/Toronto"
}
```

## 📊 Analytics API

### **Business Analytics (Admin)**

#### **Get Sales Analytics**
```http
GET /api/analytics/sales
Authorization: Required (Admin)
Query Parameters:
  - start: Start date (YYYY-MM-DD)
  - end: End date (YYYY-MM-DD)
  - granularity: day|week|month
```

#### **Get Product Analytics**
```http
GET /api/analytics/products
Authorization: Required (Admin)
```

#### **Get Customer Analytics**
```http
GET /api/analytics/customers
Authorization: Required (Admin)
```

## 🔍 Search API

### **Advanced Search**

#### **Product Search**
```http
GET /api/search/products?q=silk+blouse&category=tops&price_min=50&price_max=200
```

#### **Search Suggestions**
```http
GET /api/search/suggestions?q=silk
```

**Response:**
```json
{
  "suggestions": [
    "silk blouse",
    "silk dress",
    "silk scarf",
    "silk pajamas"
  ],
  "products": [
    {
      "id": 1,
      "title": "Premium Silk Blouse",
      "price": 129.99,
      "image": "/uploads/blouse-1.jpg"
    }
  ]
}
```

## 📝 Review API

### **Product Reviews**

#### **Get Product Reviews**
```http
GET /api/products/:productId/reviews
```

#### **Create Review**
```http
POST /api/reviews
Authorization: Required (Session)
Content-Type: application/json

{
  "productId": 1,
  "rating": 5,
  "title": "Excellent quality!",
  "comment": "Beautiful silk blouse, fits perfectly and arrived quickly.",
  "verified": true
}
```

## 🔧 Webhook API

### **Payment Webhooks**

#### **Stripe Webhook**
```http
POST /api/webhooks/stripe
Stripe-Signature: webhook_signature
Content-Type: application/json

{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "amount": 29378,
      "currency": "cad",
      "status": "succeeded"
    }
  }
}
```

#### **PayPal Webhook**
```http
POST /api/webhooks/paypal
Content-Type: application/json

{
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": {
    "id": "payment_id",
    "amount": {
      "value": "293.78",
      "currency_code": "CAD"
    }
  }
}
```

## 📋 Error Handling

### **Standard Error Response**
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid input data",
    "details": {
      "email": ["Email is required"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

### **Common HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## 🔐 Rate Limiting

### **API Rate Limits**
- **General API**: 100 requests per minute per IP
- **Authentication**: 5 login attempts per minute per IP
- **Search API**: 60 requests per minute per IP
- **Payment API**: 10 requests per minute per session

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1691337600
```

---

*This API documentation provides comprehensive information for integrating with Nagyique Boutique's backend services. For additional support or clarification, please contact our developer support team.*
