"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContactController_1 = require("../controllers/ContactController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const contactController = new ContactController_1.ContactController();
// Public route - no authentication required
router.post('/', contactController.createContact);
// Protected routes - require authentication
router.use(auth_1.authMiddleware.authenticate);
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.patch('/:id/screening-status', contactController.updateScreeningStatus);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map