"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const products_routes_1 = __importDefault(require("./products.routes"));
const products_public_routes_1 = __importDefault(require("./products-public.routes"));
const blogs_routes_1 = __importDefault(require("./blogs.routes"));
const blogs_public_routes_1 = __importDefault(require("./blogs-public.routes"));
const employees_routes_1 = __importDefault(require("./employees.routes"));
const attendance_routes_1 = __importDefault(require("./attendance.routes"));
const permissions_routes_1 = __importDefault(require("./permissions.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const orders_routes_1 = __importDefault(require("./orders.routes"));
const tickets_routes_1 = __importDefault(require("./tickets.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', users_routes_1.default);
router.use('/products', products_routes_1.default);
router.use('/public/products', products_public_routes_1.default); // Public product access
router.use('/blogs', blogs_routes_1.default);
router.use('/public/blogs', blogs_public_routes_1.default); // Public blog access
router.use('/employees', employees_routes_1.default);
router.use('/attendance', attendance_routes_1.default);
router.use('/permissions', permissions_routes_1.default);
router.use('/upload', upload_routes_1.default);
router.use('/contact', contact_routes_1.default);
router.use('/orders', orders_routes_1.default);
router.use('/tickets', tickets_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map