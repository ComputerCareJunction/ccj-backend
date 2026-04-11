"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Product_1 = require("../models/Product");
class ProductRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super('tbl_products');
    }
    async findAll() {
        const result = await this.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
        return result.rows.map(row => this.mapRowToProduct(row));
    }
    async findById(id) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
    }
    async findBySlug(slug) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE slug = $1`, [slug]);
        return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
    }
    async create(data) {
        const result = await this.query(`INSERT INTO ${this.tableName} (name, slug, brand, category, image, price, original_price, discount, description, in_stock, specifications, features, warranty, sku, dimensions, weight, color)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
             RETURNING *`, [
            data.name,
            data.slug,
            data.brand || null,
            data.category || null,
            data.image || null,
            data.price,
            data.original_price || null,
            data.discount || null,
            data.description || null,
            data.in_stock !== undefined ? data.in_stock : true,
            typeof data.specifications === 'object' && data.specifications !== null
                ? JSON.stringify(data.specifications)
                : (data.specifications || null),
            data.features || null,
            data.warranty || null,
            data.sku || null,
            data.dimensions || null,
            data.weight || null,
            data.color || null,
        ]);
        return this.mapRowToProduct(result.rows[0]);
    }
    async update(id, data) {
        const updates = [];
        const values = [];
        let paramCount = 1;
        if (data.name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(data.name);
        }
        if (data.slug !== undefined) {
            updates.push(`slug = $${paramCount++}`);
            values.push(data.slug);
        }
        if (data.brand !== undefined) {
            updates.push(`brand = $${paramCount++}`);
            values.push(data.brand);
        }
        if (data.category !== undefined) {
            updates.push(`category = $${paramCount++}`);
            values.push(data.category);
        }
        if (data.image !== undefined) {
            updates.push(`image = $${paramCount++}`);
            values.push(data.image);
        }
        if (data.price !== undefined) {
            updates.push(`price = $${paramCount++}`);
            values.push(data.price);
        }
        if (data.original_price !== undefined) {
            updates.push(`original_price = $${paramCount++}`);
            values.push(data.original_price || null);
        }
        if (data.discount !== undefined) {
            updates.push(`discount = $${paramCount++}`);
            values.push(data.discount || null);
        }
        if (data.description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(data.description);
        }
        if (data.in_stock !== undefined) {
            updates.push(`in_stock = $${paramCount++}`);
            values.push(data.in_stock);
        }
        if (data.specifications !== undefined) {
            updates.push(`specifications = $${paramCount++}`);
            values.push(typeof data.specifications === 'object' && data.specifications !== null
                ? JSON.stringify(data.specifications)
                : (data.specifications || null));
        }
        if (data.features !== undefined) {
            updates.push(`features = $${paramCount++}`);
            values.push(data.features);
        }
        if (data.warranty !== undefined) {
            updates.push(`warranty = $${paramCount++}`);
            values.push(data.warranty);
        }
        if (data.sku !== undefined) {
            updates.push(`sku = $${paramCount++}`);
            values.push(data.sku);
        }
        if (data.dimensions !== undefined) {
            updates.push(`dimensions = $${paramCount++}`);
            values.push(data.dimensions);
        }
        if (data.weight !== undefined) {
            updates.push(`weight = $${paramCount++}`);
            values.push(data.weight);
        }
        if (data.color !== undefined) {
            updates.push(`color = $${paramCount++}`);
            values.push(data.color);
        }
        if (updates.length === 0) {
            return this.findById(id);
        }
        values.push(id);
        const result = await this.query(`UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
        return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
    }
    async delete(id) {
        const result = await this.query(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`, [id]);
        return result.rows.length > 0;
    }
    async findByBrand(brand) {
        // Normalize slug (replace dashes with spaces)
        // URL slug "dell" should match database "Dell"
        const normalizedBrand = brand.toLowerCase().trim().replace(/-/g, ' ');
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE LOWER(TRIM(brand)) = $1 ORDER BY name ASC`, [normalizedBrand]);
        return result.rows.map(row => this.mapRowToProduct(row));
    }
    async findByBrandAndCategory(brand, category) {
        // Normalize slug (replace dashes with spaces if any)
        // URL slug "dell" should match database "Dell", URL "laptops" should match "Laptops"
        const normalizedBrand = brand.toLowerCase().trim().replace(/-/g, ' ');
        const normalizedCategory = category.toLowerCase().trim().replace(/-/g, ' ');
        // Handle both singular and plural forms for category (e.g., "laptop" and "laptops")
        const categorySingular = normalizedCategory.endsWith('s')
            ? normalizedCategory.slice(0, -1)
            : normalizedCategory;
        const categoryPlural = normalizedCategory.endsWith('s')
            ? normalizedCategory
            : normalizedCategory + 's';
        const result = await this.query(`SELECT * FROM ${this.tableName} 
             WHERE LOWER(TRIM(brand)) = $1 
             AND (LOWER(TRIM(category)) = $2 OR LOWER(TRIM(category)) = $3 OR LOWER(TRIM(category)) = $4)
             ORDER BY name ASC`, [normalizedBrand, normalizedCategory, categorySingular, categoryPlural]);
        return result.rows.map(row => this.mapRowToProduct(row));
    }
    async findByCategory(category) {
        // Normalize slug (replace dashes with spaces)
        // URL slug "laptops" should match database "Laptops"
        const normalizedCategory = category.toLowerCase().trim().replace(/-/g, ' ');
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE LOWER(TRIM(category)) = $1 ORDER BY name ASC`, [normalizedCategory]);
        return result.rows.map(row => this.mapRowToProduct(row));
    }
    async getUniqueBrands() {
        const result = await this.query(`SELECT DISTINCT brand FROM ${this.tableName} WHERE brand IS NOT NULL AND brand != '' ORDER BY brand ASC`);
        return result.rows.map(row => row.brand).filter((brand) => !!brand);
    }
    async getCategoriesByBrand(brand) {
        const normalizedBrand = brand.toLowerCase().trim();
        const result = await this.query(`SELECT DISTINCT category FROM ${this.tableName} 
             WHERE LOWER(TRIM(brand)) = $1 AND category IS NOT NULL AND category != '' 
             ORDER BY category ASC`, [normalizedBrand]);
        return result.rows.map(row => row.category).filter((category) => !!category);
    }
    async getUniqueCategories() {
        const result = await this.query(`SELECT DISTINCT category FROM ${this.tableName} WHERE category IS NOT NULL AND category != '' ORDER BY category ASC`);
        return result.rows.map(row => row.category).filter((category) => !!category);
    }
    mapRowToProduct(row) {
        // Safely parse specifications JSON
        let specifications = null;
        if (row.specifications) {
            if (typeof row.specifications === 'string') {
                try {
                    specifications = JSON.parse(row.specifications);
                }
                catch (error) {
                    // If JSON parsing fails, treat it as plain text or null
                    console.warn(`Failed to parse specifications JSON for product ${row.id}:`, error);
                    specifications = null;
                }
            }
            else {
                specifications = row.specifications;
            }
        }
        return new Product_1.Product({
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
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map