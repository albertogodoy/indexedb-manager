"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const Table_1 = require("./Table");
class Database {
    constructor(config) {
        this.db = null;
        this.name = config.name;
        this.version = config.version || 1;
        this.tables = (config.tables || []).map(table => new Table_1.Table(table));
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.name, this.version);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    // Create or update tables
                    this.tables.forEach(table => {
                        if (!db.objectStoreNames.contains(table.name)) {
                            const store = db.createObjectStore(table.name, {
                                keyPath: table.primaryKey,
                                autoIncrement: table.autoIncrement
                            });
                            // Create indexes for columns marked as unique
                            table.columns.forEach(column => {
                                if (column.unique) {
                                    store.createIndex(column.name, column.name, { unique: true });
                                }
                            });
                        }
                    });
                };
                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    resolve(this.db);
                };
                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
    }
    getTable(name) {
        return this.tables.find(table => table.name === name);
    }
    addTable(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = new Table_1.Table(config);
            this.tables.push(table);
            // Reopen the database to trigger onupgradeneeded
            if (this.db) {
                this.db.close();
                yield this.connect();
            }
            return table;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db) {
                this.db.close();
                this.db = null;
            }
        });
    }
    deleteDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.db) {
                    this.db.close();
                }
                const request = indexedDB.deleteDatabase(this.name);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        });
    }
}
exports.Database = Database;
