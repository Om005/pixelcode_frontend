import { Link } from "react-router-dom"
import { Code2, Instagram, Linkedin } from "lucide-react"
import { OnlyNav } from "./OnlyNav"
import Footer from "./Footer"

export default function AboutPage() {
  return (<>
  <div className="fixed w-full z-20">

    <div className="invert mt-5 flex justify-center">

    <OnlyNav/>
    </div>
    </div>
    <div className="min-h-screen montserrat pt-16 bg-black text-white">
      {/* Code Editor Preview */}
      <section className="py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="relative mx-auto max-w-3xl rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center border-b border-zinc-800 px-4 py-2">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="ml-4 text-sm text-zinc-400">index.js</div>
            </div>
            <div className="overflow-hidden p-4 font-mono text-sm">
              <pre className="text-zinc-100">
                <span className="text-blue-400">function</span> <span className="text-green-400">greet</span>(
                <span className="text-yellow-400">name</span>) {"{"}
                <br /> <span className="text-blue-400">return</span>{" "}
                <span className="text-green-400">
                  `Hello, ${"{"}name{"}"} 👋`
                </span>
                ;
                <br />
                {"}"}
                <br />
                <br />
                <span className="text-blue-400">const</span> message = greet(
                <span className="text-green-400">"Student"</span>);
                <br />
                console.<span className="text-yellow-400">log</span>(message);
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Code2 className="h-10 w-10 text-blue-500 mr-2" />
              <h1 className="text-4xl font-bold">PIXELCODE</h1>
            </div>
            <p className="text-xl text-zinc-300 mb-8">
              Your ultimate online coding environment designed for students and developers
            </p>

            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300">
                PIXELCODE is an innovative online code IDE created by students, for students. We understand the
                challenges of learning to code, which is why we've built a platform that combines powerful features with
                an intuitive interface to make coding accessible and enjoyable for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-12 bg-zinc-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">What PIXELCODE Offers</h2>

            <div className="grid gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-500 mb-2">Dual Mode Access</h3>
                <p className="text-zinc-300">
                  Choose between Guest mode for quick coding sessions or Authentication mode with a complete file system
                  to save and organize your projects.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-500 mb-2">AI-Powered Assistance</h3>
                <p className="text-zinc-300">
                  Our built-in AI assistant helps you write better code, fix errors, and learn programming concepts
                  faster than ever before.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-500 mb-2">Customization & Sharing</h3>
                <p className="text-zinc-300">
                  Personalize your coding environment with themes and language preferences. Generate shareable links to
                  collaborate with classmates and instructors effortlessly.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-500 mb-2">Multi-Language Support</h3>
                <p className="text-zinc-300">
                  From JavaScript and Python to HTML, CSS, and beyond — PIXELCODE supports all major programming
                  languages with syntax highlighting and language-specific features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      {/* <section className="py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-zinc-300 mb-8">
              To empower students with accessible, powerful coding tools that enhance learning and foster creativity.
            </p>
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300">
                We believe that learning to code should be accessible to everyone. PIXELCODE was born from the
                frustration of complicated development environments that create barriers for beginners. Our platform
                simplifies the coding experience without sacrificing powerful features, making it perfect for both
                students taking their first steps in programming and experienced developers looking for an efficient
                coding environment.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Social Media Section */}
      <section className="py-12 bg-zinc-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Connect With Us</h2>

            <div className="flex justify-center space-x-6">
              <a
                href="https://www.instagram.com/om_chavda06/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 mb-2 group-hover:scale-110 transition-transform">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <span className="text-zinc-300 group-hover:text-white transition-colors">Instagram</span>
              </a>

              <a
                href="https://www.linkedin.com/in/om-chavda-06a390302/?trk=opento_sprofile_details"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <div className="p-4 rounded-full bg-blue-600 mb-2 group-hover:scale-110 transition-transform">
                  <Linkedin className="h-8 w-8 text-white" />
                </div>
                <span className="text-zinc-300 group-hover:text-white transition-colors">LinkedIn</span>
              </a>
            </div>

            <p className="mt-8 text-zinc-400">
                We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, don't hesitate to reach out.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
    </>
  )
}
