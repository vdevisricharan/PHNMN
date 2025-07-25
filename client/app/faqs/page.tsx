import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'

const FAQsPage = () => {
    const faqSections = [
        {
            title: 'Orders',
            questions: [
                {
                    q: 'How do I place an order?',
                    a: 'Simply browse our products, add items to your cart, and proceed to checkout.'
                },
                {
                    q: 'Can I modify or cancel my order?',
                    a: 'Please contact our support team as soon as possible. Orders can only be modified or canceled before they are shipped.'
                }
            ]
        },
        {
            title: 'Shipping',
            questions: [
                {
                    q: 'What shipping options are available?',
                    a: 'We offer standard and express shipping. Shipping times and costs are calculated at checkout.'
                },
                {
                    q: 'How can I track my order?',
                    a: 'Once your order ships, you will receive a tracking number via email.'
                }
            ]
        },
        {
            title: 'Returns & Refunds',
            questions: [
                {
                    q: 'What is your return policy?',
                    a: 'You can return most items within 30 days of delivery. Please see our Return Policy page for details.'
                },
                {
                    q: 'How do I request a refund?',
                    a: 'Contact our support team with your order details. Refunds are processed within 5-7 business days after receiving your return.'
                }
            ]
        },
        {
            title: 'Account & Support',
            questions: [
                {
                    q: 'Do I need an account to order?',
                    a: 'No, you can checkout as a guest. However, creating an account allows you to track orders and save preferences.'
                },
                {
                    q: 'How can I contact customer support?',
                    a: 'Email us at support@phnmn.com or use our contact form.'
                }
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
                                Frequently Asked Questions
                            </h1>

                            <div className="space-y-8">
                                {faqSections.map((section, idx) => (
                                    <div key={idx} className="bg-gray-50  p-6">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                            {section.title}
                                        </h2>
                                        <div className="space-y-4">
                                            {section.questions.map((item, index) => (
                                                <div key={index} className="bg-white  p-4 shadow-sm">
                                                    <h3 className="text-lg font-medium text-blue-600 mb-2">
                                                        {item.q}
                                                    </h3>
                                                    <p className="text-gray-700">
                                                        {item.a}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center bg-blue-50  p-6">
                                <p className="text-blue-800">
                                    Still have questions? Contact our support team for assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default FAQsPage