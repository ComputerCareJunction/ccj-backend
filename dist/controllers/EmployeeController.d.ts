import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class EmployeeController {
    private employeeService;
    constructor();
    getAllEmployees: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getEmployeeById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getEmployeeByEmail: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    createEmployee: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateEmployee: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteEmployee: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    syncUsersToEmployees: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=EmployeeController.d.ts.map