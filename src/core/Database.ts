import { IDatabase, IDatabaseConfig } from "../interfaces/IDatabase";
import { Table } from "./Table";
import { Column } from "./Column";
import { ITableConfig } from "../interfaces/ITable";

export class Database implements IDatabase {
    name: string;
    version: number;
    tables: Table[];
    private db: IDBDatabase | null = null;

    constructor(config: IDatabaseConfig) {
        this.name = config.name;
        this.version = config.version || 1;
        this.tables = (config.tables || []).map(table => new Table(table));
    }

    async connect(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name, this.version);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create or update tables
                this.tables.forEach(table => {
                    if (!db.objectStoreNames.contains(table.name)) {
                        const store = db.createObjectStore(
                            table.name,
                            {
                                keyPath: table.primaryKey,
                                autoIncrement: table.autoIncrement
                            }
                        );

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
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }

    getTable(name: string): Table | undefined {
        return this.tables.find(table => table.name === name);
    }

    async addTable(config: ITableConfig): Promise<Table> {
        const table = new Table(config);
        this.tables.push(table);

        // Reopen the database to trigger onupgradeneeded
        if (this.db) {
            this.db.close();
            await this.connect();
        }

        return table;
    }

    async close(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }

    async deleteDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close();
            }

            const request = indexedDB.deleteDatabase(this.name);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}