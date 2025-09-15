import React, { useState } from "react";

const CreateNote = ({ onCreateNote, isLimitReached, onUpgrade, userRole }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLimitReached) {
      return;
    }

    setLoading(true);

    const noteData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };

    const result = await onCreateNote(noteData);

    if (result.success) {
      setFormData({
        title: "",
        content: "",
        priority: "medium",
        tags: "",
      });
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLimitReached) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Note Limit Reached
          </h2>
          <p className="text-gray-600 mb-6">
            You've reached the maximum number of notes for the Free plan.
            Upgrade to Pro to create unlimited notes.
          </p>

          {userRole === "admin" && (
            <button
              onClick={onUpgrade}
              className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700"
            >
              Upgrade to Pro Now
            </button>
          )}

          {userRole !== "admin" && (
            <p className="text-sm text-gray-500">
              Contact your admin to upgrade your plan.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Create New Note
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter note title..."
            required
            maxLength={200}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.title.length}/200 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            placeholder="Write your note content here..."
            required
            maxLength={10000}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.content.length}/10,000 characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tag1, tag2, tag3..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate tags with commas
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                title: "",
                content: "",
                priority: "medium",
                tags: "",
              })
            }
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={
              loading || !formData.title.trim() || !formData.content.trim()
            }
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              "Create Note"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNote;
