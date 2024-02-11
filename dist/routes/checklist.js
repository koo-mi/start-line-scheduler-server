'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const router = express_1.default.Router();
const {
	getChecklist,
	getChecklistItem,
	createNewItem,
	editItem,
	isChecked,
	deleteItem
} = require('../controllers/checklist-controller');
router.route('/').get(getChecklist).post(createNewItem);
router
	.route('/:itemId')
	.get(getChecklistItem)
	.put(editItem)
	.patch(isChecked)
	.delete(deleteItem);
module.exports = router;
//# sourceMappingURL=checklist.js.map
