import { IColumn } from "../interfaces/IColumn";
export declare class Column implements IColumn {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
    unique?: boolean;
    required?: boolean;
    defaultValue?: any;
    constructor(config: IColumn);
}
