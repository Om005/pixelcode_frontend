import { ContactForm } from "./ContactForm"
import { ContactInfo } from "./ContactInfo"
import { MapPin } from "lucide-react"
import { OnlyNav } from "./OnlyNav"
import Footer from "./Footer"

export default function ContactPage() {
  return (
    <>
    <div className="fixed w-full z-20">

    <div className="invert mt-5 flex justify-center">

    <OnlyNav/>
    </div>
    </div>
    <div className= "max-h- bg-[##F5F5F5] invert pt-24">
      <div className="container mx-auto px-4 py">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-black">Get in Touch</h1>
          <p className="text-gray-600 max-w-md text-md mx-auto">
            Have a question or want to work together? Fill out the form below or reach out directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-black mb-6">Send a Message</h2>
            <ContactForm />
          </div>

          <div className="bg-orange-50 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-black mb-6">Contact Information</h2>
            <ContactInfo />

            {/* <div className="mt-12">
              <div className="h-64 w-full rounded-lg overflow-hidden bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive map would appear here</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}
