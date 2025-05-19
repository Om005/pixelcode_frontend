import { Mail, MapPin, Phone, Clock, Linkedin, Twitter, Instagram } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <Mail className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-black">Email</h3>
          <p className="text-gray-600">chavdaom84@gmail.com</p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <MapPin className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-black">Address</h3>
          <p className="text-gray-600">
            DAIICT-campus
            <br />
near, Reliance Cross Rd
            <br />
Gandhinagar, Gujarat, India, 382007
          </p>
        </div>
      </div>

      {/* <div className="flex items-start space-x-4">
        <Phone className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-black">Phone</h3>
          <p className="text-gray-600">+1 (555) 123-4567</p>
        </div>
      </div> */}

      {/* <div className="flex items-start space-x-4">
        <Clock className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-black">Business Hours</h3>
          <p className="text-gray-600">Monday - Friday: 9AM - 5PM</p>
          <p className="text-gray-600">Saturday - Sunday: Closed</p>
        </div>
      </div> */}

      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-medium text-black mb-3">Connect With Me</h3>
        <div className="flex space-x-4">
          <a href="https://www.linkedin.com/in/om-chavda-06a390302/?trk=opento_sprofile_details" target="_blank" className="text-orange-600 hover:text-orange-800 transition-colors">
            <Linkedin className="h-6 w-6" />
          </a>
          {/* <a href="#" className="text-orange-600 hover:text-orange-800 transition-colors">
            <Twitter className="h-6 w-6" />
          </a> */}
          <a href="https://www.instagram.com/om_chavda06/" target="_blank" className="text-orange-600 hover:text-orange-800 transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
