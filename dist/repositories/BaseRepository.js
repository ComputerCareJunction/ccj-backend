"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class BaseRepository {
    constructor(tableName) {
        this.pool = database_1.default.getPool();
        this.tableName = tableName;
    }
    async query(text, params) {
        return await this.pool.query(text, params);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map