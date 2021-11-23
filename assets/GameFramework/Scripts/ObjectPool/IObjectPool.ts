import { ObjectBase } from "./ObjectBase";

/**
 * 对象池接口
 */
export interface IObjectPool<T extends ObjectBase> {
    /**
     * 当前对象池元素数量
     */
    getCount(): number;

    /**
     * 对象池容量
     */
    getCapacity(): number;

    /**
     * 设置对象池容量
     */
    setCapacity(value: number): void;

    /**
     * 是否可以获取对象
     */
    canSpawn(): boolean;

    /**
     * 获取对象
     */
    spawn(): T;

    /**
     * 回收对象
     * @param obj
     */
    upspawn(obj: T): void;

    /**
     * 释放对象池中的可释放对象。
     */
    release(): void;
}
