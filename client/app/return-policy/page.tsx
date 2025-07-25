import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'

const ReturnPolicyPage = () => {
  const returnSteps = [
    {
      step: 1,
      title: 'Contact Support',
      description: 'Contact our support team at returns@phnmn.com with your order number.'
    },
    {
      step: 2,
      title: 'Ship Item',
      description: 'Follow the instructions provided to ship your item back.'
    },
    {
      step: 3,
      title: 'Processing',
      description: 'Once received and inspected, we will process your refund or exchange.'
    }
  ]

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg  overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Return & Exchange Policy
            </h1>

            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50  p-6 mb-8">
                <p className="text-blue-800">
                  We want you to be completely satisfied with your purchase. If you are not happy with your order, 
                  you may return or exchange eligible items within 30 days of delivery.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Eligibility
                </h2>
                <div className="bg-gray-50  p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center  bg-green-100 text-green-600 mr-3">
                        ✓
                      </span>
                      <span className="text-gray-700">
                        Items must be unused, in original packaging, and in resalable condition.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center  bg-red-100 text-red-600 mr-3">
                        ✕
                      </span>
                      <span className="text-gray-700">
                        Some items (e.g., final sale, perishable goods) are non-returnable.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  How to Return
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {returnSteps.map((step) => (
                    <div key={step.step} className="bg-gray-50  p-6">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        Step {step.step}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-700">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50  p-6 mb-8">
                <h2 className="text-2xl font-semibold text-green-900 mb-4">
                  Refunds
                </h2>
                <p className="text-green-800">
                  Refunds are issued to the original payment method within 5-7 business days after we receive your return.
                </p>
              </div>

              <div className="bg-blue-50  p-6 text-center">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  Questions?
                </h2>
                <p className="text-blue-800">
                  Please contact us at{' '}
                  <a href="mailto:returns@phnmn.com" className="text-blue-600 hover:text-blue-800">
                    returns@phnmn.com
                  </a>
                  {' '}for any questions or assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}

export default ReturnPolicyPage