"use client"

import { useState, useEffect, useCallback } from "react"
import { signOut, useSession } from "next-auth/react"
import { Application, ApplicationFormData, Status } from "@/types"

const STATUS_COLORS: Record<Status, string> = {
  APPLIED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SCREENING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  INTERVIEW: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  OFFER: "bg-green-500/20 text-green-400 border-green-500/30",
  REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  WITHDRAWN: "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

const STATUSES: Status[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
]

const EMPTY_FORM: ApplicationFormData = {
  company: "",
  position: "",
  status: "APPLIED",
  location: "",
  salary: "",
  url: "",
  notes: "",
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ApplicationFormData>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL")

  const fetchApplications = useCallback(async () => {
    const res = await fetch("/api/applications")
    const data = await res.json()
    setApplications(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId
      ? `/api/applications/${editingId}`
      : "/api/applications"
    const method = editingId ? "PUT" : "POST"

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    setForm(EMPTY_FORM)
    setShowForm(false)
    setEditingId(null)
    fetchApplications()
  }

  const handleEdit = (app: Application) => {
    setForm({
      company: app.company,
      position: app.position,
      status: app.status,
      location: app.location || "",
      salary: app.salary || "",
      url: app.url || "",
      notes: app.notes || "",
    })
    setEditingId(app.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return
    await fetch(`/api/applications/${id}`, { method: "DELETE" })
    fetchApplications()
  }

  const filtered =
    filterStatus === "ALL"
      ? applications
      : applications.filter((a) => a.status === filterStatus)

  const stats = {
    total: applications.length,
    interviews: applications.filter((a) => a.status === "INTERVIEW").length,
    offers: applications.filter((a) => a.status === "OFFER").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg">AppTrackr</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">{session?.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-slate-400 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Applied", value: stats.total, color: "text-blue-400" },
            { label: "Interviews", value: stats.interviews, color: "text-purple-400" },
            { label: "Offers", value: stats.offers, color: "text-green-400" },
            { label: "Rejected", value: stats.rejected, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Applications</h1>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM) }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            + Add Application
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {(["ALL", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                filterStatus === s
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-600 text-slate-400 hover:border-slate-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? "Edit Application" : "Add Application"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Company *", key: "company", required: true },
                  { label: "Position *", key: "position", required: true },
                  { label: "Location", key: "location" },
                  { label: "Salary", key: "salary" },
                  { label: "Job URL", key: "url" },
                ].map(({ label, key, required }) => (
                  <div key={key}>
                    <label className="block text-sm text-slate-400 mb-1">{label}</label>
                    <input
                      type="text"
                      value={form[key as keyof ApplicationFormData] as string}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      required={required}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    {editingId ? "Save Changes" : "Add Application"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingId(null) }}
                    className="flex-1 border border-slate-600 text-slate-400 hover:text-white py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Applications List */}
        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-400">No applications yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-white">{app.position}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{app.company}</p>
                  <div className="flex gap-4 mt-1 text-xs text-slate-500">
                    {app.location && <span>📍 {app.location}</span>}
                    {app.salary && <span>💰 {app.salary}</span>}
                    <span>📅 {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(app)}
                    className="text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-slate-600 hover:border-slate-400 text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg border border-red-500/30 hover:border-red-400 text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}