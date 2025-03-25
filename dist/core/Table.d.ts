import { ITable, ITableConfig } from "../interfaces/ITable";
import { Column } from "./Column";
import { SelectOptions } from "./types";
export declare class Table implements ITable {
    name: string;
    primaryKey: string;
    columns: Column[];
    autoIncrement?: boolean;
    constructor(config: ITableConfig);
    private validateData;
    create(db: IDBDatabase, data: any): Promise<any>;
    read(db: IDBDatabase, id: any): Promise<any>;
    update(db: IDBDatabase, id: any, data: any): Promise<any>;
    delete(db: IDBDatabase, id: any): Promise<void>;
    findAll(db: IDBDatabase, options?: SelectOptions): Promise<any[]>;
    private applyWhereConditions;
    private applyOrderBy;
}
