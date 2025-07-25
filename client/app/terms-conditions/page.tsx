import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'

const TermsConditionsPage = () => {
  const sections = [
    {
      title: "Use of Site",
      content: [
        "You must be at least 18 years old or have parental consent to use this site.",
        "Do not misuse our services or attempt unauthorized access."
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "All content on this site, including text, images, and logos, is the property of PHNMN and may not be used without permission."
      ]
    },
    {
      title: "Orders & Payment",
      content: [
        "We reserve the right to refuse or cancel orders at our discretion.",
        "Prices and availability are subject to change without notice."
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "PHNMN is not liable for any damages arising from the use of this site or products purchased through it."
      ]
    },
    {
      title: "Changes to Terms",
      content: [
        "We may update these terms at any time.",
        "Continued use of the site constitutes acceptance of the new terms."
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
              Terms & Conditions
            </h1>

            <div className="prose prose-lg max-w-none">
              <div className="bg-yellow-50 p-6  mb-8">
                <p className="text-yellow-900">
                  By using the PHNMN website, you agree to the following terms and conditions. 
                  Please read them carefully.
                </p>
              </div>

              {sections.map((section, idx) => (
                <div key={idx} className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center  bg-blue-100 text-blue-600 mr-3">
                      {idx + 1}
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="bg-gray-50  p-6">
                    <ul className="space-y-3">
                      {section.content.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center  bg-blue-100 text-blue-600 mr-3">
                            •
                          </span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              <div className="border-t pt-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Contact
                </h2>
                <p className="text-gray-600">
                  For questions about these terms, please contact us at{' '}
                  <a href="mailto:support@phnmn.com" className="text-blue-600 hover:text-blue-800">
                    support@phnmn.com
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

export default TermsConditionsPage