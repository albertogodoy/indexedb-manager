import { IColumn } from "./IColumn";
export interface ITable {
    name: string;
    primaryKey: string;
    columns: IColumn[];
    autoIncrement?: boolean;
}
export interface ITableConfig {
    name: string;
    primaryKey?: string;
    columns?: IColumn[];
    autoIncrement?: boolean;
}
