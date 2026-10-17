import { withFirebaseAdminAuth } from './firebaseAdmin';

export interface Env {
    DB: any;
    STORAGE: any;
    FIREBASE_PROJECT_ID?: string;
    FIREBASE_CLIENT_EMAIL?: string;
    FIREBASE_PRIVATE_KEY?: string;
    ADMIN_EMAILS?: string;
}

// -----------------------------------------------------------------------------
// 1. Response Helper (Encapsulation)
// -----------------------------------------------------------------------------
export class HttpResponse {
    private static readonly corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    public static json(data: any, status = 200): Response {
        return new Response(JSON.stringify(data), {
            status,
            headers: {
                ...this.corsHeaders,
                'Content-Type': 'application/json',
            },
        });
    }

    public static corsPreflight(): Response {
        return new Response(null, {
            status: 204,
            headers: this.corsHeaders,
        });
    }

    public static error(message: string, status = 500): Response {
        return this.json({ error: message }, status);
    }
}

// -----------------------------------------------------------------------------
// 2. Base Controller Class (Abstraction & Inheritance)
// -----------------------------------------------------------------------------
export abstract class BaseController {
    protected db: any;
    protected storage: any;

    constructor(env: Env) {
        this.db = env.DB;
        this.storage = env.STORAGE;
    }

