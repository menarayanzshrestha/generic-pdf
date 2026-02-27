# PDF Generator API

A TypeScript/Express-based API for generating dynamic PDF documents (invoices, user lists, etc.) using **PDFKit** or **Puppeteer**.

## Features

- **Multiple PDF Engines**: PDFKit for lightweight generation, Puppeteer for advanced rendering
- **Multiple Design Templates**: Invoice and user-list designs
- **Customizable Parameters**: Page size, orientation, margins, page numbering
- **Dynamic Content**: Generate mock data or provide custom items/users
- **Image Support**: Embed images from URLs into PDFs
- **Type-Safe**: Built with TypeScript and Zod validation

## Prerequisites

- Node.js 18+
- Yarn or npm

## Installation

```bash
# Install dependencies
yarn install

# Build TypeScript
yarn build
```

## Running the Server

### Development Mode
```bash
yarn dev
```

The server will start on `http://localhost:6000` and automatically reload on file changes.

### Production Mode
```bash
# Build TypeScript
yarn build

# Start the server
yarn start
```

## API Endpoints

### 1. Generate PDF 
**POST** `/api/pdf/pdfkit`
**POST** `/api/pdf/pupeteer`

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | string | `A4` | Page size: `A4`, `LETTER`, `LEGAL` |
| `orientation` | string | `portrait` | Page orientation: `portrait`, `landscape` |
| `design` | string | `invoice` | Document design: `invoice`, `userList` |
| `pageNumber` | string | `true` | Show page numbers: `true`, `false` |
| `filename` | string | `document` | Output filename (without extension) |

#### Request Body

