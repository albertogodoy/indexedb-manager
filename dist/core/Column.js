"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
class Column {
    constructor(config) {
        this.name = config.name;
        this.type = config.type || 'string';
        this.unique = config.unique || false;
        this.required = config.required || false;
        this.defaultValue = config.defaultValue;
    }
}
exports.Column = Column;
