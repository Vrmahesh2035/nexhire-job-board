import { Router } from "express";
import { db } from "../db.js";
import { parseToken } from "./auth.js";
const router = Router();
router.get("/", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "student") {
      return res.status(403).json({ error: "Student authentication required" });
    }
    const bookmarks = await db.bookmarks.find(auth.id);
    const listingIds = bookmarks.map((b) => b.listingId);
    const listings = await Promise.all(
      listingIds.map(async (id) => await db.listings.findById(id))
    );
    res.json({ listings: listings.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve bookmarks" });
  }
});
router.post("/:listingId", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "student") {
      return res.status(403).json({ error: "Student authentication required" });
    }
    const { listingId } = req.params;
    await db.bookmarks.add(auth.id, listingId);
    res.json({ message: "Bookmarked successfully", bookmarked: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to bookmark opportunity" });
  }
});
router.delete("/:listingId", async (req, res) => {
  try {
    const auth = parseToken(req.headers.authorization);
    if (!auth || auth.role !== "student") {
      return res.status(403).json({ error: "Student authentication required" });
    }
    const { listingId } = req.params;
    await db.bookmarks.remove(auth.id, listingId);
    res.json({ message: "Bookmark removed", bookmarked: false });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
});
export default router;