```json
{
  "invoice": {
    "number": "INV-0001",
    "subtotal": 1000,
    "total": 1100,
    "shipping": 50,
    "discount": 10,
    "tax": 60,
    "fromName": "Your Company",
    "fromAddress": "123 Business St, City, Country",
    "toName": "Client Name",
    "toAddress": "456 Client Ave, City, Country",
    "issueDate": "2025-01-02",
    "dueDate": "2026-01-02",
    "poNumber": "PO-123"
  },
  "itemsCount": 12,
  "usersCount": 5,
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Request Body Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `invoice` | Object | No | Invoice details (required for invoice design) |
| `invoice.number` | string | No | Invoice number (max 10 chars) |
| `invoice.subtotal` | number | No | Subtotal amount (max 9999) |
| `invoice.total` | number | No | Total amount (max 9999) |
| `invoice.shipping` | number | No | Shipping cost (max 9999) |
| `invoice.discount` | number | No | Discount amount (max 9999) |
| `invoice.tax` | number | No | Tax amount (max 9999) |
| `invoice.fromName` | string | No | Sender name |
| `invoice.fromAddress` | string | No | Sender address |
| `invoice.toName` | string | No | Recipient name |
| `invoice.toAddress` | string | No | Recipient address |
| `invoice.issueDate` | string | No | Issue date |
| `invoice.dueDate` | string | No | Due date |
| `invoice.poNumber` | string | No | PO number (max 10 chars) |
| `items` | Array | No | Array of line items (overrides `itemsCount`) |
| `items[].name` | string | Yes* | Item name |
| `items[].description` | string | No | Item description |
| `items[].quantity` | number | Yes* | Item quantity |
| `items[].price` | number | Yes* | Item price |
| `users` | Array | No | Array of users (overrides `usersCount`) |
| `users[].name` | string | Yes* | User name |
| `users[].email` | string | Yes* | User email (valid email format) |
| `users[].gender` | string | No | User gender |
| `users[].role` | string | No | User role |
| `itemsCount` | number | No | Number of mock items to generate (default: 1) |
| `usersCount` | number | No | Number of mock users to generate (default: 1) |
| `imageUrl` | string | No | URL of image to embed in PDF |

*Required if the field's parent array is provided.

#### Response

- **Success (200)**: Returns a PDF file with the specified filename
- **Bad Request (400)**: Returns JSON error with validation details
```json
{
  "success": false,
  "errors": {
    "query": { /* validation errors */ },
    "body": { /* validation errors */ }
  }
}
```

## Usage Examples

### 1. Invoice PDF with Mock Data

```bash
curl --location 'http://localhost:6000/api/pdf/pdfkit?size=A4&orientation=portrait&filename=invoice_001&design=invoice&pageNumber=true' \
--header 'Content-Type: application/json' \
--data '{
  "invoice": {
    "number": "INV-0001",
    "total": 1100,
    "subtotal": 1000,
    "fromName": "Your Company",
    "fromAddress": "123 Business St, City",
    "toName": "Client Name",
    "toAddress": "456 Client Ave, City",
    "issueDate": "2025-01-02",
    "dueDate": "2026-01-02",
    "poNumber": "PO-123"
  },
  "itemsCount": 5
}'
```

### 2. Invoice with Custom Items and Image

```bash
curl --location 'http://localhost:6000/api/pdf/pdfkit?size=A4&orientation=portrait&filename=custom_invoice&design=invoice' \
--header 'Content-Type: application/json' \
--data '{
  "invoice": {
    "number": "INV-0002",
    "total": 2500,
    "subtotal": 2300,
    "shipping": 100,
    "tax": 100
  },
  "items": [
    {
      "name": "Web Development",
      "description": "Full-stack website build",
      "quantity": 1,
      "price": 1500
    },
    {
      "name": "Mobile App",
      "description": "iOS app development",
      "quantity": 1,
      "price": 800
    }
  ],
  "imageUrl": "https://fastly.picsum.photos/id/237/200/300.jpg"
}'
```

### 3. User List PDF

```bash
curl --location 'http://localhost:6000/api/pdf/pdfkit?size=A4&orientation=portrait&filename=users&design=userList&pageNumber=true' \
--header 'Content-Type: application/json' \
--data '{
  "users": [
    {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "gender": "Female",
      "role": "Admin"
    },
    {
      "name": "Bob Smith",
      "email": "bob@example.com",
      "gender": "Male",
      "role": "User"
    }
  ]
}'
```


## Project Structure

```
src/
├── server.ts                           # Express server entry point
├── app.ts                              # Express app setup
├── controllers/
│   ├── pdfKit/
│   │   └── pdf.controller.ts          # PDFKit request handler
│   └── pupeteer/
│       └── pupeteer.controller.ts     # Puppeteer request handler
├── services/
│   ├── pdfKit/                         # PDFKit-specific logic
│   │   ├── pdf.service.ts             # PDFKit PDF generation
│   │   └── designs/
│   │       ├── invoice.ts             # Invoice template for PDFKit
│   │       ├── user-list.ts           # User list template for PDFKit
│   │       └── index.ts               # PDFKit design map
│   └── pupeteer/                       # Puppeteer-specific logic
│       ├── pupeteer.service.ts        # Puppeteer PDF generation
│       └── designs/
│           ├── invoice.ts             # Invoice HTML template for Puppeteer
│           ├── user-list.ts           # User list HTML template for Puppeteer
│           ├── pageNumber.ts          # Page number footer template
│           └── index.ts               # Design map
├── validators/
│   └── pdf.validator.ts               # Zod schemas for validation
├── types/
│   └── invoice.type.ts                # TypeScript interfaces
├── enums/
│   └── pdf.enum.ts                    # Enum definitions
├── routes/
│   └── pdf.route.ts                   # API routes
└── utils/
  ├── pdfkit/                        # PDFKit utilities
  │   ├── loadImage.ts               # Image loading utilities for PDFKit
  │   └── drawPageNumber.ts          # Page numbering helper for PDFKit
  └── pupeteer/
    └── getBrowser.ts              # Puppeteer browser instance management
``` 
