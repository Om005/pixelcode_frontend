import { useState, useEffect, useContext } from "react"
import { Copy, ExternalLink, Edit, Trash2, Code, Calendar, LinkIcon, X } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { AppContent } from "../context/AppContex"

export default function Links() {
  const navigate = useNavigate()
  const { userData } = useContext(AppContent)
  const [links, setLinks] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [newLink, setNewLink] = useState({
    url: "",
    title: "",
    description: "",
    language: "",
  })

  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (userData.email === undefined) return
    setLinks([])
    const fetchlinks = async () => {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/file/get-links", { email: userData.email })
      //   console.log(res.data.Links);
      const fetchedLinks = res.data.Links.map((link) => ({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        url: `http://pixelcode-nine.vercel.app/guest/${link.id}`,
        title: link.title,
        description: link.desc,
        language: link.lang,
        createdAt: link.date,
      }))

      setLinks(fetchedLinks)
    }
    fetchlinks()
  }, [userData])

  const showToast = async (message, type = "success") => {
    toast.success(message)
  }

  const addLink = () => {
    if (!newLink.url) {
      showToast("Please provide a URL.", "error")
      return
    }

    const title = newLink.title || `Code Snippet ${new Date().toLocaleDateString()}`

    const link = {
      id: Date.now().toString(),
      url: newLink.url,
      title,
      description: newLink.description,
      language: newLink.language,
      createdAt: new Date(),
    }

    setLinks((prev) => [link, ...prev])
    setNewLink({ url: "", title: "", description: "", language: "" })
    setIsAddDialogOpen(false)
    showToast("Link added successfully!")
  }

  const updateLink = async () => {
    if (!editingLink || !newLink.url) return

    const title = newLink.title
    const desc = newLink.description

    const obj = editingLink.url.split("/")
    const id = obj[obj.length - 1]
    const rsp = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/file/update-links", { id, title, desc })

    setLinks((prev) => prev.map((link) => (link.id === editingLink.id ? { ...link, ...newLink, title, desc } : link)))

    setEditingLink(null)
    setNewLink({ url: "", title: "", description: "", language: "" })
    showToast("Link updated successfully!")
  }

  const deleteLink = async (url) => {
    console.log(url)
    const obj = url.split("/")
    const id = obj[obj.length - 1]
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/file/delete-links", { id })
      setLinks((prev) => prev.filter((link) => link.url !== url))
      showToast("Link deleted successfully!")
    } catch (err) {
      toast.error(err.message)
    }
  }

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
    showToast("Link copied to clipboard!")
  }

  const openEditDialog = (link) => {
    setEditingLink(link)
    console.log(link)
    setNewLink({
      url: link.url,
      title: link.title,
      description: link.description,
      language: link.language || "",
    })
  }

  const resetForm = () => {
    setNewLink({ url: "", title: "", description: "", language: "" })
    setEditingLink(null)
  }

  const closeDialog = () => {
    setIsAddDialogOpen(false)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br montserrat -mb-12 from-slate-900 via-blue-900 to-slate-900">
      {/* <div className="absolute top-0">

      <OnlyNav/>
      </div> */}
      <div className="container mx-auto px-4 py-8">
        {/* Toast Notification */}

        {/* Header */}
        <div className="md:flex items-center justify-between">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Code Links</h1>
            <p className="text-blue-200">Manage your shared code snippets and projects</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative md:w-96">
            <input
              type="text"
              placeholder="Search links by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
              </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center">
              <LinkIcon className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">{searchQuery ? "Filtered Links" : "Total Links"}</p>
                <p className="text-2xl font-bold text-white">
                  {searchQuery
                    ? links.filter((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase())).length
                    : links.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Languages</p>
                <p className="text-2xl font-bold text-white">
                  {
                    new Set(
                      (searchQuery
                        ? links.filter((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        : links
                      )
                        .filter((l) => l.language)
                        .map((l) => l.language),
                    ).size
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">This Month</p>
                <p className="text-2xl font-bold text-white">
                  {
                    (searchQuery
                      ? links.filter((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      : links
                    ).filter((l) => {
                      const now = new Date()
                      const linkDate = new Date(l.createdAt)
                      return linkDate.getMonth() === now.getMonth() && linkDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        {(() => {
          const filteredLinks = links.filter((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase()))

          return filteredLinks.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
              <Code className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery ? "No links found" : "No links saved yet"}
              </h3>
              {searchQuery && <p className="text-slate-400">Try adjusting your search terms</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800/70 transition-colors"
                >
                  {/* Rest of the link card content remains the same */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-semibold mb-1">
                          {link.title == "" ? "Title" : link.title}
                        </h3>
                        <p className="text-slate-400 text-sm">{new Date(link.createdAt).toLocaleDateString()}</p>
                      </div>
                      {link.language && (
                        <span className="bg-blue-600/20 text-blue-300 border border-blue-600/30 px-2 py-1 rounded-md text-xs font-medium">
                          {link.language}
                        </span>
                      )}
                    </div>

                    {
                      <p className="text-slate-300 text-sm mb-2 line-clamp-3">
                        {link.description == "" ? "Description" : link.description}
                      </p>
                    }

                    <div className="bg-slate-900/50 p-2 rounded-md mb-4 overflow-hidden">
                      <p className="text-blue-300 text-sm font-mono truncate hover:text-blue-200">{link.url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(link.url)}
                        className="flex-1 border border-slate-600 text-slate-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>

                      <button
                        onClick={() => {
                          localStorage.setItem("key12390", Math.random)
                          window.open(link.url, "_blank")
                        }}
                        className="border border-slate-600 text-slate-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => openEditDialog(link)}
                        className="border border-slate-600 text-slate-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => deleteLink(link.url)}
                        className="border border-red-600 text-red-400 hover:bg-red-600/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })()}

        {/* Dialog Modal */}
        {(isAddDialogOpen || editingLink) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{editingLink ? "Edit Link" : "Add New Link"}</h2>
                    <p className="text-slate-300 text-sm">
                      {editingLink
                        ? "Update your code link details."
                        : "Save a new code sharing link with description."}
                    </p>
                  </div>
                  <button onClick={closeDialog} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-white mb-2">
                      URL *
                    </label>
                    <input
                      disabled
                      id="url"
                      type="text"
                      placeholder="https://your-ide.com/share/abc123"
                      value={newLink.url}
                      onChange={(e) => setNewLink((prev) => ({ ...prev, url: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Leave blank for auto-generated title"
                      value={newLink.title}
                      onChange={(e) => setNewLink((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-white mb-2">
                      Language
                    </label>
                    <input
                      disabled
                      id="language"
                      type="text"
                      placeholder="JavaScript, Python, etc."
                      value={newLink.language}
                      onChange={(e) => setNewLink((prev) => ({ ...prev, language: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Brief description of your code..."
                      value={newLink.description}
                      onChange={(e) => setNewLink((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeDialog}
                    className="flex-1 border border-slate-600 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingLink ? updateLink : addLink}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {editingLink ? "Update" : "Add"} Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
