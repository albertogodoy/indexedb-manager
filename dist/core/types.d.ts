export type WhereCondition = {
    [key: string]: {
        equals?: any;
        notEquals?: any;
        greaterThan?: number | Date;
        lessThan?: number | Date;
        greaterThanOrEqual?: number | Date;
        lessThanOrEqual?: number | Date;
        contains?: string;
        in?: any[];
        notIn?: any[];
    };
};
export type OrderBy = {
    [key: string]: 'asc' | 'desc';
};
export type SelectOptions = {
    where?: WhereCondition;
    limit?: number;
    offset?: number;
    orderBy?: OrderBy;
};
