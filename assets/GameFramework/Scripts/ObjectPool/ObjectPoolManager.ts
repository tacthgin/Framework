import { Constructor } from "../Base/DataStruct/Constructor";
import { ConstructorNamePair } from "../Base/DataStruct/ConstructorNamePair";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkMap } from "../Base/GameFrameworkMap";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IObejctPoolManager } from "./IObejctPoolManager";
import { ObjectBase } from "./ObjectBase";
import { ObjectPool } from "./ObjectPool";
import { ObjectPoolBase } from "./ObjectPoolBase";

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

    getAllObjectPools(sort: boolean): ObjectPoolBase<ObjectBase>[] {
        let results: ObjectPoolBase<ObjectBase>[] = [];
        this._objectPools.forEach((objectPool: ObjectPoolBase<ObjectBase>) => {
            results.push(objectPool);
        });
        return results;
    }

    createSingleSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval: number,
        capacity: number,
        expireTime: number,
        priority: number
    ): ObjectPoolBase<T> {
        throw new Error("Method not implemented.");
    }

    CreateMultiSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval: number,
        capacity: number,
        expireTime: number,
        priority: number
    ): ObjectPoolBase<T> {
        throw new Error("Method not implemented.");
    }

    destroyObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): boolean {
        throw new Error("Method not implemented.");
    }

    release(): void {
        throw new Error("Method not implemented.");
    }

    releaseAllUnused(): void {
        throw new Error("Method not implemented.");
    }

    private internalGetObjectPoolPair<T extends ObjectBase>(constructor: Constructor<T>, name?: string): ConstructorNamePair<ObjectBase> | null {
        let pairs = this._constructorToPairMap.get(constructor);
        if (pairs) {
            name = name || "";
            let index = pairs.findIndex((pair: ConstructorNamePair<ObjectBase>) => {
                return pair.name == name;
            });
            return index != -1 ? pairs[index] : null;
        }
        return null;
    }

    private internalCreateObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        allowMultiSpawn: boolean,
        autoReleaseInterval: number = this._defaultExpireTime,
        capacity: number = this._defaultCapacity,
        expireTime: number = this._defaultExpireTime,
        priority: number = this._defaultPriority
    ): ObjectPoolBase<T> {
        if (this.hasObjectPool(constructor, name)) {
            throw new GameFrameworkError(`object pool ${name} already exist`);
        }

        let objectPool = new ObjectPool<T>(name, allowMultiSpawn, autoReleaseInterval, capacity, expireTime, priority);
        let pair = new ConstructorNamePair(constructor, name);
        this._constructorToPairMap.set(constructor, pair);
        this._objectPools.set(pair, objectPool);
        return objectPool;
    }
}
