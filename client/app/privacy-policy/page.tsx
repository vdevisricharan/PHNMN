import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: 'Information We Collect',
      items: [
        'Personal details (name, email, address, etc.)',
        'Order and payment information',
        'Usage data (cookies, IP address, browser type)'
      ]
    },
    {
      title: 'How We Use Your Information',
      items: [
        'To process and fulfill your orders',
        'To communicate with you about your account or orders',
        'To improve our website and services',
        'For marketing purposes (with your consent)'
      ]
    },
    {
      title: 'Your Rights',
      items: [
        'Access, update, or delete your personal information',
        'Opt out of marketing communications',
        'Request information about our data practices'
      ]
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
              Privacy Policy
            </h1>

            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50  p-6 mb-8">
                <p className="text-blue-800">
                  At PHNMN, we value your privacy and are committed to protecting your personal information. 
                  This policy explains how we collect, use, and safeguard your data.
                </p>
              </div>

              {sections.map((section, idx) => (
                <div key={idx} className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <ul className="bg-gray-50  p-6 space-y-3">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-blue-100 text-blue-600 mr-3">
                          •
                        </span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="bg-gray-50  p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Data Security
                </h2>
                <p className="text-gray-700">
                  We implement industry-standard security measures to protect your data. 
                  However, no method of transmission over the Internet is 100% secure.
                </p>
              </div>

              <div className="bg-blue-50  p-6 text-center">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  Contact Us
                </h2>
                <p className="text-blue-800">
                  If you have any questions about this policy, please contact us at{' '}
                  <a href="mailto:privacy@phnmn.com" className="text-blue-600 hover:text-blue-800">
                    privacy@phnmn.com
                  </a>
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

export default PrivacyPolicyPage