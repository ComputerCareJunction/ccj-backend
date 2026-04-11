"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const orderController = new OrderController_1.OrderController();
// Public route - create order (no auth required for customers)
router.post('/', orderController.createOrder);
// Protected routes - require authentication
router.use(auth_1.authMiddleware.authenticate);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.get('/number/:orderNumber', orderController.getOrderByOrderNumber);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
exports.default = router;
//# sourceMappingURL=orders.routes.js.map