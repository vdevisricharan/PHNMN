# PHNMN E-Commerce Platform

A full-stack e-commerce platform built with the MERN (MongoDB, Express.js, React/Next.js, Node.js) stack.

## Project Overview

PHNMN is a modern e-commerce platform that provides a seamless shopping experience with features like user authentication, product catalog management, shopping cart functionality, secure payments via Stripe, and order processing.

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Stripe Payment Integration
- Swagger API Documentation

### Frontend

- Next.js 15.4
- React 19.1
- Redux Toolkit for state management
- Material-UI components
- Stripe React components
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance
- Stripe account for payments

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/PHNMN.git
    cd PHNMN
    ```

2. Backend setup:

    ```bash
    cd api
    npm install
    cp .env.example .env  # Configure your environment variables
    npm run dev
    ```

3. Frontend setup:

    ```bash
    cd client
    npm install
    cp .env.example .env  # Configure your environment variables
    npm run dev
    ```

### Environment Variables

#### Backend (.env)

```plaintext
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

#### Frontend (.env)

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Features

- User authentication and authorization
- Product catalog with categories
- Shopping cart functionality
- Secure payment processing
- Order management
- User profile management
- Responsive design
- API documentation with Swagger

## API Documentation

The API documentation is available at:

- Development: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- Production: [https://phnmn.onrender.com/api-docs](https://phnmn.onrender.com/api-docs)

## Deployment

### Backend (Node.js)

The backend is deployed on Render.com.

### Frontend (Next.js)

The frontend is deployed using Vercel Platform. For deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, email [support@phnmn.com](mailto:support@phnmn.com) or create an issue in the repository.
