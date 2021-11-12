import { ObjectBase } from "./ObjectBase";

/**
 * 对象池接口
 */
export interface IObjectPool<T extends ObjectBase> {
    /**
     * 当前对象池元素数量
     */
    get count(): number;

    /**
     * 对象池容量
     */
    get capacity(): number;

    /**
     * 设置对象池容量
     */
    set capacity(value: number);

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
    release();
}