    protected generateId(prefix: string): string {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
}

// -----------------------------------------------------------------------------
// 3. Domain Controllers
// -----------------------------------------------------------------------------
export class ContactController extends BaseController {
    public async handleSubmission(request: Request): Promise<Response> {
        const body = (await request.json()) as any;
        const { name, email, phone, lookingFor, looking_for, location, message } = body;

        if (!name || !email || !message) {
            return HttpResponse.error('Name, email, and message are required', 400);
        }

        const id = this.generateId('cnt');
        await this.db
            .prepare(
                `INSERT INTO contact_submissions (id, name, email, phone, looking_for, location, message) VALUES (?, ?, ?, ?, ?, ?, ?)`
            )
            .bind(id, name, email, phone || '', lookingFor || looking_for || '', location || '', message)
            .run();

        return HttpResponse.json({ success: true, message: 'Message sent successfully', id });
    }
}

export class ConsultationController extends BaseController {
    public async handleBooking(request: Request): Promise<Response> {
        const body = (await request.json()) as any;
        const { name, email, phone, lookingFor, looking_for, location, message, subject } = body;

        if (!name || !email) {
            return HttpResponse.error('Name and email are required', 400);
        }

        const id = this.generateId('cns');
        await this.db
            .prepare(
                `INSERT INTO consultations (id, name, email, phone, looking_for, location, message, subject) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .bind(id, name, email, phone || '', lookingFor || looking_for || '', location || '', message || '', subject || '')
            .run();

        return HttpResponse.json({ success: true, message: 'Consultation booked successfully', id });
    }
}

export class TicketController extends BaseController {
    public async handleCreateTicket(request: Request): Promise<Response> {
        const body = (await request.json()) as any;
        const { customerName, name, email, phone, serviceType, priority, description, message } = body;

        const id = `tkt_${Date.now()}`;
        const ticketNumber = `CCJ-TKT-${Math.floor(100000 + Math.random() * 900000)}`;

        await this.db
            .prepare(
                `INSERT INTO support_tickets (id, ticket_number, customer_name, email, phone, service_type, priority, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .bind(
                id,
                ticketNumber,
                customerName || name || '',
                email,
                phone || '',
                serviceType || 'General',
                priority || 'medium',
                description || message || ''
            )
            .run();

        return HttpResponse.json({ success: true, ticketNumber, id });
    }
}

export class OrderController extends BaseController {
    public async handleCreateOrder(request: Request): Promise<Response> {
        const body = (await request.json()) as any;
        const { customerName, email, phone, address, totalAmount, items } = body;

        const id = `ord_${Date.now()}`;
        const orderNumber = `CCJ-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

        await this.db
            .prepare(
                `INSERT INTO orders (id, order_number, customer_name, email, phone, address, total_amount, items_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .bind(id, orderNumber, customerName, email, phone, address, totalAmount || 0, JSON.stringify(items || []))
            .run();

        return HttpResponse.json({ success: true, orderNumber, id });
    }
}

export class ProductController extends BaseController {
    public async getProducts(): Promise<Response> {
        const { results } = await this.db.prepare(`SELECT * FROM products WHERE in_stock = 1`).all();
        return HttpResponse.json({ products: results });
    }
}

export class BlogController extends BaseController {
    public async getBlogs(): Promise<Response> {
        const { results } = await this.db.prepare(`SELECT * FROM blogs ORDER BY created_at DESC`).all();
        return HttpResponse.json({ blogs: results || [] });
    }

    public async createBlog(request: Request): Promise<Response> {
        const body = (await request.json()) as any;
        const { title, content, description, author, date, image } = body;

        if (!title || !content) {
            return HttpResponse.error('Title and content are required', 400);
        }

        const id = this.generateId('blog');
        const currentDate = date || new Date().toISOString().split('T')[0];

        await this.db
            .prepare(
                `INSERT INTO blogs (id, title, content, description, author, date, image) VALUES (?, ?, ?, ?, ?, ?, ?)`
            )
            .bind(id, title, content, description || '', author || 'CCJ Team', currentDate, image || '')
            .run();

        const newBlog = {
            id,
            title,
            content,
            description: description || '',
            author: author || 'CCJ Team',
            date: currentDate,
            image: image || '',
        };

        return HttpResponse.json({ success: true, message: 'Blog created successfully', blog: newBlog });
    }

    public async updateBlog(id: string, request: Request): Promise<Response> {
        const body = (await request.json()) as any;
        const { title, content, description, author, date, image } = body;

        await this.db
            .prepare(
                `UPDATE blogs SET title = COALESCE(?, title), content = COALESCE(?, content), description = COALESCE(?, description), author = COALESCE(?, author), date = COALESCE(?, date), image = COALESCE(?, image) WHERE id = ?`
            )
            .bind(title || null, content || null, description || null, author || null, date || null, image || null, id)
            .run();

        return HttpResponse.json({ success: true, message: 'Blog updated successfully' });
    }

    public async deleteBlog(id: string): Promise<Response> {
        await this.db.prepare(`DELETE FROM blogs WHERE id = ?`).bind(id).run();
        return HttpResponse.json({ success: true, message: 'Blog deleted successfully' });
    }
}

export class CareersController extends BaseController {
    public async getCareers(activeOnly = false): Promise<Response> {
        const query = activeOnly
            ? "SELECT * FROM career_openings WHERE status = 'active' ORDER BY created_at DESC"
            : 'SELECT * FROM career_openings ORDER BY created_at DESC';
        const { results } = await this.db.prepare(query).all();
        return HttpResponse.json({ careers: results || [] });
    }

    public async createCareer(request: Request): Promise<Response> {
        const body = await jsonBody(request);
        if (!body.title || !body.department || !body.location || !body.description) {
            return HttpResponse.error('Title, department, location, and description are required', 400);
        }

        const id = crypto.randomUUID();
        await this.db.prepare('INSERT INTO career_openings (id, title, department, location, employment_type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .bind(id, body.title, body.department, body.location, body.employment_type || body.type || 'Full-time', body.description, body.status === 'closed' ? 'closed' : 'active').run();
        const career = await this.db.prepare('SELECT * FROM career_openings WHERE id = ?').bind(id).first();
        return HttpResponse.json({ success: true, career });
    }

    public async updateCareer(id: string, request: Request): Promise<Response> {
        const body = await jsonBody(request);
        const current = await this.db.prepare('SELECT * FROM career_openings WHERE id = ?').bind(id).first();
        if (!current) return notFound('Career opening');
        if (body.status !== undefined && !['active', 'closed'].includes(body.status)) {
            return HttpResponse.error('Status must be active or closed', 400);
        }

        await this.db.prepare('UPDATE career_openings SET title = ?, department = ?, location = ?, employment_type = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .bind(body.title ?? current.title, body.department ?? current.department, body.location ?? current.location, body.employment_type ?? body.type ?? current.employment_type, body.description ?? current.description, body.status ?? current.status, id).run();
        return HttpResponse.json({ success: true });
    }

    public async deleteCareer(id: string): Promise<Response> {
        const result = await this.db.prepare('DELETE FROM career_openings WHERE id = ?').bind(id).run();
        return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Career opening');
    }
}

export class StorageController extends BaseController {
    public async uploadFile(request: Request): Promise<Response> {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return HttpResponse.error('No file uploaded', 400);
        }

        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        await this.storage.put(fileName, file.stream(), {
            httpMetadata: { contentType: file.type },
        });

        return HttpResponse.json({ success: true, fileName, url: `/api/storage/${fileName}` });
    }

    public async getFile(key: string): Promise<Response> {
        const object = await this.storage.get(key);
        if (!object) {
            return HttpResponse.error('File not found', 404);
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000');

        return new Response(object.body, { headers });
    }
}

// -----------------------------------------------------------------------------
// 4. API Router Facade
// -----------------------------------------------------------------------------
type AuthenticatedUser = {
    uid: string;
    email: string;
    name: string;
    photoURL?: string;
    isAdmin: boolean;
    emailVerified: boolean;
};

type DashboardSection = 'products' | 'orders' | 'tickets' | 'users' | 'employees' | 'leads' | 'resources' | 'assets';
type SectionPermission = { read: boolean; write: boolean };
type SectionPermissions = Record<DashboardSection, SectionPermission>;

const DASHBOARD_SECTIONS: DashboardSection[] = ['products', 'orders', 'tickets', 'users', 'employees', 'leads', 'resources', 'assets'];

const emptySectionPermissions = (): SectionPermissions => Object.fromEntries(
    DASHBOARD_SECTIONS.map((section) => [section, { read: false, write: false }])
) as SectionPermissions;

const adminSectionPermissions = (): SectionPermissions => Object.fromEntries(
    DASHBOARD_SECTIONS.map((section) => [section, { read: true, write: true }])
) as SectionPermissions;

const parseSectionPermissions = (raw: unknown): SectionPermissions => {
    let parsed: Record<string, unknown> = {};
    try {
        if (typeof raw === 'string') parsed = JSON.parse(raw) as Record<string, unknown>;
        else if (raw && typeof raw === 'object') parsed = raw as Record<string, unknown>;
    } catch {
        parsed = {};
    }

    const permissions = emptySectionPermissions();
    for (const section of DASHBOARD_SECTIONS) {
        const entry = parsed[section] as Partial<SectionPermission> | undefined;
        const write = entry?.write === true;
        permissions[section] = { read: entry?.read === true || write, write };
    }
    return permissions;
};

const sectionForPath = (path: string): DashboardSection | null => {
    if (path === '/dashboard/counts') return 'products';
    if (path.startsWith('/products')) return 'products';
    if (path.startsWith('/orders')) return 'orders';
    if (path.startsWith('/tickets') || path.startsWith('/support-tickets')) return 'tickets';
    if (path.startsWith('/firebase/users') || path.startsWith('/users')) return 'users';
    if (path.startsWith('/employees') || path.startsWith('/attendance')) return 'employees';
    if (path.startsWith('/contact')) return 'leads';
    if (path.startsWith('/blogs') || path.startsWith('/careers')) return 'resources';
    if (path.startsWith('/assets')) return 'assets';
    return null;
};

const base64UrlToBytes = (value: string): Uint8Array => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
    return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
};

const asArrayBuffer = (value: Uint8Array): ArrayBuffer => value.slice().buffer as ArrayBuffer;

const base64UrlEncode = (value: string | ArrayBuffer): string => {
    const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const getFirebaseAdminAccessToken = async (env: Env): Promise<string> => {
    if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
        throw new Error('Firebase Admin service account is not configured on the Worker');
    }

    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64UrlEncode(JSON.stringify({
        iss: env.FIREBASE_CLIENT_EMAIL,
        scope: 'https://www.googleapis.com/auth/identitytoolkit',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    }))}`;
    let privateKeyPem = env.FIREBASE_PRIVATE_KEY.trim();
    if (privateKeyPem.startsWith('{')) {
        try {
            const credentials = JSON.parse(privateKeyPem) as { private_key?: string; client_email?: string };
            if (credentials.client_email && credentials.client_email !== env.FIREBASE_CLIENT_EMAIL) {
                throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT_MISMATCH');
            }
            privateKeyPem = credentials.private_key || '';
        } catch (error) {
            if (error instanceof Error && error.message === 'FIREBASE_ADMIN_SERVICE_ACCOUNT_MISMATCH') throw error;
            throw new Error('FIREBASE_ADMIN_PRIVATE_KEY_FORMAT_INVALID');
        }
    }
    privateKeyPem = privateKeyPem.replace(/\\n/g, '\n');
    const pemBlock = privateKeyPem.match(/-----BEGIN PRIVATE KEY-----([\s\S]*?)-----END PRIVATE KEY-----/);
    if (!pemBlock) throw new Error('FIREBASE_ADMIN_PRIVATE_KEY_FORMAT_INVALID');
    const keyBase64 = pemBlock[1].replace(/\s/g, '');
    let keyBytes: Uint8Array;
    try {
        keyBytes = Uint8Array.from(atob(keyBase64), (character) => character.charCodeAt(0));
    } catch {
        throw new Error('FIREBASE_ADMIN_PRIVATE_KEY_FORMAT_INVALID');
    }
    let privateKey: CryptoKey;
    try {
        privateKey = await crypto.subtle.importKey('pkcs8', asArrayBuffer(keyBytes), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    } catch {
        throw new Error('FIREBASE_ADMIN_PRIVATE_KEY_INVALID_PKCS8');
    }
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, asArrayBuffer(new TextEncoder().encode(unsigned)));
    const assertion = `${unsigned}.${base64UrlEncode(signature)}`;
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    });
    if (!tokenResponse.ok) {
        const tokenError = await tokenResponse.json().catch(() => ({})) as { error?: string };
        if (tokenError.error === 'invalid_grant' || tokenError.error === 'unauthorized_client') {
            throw new Error('FIREBASE_ADMIN_CREDENTIALS_REJECTED');
        }
        throw new Error('FIREBASE_ADMIN_TOKEN_EXCHANGE_FAILED');
    }
    const tokenBody = await tokenResponse.json() as { access_token?: string };
    if (!tokenBody.access_token) throw new Error('Firebase Admin did not return an access token');
    return tokenBody.access_token;
};

const authenticateFirebaseUser = async (request: Request, env: Env): Promise<AuthenticatedUser | null> => {
    const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return null;

    try {
        const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
        if (!encodedHeader || !encodedPayload || !encodedSignature) return null;
        const header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedHeader)));
        const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload)));
        if (header.alg !== 'RS256' || typeof header.kid !== 'string') return null;

        const projectId = env.FIREBASE_PROJECT_ID || 'ccj-web';
        const now = Math.floor(Date.now() / 1000);
        if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}` ||
            typeof payload.sub !== 'string' || payload.exp <= now || payload.iat > now ||
            typeof payload.email !== 'string') return null;

        const keyResponse = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');
        if (!keyResponse.ok) return null;
        const keySet = await keyResponse.json() as { keys: Array<{ kid?: string; kty: string; n: string; e: string; alg?: string; use?: string }> };
        const jwk = keySet.keys.find((key) => key.kid === header.kid);
        if (!jwk) return null;

        const publicKey = await crypto.subtle.importKey('jwk', jwk as never, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
        const valid = await crypto.subtle.verify(
            'RSASSA-PKCS1-v1_5',
            publicKey,
            asArrayBuffer(base64UrlToBytes(encodedSignature)),
            new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
        );
        if (!valid) return null;

        return {
            uid: payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            photoURL: payload.picture,
            isAdmin: payload.admin === true,
            emailVerified: payload.email_verified === true,
        };
    } catch {
        return null;
    }
};

const isConfiguredAdmin = (user: AuthenticatedUser, env: Env): boolean => {
    const allowedEmails = env.ADMIN_EMAILS?.split(',').map((email) => email.trim().toLowerCase()).filter(Boolean) || [];
    return user.isAdmin || allowedEmails.includes(user.email.toLowerCase());
};

const findApplicationUser = (user: AuthenticatedUser, env: Env): Promise<Record<string, any> | null> => env.DB.prepare(`
    SELECT id, firebase_uid, name, email, phone, role, status, permissions_json
    FROM application_users
    WHERE firebase_uid = ? OR (firebase_uid IS NULL AND email = ? COLLATE NOCASE)
    LIMIT 1
`).bind(user.uid, user.email).first();

const authenticateApplicationUser = async (request: Request, env: Env): Promise<{ user: AuthenticatedUser; applicationUser: Record<string, any> } | null> => {
    const user = await authenticateFirebaseUser(request, env);
    if (!user) return null;
    const applicationUser = await findApplicationUser(user, env);
    if (!applicationUser || applicationUser.status !== 'active') return null;

    if (!applicationUser.firebase_uid) {
        await env.DB.prepare(`
            UPDATE application_users SET firebase_uid = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND firebase_uid IS NULL
        `).bind(user.uid, applicationUser.id).run();
        applicationUser.firebase_uid = user.uid;
    }

    return { user, applicationUser };
};

const authenticateAdmin = async (request: Request, env: Env): Promise<AuthenticatedUser | null> => {
    const access = await authenticateApplicationUser(request, env);
    return access?.applicationUser.role === 'admin' ? access.user : null;
};

const requireApplicationUser = async (request: Request, env: Env): Promise<{ user: AuthenticatedUser; applicationUser: Record<string, any> } | Response> => {
    const access = await authenticateApplicationUser(request, env);
    return access || HttpResponse.error('Authentication required', 401);
};

const requireSectionAccess = async (
    request: Request,
    env: Env,
    section: DashboardSection,
    mode: 'read' | 'write'
): Promise<{ user: AuthenticatedUser; applicationUser: Record<string, any> } | Response> => {
    const access = await requireApplicationUser(request, env);
    if (access instanceof Response) return access;
    if (access.applicationUser.role === 'admin') return access;

    const permission = parseSectionPermissions(access.applicationUser.permissions_json)[section];
    const granted = mode === 'read' ? permission.read : permission.write;
    return granted
        ? access
        : HttpResponse.error(`You do not have ${mode} access to the ${section} section. Ask an administrator to update your permissions.`, 403);
};

const requireSectionRead = (request: Request, env: Env, section: DashboardSection) => requireSectionAccess(request, env, section, 'read');

const requireAdmin = async (request: Request, env: Env): Promise<AuthenticatedUser | Response> => {
    const user = await authenticateAdmin(request, env);
    return user || HttpResponse.error('Authentication required', 401);
};

const hashPassword = async (password: string, salt: Uint8Array): Promise<string> => {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: asArrayBuffer(salt), iterations: 120000, hash: 'SHA-256' }, key, 256);
    return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const jsonBody = async (request: Request): Promise<Record<string, any>> => request.json() as Promise<Record<string, any>>;
const routeId = (path: string, prefix: string): string => decodeURIComponent(path.slice(prefix.length));
const notFound = (entity: string): Response => HttpResponse.error(`${entity} not found`, 404);

export class ApiRouter {
    public static async handleApiRequest(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname.replace(/^\/api/, '');
        const method = request.method;

        // Health Check
        if (path === '/health' || path === '' || path === '/') {
            return HttpResponse.json({
                status: 'healthy',
                service: 'ccj-api',
                provider: 'Cloudflare Workers & D1 & R2',
                repository: 'ccj-backend',
                timestamp: new Date().toISOString(),
            });
        }

        if (path === '/dashboard/counts' && method === 'GET') return this.getDashboardCounts(request, env);

        if (path === '/contact' && method === 'POST') return this.createContact(request, env);
        if (path === '/contact' && method === 'GET') return this.getContacts(request, env);
        if (path.startsWith('/contact/') && method === 'GET') return this.getContact(request, env, routeId(path, '/contact/'));
        if (path.startsWith('/contact/') && path.endsWith('/screening-status') && method === 'PATCH') {
            return this.updateContactStatus(request, env, routeId(path, '/contact/').replace(/\/screening-status$/, ''));
        }
        if (path === '/consultation' && method === 'POST') return new ConsultationController(env).handleBooking(request);
        if (path === '/support-tickets' || path === '/tickets') {
            if (method === 'POST') return this.createTicket(request, env);
            if (method === 'GET') return this.getTickets(request, env);
        }
        if ((path.startsWith('/support-tickets/') || path.startsWith('/tickets/')) && method !== 'OPTIONS') {
            return this.ticketById(request, env, path.replace(/^\/(?:support-tickets|tickets)\//, ''));
        }
        if (path === '/orders' && method === 'POST') return this.createOrder(request, env);
        if (path === '/orders' && method === 'GET') return this.getOrders(request, env);
        if (path.startsWith('/orders/')) return this.orderByPath(request, env, path.slice('/orders/'.length));

        if (path === '/products' && method === 'GET') return this.getProducts(request, env, url);
        if (path === '/products' && method === 'POST') return this.createProduct(request, env);
        if (path.startsWith('/products/')) return this.productByPath(request, env, path.slice('/products/'.length), url);
        if (path === '/public/products' && method === 'GET') return this.getProducts(request, env, url, true);
        if (path.startsWith('/public/products/') && method === 'GET') return this.publicProductByPath(path.slice('/public/products/'.length), url, env);

        if ((path === '/blogs' || path === '/public/blogs') && method === 'GET') return new BlogController(env).getBlogs();
        if ((path === '/blogs' || path === '/public/blogs') && method === 'POST') {
            const access = await requireSectionAccess(request, env, 'resources', 'write');
            return access instanceof Response ? access : new BlogController(env).createBlog(request);
        }
        if (path.startsWith('/blogs/') || path.startsWith('/public/blogs/')) {
            const publicPrefix = path.startsWith('/public/blogs/') ? '/public/blogs/' : '/blogs/';
            const id = routeId(path, publicPrefix);
            if (method === 'GET') {
                const blog = await env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first();
                return blog ? HttpResponse.json({ blog }) : notFound('Blog');
            }
            const access = await requireSectionAccess(request, env, 'resources', 'write');
            if (access instanceof Response) return access;
            if (method === 'PUT') return new BlogController(env).updateBlog(id, request);
            if (method === 'DELETE') return new BlogController(env).deleteBlog(id);
        }

        if (path === '/public/careers' && method === 'GET') return new CareersController(env).getCareers(true);
        if (path === '/careers' && method === 'GET') {
            const access = await requireSectionRead(request, env, 'resources');
            return access instanceof Response ? access : new CareersController(env).getCareers();
        }
        if (path === '/careers' && method === 'POST') {
            const access = await requireSectionAccess(request, env, 'resources', 'write');
            return access instanceof Response ? access : new CareersController(env).createCareer(request);
        }
        if (path.startsWith('/careers/')) {
            const access = await requireSectionAccess(request, env, 'resources', 'write');
            if (access instanceof Response) return access;
            const careers = new CareersController(env);
            const id = routeId(path, '/careers/');
            if (method === 'PUT') return careers.updateCareer(id, request);
            if (method === 'DELETE') return careers.deleteCareer(id);
        }

        if (path === '/storage/upload' && method === 'POST') {
            const section = url.searchParams.get('section');
            if (section === 'products' || section === 'resources') {
                const access = await requireSectionAccess(request, env, section, 'write');
                return access instanceof Response ? access : this.uploadFile(request, env);
            }
            const admin = await requireAdmin(request, env);
            return admin instanceof Response ? admin : this.uploadFile(request, env);
        }
        if (path.startsWith('/storage/') && method === 'GET') return new StorageController(env).getFile(routeId(path, '/storage/'));

        if (path === '/users' && method === 'GET') return this.getUsers(request, env, url);
        if (path === '/users' && method === 'POST') return this.createUser(request, env);
        if (path.startsWith('/users/')) return this.userByPath(request, env, path.slice('/users/'.length));
        if (path === '/firebase/users' && method === 'GET') return this.listFirebaseUsers(request, env, url);
        if (path === '/firebase/users' && method === 'POST') return this.provisionFirebaseUser(request, env);
        if (path.startsWith('/firebase/users/') && path.endsWith('/access') && method === 'PUT') {
            const uid = routeId(path, '/firebase/users/').replace(/\/access$/, '');
            return this.setFirebaseUserAccess(request, env, uid);
        }
        if (path.startsWith('/firebase/users/') && path.endsWith('/role') && method === 'PUT') {
            const uid = routeId(path, '/firebase/users/').replace(/\/role$/, '');
            return this.setFirebaseUserRole(request, env, uid);
        }
        if (path.startsWith('/firebase/users/') && path.endsWith('/permissions') && method === 'PUT') {
            const uid = routeId(path, '/firebase/users/').replace(/\/permissions$/, '');
            return this.setFirebaseUserPermissions(request, env, uid);
        }
        if (path.startsWith('/firebase/users/') && path.endsWith('/employee') && method === 'PUT') {
            const uid = routeId(path, '/firebase/users/').replace(/\/employee$/, '');
            return this.setFirebaseUserEmployee(request, env, uid);
        }
        if (path === '/employees' && method === 'GET') return this.getEmployees(request, env);
        if (path === '/employees' && method === 'POST') return this.createEmployee(request, env);
        if (path === '/employees/sync-users' && method === 'POST') return this.syncUsers(request, env);
        if (path.startsWith('/employees/')) return this.employeeByPath(request, env, path.slice('/employees/'.length));
        if (path === '/attendance' && method === 'GET') return this.getAttendance(request, env, url);
        if (path === '/attendance' && method === 'POST') return this.createAttendance(request, env);
        if (path.startsWith('/attendance/')) return this.deleteAttendance(request, env, routeId(path, '/attendance/'));
        if (path === '/assets' && method === 'GET') return this.getAssets(request, env, url);
        if (path === '/assets' && method === 'POST') return this.createAsset(request, env);
        if (path === '/assets/stock' && method === 'GET') return this.getAssetStock(request, env);
        if (path.startsWith('/assets/')) return this.assetById(request, env, routeId(path, '/assets/'));
        if (path === '/auth/profile' && method === 'GET') return this.getProfile(request, env);
        if (path === '/auth/access' && method === 'GET') return this.getApplicationAccess(request, env);

        return HttpResponse.error('API Endpoint not found', 404);
    }

    private static async authorized(request: Request, env: Env): Promise<Response | null> {
        const section = sectionForPath(new URL(request.url).pathname.replace(/^\/api/, ''));
        if (!section) {
            const admin = await requireAdmin(request, env);
            return admin instanceof Response ? admin : null;
        }
        const access = await requireSectionAccess(request, env, section, request.method === 'GET' ? 'read' : 'write');
        return access instanceof Response ? access : null;
    }

    private static async getApplicationAccess(request: Request, env: Env): Promise<Response> {
        const user = await authenticateFirebaseUser(request, env);
        if (!user) return HttpResponse.error('Sign-in is required.', 401);

        let applicationUser = await findApplicationUser(user, env);

        if (!applicationUser && (isConfiguredAdmin(user, env) || user.isAdmin)) {
            await env.DB.prepare(`
                INSERT OR IGNORE INTO application_users (id, firebase_uid, name, email, role, status)
                VALUES (?, ?, ?, ?, 'admin', 'active')
            `).bind(crypto.randomUUID(), user.uid, user.name, user.email).run();
            applicationUser = await findApplicationUser(user, env);
        }

        if (!applicationUser || applicationUser.status !== 'active') {
            return HttpResponse.error('This account is not authorized for application access. Ask an administrator to create or enable your user record.', 403);
        }

        if (!applicationUser.firebase_uid) {
            await env.DB.prepare(`
                UPDATE application_users SET firebase_uid = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND firebase_uid IS NULL
            `).bind(user.uid, applicationUser.id).run();
        }

        return HttpResponse.json({
            id: user.uid,
            name: applicationUser.name || user.name,
            email: applicationUser.email,
            phone: applicationUser.phone,
            role: applicationUser.role === 'admin' ? 'admin' : 'user',
            status: applicationUser.status,
            permissions: applicationUser.role === 'admin'
                ? adminSectionPermissions()
                : parseSectionPermissions(applicationUser.permissions_json),
        });
    }

    private static async getDashboardCounts(request: Request, env: Env): Promise<Response> {
        const access = await requireApplicationUser(request, env);
        if (access instanceof Response) return access;
        const admin = access.applicationUser.role === 'admin';
        const permissions = admin ? adminSectionPermissions() : parseSectionPermissions(access.applicationUser.permissions_json);
        if (!admin && !DASHBOARD_SECTIONS.some((section) => permissions[section].read)) {
            return HttpResponse.error('Dashboard overview requires read access to at least one section.', 403);
        }

        const counts = await Promise.all([
            env.DB.prepare('SELECT COUNT(*) AS total FROM products').first(),
            env.DB.prepare('SELECT COUNT(*) AS total FROM orders').first(),
            env.DB.prepare('SELECT COUNT(*) AS total FROM support_tickets').first(),
            env.DB.prepare('SELECT COUNT(*) AS total FROM blogs').first(),
            env.DB.prepare("SELECT COUNT(*) AS total FROM career_openings WHERE status = 'active'").first(),
            env.DB.prepare('SELECT COUNT(*) AS total FROM employees').first(),
            env.DB.prepare('SELECT (SELECT COUNT(*) FROM contact_submissions) + (SELECT COUNT(*) FROM consultations) AS total').first(),
            env.DB.prepare('SELECT COUNT(*) AS total FROM assets').first().catch(() => ({ total: 0 })),
        ]);

        return HttpResponse.json({
            products: permissions.products.read ? Number(counts[0]?.total || 0) : 0,
            orders: permissions.orders.read ? Number(counts[1]?.total || 0) : 0,
            tickets: permissions.tickets.read ? Number(counts[2]?.total || 0) : 0,
            blogs: permissions.resources.read ? Number(counts[3]?.total || 0) : 0,
            careers: permissions.resources.read ? Number(counts[4]?.total || 0) : 0,
            employees: permissions.employees.read ? Number(counts[5]?.total || 0) : 0,
            leads: permissions.leads.read ? Number(counts[6]?.total || 0) : 0,
            users: permissions.users.read ? Number((await env.DB.prepare('SELECT COUNT(*) AS total FROM application_users').first() as { total?: number } | null)?.total || 0) : 0,
            assets: permissions.assets?.read ? Number((counts[7] as any)?.total || 0) : 0,
        });
    }

    private static async createContact(request: Request, env: Env): Promise<Response> {
        const body = await jsonBody(request);
        if (!body.name || !body.email || !body.message) return HttpResponse.error('Name, email, and message are required', 400);
        const id = crypto.randomUUID();
        await env.DB.prepare('INSERT INTO contact_submissions (id, name, email, phone, looking_for, location, message, subject, form_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(id, body.name, body.email, body.phone || '', body.looking_for || body.lookingFor || '', body.location || '', body.message, body.subject || '', body.form_type || 'contact').run();
        return HttpResponse.json({ success: true, id });
    }

    private static async getContacts(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const [contacts, consultations] = await Promise.all([
            env.DB.prepare("SELECT id, name, email, phone, subject, looking_for, location, message, COALESCE(form_type, 'contact') AS form_type, screening_status, created_at FROM contact_submissions").all(),
            env.DB.prepare("SELECT id, name, email, phone, subject, looking_for, location, message, 'consultation' AS form_type, NULL AS screening_status, created_at FROM consultations").all(),
        ]);
        const data = [...(contacts.results || []), ...(consultations.results || [])].sort((a: any, b: any) => String(b.created_at).localeCompare(String(a.created_at)));
        return HttpResponse.json(data);
    }

    private static async getContact(request: Request, env: Env, id: string): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const contact = await env.DB.prepare("SELECT id, name, email, phone, subject, looking_for, location, message, COALESCE(form_type, 'contact') AS form_type, screening_status, created_at FROM contact_submissions WHERE id = ?").bind(id).first();
        return contact ? HttpResponse.json(contact) : notFound('Contact');
    }

    private static async updateContactStatus(request: Request, env: Env, id: string): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const { screening_status } = await jsonBody(request);
        if (screening_status !== null && !['screening', 'done'].includes(screening_status)) return HttpResponse.error('Invalid screening status', 400);
        const result = await env.DB.prepare('UPDATE contact_submissions SET screening_status = ? WHERE id = ?').bind(screening_status, id).run();
        return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Contact');
    }

    private static async createTicket(request: Request, env: Env): Promise<Response> {
        const body = await jsonBody(request);
        const id = crypto.randomUUID();
        const sequence = await env.DB.prepare('UPDATE ticket_sequence SET current_value = current_value + 1 WHERE id = 1 RETURNING current_value').first() as { current_value?: number } | null;
        if (!sequence?.current_value) return HttpResponse.error('Ticket numbering is unavailable', 500);
        const ticketNumber = `CCJ-${String(sequence.current_value).padStart(2, '0')}`;
        const name = body.requested_by || body.customer_name || body.customerName || body.name || body.ticket_name || '';
        const ticketName = body.ticket_name || body.serviceType || body.ticket_type || 'Support request';
        const service = body.ticket_type || body.serviceType || 'General';
        const description = body.message || body.description || '';
        await env.DB.prepare('INSERT INTO support_tickets (id, ticket_number, ticket_name, customer_name, email, phone, service_type, priority, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(id, ticketNumber, ticketName, name, body.email || '', body.phone_number || body.phone || '', service, body.priority || 'medium', body.status || 'open', description).run();
        return HttpResponse.json({ success: true, ticketNumber, id });
    }

    private static async getTickets(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const { results } = await env.DB.prepare("SELECT id, ticket_number, COALESCE(ticket_name, service_type) AS ticket_name, service_type AS ticket_type, customer_name AS requested_by, phone AS phone_number, description AS message, status, priority, created_at, updated_at FROM support_tickets ORDER BY created_at DESC").all();
        return HttpResponse.json(results || []);
    }

    private static async ticketById(request: Request, env: Env, rawId: string): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const parts = rawId.split('/');
        const id = decodeURIComponent(parts[0]);
        const method = request.method;
        if (method === 'GET' && !parts[1]) {
            const ticket = await env.DB.prepare("SELECT id, ticket_number, COALESCE(ticket_name, service_type) AS ticket_name, service_type AS ticket_type, customer_name AS requested_by, phone AS phone_number, description AS message, status, priority, created_at, updated_at FROM support_tickets WHERE id = ?").bind(id).first();
            return ticket ? HttpResponse.json(ticket) : notFound('Ticket');
        }
        if (parts[1] === 'status' && method === 'PUT') {
            const { status } = await jsonBody(request);
            if (!['todo', 'in_progress', 'done', 'closed', 'open'].includes(status)) return HttpResponse.error('Invalid ticket status', 400);
            const result = await env.DB.prepare('UPDATE support_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(status, id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Ticket');
        }
        if (method === 'PUT') {
            const body = await jsonBody(request);
            const current = await env.DB.prepare('SELECT * FROM support_tickets WHERE id = ?').bind(id).first();
            if (!current) return notFound('Ticket');
            await env.DB.prepare('UPDATE support_tickets SET priority = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                .bind(body.priority ?? current.priority, body.status ?? current.status, id).run();
            return HttpResponse.json({ success: true });
        }
        if (method === 'DELETE') {
            const result = await env.DB.prepare('DELETE FROM support_tickets WHERE id = ?').bind(id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Ticket');
        }
        return HttpResponse.error('Method not allowed', 405);
    }

    private static async createOrder(request: Request, env: Env): Promise<Response> {
        const body = await jsonBody(request);
        const id = crypto.randomUUID();
        const orderNumber = `CCJ-ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const name = body.customer_name || body.customerName || '';
        const email = body.customer_email || body.email || '';
        const phone = body.customer_phone || body.phone || '';
        const address = body.shipping_address || body.address || '';
        const items = Array.isArray(body.items) ? body.items : [];
        await env.DB.prepare('INSERT INTO orders (id, order_number, customer_name, email, phone, address, city, state, pincode, payment_method, notes, total_amount, items_json, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(id, orderNumber, name, email, phone, address, body.city || '', body.state || '', body.pincode || '', body.payment_method || body.paymentMethod || 'unknown', body.notes || '', body.total_amount || body.totalAmount || 0, JSON.stringify(items), body.status || 'pending').run();
        return HttpResponse.json({ success: true, orderNumber, order_number: orderNumber, id, customer_name: name, customer_email: email, customer_phone: phone, shipping_address: address, city: body.city || '', state: body.state || '', pincode: body.pincode || '', payment_method: body.payment_method || body.paymentMethod || 'unknown', total_amount: body.total_amount || body.totalAmount || 0, items, status: body.status || 'pending', created_at: new Date().toISOString() });
    }

    private static async getOrders(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const { results } = await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        return HttpResponse.json((results || []).map((order: any) => this.presentOrder(order)));
    }

    private static presentOrder(order: any): Record<string, any> {
        return { ...order, customer_email: order.email, customer_phone: order.phone, shipping_address: order.address, items: JSON.parse(order.items_json || '[]') };
    }

    private static async orderByPath(request: Request, env: Env, rawPath: string): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        if (rawPath.startsWith('number/')) {
            const orderNumber = decodeURIComponent(rawPath.slice(7));
            const order = await env.DB.prepare('SELECT * FROM orders WHERE order_number = ?').bind(orderNumber).first();
            return order ? HttpResponse.json(this.presentOrder(order)) : notFound('Order');
        }
        const [id, action] = rawPath.split('/').map(decodeURIComponent);
        if (action === 'status' && request.method === 'PUT') {
            const { status } = await jsonBody(request);
            const result = await env.DB.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(status, id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Order');
        }
        if (request.method === 'DELETE') {
            const result = await env.DB.prepare('DELETE FROM orders WHERE id = ?').bind(id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Order');
        }
        if (request.method === 'GET') {
            const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
            return order ? HttpResponse.json(this.presentOrder(order)) : notFound('Order');
        }
        if (request.method === 'PUT') {
            const body = await jsonBody(request);
            const result = await env.DB.prepare('UPDATE orders SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(body.status ?? null, body.notes ?? null, id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Order');
        }
        return HttpResponse.error('Method not allowed', 405);
    }

    private static async getProducts(request: Request, env: Env, url: URL, isPublic = false): Promise<Response> {
        if (!isPublic) {
            const denied = await this.authorized(request, env);
            if (denied) return denied;
        }
        const productQuery = isPublic
            ? 'SELECT id, slug, name, brand, category, price, original_price, discount, description, image_url, in_stock, specifications, features, warranty, sku, dimensions, weight, color, created_at FROM products WHERE in_stock = 1 ORDER BY name'
            : 'SELECT id, slug, name, brand, category, price, original_price, discount, description, image_url, in_stock, specifications, features, warranty, sku, dimensions, weight, color, created_at FROM products ORDER BY name';
        const { results } = await env.DB.prepare(productQuery).all();
        const products = (results || []).map((product: any) => ({ ...product, image: product.image_url }));
        return HttpResponse.json(isPublic ? products : { products });
    }

    private static async publicProductByPath(rawPath: string, url: URL, env: Env): Promise<Response> {
        const parts = rawPath.split('/').map(decodeURIComponent);
        let query = 'SELECT * FROM products WHERE in_stock = 1';
        const values: string[] = [];
        if (parts[0] === 'slug') { query += ' AND slug = ?'; values.push(parts.slice(1).join('/')); }
        else if (parts[0] === 'brand' && parts[2] === 'category') { query += ' AND brand = ? AND category = ?'; values.push(parts[1], parts.slice(3).join('/')); }
        else if (parts[0] === 'brand' && parts[2] === 'categories') {
            const result = await env.DB.prepare('SELECT DISTINCT category FROM products WHERE in_stock = 1 AND brand = ? ORDER BY category').bind(parts[1]).all();
            return HttpResponse.json((result.results || []).map((row: any) => row.category));
        }
        else if (parts[0] === 'brand') { query += ' AND brand = ?'; values.push(parts.slice(1).join('/')); }
        else if (parts[0] === 'category') { query += ' AND category = ?'; values.push(parts.slice(1).join('/')); }
        else if (parts[0] === 'brands') {
            const result = await env.DB.prepare('SELECT DISTINCT brand FROM products WHERE in_stock = 1 ORDER BY brand').all();
            return HttpResponse.json((result.results || []).map((row: any) => row.brand));
        } else if (parts[0] === 'shop' && parts[1] === 'dropdown') {
            const result = await env.DB.prepare('SELECT DISTINCT brand, category FROM products WHERE in_stock = 1 ORDER BY brand, category').all();
            return HttpResponse.json(result.results || []);
        }
        const result = await env.DB.prepare(query).bind(...values).all();
        const products = (result.results || []).map((item: any) => ({ ...item, image: item.image_url }));
        return parts[0] === 'slug' ? (products[0] ? HttpResponse.json(products[0]) : notFound('Product')) : HttpResponse.json(products);
    }

    private static async productByPath(request: Request, env: Env, rawPath: string, url: URL): Promise<Response> {
        if (rawPath === 'brands/list' && request.method === 'GET') {
            const denied = await this.authorized(request, env);
            if (denied) return denied;
            const result = await env.DB.prepare('SELECT DISTINCT brand FROM products ORDER BY brand').all();
            return HttpResponse.json((result.results || []).map((row: any) => row.brand));
        }
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        if (request.method === 'POST') return this.createProduct(request, env);
        const parts = rawPath.split('/').map(decodeURIComponent);
        if (parts[0] === 'shop' && parts[1] === 'dropdown') {
            const result = await env.DB.prepare('SELECT DISTINCT brand, category FROM products ORDER BY brand, category').all();
            return HttpResponse.json(result.results || []);
        }
        if (parts[0] === 'brand' && parts[2] === 'categories' && parts[3] === 'list') {
            const result = await env.DB.prepare('SELECT DISTINCT category FROM products WHERE brand = ? ORDER BY category').bind(parts[1]).all();
            return HttpResponse.json((result.results || []).map((row: any) => row.category));
        }
        if (parts[0] === 'brand' && parts[2] === 'category') {
            const result = await env.DB.prepare('SELECT *, image_url AS image FROM products WHERE brand = ? AND category = ? ORDER BY name').bind(parts[1], parts.slice(3).join('/')).all();
            return HttpResponse.json(result.results || []);
        }
        if (parts[0] === 'brand' || parts[0] === 'category') {
            const field = parts[0];
            const result = await env.DB.prepare(`SELECT *, image_url AS image FROM products WHERE ${field} = ? ORDER BY name`).bind(parts.slice(1).join('/')).all();
            return HttpResponse.json(result.results || []);
        }
        if (parts[0] === 'slug') {
            const product = await env.DB.prepare('SELECT *, image_url AS image FROM products WHERE slug = ?').bind(parts.slice(1).join('/')).first();
            return product ? HttpResponse.json(product) : notFound('Product');
        }
        const [id] = parts;
        if (request.method === 'GET') {
            const product = await env.DB.prepare('SELECT *, image_url AS image FROM products WHERE id = ?').bind(id).first();
            return product ? HttpResponse.json(product) : notFound('Product');
        }
        if (request.method === 'PUT') return this.updateProduct(request, env, id);
        if (request.method === 'DELETE') {
            const result = await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Product');
        }
        return HttpResponse.error('Method not allowed', 405);
    }

    private static async createProduct(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const body = await jsonBody(request);
        if (!body.name || !body.slug) return HttpResponse.error('Name and slug are required', 400);
        const id = crypto.randomUUID();
        await env.DB.prepare('INSERT INTO products (id, slug, name, brand, category, price, original_price, discount, description, image_url, in_stock, specifications, features, warranty, sku, dimensions, weight, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(id, body.slug, body.name, body.brand || '', body.category || '', Number(body.price) || 0, body.original_price ?? body.originalPrice ?? null, body.discount ?? null, body.description || '', body.image || body.image_url || '', body.in_stock === false ? 0 : 1, body.specifications || null, body.features || null, body.warranty || null, body.sku || null, body.dimensions || null, body.weight || null, body.color || null).run();
        return HttpResponse.json({ ...body, id, image: body.image || body.image_url || '' });
    }

    private static async updateProduct(request: Request, env: Env, id: string): Promise<Response> {
        const body = await jsonBody(request);
        const fields: Record<string, string> = { name: 'name', slug: 'slug', brand: 'brand', category: 'category', price: 'price', originalPrice: 'original_price', original_price: 'original_price', discount: 'discount', description: 'description', image: 'image_url', image_url: 'image_url', in_stock: 'in_stock', specifications: 'specifications', features: 'features', warranty: 'warranty', sku: 'sku', dimensions: 'dimensions', weight: 'weight', color: 'color' };
        const updates = Object.entries(body).filter(([key]) => fields[key]);
        if (!updates.length) return HttpResponse.error('No valid product fields provided', 400);
        const result = await env.DB.prepare(`UPDATE products SET ${updates.map(([key]) => `${fields[key]} = ?`).join(', ')} WHERE id = ?`)
            .bind(...updates.map(([key, value]) => key === 'in_stock' ? (value ? 1 : 0) : value), id).run();
        return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Product');
    }

    private static async getUsers(request: Request, env: Env, url: URL): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const status = url.searchParams.get('status');
        const query = 'SELECT id, name, email, phone, role, status, created_at FROM users' + (status ? ' WHERE status = ?' : '') + ' ORDER BY created_at DESC';
        const result = status ? await env.DB.prepare(query).bind(status).all() : await env.DB.prepare(query).all();
        return HttpResponse.json(result.results || []);
    }

    private static async listFirebaseUsers(request: Request, env: Env, url: URL): Promise<Response> {
        const access = await requireSectionRead(request, env, 'users');
        if (access instanceof Response) return access;

        try {
            const accessToken = await getFirebaseAdminAccessToken(env);
            const params = new URLSearchParams({ maxResults: '1000' });
            const nextPageToken = url.searchParams.get('nextPageToken');
            if (nextPageToken) params.set('nextPageToken', nextPageToken);
            const projectId = env.FIREBASE_PROJECT_ID || 'ccj-web';
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/accounts:batchGet?${params}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!response.ok) {
                const apiError = await response.json().catch(() => ({})) as { error?: { status?: string } };
                const category = response.status === 403
                    ? 'FIREBASE_ADMIN_PERMISSION_DENIED'
                    : response.status === 404
                        ? 'FIREBASE_PROJECT_OR_API_NOT_FOUND'
                        : 'FIREBASE_ACCOUNT_LIST_FAILED';
                console.error(JSON.stringify({ message: 'Firebase account listing failed', status: response.status, category, googleStatus: apiError.error?.status }));
                if (response.status === 403) return HttpResponse.error('Firebase service account is authenticated but lacks Firebase Authentication user-list permission. Grant firebaseauth.users.get (Firebase Authentication Viewer) in project ccj-web.', 502);
                if (response.status === 404) return HttpResponse.error('Firebase project/API not found. Check that Firebase Authentication is enabled for project ccj-web and that the Worker project ID is correct.', 502);
                return HttpResponse.error('Firebase Auth user listing failed. Check the Worker logs for the Firebase error category.', 502);
            }

            const result = await response.json() as { users?: Array<Record<string, any>>; nextPageToken?: string };
            const [employees, applicationUsers] = await Promise.all([
                env.DB.prepare('SELECT firebase_uid, email, status FROM employees').all(),
                env.DB.prepare('SELECT firebase_uid, email, status, role, permissions_json FROM application_users').all(),
            ]);
            const byUid = new Set((employees.results || []).filter((employee: any) => employee.status === 'active' && employee.firebase_uid).map((employee: any) => employee.firebase_uid));
            const byEmail = new Set((employees.results || []).filter((employee: any) => employee.status === 'active').map((employee: any) => String(employee.email).toLowerCase()));
            const appUserByUid = new Map<string, Record<string, any>>((applicationUsers.results || []).filter((applicationUser: any) => applicationUser.firebase_uid).map((applicationUser: any) => [applicationUser.firebase_uid, applicationUser]));
            const appUserByEmail = new Map<string, Record<string, any>>((applicationUsers.results || []).map((applicationUser: any) => [String(applicationUser.email).toLowerCase(), applicationUser]));
            const users = (result.users || []).map((user) => ({
                id: user.localId,
                name: user.displayName || user.email?.split('@')[0] || 'Firebase user',
                email: user.email || '',
                phone: user.phoneNumber || '',
                photoURL: user.photoUrl || '',
                role: appUserByUid.get(user.localId)?.role || appUserByEmail.get(String(user.email || '').toLowerCase())?.role || 'user',
                status: user.disabled ? 'inactive' : 'active',
                createdAt: user.createdAt ? new Date(Number(user.createdAt)).toISOString() : '',
                isEmployee: byUid.has(user.localId) || byEmail.has(String(user.email || '').toLowerCase()),
                applicationAccess: appUserByUid.get(user.localId)?.status || appUserByEmail.get(String(user.email || '').toLowerCase())?.status || 'not_registered',
                permissions: parseSectionPermissions(appUserByUid.get(user.localId)?.permissions_json || appUserByEmail.get(String(user.email || '').toLowerCase())?.permissions_json),
            }));
            return HttpResponse.json({ users, nextPageToken: result.nextPageToken || null });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (message.includes('not configured')) return HttpResponse.error(message, 503);
            if (message === 'FIREBASE_ADMIN_CREDENTIALS_REJECTED') {
                console.error(JSON.stringify({ message: 'Firebase service-account credentials rejected by Google', category: message }));
                return HttpResponse.error('Firebase service-account credentials were rejected. Verify FIREBASE_CLIENT_EMAIL matches the uploaded private key and that the key is active.', 503);
            }
            if (message === 'FIREBASE_ADMIN_TOKEN_EXCHANGE_FAILED') {
                console.error(JSON.stringify({ message: 'Firebase service-account token exchange failed', category: message }));
                return HttpResponse.error('Unable to exchange Firebase service-account credentials for an access token. Check the Worker secrets and service-account key status.', 503);
            }
            if (message === 'FIREBASE_ADMIN_PRIVATE_KEY_FORMAT_INVALID') {
                console.error(JSON.stringify({ message: 'Firebase private key secret is not a valid PEM or service-account JSON', category: message }));
                return HttpResponse.error('FIREBASE_PRIVATE_KEY must contain the complete PEM private key, including BEGIN/END lines, or the complete service-account JSON file.', 503);
            }
            if (message === 'FIREBASE_ADMIN_PRIVATE_KEY_INVALID_PKCS8') {
                console.error(JSON.stringify({ message: 'Firebase private key is not a PKCS8 key', category: message }));
                return HttpResponse.error('The Firebase private key is not a PKCS8 service-account key. Upload the private_key value from a Google service-account JSON file.', 503);
            }
            if (message === 'FIREBASE_ADMIN_SERVICE_ACCOUNT_MISMATCH') {
                console.error(JSON.stringify({ message: 'Firebase service-account email does not match the credential JSON', category: message }));
                return HttpResponse.error('FIREBASE_CLIENT_EMAIL must match the client_email in the service-account JSON file.', 503);
            }
            console.error(JSON.stringify({ message: 'Firebase user list request failed', category: 'FIREBASE_ADMIN_REQUEST_FAILED' }));
            return HttpResponse.error('Firebase Admin request failed before the account list was retrieved. Check Worker logs for FIREBASE_ADMIN_REQUEST_FAILED.', 502);
        }
    }

    private static async setFirebaseUserAccess(request: Request, env: Env, uid: string): Promise<Response> {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;

        const { status } = await jsonBody(request);
        if (!['active', 'inactive'].includes(status)) return HttpResponse.error('Access status must be active or inactive.', 400);
        if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
            return HttpResponse.error('Firebase Admin credentials are not configured on the backend.', 503);
        }

        let firebaseUser;
        try {
            firebaseUser = await withFirebaseAdminAuth({
                projectId: env.FIREBASE_PROJECT_ID || 'ccj-web',
                clientEmail: env.FIREBASE_CLIENT_EMAIL,
                privateKey: env.FIREBASE_PRIVATE_KEY,
            }, (firebaseAuth) => firebaseAuth.getUser(uid));
        } catch (error) {
            const code = (error as { code?: string }).code;
            if (code === 'auth/user-not-found') return notFound('Firebase user');
            console.error(JSON.stringify({ message: 'Firebase account lookup for access management failed', code: code || 'unknown' }));
            return HttpResponse.error('Unable to verify the Firebase account. Retry after checking backend credentials.', 502);
        }

        const firebaseEmail = firebaseUser.email?.trim().toLowerCase();
        if (!firebaseEmail) return HttpResponse.error('This Firebase account has no email address and cannot be granted email-based application access.', 400);

        const linkedRows = await env.DB.prepare(`
            SELECT id, firebase_uid, email FROM application_users
            WHERE email = ? COLLATE NOCASE OR firebase_uid = ?
        `).bind(firebaseEmail, firebaseUser.uid).all();
        const emailRow = (linkedRows.results || []).find((row: any) => String(row.email).toLowerCase() === firebaseEmail);
        const uidRow = (linkedRows.results || []).find((row: any) => row.firebase_uid === firebaseUser.uid);

        if (emailRow && uidRow && emailRow.id !== uidRow.id) {
            return HttpResponse.error('The Firebase account and application email are attached to separate database records. Reconcile those records before changing access.', 409);
        }

        const row = emailRow || uidRow;
        if (row) {
            await env.DB.prepare(`
                UPDATE application_users
                SET firebase_uid = ?, email = ?, name = ?, phone = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(firebaseUser.uid, firebaseEmail, firebaseUser.displayName || firebaseEmail.split('@')[0], firebaseUser.phoneNumber || '', status, row.id).run();
        } else if (status === 'active') {
            await env.DB.prepare(`
                INSERT INTO application_users (id, firebase_uid, name, email, phone, role, status)
                VALUES (?, ?, ?, ?, ?, 'user', 'active')
            `).bind(crypto.randomUUID(), firebaseUser.uid, firebaseUser.displayName || firebaseEmail.split('@')[0], firebaseEmail, firebaseUser.phoneNumber || '').run();
        } else {
            return notFound('Application user');
        }

        return HttpResponse.json({ success: true, applicationAccess: status });
    }

    private static async setFirebaseUserRole(request: Request, env: Env, uid: string): Promise<Response> {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;

        const { role } = await jsonBody(request);
        if (!['admin', 'user'].includes(role)) return HttpResponse.error('Role must be admin or user.', 400);
        if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
            return HttpResponse.error('Firebase Admin credentials are not configured on the backend.', 503);
        }

        let firebaseUser;
        try {
            firebaseUser = await withFirebaseAdminAuth({
                projectId: env.FIREBASE_PROJECT_ID || 'ccj-web',
                clientEmail: env.FIREBASE_CLIENT_EMAIL,
                privateKey: env.FIREBASE_PRIVATE_KEY,
            }, (firebaseAuth) => firebaseAuth.getUser(uid));
        } catch (error) {
            const code = (error as { code?: string }).code;
            if (code === 'auth/user-not-found') return notFound('Firebase user');
            console.error(JSON.stringify({ message: 'Firebase account lookup for role management failed', code: code || 'unknown' }));
            return HttpResponse.error('Unable to verify the Firebase account. Retry after checking backend credentials.', 502);
        }

        if (!firebaseUser.email) return HttpResponse.error('A Firebase user needs an email before application access can be assigned.', 400);
        const email = firebaseUser.email.trim().toLowerCase();
        const linkedRows = await env.DB.prepare(`
            SELECT id, firebase_uid, email, role FROM application_users
            WHERE email = ? COLLATE NOCASE OR firebase_uid = ?
        `).bind(email, firebaseUser.uid).all();
        const emailRow = (linkedRows.results || []).find((row: any) => String(row.email).toLowerCase() === email);
        const uidRow = (linkedRows.results || []).find((row: any) => row.firebase_uid === firebaseUser.uid);
        if (emailRow && uidRow && emailRow.id !== uidRow.id) {
            return HttpResponse.error('This Firebase account and email are attached to separate application records. Reconcile them before changing the role.', 409);
        }

        const existingRow = emailRow || uidRow;
        if (role === 'user') {
            const otherAdmins = await env.DB.prepare(`
                SELECT COUNT(*) AS total FROM application_users
                WHERE role = 'admin' AND status = 'active'
                AND email != ? COLLATE NOCASE
            `).bind(email).first() as { total?: number } | null;
            if (!Number(otherAdmins?.total || 0)) {
                return HttpResponse.error('The last active admin cannot be changed to a user. Promote another account first.', 409);
            }
        }

        if (existingRow) {
            await env.DB.prepare(`
                UPDATE application_users
                SET firebase_uid = ?, name = ?, email = ?, phone = ?, role = ?, status = 'active', updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(firebaseUser.uid, firebaseUser.displayName || email.split('@')[0], email, firebaseUser.phoneNumber || '', role, existingRow.id).run();
        } else {
            await env.DB.prepare(`
                INSERT INTO application_users (id, firebase_uid, name, email, phone, role, status)
                VALUES (?, ?, ?, ?, ?, ?, 'active')
            `).bind(crypto.randomUUID(), firebaseUser.uid, firebaseUser.displayName || email.split('@')[0], email, firebaseUser.phoneNumber || '', role).run();
        }

        return HttpResponse.json({ success: true, role });
    }

    private static async setFirebaseUserPermissions(request: Request, env: Env, uid: string): Promise<Response> {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;

        const body = await jsonBody(request);
        if (!uid || !body.permissions || typeof body.permissions !== 'object' || Array.isArray(body.permissions)) {
            return HttpResponse.error('A section permission map is required.', 400);
        }

        const permissions = parseSectionPermissions(body.permissions);
        if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
            return HttpResponse.error('Firebase Admin credentials are not configured on the backend.', 503);
        }
        let firebaseUser;
        try {
            firebaseUser = await withFirebaseAdminAuth({
                projectId: env.FIREBASE_PROJECT_ID || 'ccj-web',
                clientEmail: env.FIREBASE_CLIENT_EMAIL,
                privateKey: env.FIREBASE_PRIVATE_KEY,
            }, (firebaseAuth) => firebaseAuth.getUser(uid));
        } catch (error) {
            const code = (error as { code?: string }).code;
            if (code === 'auth/user-not-found') return notFound('Firebase user');
            console.error(JSON.stringify({ message: 'Firebase account lookup for permission update failed', code: code || 'unknown' }));
            return HttpResponse.error('Unable to verify the Firebase account. Retry after checking backend credentials.', 502);
        }
        if (!firebaseUser.email) return HttpResponse.error('This Firebase account needs an email before section permissions can be saved.', 400);
        const email = firebaseUser.email.trim().toLowerCase();
        const rows = await env.DB.prepare(`
            SELECT id, firebase_uid, email FROM application_users
            WHERE email = ? COLLATE NOCASE OR firebase_uid = ?
        `).bind(email, firebaseUser.uid).all();
        const emailRow = (rows.results || []).find((row: any) => String(row.email).toLowerCase() === email);
        const uidRow = (rows.results || []).find((row: any) => row.firebase_uid === firebaseUser.uid);
        if (emailRow && uidRow && emailRow.id !== uidRow.id) {
            return HttpResponse.error('This Firebase account and email are attached to separate application records. Reconcile them before updating permissions.', 409);
        }

        const existingRow = emailRow || uidRow;
        if (existingRow) {
            await env.DB.prepare(`
                UPDATE application_users
                SET firebase_uid = ?, email = ?, permissions_json = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(firebaseUser.uid, email, JSON.stringify(permissions), existingRow.id).run();
        } else {
            await env.DB.prepare(`
                INSERT INTO application_users (id, firebase_uid, name, email, phone, role, status, permissions_json)
                VALUES (?, ?, ?, ?, ?, 'user', 'inactive', ?)
            `).bind(crypto.randomUUID(), firebaseUser.uid, firebaseUser.displayName || email.split('@')[0], email, firebaseUser.phoneNumber || '', JSON.stringify(permissions)).run();
        }

        return HttpResponse.json({ success: true, permissions });
    }

    private static async setFirebaseUserEmployee(request: Request, env: Env, uid: string): Promise<Response> {
        const admin = await requireAdmin(request, env);
        if (admin instanceof Response) return admin;
        const body = await jsonBody(request);
        if (!uid || !body.email || typeof body.isEmployee !== 'boolean') return HttpResponse.error('Firebase UID, email, and employee selection are required', 400);

        if (!body.isEmployee) {
            const existing = await env.DB.prepare('SELECT id FROM employees WHERE firebase_uid = ? OR (firebase_uid IS NULL AND email = ? COLLATE NOCASE)').bind(uid, body.email).first();
            if (!existing) return HttpResponse.json({ success: true, isEmployee: false });
            await env.DB.prepare("UPDATE employees SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(existing.id).run();
            return HttpResponse.json({ success: true, isEmployee: false });
        }

        const existing = await env.DB.prepare('SELECT id FROM employees WHERE firebase_uid = ? OR email = ? COLLATE NOCASE').bind(uid, body.email).first();
        if (existing) {
            await env.DB.prepare("UPDATE employees SET firebase_uid = ?, name = ?, phone = ?, status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
                .bind(uid, body.name || 'Firebase user', body.phone || '', existing.id).run();
            return HttpResponse.json({ success: true, isEmployee: true });
        }

        const employeeId = `CCJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const id = crypto.randomUUID();
        const createdDate = body.createdAt ? new Date(body.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        await env.DB.prepare('INSERT INTO employees (id, employee_id, firebase_uid, name, email, phone, position, department, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(id, employeeId, uid, body.name || 'Firebase user', body.email, body.phone || '', body.position || 'Staff', body.department || 'General', createdDate, 'active').run();
        return HttpResponse.json({ success: true, isEmployee: true, employeeId: id });
    }

    private static async createUser(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const body = await jsonBody(request);
        if (!body.name || !body.email || !body.password || body.password.length < 6) return HttpResponse.error('Name, email, and password (at least 6 characters) are required', 400);
        const id = crypto.randomUUID();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const passwordSalt = Array.from(salt, (byte) => byte.toString(16).padStart(2, '0')).join('');
        const passwordHash = await hashPassword(body.password, salt);
        await env.DB.prepare('INSERT INTO users (id, name, email, phone, role, password_hash, password_salt) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .bind(id, body.name, body.email, body.phone || '', body.role || 'user', passwordHash, passwordSalt).run();
        return HttpResponse.json({ id, name: body.name, email: body.email, phone: body.phone || '', role: body.role || 'user', status: 'active', created_at: new Date().toISOString() });
    }

    private static async provisionFirebaseUser(request: Request, env: Env): Promise<Response> {
        const access = await requireSectionAccess(request, env, 'users', 'write');
        if (access instanceof Response) return access;

        const body = await jsonBody(request);
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = typeof body.password === 'string' ? body.password : '';
        const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
        if (!name || !email || !password || !phone) return HttpResponse.error('Full name, email, password, and phone number are required.', 400);
        if (password.length < 6) return HttpResponse.error('Password must be at least 6 characters.', 400);
        if (!/^\+[1-9]\d{7,14}$/.test(phone)) return HttpResponse.error('Enter the phone number in international format, for example +14155552671.', 400);
        if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
            return HttpResponse.error('Firebase Admin credentials are not configured on the backend.', 503);
        }

        let firebaseUser;
        let alreadyExisted = false;
        const isAllowlistedAdmin = (env.ADMIN_EMAILS || '').split(',')
            .map((allowedEmail) => allowedEmail.trim().toLowerCase())
            .includes(email);
        try {
            firebaseUser = await withFirebaseAdminAuth({
                projectId: env.FIREBASE_PROJECT_ID || 'ccj-web',
                clientEmail: env.FIREBASE_CLIENT_EMAIL,
                privateKey: env.FIREBASE_PRIVATE_KEY,
            }, async (firebaseAuth) => {
                try {
                    const existing = await firebaseAuth.getUserByEmail(email);
                    alreadyExisted = true;
                    return firebaseAuth.updateUser(existing.uid, {
                        displayName: name,
                        phoneNumber: phone,
                        ...(isAllowlistedAdmin ? { emailVerified: true } : {}),
                    });
                } catch (error) {
                    const code = (error as { code?: string }).code;
                    if (code === 'auth/email-already-exists') {
                        const racedUser = await firebaseAuth.getUserByEmail(email);
                        alreadyExisted = true;
                        return firebaseAuth.updateUser(racedUser.uid, {
                            displayName: name,
                            phoneNumber: phone,
                            ...(isAllowlistedAdmin ? { emailVerified: true } : {}),
                        });
                    }
                    if (code !== 'auth/user-not-found') throw error;
                    return await firebaseAuth.createUser({
                        email,
                        password,
                        displayName: name,
                        phoneNumber: phone,
                        emailVerified: isAllowlistedAdmin,
                    });
                }
            });
        } catch (error) {
            const code = (error as { code?: string }).code;
            if (code === 'auth/email-already-exists') {
                return HttpResponse.error('An account with this email already exists. Refresh the Users list and retry to link its application access.', 409);
            }
            console.error(JSON.stringify({ message: 'Firebase Admin user provisioning failed', code: code || 'unknown' }));
            return HttpResponse.error('Firebase could not create or find the account. Check backend Firebase Admin credentials and permissions, then retry.', 502);
        }

        try {
            const firebaseEmail = firebaseUser.email?.trim().toLowerCase();
            if (!firebaseEmail || firebaseEmail !== email) {
                return HttpResponse.error('Firebase returned an account with a different email. No application access was changed.', 409);
            }

            const linkedRows = await env.DB.prepare(`
                SELECT id, firebase_uid, email FROM application_users
                WHERE email = ? COLLATE NOCASE OR firebase_uid = ?
            `).bind(email, firebaseUser.uid).all();
            const emailRow = (linkedRows.results || []).find((row: any) => String(row.email).toLowerCase() === email);
            const uidRow = (linkedRows.results || []).find((row: any) => row.firebase_uid === firebaseUser.uid);

            if (emailRow && uidRow && emailRow.id !== uidRow.id) {
                return HttpResponse.error('The Firebase account and application email are attached to separate database records. Ask an administrator to reconcile those records before retrying.', 409);
            }

            const row = emailRow || uidRow;
            if (row) {
                await env.DB.prepare(`
                    UPDATE application_users
                    SET firebase_uid = ?, name = ?, email = ?, phone = ?, status = 'active', updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).bind(firebaseUser.uid, name, email, phone, row.id).run();
            } else {
                await env.DB.prepare(`
                    INSERT INTO application_users (id, firebase_uid, name, email, phone, role, status)
                    VALUES (?, ?, ?, ?, ?, 'user', 'active')
                `).bind(crypto.randomUUID(), firebaseUser.uid, name, email, phone).run();
            }
        } catch (error) {
            console.error(JSON.stringify({ message: 'Application user record could not be saved after Firebase provisioning', uid: firebaseUser.uid }));
            return HttpResponse.error('Firebase account exists, but application access was not saved. Retry Create User with the same email and password to safely complete registration; an existing Firebase password is never changed by a retry.', 503);
        }

        return HttpResponse.json({
            success: true,
            user: { id: firebaseUser.uid, name, email, phone, role: 'user', status: 'active' },
            recoveredExistingFirebaseAccount: alreadyExisted,
        }, alreadyExisted ? 200 : 201);
    }

    private static async userByPath(request: Request, env: Env, rawPath: string): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const [id, action] = rawPath.split('/').map(decodeURIComponent);
        if (action === 'password' && request.method === 'PUT') {
            const { password } = await jsonBody(request);
            if (!password || password.length < 6) return HttpResponse.error('Password must be at least 6 characters', 400);
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const encodedSalt = Array.from(salt, (byte) => byte.toString(16).padStart(2, '0')).join('');
            const result = await env.DB.prepare('UPDATE users SET password_hash = ?, password_salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(await hashPassword(password, salt), encodedSalt, id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('User');
        }
        if (action === 'status' && request.method === 'PUT') {
            const { status } = await jsonBody(request);
            if (!['active', 'inactive'].includes(status)) return HttpResponse.error('Invalid user status', 400);
            const result = await env.DB.prepare('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(status, id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('User');
        }
        if (request.method === 'PUT') {
            const body = await jsonBody(request);
            const result = await env.DB.prepare('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), role = COALESCE(?, role), updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                .bind(body.name ?? null, body.email ?? null, body.phone ?? null, body.role ?? null, id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('User');
        }
        if (request.method === 'DELETE') {
            const result = await env.DB.prepare("UPDATE users SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('User');
        }
        if (request.method === 'GET') {
            const user = await env.DB.prepare('SELECT id, name, email, phone, role, status, created_at FROM users WHERE id = ?').bind(id).first();
            return user ? HttpResponse.json(user) : notFound('User');
        }
        return HttpResponse.error('Method not allowed', 405);
    }

    private static async getEmployees(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const result = await env.DB.prepare('SELECT * FROM employees ORDER BY name').all();
        return HttpResponse.json(result.results || []);
    }

    private static async createEmployee(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const body = await jsonBody(request);
        if (!body.name || !body.email) return HttpResponse.error('Name and email are required', 400);
        const row = await this.insertEmployee(env, body);
        return HttpResponse.json(row);
    }

    private static async insertEmployee(env: Env, body: Record<string, any>): Promise<Record<string, any>> {
        const id = crypto.randomUUID();
        const count = await env.DB.prepare('SELECT COUNT(*) AS count FROM employees').first();
        const employeeId = `CCJ-${String(Number(count?.count || 0) + 1).padStart(2, '0')}`;
        const hireDate = body.hire_date || body.hireDate || new Date().toISOString().slice(0, 10);
        await env.DB.prepare('INSERT INTO employees (id, employee_id, name, email, phone, position, department, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(id, employeeId, body.name, body.email, body.phone || '', body.position || '', body.department || '', hireDate, body.status || 'active').run();
        return { ...body, id, employee_id: employeeId, hire_date: hireDate, status: body.status || 'active' };
    }

    private static async employeeByPath(request: Request, env: Env, rawPath: string): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        if (rawPath === 'sync-users' && request.method === 'POST') return this.syncUsers(request, env);
        if (rawPath.startsWith('email/')) {
            const email = decodeURIComponent(rawPath.slice(6));
            const employee = await env.DB.prepare('SELECT * FROM employees WHERE email = ? COLLATE NOCASE').bind(email).first();
            return employee ? HttpResponse.json(employee) : notFound('Employee');
        }
        const [id] = rawPath.split('/').map(decodeURIComponent);
        if (request.method === 'GET') {
            const employee = await env.DB.prepare('SELECT * FROM employees WHERE id = ?').bind(id).first();
            return employee ? HttpResponse.json(employee) : notFound('Employee');
        }
        if (request.method === 'PUT') {
            const body = await jsonBody(request);
            const values = [body.name ?? null, body.email ?? null, body.phone ?? null, body.position ?? null, body.department ?? null, body.hire_date ?? body.hireDate ?? null, body.status ?? null, id];
            const result = await env.DB.prepare('UPDATE employees SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), position = COALESCE(?, position), department = COALESCE(?, department), hire_date = COALESCE(?, hire_date), status = COALESCE(?, status), updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(...values).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Employee');
        }
        if (request.method === 'DELETE') {
            const result = await env.DB.prepare('DELETE FROM employees WHERE id = ?').bind(id).run();
            return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Employee');
        }
        return HttpResponse.error('Method not allowed', 405);
    }

    private static async syncUsers(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const users = await env.DB.prepare("SELECT name, email, phone, created_at FROM users WHERE status = 'active'").all();
        let created = 0;
        let updated = 0;
        const errors: string[] = [];
        for (const user of users.results || []) {
            try {
                const existing = await env.DB.prepare('SELECT id FROM employees WHERE email = ? COLLATE NOCASE').bind(user.email).first();
                if (existing) {
                    await env.DB.prepare('UPDATE employees SET name = ?, phone = ?, status = \'active\', updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(user.name, user.phone || '', existing.id).run();
                    updated++;
                } else {
                    await this.insertEmployee(env, { ...user, position: 'Staff', department: 'General', hire_date: String(user.created_at || '').slice(0, 10), status: 'active' });
                    created++;
                }
            } catch (error) {
                errors.push(`${user.email}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        return HttpResponse.json({ created, updated, errors });
    }

    private static async getAttendance(request: Request, env: Env, url: URL): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const employeeId = url.searchParams.get('employee_id');
        const result = employeeId
            ? await env.DB.prepare('SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC').bind(employeeId).all()
            : await env.DB.prepare('SELECT * FROM attendance ORDER BY date DESC').all();
        return HttpResponse.json(result.results || []);
    }

    private static async createAttendance(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        const body = await jsonBody(request);
        if (!body.employee_id || !body.date) return HttpResponse.error('Employee and date are required', 400);
        const existing = await env.DB.prepare('SELECT id FROM attendance WHERE employee_id = ? AND date = ?').bind(body.employee_id, body.date).first();
        const id = existing?.id || crypto.randomUUID();
        await env.DB.prepare('INSERT INTO attendance (id, employee_id, date, check_in, check_out, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(employee_id, date) DO UPDATE SET check_in = excluded.check_in, check_out = excluded.check_out, status = excluded.status, notes = excluded.notes')
            .bind(id, body.employee_id, body.date, body.check_in || null, body.check_out || null, body.status || 'present', body.notes || null).run();
        return HttpResponse.json({ ...body, id });
    }

    private static async deleteAttendance(request: Request, env: Env, id: string): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        if (request.method !== 'DELETE') return HttpResponse.error('Method not allowed', 405);
        const result = await env.DB.prepare('DELETE FROM attendance WHERE id = ?').bind(decodeURIComponent(id)).run();
        return result.meta.changes ? HttpResponse.json({ success: true }) : notFound('Attendance record');
    }

    private static async getProfile(request: Request, env: Env): Promise<Response> {
        const access = await requireApplicationUser(request, env);
        return access instanceof Response ? access : HttpResponse.json({
            id: access.user.uid,
            name: access.applicationUser.name || access.user.name,
            email: access.applicationUser.email,
            phone: access.applicationUser.phone,
            photoURL: access.user.photoURL,
            role: access.applicationUser.role,
            status: access.applicationUser.status,
            permissions: access.applicationUser.role === 'admin'
                ? adminSectionPermissions()
                : parseSectionPermissions(access.applicationUser.permissions_json),
        });
    }

    private static async uploadFile(request: Request, env: Env): Promise<Response> {
        const formData = await request.formData();
        const file = formData.get('file');
        if (!(file instanceof File)) return HttpResponse.error('No file uploaded', 400);
        if (file.size > 5 * 1024 * 1024) return HttpResponse.error('File must be 5 MB or smaller', 413);
        const fileName = `${crypto.randomUUID()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        await env.STORAGE.put(fileName, file.stream(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } });
        const fileUrl = new URL(`/api/storage/${encodeURIComponent(fileName)}`, request.url).toString();
        return HttpResponse.json({ success: true, fileName, url: fileUrl });
    }

    private static async ensureAssetsTable(env: Env): Promise<void> {
        try {
            await env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS assets (
                    id TEXT PRIMARY KEY,
                    date TEXT NOT NULL,
                    bill_no TEXT NOT NULL,
                    movement TEXT NOT NULL CHECK(movement IN ('Purchase', 'Sales')),
                    item TEXT NOT NULL,
                    category TEXT NOT NULL,
                    qty INTEGER NOT NULL CHECK(qty > 0),
                    unit_amount REAL NOT NULL CHECK(unit_amount >= 0),
                    total_amount REAL NOT NULL CHECK(total_amount >= 0),
                    vendor TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'Completed',
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `).run();
        } catch {}
    }

    private static async getAssets(request: Request, env: Env, url: URL): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        await this.ensureAssetsTable(env);

        const movement = url.searchParams.get('movement');
        const category = url.searchParams.get('category');
        const status = url.searchParams.get('status');
        const search = url.searchParams.get('search');

        let query = 'SELECT * FROM assets WHERE 1=1';
        const params: any[] = [];

        if (movement && movement !== 'all') {
            query += ' AND movement = ?';
            params.push(movement);
        }
        if (category && category !== 'all') {
            query += ' AND category = ?';
            params.push(category);
        }
        if (status && status !== 'all') {
            query += ' AND status = ?';
            params.push(status);
        }
        if (search && search.trim()) {
            query += ' AND (item LIKE ? OR bill_no LIKE ? OR vendor LIKE ?)';
            const term = `%${search.trim()}%`;
            params.push(term, term, term);
        }

        query += ' ORDER BY date DESC, created_at DESC';

        try {
            const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query);
            const result = await stmt.all();
            return HttpResponse.json(result.results || []);
        } catch {
            return HttpResponse.json([]);
        }
    }

    private static async createAsset(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        await this.ensureAssetsTable(env);

        const body = await jsonBody(request);
        const { date, bill_no, movement, item, category, qty, unit_amount, total_amount, vendor, status, notes } = body;

        if (!date || !bill_no || !movement || !item || !category || qty === undefined || unit_amount === undefined || !vendor) {
            return HttpResponse.error('Date, bill number, movement, item, category, qty, unit amount, and vendor are required', 400);
        }

        const parsedQty = Math.max(1, parseInt(String(qty), 10) || 1);
        const parsedUnitAmount = Math.max(0, parseFloat(String(unit_amount)) || 0);
        const calculatedTotal = total_amount !== undefined && total_amount !== null && !isNaN(Number(total_amount))
            ? Math.max(0, Number(total_amount))
            : (parsedQty * parsedUnitAmount);
        const id = body.id || `ast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        await env.DB.prepare(`
            INSERT INTO assets (id, date, bill_no, movement, item, category, qty, unit_amount, total_amount, vendor, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            String(date).slice(0, 10),
            String(bill_no).trim(),
            movement === 'Sales' ? 'Sales' : 'Purchase',
            String(item).trim(),
            String(category).trim(),
            parsedQty,
            parsedUnitAmount,
            calculatedTotal,
            String(vendor).trim(),
            String(status || 'Completed').trim(),
            notes ? String(notes).trim() : null
        ).run();

        const created = await env.DB.prepare('SELECT * FROM assets WHERE id = ?').bind(id).first();
        return HttpResponse.json(created || { success: true, id }, 201);
    }

    private static async assetById(request: Request, env: Env, id: string): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        await this.ensureAssetsTable(env);
        const decodedId = decodeURIComponent(id);

        if (request.method === 'GET') {
            const asset = await env.DB.prepare('SELECT * FROM assets WHERE id = ?').bind(decodedId).first();
            return asset ? HttpResponse.json(asset) : notFound('Asset entry');
        }

        if (request.method === 'PUT') {
            const body = await jsonBody(request);
            const { date, bill_no, movement, item, category, qty, unit_amount, total_amount, vendor, status, notes } = body;
            const parsedQty = Math.max(1, parseInt(String(qty), 10) || 1);
            const parsedUnitAmount = Math.max(0, parseFloat(String(unit_amount)) || 0);
            const calculatedTotal = total_amount !== undefined && total_amount !== null && !isNaN(Number(total_amount))
                ? Math.max(0, Number(total_amount))
                : (parsedQty * parsedUnitAmount);

            const result = await env.DB.prepare(`
                UPDATE assets SET
                    date = ?, bill_no = ?, movement = ?, item = ?, category = ?,
                    qty = ?, unit_amount = ?, total_amount = ?, vendor = ?, status = ?, notes = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(
                String(date).slice(0, 10),
                String(bill_no).trim(),
                movement === 'Sales' ? 'Sales' : 'Purchase',
                String(item).trim(),
                String(category).trim(),
                parsedQty,
                parsedUnitAmount,
                calculatedTotal,
                String(vendor).trim(),
                String(status || 'Completed').trim(),
                notes ? String(notes).trim() : null,
                decodedId
            ).run();

            if (!result.meta.changes) return notFound('Asset entry');
            const updated = await env.DB.prepare('SELECT * FROM assets WHERE id = ?').bind(decodedId).first();
            return HttpResponse.json(updated);
        }

        if (request.method === 'DELETE') {
            const result = await env.DB.prepare('DELETE FROM assets WHERE id = ?').bind(decodedId).run();
            return result.meta.changes ? HttpResponse.json({ success: true, id: decodedId }) : notFound('Asset entry');
        }

        return HttpResponse.error('Method not allowed', 405);
    }

    private static async getAssetStock(request: Request, env: Env): Promise<Response> {
        const denied = await this.authorized(request, env);
        if (denied) return denied;
        await this.ensureAssetsTable(env);

        try {
            const result = await env.DB.prepare(`
                SELECT
                    item,
                    category,
                    SUM(CASE WHEN movement = 'Purchase' THEN qty ELSE 0 END) AS total_purchased_qty,
                    SUM(CASE WHEN movement = 'Purchase' THEN total_amount ELSE 0 END) AS total_purchased_amount,
                    SUM(CASE WHEN movement = 'Sales' THEN qty ELSE 0 END) AS total_sold_qty,
                    SUM(CASE WHEN movement = 'Sales' THEN total_amount ELSE 0 END) AS total_sold_amount,
                    (SUM(CASE WHEN movement = 'Purchase' THEN qty ELSE 0 END) - SUM(CASE WHEN movement = 'Sales' THEN qty ELSE 0 END)) AS available_stock
                FROM assets
                GROUP BY item, category
                ORDER BY item ASC
            `).all();

            return HttpResponse.json(result.results || []);
        } catch {
            return HttpResponse.json([]);
        }
    }
}

// -----------------------------------------------------------------------------
// 5. Worker Entrypoint
// -----------------------------------------------------------------------------
export default {
    async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
        if (request.method === 'OPTIONS') {
            return HttpResponse.corsPreflight();
        }

        try {
            return await ApiRouter.handleApiRequest(request, env);
        } catch (err: any) {
            return HttpResponse.error(err.message || 'Internal Server Error', 500);
        }
    },
};
