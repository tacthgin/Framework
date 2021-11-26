import { GameFrameworkError } from "../Base/GameFrameworkError";
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
        if (value < 0) {
            throw new GameFrameworkError("capacity is invalid");
        }

        if (this._capacity == value) {
            return;
        }

        this._capacity = value;
        this.release();
    }

    get autoReleaseInterval(): number {
        return this._autoReleaseInterval;
    }

    set autoReleaseInterval(value: number) {
        this._autoReleaseInterval = value;
    }

    set expireTime(value: number) {
        if (value < 0) {
            throw new GameFrameworkError("expireTime is invalid");
        }

        if (this._expireTime == value) {
            return;
        }

        this._expireTime = value;
        this.release();
    }

    get expireTime(): number {
        return this._expireTime;
    }

    set priority(value: number) {
        this._priority = value;
    }

    get priority(): number {
        return this._priority;
    }

    setPriority(obj: object, priority: number): void {
        let internalObject = this.getObject(obj);
        if (internalObject) {
            internalObject.priority = priority;
        } else {
            throw new GameFrameworkError(`could not find object in object pool`);
        }
    }

    setLocked(obj: object, locked: boolean): void {
        let internalObject = this.getObject(obj);
        if (internalObject) {
            internalObject.locked = locked;
        } else {
            throw new GameFrameworkError(`could not find object in object pool`);
        }
    }

    /**
     * 是否可以获取对象
     */
    canSpawn(): boolean {
        return false;
    }

    register(obj: T, spawned: boolean): void {
        throw new Error("Method not implemented.");
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

    releaseAllUnused(): void {
        throw new Error("Method not implemented.");
    }

    update(elapseSeconds: number): void {
        this._autoReleaseTime += elapseSeconds;
        if (this._autoReleaseInterval >= this._autoReleaseInterval) {
            this.release();
        }
    }

    shutDown(): void {
        throw new Error("Method not implemented.");
    }

    private getObject(target: object): Object<T> | null {
        if (!target) {
            throw new GameFrameworkError("target is null");
        }

        return this._objectMap.get(target) || null;
    }
}
