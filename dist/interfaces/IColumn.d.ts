export interface IColumn {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
    unique?: boolean;
    required?: boolean;
    defaultValue?: any;
}
