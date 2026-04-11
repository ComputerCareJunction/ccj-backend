import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class ProductController {
    private productService;
    constructor();
    getAllProducts: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    getProductById: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    createProduct: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateProduct: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteProduct: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getProductBySlug: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    getProductsByBrand: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    getProductsByBrandAndCategory: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    getProductsByCategory: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    getUniqueBrands: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    getCategoriesByBrand: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
    getShopDropdownData: (req: Request | AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=ProductController.d.ts.map