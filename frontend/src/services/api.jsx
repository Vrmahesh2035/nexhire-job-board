const API_BASE = "/api";
function getHeaders() {
  const token = localStorage.getItem("nexhire_token");
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
export const api = {
  // Database Status
  async getDbStatus() {
    try {
      const res = await fetch(`${API_BASE}/db-status`);
      return await res.json();
    } catch {
      return {
        connected: false,
        dbType: "embedded_store",
        databaseName: "local",
        uriConfigured: false,
        message: "Could not fetch database status."
      };
    }
  },
  // Auth
  auth: {
    async register(data) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Registration failed");
      return json;
    },
    async login(data) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      return json;
    },
    async me() {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Not authenticated");
      return json;
    },
    async demoLogin(role) {
      const res = await fetch(`${API_BASE}/auth/demo/${role}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Demo login failed");
      return json;
    },
    async updateProfile(updates) {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update profile");
      return json;
    }
  },
  // Listings
  listings: {
    async getAll(params) {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v && v !== "all" && v !== "All") {
            searchParams.append(k, v);
          }
        });
      }
      const res = await fetch(`${API_BASE}/listings?${searchParams.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch listings");
      return json.listings || [];
    },
    async getById(id) {
      const res = await fetch(`${API_BASE}/listings/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch listing");
      return json.listing;
    },
    async create(data) {
      const res = await fetch(`${API_BASE}/listings`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create listing");
      return json.listing;
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/listings/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update listing");
      return json.listing;
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/listings/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete listing");
      }
    }
  },
  // Applications (Candidate Application & Recruiter ATS)
  applications: {
    async submit(data) {
      const res = await fetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit application");
      return json.application;
    },
    async getStudentApplications() {
      const res = await fetch(`${API_BASE}/applications/student`, {
        headers: getHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch student applications");
      return json.applications || [];
    },
    async getCompanyApplications(filters) {
      const searchParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== void 0 && v !== "all" && v !== "") {
            searchParams.append(k, String(v));
          }
        });
      }
      const res = await fetch(`${API_BASE}/applications/company?${searchParams.toString()}`, {
        headers: getHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch candidate applications");
      return json.applications || [];
    },
    async updateStatus(id, updates) {
      const res = await fetch(`${API_BASE}/applications/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update candidate status");
      return json.application;
    }
  },
  // Bookmarks
  bookmarks: {
    async getAll() {
      const res = await fetch(`${API_BASE}/bookmarks`, {
        headers: getHeaders()
      });
      const json = await res.json();
      if (!res.ok) return [];
      return json.listings || [];
    },
    async add(listingId) {
      await fetch(`${API_BASE}/bookmarks/${listingId}`, {
        method: "POST",
        headers: getHeaders()
      });
    },
    async remove(listingId) {
      await fetch(`${API_BASE}/bookmarks/${listingId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
    }
  },
  // Resume Scraping & Recommendations
  resume: {
    async parse(payload) {
      const res = await fetch(`${API_BASE}/resume/parse`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to parse resume");
      return json;
    },
    async getRecommendations() {
      const res = await fetch(`${API_BASE}/resume/recommendations`, {
        headers: getHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch recommendations");
      return json;
    }
  },
  // Student Achievements
  studentPosts: {
    async getAll(filters) {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v && v !== "all" && v !== "All") {
            params.append(k, String(v));
          }
        });
      }
      const res = await fetch(`${API_BASE}/student-posts?${params.toString()}`, {
        headers: getHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load achievements");
      return json.posts || [];
    },
    async create(postData) {
      const res = await fetch(`${API_BASE}/student-posts`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(postData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create achievement post");
      return json.post;
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/student-posts/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete post");
      return json;
    }
  }
};
