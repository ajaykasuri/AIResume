import React, { useState } from "react";

const ContentLibrary = () => {
  const [activeCategory, setActiveCategory] = useState("skills");
  const [snippets, setSnippets] = useState([
    {
      id: 1,
      category: "skills",
      content: "JavaScript, React, Node.js",
      tags: ["frontend", "web"],
    },
    {
      id: 2,
      category: "skills",
      content: "Python, Django, Flask",
      tags: ["backend", "web"],
    },
    {
      id: 3,
      category: "summary",
      content: "Experienced full-stack developer...",
      tags: ["professional"],
    },
    {
      id: 4,
      category: "achievements",
      content: "Increased performance by 40%...",
      tags: ["performance"],
    },
  ]);

  const [newSnippet, setNewSnippet] = useState({
    category: "skills",
    content: "",
    tags: "",
  });

  const categories = [
    { key: "skills", label: "Skills", icon: "💪" },
    { key: "summary", label: "Summary Statements", icon: "📝" },
    { key: "achievements", label: "Achievements", icon: "⭐" },
    { key: "experience", label: "Experience Descriptions", icon: "💼" },
  ];

  const filteredSnippets = snippets.filter(
    (snippet) => snippet.category === activeCategory
  );

  const handleAddSnippet = (e) => {
    e.preventDefault();
    if (newSnippet.content.trim()) {
      const snippet = {
        id: snippets.length + 1,
        category: newSnippet.category,
        content: newSnippet.content,
        tags: newSnippet.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };
      setSnippets([...snippets, snippet]);
      setNewSnippet({ category: "skills", content: "", tags: "" });
    }
  };

  const deleteSnippet = (snippetId) => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      setSnippets(snippets.filter((snippet) => snippet.id !== snippetId));
    }
  };

  return (
    <div className="content-library">
      <div className="section-header">
        <h2>Content Library</h2>
        <button className="btn-primary">Export Library</button>
      </div>

      <div className="content-layout">
        <div className="content-sidebar">
          <h3>Categories</h3>
          <nav className="category-nav">
            {categories.map((category) => (
              <button
                key={category.key}
                className={activeCategory === category.key ? "active" : ""}
                onClick={() => setActiveCategory(category.key)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="content-main">
          {/* Add Snippet Form */}
          <div className="card">
            <h3>Add New Snippet</h3>
            <form onSubmit={handleAddSnippet} className="snippet-form">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newSnippet.category}
                  onChange={(e) =>
                    setNewSnippet({ ...newSnippet, category: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={newSnippet.content}
                  onChange={(e) =>
                    setNewSnippet({ ...newSnippet, content: e.target.value })
                  }
                  placeholder="Enter your content snippet..."
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={newSnippet.tags}
                  onChange={(e) =>
                    setNewSnippet({ ...newSnippet, tags: e.target.value })
                  }
                  placeholder="e.g., frontend, javascript, web"
                />
              </div>
              <button type="submit" className="btn-primary">
                Add Snippet
              </button>
            </form>
          </div>

          {/* Snippets List */}
          <div className="card">
            <h3>
              {categories.find((cat) => cat.key === activeCategory)?.label}
              <span className="count-badge">
                {filteredSnippets.length} snippets
              </span>
            </h3>

            <div className="snippets-list">
              {filteredSnippets.map((snippet) => (
                <div key={snippet.id} className="snippet-card">
                  <div className="snippet-content">{snippet.content}</div>
                  <div className="snippet-footer">
                    <div className="snippet-tags">
                      {snippet.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="snippet-actions">
                      <button className="btn-sm btn-primary">Edit</button>
                      <button
                        className="btn-sm btn-danger"
                        onClick={() => deleteSnippet(snippet.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredSnippets.length === 0 && (
                <div className="no-data">
                  No snippets found in this category. Add some above!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;
