// app/contact/page.tsx

import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <main className="bg-white">
      {/* Page Header */}
      <div className="bg-gray-50 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg leading-6 text-gray-600 max-w-2xl mx-auto px-4">
          We&apos;d love to hear from you! Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.
        </p>
      </div>

      {/* Main Content: Form and Info */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* --- Contact Form Column --- */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Send Us a Message</h2>
            <form action="#" method="POST" className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* --- Contact Info & Map Column --- */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
                <ul className="space-y-6 text-gray-600">
                  <li className="flex items-start">
                    <MapPinIcon className="h-6 w-6 text-teal-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-800">Our Address</h3>
                        <p>123 Greenery Lane, Garden City, GC 12345</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <EnvelopeIcon className="h-6 w-6 text-teal-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-800">Email Us</h3>
                        <p>contact@yourcompany.com</p>
                    </div>
                  </li>
                   <li className="flex items-start">
                    <PhoneIcon className="h-6 w-6 text-teal-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-800">Call Us</h3>
                        <p>(123) 456-7890</p>
                    </div>
                  </li>
                </ul>
            </div>
            
            {/* Embedded Map */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Find Us Here</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                {/* 
                  HOW TO GET YOUR MAP:
                  1. Go to Google Maps and find your business address.
                  2. Click "Share", then "Embed a map".
                  3. Copy the HTML and paste the `src` URL below.
                */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.23862366291!2d-122.4211668846817!3d37.7843859797579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580979453733d%3A0x446c75a407a52d3a!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1678886470000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}