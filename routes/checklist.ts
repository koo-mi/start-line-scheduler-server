import express from "express";
const router = express.Router();
const {getChecklist, getChecklistItem, createNewItem, editItem, deleteItem} = require("../controllers/checklist-controller");

router.route("/")
    .get(getChecklist)
    .post(createNewItem);

router.route("/:itemId")
    .get(getChecklistItem)
    .put(editItem)
    .delete(deleteItem);

module.exports = router;