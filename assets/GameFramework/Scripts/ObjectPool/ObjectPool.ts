import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkMap } from "../Base/GameFrameworkMap";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { Object } from "./Object";
import { ObjectBase } from "./ObjectBase";
import { ObjectPoolBase } from "./ObjectPoolBase";

/**
 * 对象池
 */
export class ObjectPool<T extends ObjectBase> extends ObjectPoolBase<T> {
    private _objects: GameFrameworkMap<string, Object<T>> = null!;
    private _objectMap: Map<object, Object<T>> = null!;
    private _capacity: number = 0;
    private _autoReleaseInterval: number = 0;
    private _expireTime: number = 0;
    private _priority: number = 0;
    private _autoReleaseTime: number = 0;

    constructor(name: string, allowMultiSpawn: boolean, autoReleaseInterval: number, capacity: number, expireTime: number, priority: number) {
        super();
        this._objects = new GameFrameworkMap<string, Object<T>>();
        this._objectMap = new Map<object, Object<T>>();
        this._name = name;
        this._allowMultiSpawn = allowMultiSpawn;
        this._autoReleaseInterval = autoReleaseInterval;
        this._capacity = capacity;
        this._expireTime = expireTime;
        this._priority = priority;
    }

    get name(): string {
        return this._name;
    }

    /**
     * 当前对象池元素数量
     */
    get count(): number {
        return this._objectMap.size;
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

    setPriority(targetOrObject: object | T, priority: number): void {
        let internalObject = this.getObject(targetOrObject);
        if (internalObject) {
            internalObject.priority = priority;
        } else {
            throw new GameFrameworkError(`could not find object in object pool`);
        }
    }

    setLocked(targetOrObject: object | T, locked: boolean): void {
        let internalObject = this.getObject(targetOrObject);
        if (internalObject) {
            internalObject.locked = locked;
        } else {
            throw new GameFrameworkError(`could not find object in object pool`);
        }
    }

    register(obj: T, spawned: boolean): void {
        if (!obj) {
            throw new GameFrameworkError("object is null");
        }

        let internalObject = Object.create(obj, spawned);
        this._objectMap.set(obj.target, internalObject);
        this._objects.set(obj.name, internalObject);

        if (this.count > this.capacity) {
            this.release();
        }
    }

    /**
     * 是否可以获取对象
     */
    canSpawn(name: string = ""): boolean {
        if (name == null) {
            throw new GameFrameworkError("name is invalid");
        }
        let objectArray = this._objects.get(name);
        return objectArray ? objectArray.length > 0 : false;
    }

    /**
     * 获取对象
     */
    spawn(name: string = ""): T | null {
        if (name == null) {
            throw new GameFrameworkError("name is invalid");
        }

        let objectArray = this._objects.get(name);
        if (objectArray) {
            for (let i = 0; i < objectArray.length; ++i) {
                if (this._allowMultiSpawn || !objectArray[i].isInUse) {
                    return objectArray[i].spawn();
                }
            }
        }

        return null;
    }

    /**
     * 回收对象
     * @param obj
     */
    upspawn(obj: T): void {
        let internalObject = this.getObject(obj);
        if (internalObject) {
            internalObject.unspawn();
            if (this.count > this.capacity && internalObject.spawnCount <= 0) {
                this.release();
            }
        } else {
            throw new GameFrameworkError("could not find object in object pool");
        }
    }

    releaseObject(objectOrTarget: object | T): boolean {
        let internalObject = this.getObject(objectOrTarget);
        if (!internalObject) {
            return false;
        }

        if (internalObject.isInUse || internalObject.locked || !internalObject.customCanReleaseFlag) {
            return false;
        }

        this._objects.delete(internalObject.name, internalObject);
        this._objectMap.delete(internalObject.peek().target);

        internalObject.release(false);
        ReferencePool.release(internalObject);

        return true;
    }

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

    private getObject(targetOrObject: object | T): Object<T> | null {
        if (!targetOrObject) {
            throw new GameFrameworkError("target or object is null");
        }

        let target: object | null = null;
        if (targetOrObject instanceof ObjectBase) {
            target = targetOrObject.target;
        } else {
            target = targetOrObject;
        }

        return this._objectMap.get(target) || null;
    }
}
