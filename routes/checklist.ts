import express from "express";
const router = express.Router();
const { getChecklist, getChecklistItem, createNewItem, editItem, isChecked, deleteItem } = require("../controllers/checklist-controller");

router.route("/")
    .get(getChecklist)
    .post(createNewItem);

router.route("/:itemId")
    .get(getChecklistItem)
    .put(editItem)
    .patch(isChecked)
    .delete(deleteItem);

module.exports = router;