import React, { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { OnlyNav } from "./OnlyNav"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("access_key", import.meta.env.VITE_WEB_API);
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("subject", formData.subject);
    form.append("message", formData.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Thank you, we'll get back to you as soon as possible.");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error("Something went wrong, please try again later.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }

    setIsSubmitting(false);
  }

  return (
    <>
    
    <form onSubmit={handleSubmit}  className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-black">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-black">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-black">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What is this regarding?"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-black">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message here..."
          required
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
                   ${
                     isSubmitting
                       ? "bg-orange-400 cursor-not-allowed"
                       : "bg-orange-600 hover:bg-orange-700 active:bg-orange-800"
                   }`}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
    </>
  )
}
