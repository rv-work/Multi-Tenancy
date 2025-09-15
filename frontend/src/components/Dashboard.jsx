import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import NotesList from "./NotesList";
import CreateNote from "./CreateNote";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, logout, inviteUser, upgradeTenant } = useAuth();
  const [activeTab, setActiveTab] = useState("notes");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  useEffect(() => {
    fetchNotes();
    fetchTenantInfo();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notes");
      if (response.data.success) {
        setNotes(response.data.notes);
        setTenantInfo(response.data.tenant);
      }
    } catch (error) {
      toast.error("Failed to fetch notes");
      console.log("error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantInfo = async () => {
    try {
      const response = await api.get("/tenants/info");
      if (response.data.success) {
        setTenantInfo(response.data.tenant);
      }
    } catch (error) {
      console.error("Failed to fetch tenant info");
      console.log("error : ", error);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const response = await api.post("/notes", noteData);
      if (response.data.success) {
        setNotes((prev) => [response.data.note, ...prev]);
        toast.success("Note created successfully");
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create note";
      toast.error(message);

      if (error.response?.data?.upgradeRequired) {
        return { success: false, upgradeRequired: true };
      }

      return { success: false };
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await api.delete(`/notes/${noteId}`);
      if (response.data.success) {
        setNotes((prev) => prev.filter((note) => note._id !== noteId));
        toast.success("Note deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete note");
      console.log("error : ", error);
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();

    if (!inviteEmail) {
      toast.error("Email is required");
      return;
    }

    const result = await inviteUser(inviteEmail, inviteRole);

    if (result.success) {
      setInviteEmail("");
      setInviteRole("member");
    }
  };

  const handleUpgrade = async () => {
    const result = await upgradeTenant();
    if (result.success) {
      fetchTenantInfo();
    }
  };

  const isLimitReached =
    tenantInfo?.subscription === "free" &&
    tenantInfo?.currentNotes >= tenantInfo?.maxNotes;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.tenant?.name} - Notes App
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">
                  {user?.email} ({user?.role})
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    tenantInfo?.subscription === "pro"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {tenantInfo?.subscription?.toUpperCase()} Plan
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {tenantInfo?.subscription === "free" &&
                user?.role === "admin" && (
                  <button
                    onClick={handleUpgrade}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Upgrade to Pro
                  </button>
                )}

              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Subscription Limit Warning */}
      {isLimitReached && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note limit reached!</strong> You've reached the maximum
                of {tenantInfo.maxNotes} notes for the Free plan.
                {user?.role === "admin" && (
                  <button
                    onClick={handleUpgrade}
                    className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                  >
                    Upgrade to Pro for unlimited notes
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("notes")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "notes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Notes ({notes.length})
            </button>

            <button
              onClick={() => setActiveTab("create")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "create"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Create Note
            </button>

            {user?.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "admin"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Admin Panel
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "notes" && (
          <NotesList
            notes={notes}
            loading={loading}
            onDelete={handleDeleteNote}
            onRefresh={fetchNotes}
          />
        )}

        {activeTab === "create" && (
          <CreateNote
            onCreateNote={handleCreateNote}
            isLimitReached={isLimitReached}
            onUpgrade={handleUpgrade}
            userRole={user?.role}
          />
        )}

        {activeTab === "admin" && user?.role === "admin" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Admin Panel
            </h2>

            {/* Tenant Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Tenant Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Company:</span>
                  <span className="ml-2 font-medium">{user?.tenant?.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Subscription:</span>
                  <span className="ml-2 font-medium">
                    {tenantInfo?.subscription?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Notes:</span>
                  <span className="ml-2 font-medium">
                    {tenantInfo?.currentNotes || 0} /{" "}
                    {tenantInfo?.maxNotes === -1 ? "∞" : tenantInfo?.maxNotes}
                  </span>
                </div>
              </div>
            </div>

            {/* Invite User */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">
                Invite New User
              </h3>
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="user@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Send Invitation
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
