import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import productsRoutes from './products.routes';
import productsPublicRoutes from './products-public.routes';
import blogsRoutes from './blogs.routes';
import blogsPublicRoutes from './blogs-public.routes';
import employeesRoutes from './employees.routes';
import attendanceRoutes from './attendance.routes';
import permissionsRoutes from './permissions.routes';
import uploadRoutes from './upload.routes';
import contactRoutes from './contact.routes';
import ordersRoutes from './orders.routes';
import ticketsRoutes from './tickets.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/public/products', productsPublicRoutes); // Public product access
router.use('/blogs', blogsRoutes);
router.use('/public/blogs', blogsPublicRoutes); // Public blog access
router.use('/employees', employeesRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/upload', uploadRoutes);
router.use('/contact', contactRoutes);
router.use('/orders', ordersRoutes);
router.use('/tickets', ticketsRoutes);

export default router;

