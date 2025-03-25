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
exports.Table = void 0;
const Column_1 = require("./Column");
class Table {
    constructor(config) {
        this.name = config.name;
        this.primaryKey = config.primaryKey || 'id';
        this.autoIncrement = config.autoIncrement || true;
        this.columns = (config.columns || []).map(col => new Column_1.Column(col));
    }
    validateData(data) {
        // Implement validation based on columns
    }
    create(db, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.name, 'readwrite');
                const store = transaction.objectStore(this.name);
                const request = store.add(data);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }
    read(db, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.name, 'readonly');
                const store = transaction.objectStore(this.name);
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }
    update(db, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.name, 'readwrite');
                const store = transaction.objectStore(this.name);
                const request = store.put(Object.assign(Object.assign({}, data), { [this.primaryKey]: id }));
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }
    delete(db, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.name, 'readwrite');
                const store = transaction.objectStore(this.name);
                const request = store.delete(id);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        });
    }
    findAll(db, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.name, 'readonly');
                const store = transaction.objectStore(this.name);
                const request = store.getAll();
                request.onsuccess = () => {
                    let results = request.result;
                    if (options === null || options === void 0 ? void 0 : options.where) {
                        results = this.applyWhereConditions(results, options.where);
                    }
                    if (options === null || options === void 0 ? void 0 : options.orderBy) {
                        results = this.applyOrderBy(results, options.orderBy);
                    }
                    if (options === null || options === void 0 ? void 0 : options.limit) {
                        const offset = options.offset || 0;
                        results = results.slice(offset, offset + options.limit);
                    }
                    resolve(results);
                };
                request.onerror = () => reject(request.error);
            });
        });
    }
    applyWhereConditions(data, where) {
        return data.filter(item => {
            return Object.entries(where).every(([key, conditions]) => {
                return Object.entries(conditions).every(([operator, value]) => {
                    switch (operator) {
                        case 'equals': return item[key] === value;
                        case 'notEquals': return item[key] !== value;
                        case 'greaterThan': return item[key] > value;
                        case 'lessThan': return item[key] < value;
                        case 'greaterThanOrEqual': return item[key] >= value;
                        case 'lessThanOrEqual': return item[key] <= value;
                        case 'contains':
                            return typeof item[key] === 'string' &&
                                item[key].includes(value);
                        case 'in': return Array.isArray(value) && value.includes(item[key]);
                        case 'notIn': return Array.isArray(value) && !value.includes(item[key]);
                        default: return true;
                    }
                });
            });
        });
    }
    applyOrderBy(data, orderBy) {
        return data.sort((a, b) => {
            for (const [key, direction] of Object.entries(orderBy)) {
                if (a[key] < b[key])
                    return direction === 'asc' ? -1 : 1;
                if (a[key] > b[key])
                    return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
}
exports.Table = Table;
