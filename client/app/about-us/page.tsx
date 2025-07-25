import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'

const AboutUsPage = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg  overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">About Us</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Welcome to PHNMN! We are passionate about delivering exceptional products and outstanding customer experiences. Our journey began with a simple idea: to make quality and innovation accessible to everyone.
              </p>

              <div className="bg-blue-50  p-6 mb-8">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Our Mission</h2>
                <p className="text-blue-800">
                  To empower our customers by providing top-quality products and services that enrich their lives.
                </p>
              </div>

              <div className="bg-green-50  p-6 mb-8">
                <h2 className="text-2xl font-semibold text-green-900 mb-4">Our Vision</h2>
                <p className="text-green-800">
                  To be a leader in our industry, recognized for our commitment to excellence, innovation, and integrity.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Customer First', desc: 'We put our customers at the heart of everything we do.' },
                    { title: 'Integrity', desc: 'We act with honesty and transparency.' },
                    { title: 'Innovation', desc: 'We embrace change and continuously improve.' },
                    { title: 'Quality', desc: 'We never compromise on quality.' },
                    { title: 'Teamwork', desc: 'We achieve more together.' }
                  ].map((value, index) => (
                    <div key={index} className="bg-gray-50 p-4 ">
                      <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-700">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center bg-gray-50  p-6">
                <p className="text-lg text-gray-700">
                  Thank you for choosing PHNMN. We look forward to serving you!
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

export default AboutUsPage