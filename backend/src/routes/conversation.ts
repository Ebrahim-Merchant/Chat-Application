import express from "express";

const router = express.Router();
router.get("/", (_req, res) => {
  res.json({ message: "Conversation endpoint is live" });
});

router.get("/conversations/:userId");
router.get("/:conversationId");
router.post("/new");
router.post("/");

export default router;
