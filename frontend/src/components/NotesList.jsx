import React, { useState } from "react";

const NotesList = ({ notes, loading, onDelete, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || note.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:w-48">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="divide-y divide-gray-200">
        {filteredNotes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-lg mb-2">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchTerm || priorityFilter
                ? "No matching notes"
                : "No notes yet"}
            </h3>
            <p className="text-gray-500">
              {searchTerm || priorityFilter
                ? "Try adjusting your search or filter criteria"
                : "Create your first note to get started"}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note._id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {note.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        note.priority
                      )}`}
                    >
                      {note.priority}
                    </span>
                  </div>

                  <p className="text-gray-600 line-clamp-3 mb-3">
                    {note.content}
                  </p>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <span>Created {formatDate(note.createdAt)}</span>
                    {note.createdBy && (
                      <span className="ml-4">by {note.createdBy.email}</span>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this note?"
                        )
                      ) {
                        onDelete(note._id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
