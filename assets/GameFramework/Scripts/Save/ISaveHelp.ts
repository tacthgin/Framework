/**
 * 存储辅助器接口
 */
export interface ISaveHelp {
    setNumber(name: string, value: number): void;
    getNumber(name: string, defaultValue?: number): number | null;
    setString(name: string, value: string): void;
    getString(name: string, defaultValue?: string): string | null;
    setObject(name: string, value: object): void;
    getObject(name: string, defaultValue?: object): object | null;
    deleteData(name: string): void;
    clear(): void;
    forEach(callbackfn: (name: string, value: string) => void, thisArg?: any): void;
}
