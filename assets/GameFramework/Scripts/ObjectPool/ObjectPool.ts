import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkMap } from "../Base/GameFrameworkMap";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { FObject } from "./FObject";
import { ObjectBase } from "./ObjectBase";
import { ObjectInfo } from "./ObjectInfo";
import { ObjectPoolBase } from "./ObjectPoolBase";
import { ReleaseObjectFilterCallback } from "./ReleaseObjectFilterCallback";

/**
 * 对象池
 */
export class ObjectPool<T extends ObjectBase> extends ObjectPoolBase<T> {
    GetAllObjectInfos(): ObjectInfo[] {
        throw new Error("Method not implemented.");
    }
    private _objects: GameFrameworkMap<string, FObject<T>> = null!;
    private _objectMap: Map<object, FObject<T>> = null!;
    private _cachedCanReleaseObjects: Array<T> = null!;
    private _cachedNeedReleaseObjects: Array<T> = null!;
    private _capacity: number = 0;
    private _autoReleaseInterval: number = 0;
    private _expireTime: number = 0;
    private _priority: number = 0;
    private _autoReleaseTime: number = 0;

    constructor(name: string, allowMultiSpawn: boolean, autoReleaseInterval: number, capacity: number, expireTime: number, priority: number) {
        super();
        this._objects = new GameFrameworkMap<string, FObject<T>>();
        this._objectMap = new Map<object, FObject<T>>();
        this._cachedCanReleaseObjects = new Array<T>();
        this._cachedNeedReleaseObjects = new Array<T>();
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
     * 对象池中可释放对象的数量
     */
    get canReleaseCount(): number {
        this.getCanReleaseObjects(this._cachedCanReleaseObjects);
        return this._cachedCanReleaseObjects.length;
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

        let internalObject = FObject.create(obj, spawned);
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
    release(releaseCount?: number, releaseObjectFilterCallback?: ReleaseObjectFilterCallback<T>): void {
        releaseCount = releaseCount || this.count - this.capacity;
        if (releaseCount < 0) {
            releaseCount = 0;
        }

        let expireTime = 0;
        if (this._expireTime < Number.MAX_VALUE) {
            expireTime = Date.now() - this._expireTime;
        }

        releaseObjectFilterCallback = releaseObjectFilterCallback || this.defaultReleaseObjectFilterCallback;
        this._autoReleaseTime = 0;
        this.getCanReleaseObjects(this._cachedCanReleaseObjects);
        let needReleaseObjects = releaseObjectFilterCallback(this._cachedCanReleaseObjects, releaseCount, expireTime);
        needReleaseObjects.forEach((internalObject: T) => {
            this.releaseObject(internalObject);
        });
    }

    releaseAllUnused(): void {
        this._autoReleaseTime = 0;
        this.getCanReleaseObjects(this._cachedCanReleaseObjects);
        this._cachedCanReleaseObjects.forEach((releaseObject: T) => {
            this.releaseObject(releaseObject);
        });
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

    private getObject(targetOrObject: object | T): FObject<T> | null {
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

    private getCanReleaseObjects(results: Array<T>): void {
        if (!results) {
            throw new GameFrameworkError("results is invailid");
        }
        results.length = 0;
        this._objectMap.forEach((internalObject: FObject<T>) => {
            if (internalObject.isInUse || internalObject.locked || !internalObject.customCanReleaseFlag) {
                return;
            }
            results.push(internalObject.peek());
        });
    }

    private defaultReleaseObjectFilterCallback(candidateObjects: Array<T>, releaseCount: number, expireTime: number): Array<T> {
        this._cachedNeedReleaseObjects.length = 0;
        if (expireTime > 0) {
            for (let i = candidateObjects.length - 1; i >= 0; --i) {
                if (candidateObjects[i].lastUseTime <= expireTime) {
                    this._cachedNeedReleaseObjects.push(candidateObjects[i]);
                    // ?数组直接删除不友好
                    candidateObjects.splice(i, 1);
                }
            }
            releaseCount -= this._cachedNeedReleaseObjects.length;
        }

        for (let i = 0; releaseCount > 0 && i < candidateObjects.length; ++i) {
            for (let j = 1; j < candidateObjects.length; ++j) {
                if (
                    candidateObjects[i].priority > candidateObjects[j].priority ||
                    (candidateObjects[i].priority == candidateObjects[j].priority && candidateObjects[i].lastUseTime > candidateObjects[j].lastUseTime)
                ) {
                    [candidateObjects[i], candidateObjects[j]] = [candidateObjects[j], candidateObjects[i]];
                }
            }
            --releaseCount;
            this._cachedNeedReleaseObjects.push(candidateObjects[i]);
        }

        return this._cachedNeedReleaseObjects;
    }
}
