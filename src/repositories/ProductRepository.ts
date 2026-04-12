import { BaseRepository } from './BaseRepository';
import { Product, IProduct } from '../models/Product';

/** MySQL JSON columns reject raw text; objects and plain strings must be written as valid JSON. */
function specificationsToJsonColumn(
    value: string | Record<string, unknown> | null | undefined
): string | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
        JSON.parse(trimmed);
        return trimmed;
    } catch {
        return JSON.stringify(value);
    }
}

export class ProductRepository extends BaseRepository<Product> {
    constructor() {
        super('tbl_products');
    }

    async findAll(): Promise<Product[]> {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map((row) => this.mapRowToProduct(row));
    }

    async findById(id: number): Promise<Product | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
    }

    async findBySlug(slug: string): Promise<Product | null> {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE slug = ?`, [slug]);
        return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
    }

    async create(
        data: Partial<IProduct & { specifications?: string | Record<string, any> | null }>
    ): Promise<Product> {
        const ins = await this.query(
            `INSERT INTO ${this.tableName} (name, slug, brand, category, image, price, original_price, discount, description, in_stock, specifications, features, warranty, sku, dimensions, weight, color)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.name!,
                data.slug!,
                data.brand || null,
                data.category || null,
                data.image || null,
                data.price!,
                data.original_price || null,
                data.discount || null,
                data.description || null,
                data.in_stock !== undefined ? data.in_stock : true,
                specificationsToJsonColumn(
                    data.specifications as string | Record<string, unknown> | null | undefined
                ),
                data.features || null,
                data.warranty || null,
                data.sku || null,
                data.dimensions || null,
                data.weight || null,
                data.color || null,
            ]
        );
        const insertId = ins.insertId;
        if (!insertId) {
            throw new Error('Failed to create product');
        }
        const fetched = await this.selectByIdAfterInsert(Number(insertId));
        return this.mapRowToProduct(fetched.rows[0]);
    }

    async update(
        id: number,
        data: Partial<IProduct & { specifications?: string | Record<string, any> | null }>
    ): Promise<Product | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            updates.push(`name = ?`);
            values.push(data.name);
        }
        if (data.slug !== undefined) {
            updates.push(`slug = ?`);
            values.push(data.slug);
        }
        if (data.brand !== undefined) {
            updates.push(`brand = ?`);
            values.push(data.brand);
        }
        if (data.category !== undefined) {
            updates.push(`category = ?`);
            values.push(data.category);
        }
        if (data.image !== undefined) {
            updates.push(`image = ?`);
            values.push(data.image);
        }
        if (data.price !== undefined) {
            updates.push(`price = ?`);
            values.push(data.price);
        }
        if (data.original_price !== undefined) {
            updates.push(`original_price = ?`);
            values.push(data.original_price || null);
        }
        if (data.discount !== undefined) {
            updates.push(`discount = ?`);
            values.push(data.discount || null);
        }
        if (data.description !== undefined) {
            updates.push(`description = ?`);
            values.push(data.description);
        }
        if (data.in_stock !== undefined) {
            updates.push(`in_stock = ?`);
            values.push(data.in_stock);
        }
        if (data.specifications !== undefined) {
            updates.push(`specifications = ?`);
            values.push(
                specificationsToJsonColumn(
                    data.specifications as string | Record<string, unknown> | null | undefined
                )
            );
        }
        if (data.features !== undefined) {
            updates.push(`features = ?`);
            values.push(data.features);
        }
        if (data.warranty !== undefined) {
            updates.push(`warranty = ?`);
            values.push(data.warranty);
        }
        if (data.sku !== undefined) {
            updates.push(`sku = ?`);
            values.push(data.sku);
        }
        if (data.dimensions !== undefined) {
            updates.push(`dimensions = ?`);
            values.push(data.dimensions);
        }
        if (data.weight !== undefined) {
            updates.push(`weight = ?`);
            values.push(data.weight);
        }
        if (data.color !== undefined) {
            updates.push(`color = ?`);
            values.push(data.color);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        await this.query(`UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async findByBrand(brand: string): Promise<Product[]> {
        const normalizedBrand = brand.toLowerCase().trim().replace(/-/g, ' ');
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE LOWER(TRIM(brand)) = ? ORDER BY name ASC`,
            [normalizedBrand]
        );
        return result.rows.map((row) => this.mapRowToProduct(row));
    }

    async findByBrandAndCategory(brand: string, category: string): Promise<Product[]> {
        const normalizedBrand = brand.toLowerCase().trim().replace(/-/g, ' ');
        const normalizedCategory = category.toLowerCase().trim().replace(/-/g, ' ');

        const categorySingular = normalizedCategory.endsWith('s')
            ? normalizedCategory.slice(0, -1)
            : normalizedCategory;
        const categoryPlural = normalizedCategory.endsWith('s')
            ? normalizedCategory
            : normalizedCategory + 's';

        const result = await this.query(
            `SELECT * FROM ${this.tableName} 
             WHERE LOWER(TRIM(brand)) = ? 
             AND (LOWER(TRIM(category)) = ? OR LOWER(TRIM(category)) = ? OR LOWER(TRIM(category)) = ?)
             ORDER BY name ASC`,
            [normalizedBrand, normalizedCategory, categorySingular, categoryPlural]
        );
        return result.rows.map((row) => this.mapRowToProduct(row));
    }

    async findByCategory(category: string): Promise<Product[]> {
        const normalizedCategory = category.toLowerCase().trim().replace(/-/g, ' ');
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE LOWER(TRIM(category)) = ? ORDER BY name ASC`,
            [normalizedCategory]
        );
        return result.rows.map((row) => this.mapRowToProduct(row));
    }

    async getUniqueBrands(): Promise<string[]> {
        const result = await this.query(
            `SELECT DISTINCT brand FROM ${this.tableName} WHERE brand IS NOT NULL AND brand != '' ORDER BY brand ASC`
        );
        return result.rows.map((row) => row.brand).filter((brand): brand is string => !!brand);
    }

    async getCategoriesByBrand(brand: string): Promise<string[]> {
        const normalizedBrand = brand.toLowerCase().trim();
        const result = await this.query(
            `SELECT DISTINCT category FROM ${this.tableName} 
             WHERE LOWER(TRIM(brand)) = ? AND category IS NOT NULL AND category != '' 
             ORDER BY category ASC`,
            [normalizedBrand]
        );
        return result.rows.map((row) => row.category).filter((category): category is string => !!category);
    }

    async getUniqueCategories(): Promise<string[]> {
        const result = await this.query(
            `SELECT DISTINCT category FROM ${this.tableName} WHERE category IS NOT NULL AND category != '' ORDER BY category ASC`
        );
        return result.rows.map((row) => row.category).filter((category): category is string => !!category);
    }

    private mapRowToProduct(row: any): Product {
        let specifications = null;
        if (row.specifications !== null && row.specifications !== undefined) {
            if (typeof row.specifications === 'string') {
                try {
                    specifications = JSON.parse(row.specifications);
                } catch {
                    specifications = row.specifications;
                }
            } else {
                specifications = row.specifications;
            }
        }

        return new Product({
            id: row.id,
            name: row.name,
            slug: row.slug,
            brand: row.brand,
            category: row.category,
            image: row.image,
            price: parseFloat(row.price),
            original_price: row.original_price || null,
            discount: row.discount || null,
            description: row.description,
            in_stock: row.in_stock !== undefined ? row.in_stock : true,
            specifications: specifications,
            features: row.features,
            warranty: row.warranty,
            sku: row.sku,
            dimensions: row.dimensions,
            weight: row.weight,
            color: row.color,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }
}
