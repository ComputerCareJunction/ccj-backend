"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TicketController_1 = require("../controllers/TicketController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const ticketController = new TicketController_1.TicketController();
// Public route - no authentication required (for creating tickets from frontend)
router.post('/', ticketController.createTicket);
// Protected routes - require authentication (for admin dashboard)
router.use(auth_1.authMiddleware.authenticate);
router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.put('/:id', ticketController.updateTicket);
router.put('/:id/status', ticketController.updateTicketStatus);
router.delete('/:id', ticketController.deleteTicket);
exports.default = router;
//# sourceMappingURL=tickets.routes.js.map