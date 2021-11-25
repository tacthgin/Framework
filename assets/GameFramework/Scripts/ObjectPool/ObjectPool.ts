import { Object } from "./Object";
import { ObjectBase } from "./ObjectBase";
import { ObjectPoolBase } from "./ObjectPoolBase";

/**
 * 对象池
 */
export class ObjectPool<T extends ObjectBase> extends ObjectPoolBase<T> {
    private _objectMap = new Map<object, Object<T>>();
    private _capacity: number = 0;
    private _autoReleaseInterval: number = 0;
    private _expireTime: number = 0;
    private _priority: number = 0;
    private _autoReleaseTime: number = 0;

    get name(): string {
        return this._name;
    }

    /**
     * 当前对象池元素数量
     */
    get count(): number {
        return 0;
    }

    /**
     * 对象池容量
     */
    get capacity(): number {
        return this._capacity;
    }

    /**
     * 设置对象池容量
     */
    set capacity(value: number) {
        this._capacity = value;
    }

    get autoReleaseInterval(): number {
        return this._autoReleaseInterval;
    }

    set autoReleaseInterval(value: number) {
        this._autoReleaseInterval = value;
    }

    /**
     * 是否可以获取对象
     */
    canSpawn(): boolean {
        return false;
    }

    /**
     * 获取对象
     */
    spawn(): T {
        return null;
    }

    /**
     * 回收对象
     * @param obj
     */
    upspawn(obj: T): void {}

    /**
     * 释放对象池中的可释放对象。
     */
    release(): void {}
}
