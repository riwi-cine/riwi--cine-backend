declare module "sequelize" {
    export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

    export const Op: any;

    export const DataTypes: {
        INTEGER: any;
        STRING: (length?: number) => any;
        TEXT: any;
        BOOLEAN: any;
        DATE: any;
        DECIMAL: (precision?: number, scale?: number) => any;
        NOW: any;
    };

    export class Model<T = any, C = any> {
        static init(attributes: any, options: any): void;
        static belongsTo(target: any, options: any): void;
        static hasMany(target: any, options: any): void;
        static belongsToMany(target: any, options: any): void;
        static findByPk(id: number, options?: any): Promise<any>;
        static findAll(options?: any): Promise<any[]>;
        static findOne(options?: any): Promise<any>;
        static count(options?: any): Promise<number>;
        static create(values?: any, options?: any): Promise<any>;
        static destroy(options?: any): Promise<number>;
        static update(values: any, options: any): Promise<[number, any[]]>;
        get(options?: any): any;
    }

    export class Sequelize {
        constructor(database: string, username: string, password: string, options: any);
        authenticate(): Promise<void>;
        sync(options?: any): Promise<void>;
    }

    export { Sequelize };
}
