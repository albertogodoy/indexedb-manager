import { IDatabase, IDatabaseConfig } from "../interfaces/IDatabase";
import { Table } from "./Table";
import { ITableConfig } from "../interfaces/ITable";
export declare class Database implements IDatabase {
    name: string;
    version: number;
    tables: Table[];
    private db;
    constructor(config: IDatabaseConfig);
    connect(): Promise<IDBDatabase>;
    getTable(name: string): Table | undefined;
    addTable(config: ITableConfig): Promise<Table>;
    close(): Promise<void>;
    deleteDatabase(): Promise<void>;
}
