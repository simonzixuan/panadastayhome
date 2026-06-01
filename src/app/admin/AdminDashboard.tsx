"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { filterAndPaginateLeads } from "@/lib/admin-view"

type Listing = {
  id: string
  title: string
  city: string | null
  state: string | null
  type: string
  price: number
  contact_name: string
  is_available: boolean
  featured: boolean
  publisher_type: string | null
  listing_source: string | null
  review_notes: string | null
  created_at: string
}

type UserRow = {
  id: string
  email: string
  name: string
  created_at: string
  banned_until: string | null
}

type Lead = {
  id: string
  listing_id: string | null
  name: string
  contact: string
  budget: string | null
  move_in_date: string | null
  message: string | null
  source: string | null
  referrer: string | null
  current_path: string | null
  transferred: boolean
  status: string
  notes: string | null
  assigned_to: string | null
  next_follow_up_at: string | null
  created_at: string
  listings: { id: string; title: string; city: string | null; state: string | null } | null
}

type Tab = "listings" | "leads" | "users"

const publisherTypeLabels: Record<string, string> = {
  landlord: "房东",
  sublessor: "二房东/转租",
  agent: "经纪人",
  property_manager: "公寓/物业",
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("leads")
  const [listings, setListings] = useState<Listing[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [users, setUsers] = useState<UserRow[]>([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [token, setToken] = useState("")
  const [actionId, setActionId] = useState<string | null>(null)
  const [listingSearch, setListingSearch] = useState("")
  const [listingStatus, setListingStatus] = useState("all")
  const [listingPage, setListingPage] = useState(1)
  const [leadSearch, setLeadSearch] = useState("")
  const [leadStatus, setLeadStatus] = useState("all")
  const [leadPage, setLeadPage] = useState(1)
  const LISTING_PAGE_SIZE = 20
  const LEAD_PAGE_SIZE = 20

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setToken(data.session?.access_token ?? "")
    })
  }, [])

  const fetchListings = useCallback(async () => {
    if (!token) return
    setLoadingListings(true)
    const res = await fetch("/api/admin/listings", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setListings(data.listings)
    }
    setLoadingListings(false)
  }, [token])

  const fetchUsers = useCallback(async () => {
    if (!token) return
    setLoadingUsers(true)
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setUsers(data.users)
    }
    setLoadingUsers(false)
  }, [token])

  const fetchLeads = useCallback(async () => {
    if (!token) return
    setLoadingLeads(true)
    const res = await fetch("/api/admin/leads", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setLeads(data.leads)
    }
    setLoadingLeads(false)
  }, [token])

  useEffect(() => {
    if (!token) return
    void Promise.resolve().then(fetchListings)
  }, [token, fetchListings])

  useEffect(() => {
    if (tab !== "users" || !token || users.length > 0) return
    void Promise.resolve().then(fetchUsers)
  }, [tab, token, users.length, fetchUsers])

  useEffect(() => {
    if (tab !== "leads" || !token || leads.length > 0) return
    void Promise.resolve().then(fetchLeads)
  }, [tab, token, leads.length, fetchLeads])

  async function patchListing(id: string, patch: Record<string, unknown>) {
    setActionId(id)
    await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    })
    await fetchListings()
    setActionId(null)
  }

  async function deleteListing(id: string) {
    if (!window.confirm("确认删除该房源？此操作不可撤销。")) return
    setActionId(id)
    await fetch(`/api/admin/listings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    await fetchListings()
    setActionId(null)
  }

  async function toggleLeadTransferred(id: string, transferred: boolean) {
    setActionId(id)
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ transferred: !transferred }),
    })
    await fetchLeads()
    setActionId(null)
  }

  async function patchLead(id: string, patch: Record<string, unknown>) {
    setActionId(id)
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    })
    await fetchLeads()
    setActionId(null)
  }

  async function toggleBan(id: string, isBanned: boolean) {
    setActionId(id)
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ban: !isBanned }),
    })
    await fetchUsers()
    setActionId(null)
  }

  const filteredListings = listings.filter((listing) => {
    const keyword = listingSearch.trim().toLowerCase()
    const matchesSearch =
      !keyword ||
      listing.title.toLowerCase().includes(keyword) ||
      (listing.city ?? "").toLowerCase().includes(keyword) ||
      (listing.state ?? "").toLowerCase().includes(keyword)

    const matchesStatus =
      listingStatus === "all" ||
      (listingStatus === "available" && listing.is_available) ||
      (listingStatus === "unavailable" && !listing.is_available) ||
      (listingStatus === "featured" && listing.featured)

    return matchesSearch && matchesStatus
  })
  const listingTotalPages = Math.max(1, Math.ceil(filteredListings.length / LISTING_PAGE_SIZE))
  const visibleListings = filteredListings.slice(
    (listingPage - 1) * LISTING_PAGE_SIZE,
    listingPage * LISTING_PAGE_SIZE
  )
  const filteredLeadResult = filterAndPaginateLeads(leads, {
    status: leadStatus,
    search: leadSearch,
    page: leadPage,
    pageSize: LEAD_PAGE_SIZE,
  })
  const visibleLeads = filteredLeadResult.items as Lead[]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">管理员后台</h1>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {(["listings", "leads", "users"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2 px-6 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "listings"
              ? `房源管理 (${listings.length})`
              : t === "leads"
                ? `线索管理 (${leads.length})`
                : `用户管理 (${users.length})`}
          </button>
        ))}
      </div>

      {tab === "listings" ? (
        loadingListings ? (
          <div className="text-gray-400 py-12 text-center">加载中...</div>
        ) : (
          <>
          <div className="bg-white border rounded-xl p-4 mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-gray-900">房源管理</p>
              <p className="text-sm text-gray-400 mt-1">
                共 {listings.length} 套，当前显示 {filteredListings.length} 套
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={listingSearch}
                onChange={(e) => { setListingSearch(e.target.value); setListingPage(1) }}
                placeholder="搜索标题/城市/州"
                className="h-10 rounded-lg border px-3 text-sm"
              />
              <select
                value={listingStatus}
                onChange={(e) => { setListingStatus(e.target.value); setListingPage(1) }}
                className="h-10 rounded-lg border px-3 text-sm"
              >
                <option value="all">全部状态</option>
                <option value="available">已上架</option>
                <option value="unavailable">待审核/未上架</option>
                <option value="featured">已置顶</option>
              </select>
            </div>
          </div>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">标题</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">城市/州</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">类型</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">价格</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">联系人</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">发布者</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">发布时间</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">状态</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">审核备注</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleListings.map((l) => (
                  <tr key={l.id} className={`hover:bg-gray-50 ${l.featured ? "bg-amber-50" : ""}`}>
                    <td className="px-4 py-3 max-w-[180px]">
                      <div className="flex items-center gap-1.5">
                        {l.featured && (
                          <span className="text-amber-500 text-xs font-bold shrink-0">置顶</span>
                        )}
                        <span className="truncate font-medium">{l.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {[l.city, l.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.type === "rent" ? "租房" : "买房"}</td>
                    <td className="px-4 py-3 text-gray-500">${l.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{l.contact_name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <div>{l.publisher_type ? publisherTypeLabels[l.publisher_type] ?? l.publisher_type : "—"}</div>
                      {l.listing_source && <div className="text-xs text-gray-400">{l.listing_source}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(l.created_at).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        l.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {l.is_available ? "已上架" : "待审核"}
                      </span>
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <input
                        defaultValue={l.review_notes ?? ""}
                        placeholder="审核备注"
                        onBlur={(e) => {
                          if (e.target.value !== (l.review_notes ?? "")) {
                            patchListing(l.id, { review_notes: e.target.value })
                          }
                        }}
                        className="h-9 w-full rounded-lg border px-2 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={l.featured ? "outline" : "secondary"}
                          disabled={actionId === l.id}
                          onClick={() => patchListing(l.id, { featured: !l.featured })}
                        >
                          {l.featured ? "取消置顶" : "置顶"}
                        </Button>
                        <Button
                          size="sm"
                          variant={l.is_available ? "destructive" : "outline"}
                          disabled={actionId === l.id}
                          onClick={() => patchListing(l.id, { is_available: !l.is_available })}
                        >
                          {actionId === l.id ? "处理中..." : l.is_available ? "下架" : "通过上架"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actionId === l.id}
                          onClick={() => deleteListing(l.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredListings.length === 0 && (
              <div className="text-center py-12 text-gray-400">暂无房源</div>
            )}
          </div>
          {listingTotalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={listingPage === 1}
                onClick={() => setListingPage((p) => Math.max(1, p - 1))}
              >
                上一页
              </Button>
              <span className="text-sm text-gray-500">
                第 {listingPage} / {listingTotalPages} 页
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={listingPage === listingTotalPages}
                onClick={() => setListingPage((p) => Math.min(listingTotalPages, p + 1))}
              >
                下一页
              </Button>
            </div>
          )}
          </>
        )
      ) : tab === "leads" ? (
        loadingLeads ? (
          <div className="text-gray-400 py-12 text-center">加载中...</div>
        ) : (
          <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              ["新线索", leads.filter((l) => l.status === "new").length],
              ["已联系", leads.filter((l) => l.status === "contacted").length],
              ["已转交", leads.filter((l) => l.status === "transferred" || l.transferred).length],
              ["无效", leads.filter((l) => l.status === "invalid").length],
            ].map(([label, value]) => (
              <div key={label} className="bg-white border rounded-xl p-4">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border rounded-xl p-4 mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-gray-900">线索管理</p>
              <p className="text-sm text-gray-400 mt-1">
                共 {leads.length} 条，当前显示 {filteredLeadResult.total} 条
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={leadSearch}
                onChange={(e) => { setLeadSearch(e.target.value); setLeadPage(1) }}
                placeholder="搜索姓名/联系方式/来源/房源"
                className="h-10 rounded-lg border px-3 text-sm"
              />
              <select
                value={leadStatus}
                onChange={(e) => { setLeadStatus(e.target.value); setLeadPage(1) }}
                className="h-10 rounded-lg border px-3 text-sm"
              >
                <option value="all">全部状态</option>
                <option value="new">新线索</option>
                <option value="contacted">已联系</option>
                <option value="transferred">已转交</option>
                <option value="invalid">无效</option>
              </select>
            </div>
          </div>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">咨询人</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">联系方式</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">房源</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">预算/时间</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">来源</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">状态</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">跟进</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">备注</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(lead.created_at).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.contact}</td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <div className="font-medium truncate">{lead.listings?.title ?? "未知房源"}</div>
                      <div className="text-xs text-gray-400">
                        {[lead.listings?.city, lead.listings?.state].filter(Boolean).join(", ")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <div>{lead.budget || "—"}</div>
                      <div className="text-xs">{lead.move_in_date || "—"}</div>
                      {lead.message && <div className="text-xs mt-1 max-w-[220px] whitespace-pre-wrap">{lead.message}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px]">
                      <div>{lead.source || "直接访问"}</div>
                      {lead.current_path && <div className="text-xs truncate">{lead.current_path}</div>}
                      {lead.referrer && <div className="text-xs truncate">{lead.referrer}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status || (lead.transferred ? "transferred" : "new")}
                        onChange={(e) => patchLead(lead.id, {
                          status: e.target.value,
                          transferred: e.target.value === "transferred",
                        })}
                        className="h-9 rounded-lg border px-2 text-sm"
                      >
                        <option value="new">新线索</option>
                        <option value="contacted">已联系</option>
                        <option value="transferred">已转交</option>
                        <option value="invalid">无效</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <input
                        defaultValue={lead.assigned_to ?? ""}
                        placeholder="负责人"
                        onBlur={(e) => {
                          if (e.target.value !== (lead.assigned_to ?? "")) {
                            patchLead(lead.id, { assigned_to: e.target.value })
                          }
                        }}
                        className="mb-2 h-9 w-full rounded-lg border px-2 text-sm"
                      />
                      <input
                        type="date"
                        defaultValue={lead.next_follow_up_at ?? ""}
                        onBlur={(e) => {
                          if (e.target.value !== (lead.next_follow_up_at ?? "")) {
                            patchLead(lead.id, { next_follow_up_at: e.target.value || null })
                          }
                        }}
                        className="h-9 w-full rounded-lg border px-2 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <input
                        defaultValue={lead.notes ?? ""}
                        placeholder="添加备注"
                        onBlur={(e) => {
                          if (e.target.value !== (lead.notes ?? "")) {
                            patchLead(lead.id, { notes: e.target.value })
                          }
                        }}
                        className="h-9 w-full rounded-lg border px-2 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant={lead.transferred ? "outline" : "secondary"}
                        disabled={actionId === lead.id}
                        onClick={() => toggleLeadTransferred(lead.id, lead.transferred)}
                      >
                        {lead.transferred ? "标为待转交" : "标为已转交"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeadResult.total === 0 && (
              <div className="text-center py-12 text-gray-400">暂无线索</div>
            )}
          </div>
          {filteredLeadResult.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={filteredLeadResult.page === 1}
                onClick={() => setLeadPage((p) => Math.max(1, p - 1))}
              >
                上一页
              </Button>
              <span className="text-sm text-gray-500">
                第 {filteredLeadResult.page} / {filteredLeadResult.totalPages} 页
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={filteredLeadResult.page === filteredLeadResult.totalPages}
                onClick={() => setLeadPage((p) => Math.min(filteredLeadResult.totalPages, p + 1))}
              >
                下一页
              </Button>
            </div>
          )}
          </>
        )
      ) : (
        loadingUsers ? (
          <div className="text-gray-400 py-12 text-center">加载中...</div>
        ) : (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">邮箱</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">姓名</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">注册时间</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">状态</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => {
                  const isBanned = !!u.banned_until && new Date(u.banned_until) > new Date()
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500">{u.name || "—"}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(u.created_at).toLocaleDateString("zh-CN")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          isBanned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}>
                          {isBanned ? "已封禁" : "正常"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant={isBanned ? "outline" : "destructive"}
                          disabled={actionId === u.id}
                          onClick={() => toggleBan(u.id, isBanned)}
                        >
                          {actionId === u.id ? "处理中..." : isBanned ? "解封" : "封禁"}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-400">暂无用户</div>
            )}
          </div>
        )
      )}
    </div>
  )
}
