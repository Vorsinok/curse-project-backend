import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
    searchInventories,
    createInventory,
    getInventory,
    getUserInventories,
    deleteInventory,
    updateInventory
} from "../controllers/inventoryController.js";
import {
    listEditors,
    addEditor,
    removeEditor,
} from "../controllers/inventoryAccessController.js";

const router = Router();
router.get("/user/:userId", authenticateToken, getUserInventories);
router.get("/", searchInventories);
router.post("/", authenticateToken, createInventory);
router.get("/:id", authenticateToken, getInventory);
router.get("/:id/access", authenticateToken, listEditors);
router.post("/:id/access", authenticateToken, addEditor);
router.delete("/:id/access/:userId", authenticateToken, removeEditor);
router.delete("/:id", authenticateToken, deleteInventory);
router.patch("/:id", authenticateToken, updateInventory);

export default router;