import { ISaveHelp } from "./ISaveHelp";

/**
 * 存储管理接口
 */
export interface ISaveManager {
    /**
     * 存储数据个数
     */
    readonly count: number;
    /**
     * 设置存储辅助器
     * @param saveHelp
     */
    setSaveHelp(saveHelp: ISaveHelp): void;

    /**
     * 存储数字类型
     * @param name 存储名
     * @param value 存储值
     */
    setNumber(name: string, value: number): void;

    /**
     * 获取数字类型的存储
     * @param name 存储名
     * @param defaultValue 存储默认值
     */
    getNumber(name: string, defaultValue?: number): number | null;

    /**
     * 存储字符串类型
     * @param name 存储名
     * @param value 存储值
     */
    setString(name: string, value: string): void;

    /**
     * 获取字符串类型的存储
     * @param name 存储名
     * @param defaultValue 存储默认值
     */
    getString(name: string, defaultValue?: string): string | null;

    /**
     * 存储对象类型
     * @param name 存储名
     * @param value 存储值
     */
    setObject(name: string, value: object): void;

    /**
     * 获取对象类型的存储
     * @param name 存储名
     * @param defaultValue 存储默认值
     */
    getObject(name: string, defaultValue?: object): object | null;

    /**
     * 删除存储数据
     * @param name 存储名
     */
    deleteData(name: string): void;

    /**
     * 清空存储数据
     */
    clear(): void;

    /**
     * 遍历存储数据
     * @param callbackfn
     * @param thisArg
     */
    forEach(callbackfn: (name: string, value: string) => void, thisArg?: any): void;
}
