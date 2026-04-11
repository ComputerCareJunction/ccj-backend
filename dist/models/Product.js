"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.brand = data.brand;
        this.category = data.category;
        this.image = data.image;
        this.price = data.price;
        this.original_price = data.original_price || null;
        this.discount = data.discount || null;
        this.description = data.description;
        this.in_stock = data.in_stock !== undefined ? data.in_stock : true;
        // Handle specifications - convert string to object if needed, or keep as object
        if (typeof data.specifications === 'string') {
            try {
                this.specifications = JSON.parse(data.specifications);
            }
            catch {
                // If parsing fails, treat as empty object or null
                this.specifications = data.specifications.trim() ? { raw: data.specifications } : null;
            }
        }
        else {
            this.specifications = data.specifications || null;
        }
        this.features = data.features || null;
        this.warranty = data.warranty || null;
        this.sku = data.sku || null;
        this.dimensions = data.dimensions || null;
        this.weight = data.weight || null;
        this.color = data.color || null;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}
exports.Product = Product;
//# sourceMappingURL=Product.js.map