import { Constructor } from "../Base/DataStruct/Constructor";
import { ConstructorNamePair } from "../Base/DataStruct/ConstructorNamePair";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkMap } from "../Base/GameFrameworkMap";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IObejctPoolManager } from "./IObejctPoolManager";
import { ObjectBase } from "./ObjectBase";
import { ObjectPool } from "./ObjectPool";
import { ObjectPoolBase } from "./ObjectPoolBase";

@GameFrameworkEntry.registerModule("ObjectPoolManager")
export class ObjectPoolManager extends GameFrameworkModule implements IObejctPoolManager {
    private readonly _defaultCapacity: number = Number.MAX_SAFE_INTEGER;
    private readonly _defaultExpireTime: number = Number.MAX_VALUE;
    private readonly _defaultPriority: number = 0;

    private readonly _objectPools: Map<ConstructorNamePair<ObjectBase>, ObjectPoolBase<ObjectBase>> = null!;
    private readonly _cachedAllObjectPools: Array<ObjectPoolBase<ObjectBase>> = null!;
    private readonly _constructorToPairMap: GameFrameworkMap<Constructor<ObjectBase>, ConstructorNamePair<ObjectBase>> = null!;

    constructor() {
        super();
        this._objectPools = new Map<ConstructorNamePair<ObjectBase>, ObjectPoolBase<ObjectBase>>();
        this._cachedAllObjectPools = new Array<ObjectPoolBase<ObjectBase>>();
        this._constructorToPairMap = new GameFrameworkMap<Constructor<ObjectBase>, ConstructorNamePair<ObjectBase>>();
    }

    get priority(): number {
        return 6;
    }

    get count(): number {
        return this._objectPools.size;
    }

    update(elapseSeconds: number): void {
        this._objectPools.forEach((objectPool: ObjectPoolBase<ObjectBase>) => {
            objectPool.update(elapseSeconds);
        });
    }

    shutDown(): void {
        this._objectPools.forEach((objectPool: ObjectPoolBase<ObjectBase>) => {
            objectPool.shutDown();
        });
    }

    hasObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): boolean {
        return this.internalGetObjectPoolPair(constructor, name) != null;
    }

    getObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): ObjectPoolBase<T> | null {
        let pair = this.internalGetObjectPoolPair(constructor, name);
        if (pair) {
            return (this._objectPools.get(pair) as ObjectPoolBase<T>) || null;
        }
        return null;
    }

    getAllObjectPools(sort: boolean, results: ObjectPoolBase<ObjectBase>[]): void {
        results.length = 0;

        this._objectPools.forEach((objectPool: ObjectPoolBase<ObjectBase>) => {
            results.push(objectPool);
        });

        if (sort) {
            results.sort(ObjectPoolManager.ObjectPoolComparer);
        }
    }

    createSingleSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval: number = this._defaultExpireTime,
        capacity: number = this._defaultCapacity,
        expireTime: number = this._defaultExpireTime,
        priority: number = this._defaultPriority
    ): ObjectPoolBase<T> {
        return this.internalCreateObjectPool(constructor, name, false, autoReleaseInterval, capacity, expireTime, priority);
    }

    CreateMultiSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval: number = this._defaultExpireTime,
        capacity: number = this._defaultCapacity,
        expireTime: number = this._defaultExpireTime,
        priority: number = this._defaultPriority
    ): ObjectPoolBase<T> {
        return this.internalCreateObjectPool(constructor, name, true, autoReleaseInterval, capacity, expireTime, priority);
    }

    destroyObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): boolean {
        if (!constructor) {
            throw new GameFrameworkError("constructor is invalid");
        }
        let constructorNamePair = this.internalGetObjectPoolPair(constructor, name);
        if (constructorNamePair) {
            let objectPool = this._objectPools.get(constructorNamePair);
            objectPool?.shutDown();
            this._constructorToPairMap.delete(constructor, constructorNamePair);
            this._objectPools.delete(constructorNamePair);
            return true;
        }
        return false;
    }

    release(): void {
        this.getAllObjectPools(true, this._cachedAllObjectPools);
        this._cachedAllObjectPools.forEach((objectPool: ObjectPoolBase<ObjectBase>) => {
            objectPool.release();
        });
    }

    releaseAllUnused(): void {
        this.getAllObjectPools(true, this._cachedAllObjectPools);
        this._cachedAllObjectPools.forEach((objectPool: ObjectPoolBase<ObjectBase>) => {
            objectPool.releaseAllUnused();
        });
    }

    private internalGetObjectPoolPair<T extends ObjectBase>(constructor: Constructor<T>, name?: string): ConstructorNamePair<ObjectBase> | null {
        if (!constructor) {
            throw new GameFrameworkError("constructor is invalid");
        }

        let constructorNamePairs = this._constructorToPairMap.get(constructor);
        if (constructorNamePairs) {
            name = name || "";
            let node = constructorNamePairs.find((pair: ConstructorNamePair<ObjectBase>) => {
                return pair.name == name;
            });
            return node ? node.value : null;
        }
        return null;
    }

    private internalCreateObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        allowMultiSpawn: boolean,
        autoReleaseInterval: number,
        capacity: number,
        expireTime: number,
        priority: number
    ): ObjectPoolBase<T> {
        if (!constructor) {
            throw new GameFrameworkError("constructor is invalid");
        }

        if (this.hasObjectPool(constructor, name)) {
            throw new GameFrameworkError(`object pool ${name} already exist`);
        }

        let objectPool = new ObjectPool<T>(name, allowMultiSpawn, autoReleaseInterval, capacity, expireTime, priority);
        let constructorNamePair = new ConstructorNamePair(constructor, name);
        this._constructorToPairMap.set(constructor, constructorNamePair);
        this._objectPools.set(constructorNamePair, objectPool);
        return objectPool;
    }

    private static ObjectPoolComparer(left: ObjectPoolBase<ObjectBase>, right: ObjectPoolBase<ObjectBase>): number {
        return right.priority - left.priority;
    }
}
