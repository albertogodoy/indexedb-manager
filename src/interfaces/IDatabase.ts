import { ITable, ITableConfig } from "./ITable";

export interface IDatabase {
    name: string;
    version: number;
    tables: ITable[];
}

export interface IDatabaseConfig {
    name: string;
    version?: number;
    tables?: ITableConfig[];
}