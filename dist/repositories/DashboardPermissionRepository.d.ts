import { BaseRepository } from './BaseRepository';
import { DashboardPermission, IDashboardPermission, DashboardSection } from '../models/DashboardPermission';
export declare class DashboardPermissionRepository extends BaseRepository<DashboardPermission> {
    constructor();
    findAll(): Promise<DashboardPermission[]>;
    findById(id: number): Promise<DashboardPermission | null>;
    findByUserId(userId: number): Promise<DashboardPermission[]>;
    findByUserAndSection(userId: number, section: DashboardSection): Promise<DashboardPermission | null>;
    create(data: Partial<IDashboardPermission>): Promise<DashboardPermission>;
    update(id: number, data: Partial<IDashboardPermission>): Promise<DashboardPermission | null>;
    upsertByUserAndSection(data: IDashboardPermission): Promise<DashboardPermission>;
    delete(id: number): Promise<boolean>;
    deleteByUserId(userId: number): Promise<boolean>;
    private mapRowToPermission;
}
//# sourceMappingURL=DashboardPermissionRepository.d.ts.map