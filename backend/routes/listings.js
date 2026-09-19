import { Router } from "express";
import { db } from "../db.js";
import { parseToken } from "./auth.js";
const router = Router();
router.get("/", async (req, res) => {
  try {
    const { type, search, workMode, department, experienceLevel, companyId } = req.query;
    const filter = {};
    if (type && type !== "all") {
      filter.type = type;
    }
    if (companyId) {
      filter.companyId = companyId;
    }
    if (workMode && workMode !== "All") {
      filter.workMode = workMode;
    }
    let listings = await db.listings.find(filter);
    if (search) {
      const q = String(search).toLowerCase();
      listings = listings.filter(
        (item) => item.title.toLowerCase().includes(q) || item.companyName.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.skillsRequired && item.skillsRequired.some((s) => s.toLowerCase().includes(q)) || item.location && item.location.toLowerCase().includes(q)
      );
    }
    if (department && department !== "All") {
      listings = listings.filter((item) => item.department === department);
    }
    if (experienceLevel && experienceLevel !== "All") {
      listings = listings.filter((item) => item.experienceLevel?.includes(String(experienceLevel)));
    }
    const listingsWithCounts = await Promise.all(
      listings.map(async (listing) => {
        const count = await db.applications.count({ listingId: listing.id });
        return {
          ...listing,
          applicantCount: count
        };
      })
    );
    res.json({ listings: listingsWithCounts });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ error: "Failed to retrieve listings" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await db.listings.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    const applicantCount = await db.applications.count({ listingId: id });
    res.json({ listing: { ...listing, applicantCount } });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve listing details" });
  }
});
router.post("/", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "company") {
      return res.status(403).json({ error: "Only registered companies can post listings" });
    }
    const companyUser = await db.users.findOne({ id: auth.id });
    if (!companyUser) {
      return res.status(404).json({ error: "Company user not found" });
    }
    const {
      type,
      title,
      department,
      location,
      workMode,
      experienceLevel,
      salaryOrStipend,
      duration,
      skillsRequired,
      description,
      responsibilities,
      requirements,
      perks,
      deadline,
      prizePool,
      teamSize,
      startDate,
      endDate,
      theme
    } = req.body;
    if (!type || !title || !description) {
      return res.status(400).json({ error: "Type, title, and description are required" });
    }
    const newListing = {
      id: `list_${type}_${Date.now()}`,
      companyId: auth.id,
      companyName: companyUser.companyProfile?.companyName || companyUser.name,
      companyLogo: companyUser.companyProfile?.logo || "",
      type,
      title: title.trim(),
      department: department || "Engineering",
      location: location || "Remote",
      workMode: workMode || "Remote",
      experienceLevel: experienceLevel || "Freshers / Students",
      salaryOrStipend: salaryOrStipend || "Competitive",
      duration: duration || (type === "internship" ? "12 Weeks" : type === "hackathon" ? "48 Hours" : "Full-Time"),
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired || "").split(",").map((s) => s.trim()).filter(Boolean),
      description: description.trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : responsibilities ? responsibilities.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      requirements: Array.isArray(requirements) ? requirements : requirements ? requirements.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      perks: Array.isArray(perks) ? perks : perks ? perks.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      deadline: deadline || new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
      status: "active",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (type === "hackathon") {
      newListing.prizePool = prizePool || "$10,000 Prizes";
      newListing.teamSize = teamSize || "1 - 4 Members";
      newListing.startDate = startDate || new Date(Date.now() + 14 * 864e5).toISOString().split("T")[0];
      newListing.endDate = endDate || new Date(Date.now() + 16 * 864e5).toISOString().split("T")[0];
      newListing.theme = theme || "General Innovation";
    }
    const created = await db.listings.insertOne(newListing);
    res.status(201).json({ message: "Opportunity posted successfully", listing: created });
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ error: "Failed to create listing" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "company") {
      return res.status(403).json({ error: "Unauthorized to edit this listing" });
    }
    const { id } = req.params;
    const existing = await db.listings.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (existing.companyId !== auth.id) {
      return res.status(403).json({ error: "You can only update listings posted by your company" });
    }
    const updated = await db.listings.updateOne(id, req.body);
    res.json({ message: "Listing updated successfully", listing: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update listing" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "company") {
      return res.status(403).json({ error: "Unauthorized to delete this listing" });
    }
    const { id } = req.params;
    const existing = await db.listings.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (existing.companyId !== auth.id) {
      return res.status(403).json({ error: "You can only delete your company listings" });
    }
    await db.listings.deleteOne(id);
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});
export default router;
