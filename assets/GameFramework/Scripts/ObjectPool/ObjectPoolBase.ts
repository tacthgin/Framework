import { ObjectBase } from "./ObjectBase";

/**
 * 对象池基类
 */
export abstract class ObjectPoolBase<T extends ObjectBase> {
    readonly _name: string = "";
    /**
     * 对象池名字
     */
    abstract get name(): string;

    /**
     * 当前对象池元素数量
     */
    abstract get count(): number;

    /**
     * 对象池容量
     */
    abstract get capacity(): number;

    /**
     * 设置对象池容量
     */
    abstract set capacity(value: number);

    /**
     *  获取对象池自动释放可释放对象的间隔秒数。
     */
    abstract get autoReleaseInterval(): number;

    /**
     *  设置对象池自动释放可释放对象的间隔秒数。
     */
    abstract set autoReleaseInterval(value: number);

    /**
     * 是否可以获取对象
     */
    abstract canSpawn(): boolean;

    /**
     * 获取对象
     */
    abstract spawn(): T;

    /**
     * 回收对象
     * @param obj
     */
    abstract upspawn(obj: T): void;

    /**
     * 释放对象池中的可释放对象。
     */
    abstract release(): void;
}
