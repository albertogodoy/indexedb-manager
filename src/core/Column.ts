import { IColumn } from "../interfaces/IColumn";

export class Column implements IColumn {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
    unique?: boolean;
    required?: boolean;
    defaultValue?: any;

    constructor(config: IColumn) {
        this.name = config.name;
        this.type = config.type || 'string';
        this.unique = config.unique || false;
        this.required = config.required || false;
        this.defaultValue = config.defaultValue;
    }
}