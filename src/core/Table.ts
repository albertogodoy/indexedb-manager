import { ITable, ITableConfig } from "../interfaces/ITable";
import { Column } from "./Column";
import { OrderBy, SelectOptions, WhereCondition } from "./types";

export class Table implements ITable {
    name: string;
    primaryKey: string;
    columns: Column[];
    autoIncrement?: boolean;

    constructor(config: ITableConfig) {
        this.name = config.name;
        this.primaryKey = config.primaryKey || 'id';
        this.autoIncrement = config.autoIncrement || true;
        this.columns = (config.columns || []).map(col => new Column(col));
    }

    private validateData(data: any): void {
        // Implement validation based on columns
    }

    async create(db: IDBDatabase, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.name, 'readwrite');
            const store = transaction.objectStore(this.name);
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async read(db: IDBDatabase, id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.name, 'readonly');
            const store = transaction.objectStore(this.name);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(db: IDBDatabase, id: any, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.name, 'readwrite');
            const store = transaction.objectStore(this.name);
            const request = store.put({ ...data, [this.primaryKey]: id });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(db: IDBDatabase, id: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.name, 'readwrite');
            const store = transaction.objectStore(this.name);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async findAll(db: IDBDatabase, options?: SelectOptions): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.name, 'readonly');
            const store = transaction.objectStore(this.name);
            const request = store.getAll();

            request.onsuccess = () => {
                let results = request.result;

                if (options?.where) {
                    results = this.applyWhereConditions(results, options.where);
                }

                if (options?.orderBy) {
                    results = this.applyOrderBy(results, options.orderBy);
                }

                if (options?.limit) {
                    const offset = options.offset || 0;
                    results = results.slice(offset, offset + options.limit);
                }

                resolve(results);
            };

            request.onerror = () => reject(request.error);
        });
    }

    private applyWhereConditions(data: any[], where: WhereCondition): any[] {
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
                                item[key].includes(value as string);
                        case 'in': return Array.isArray(value) && value.includes(item[key]);
                        case 'notIn': return Array.isArray(value) && !value.includes(item[key]);
                        default: return true;
                    }
                });
            });
        });
    }

    private applyOrderBy(data: any[], orderBy: OrderBy): any[] {
        return data.sort((a, b) => {
            for (const [key, direction] of Object.entries(orderBy)) {
                if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
}