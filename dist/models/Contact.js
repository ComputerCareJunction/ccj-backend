"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
class Contact {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.subject = data.subject;
        this.looking_for = data.looking_for;
        this.location = data.location;
        this.message = data.message;
        this.form_type = data.form_type || 'contact';
        this.screening_status = data.screening_status || null;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}
exports.Contact = Contact;
//# sourceMappingURL=Contact.js.map