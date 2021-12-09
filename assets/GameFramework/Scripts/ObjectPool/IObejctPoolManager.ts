import { Constructor } from "../Base/DataStruct/Constructor";
import { ObjectBase } from "./ObjectBase";
import { ObjectPoolBase } from "./ObjectPoolBase";

export interface IObejctPoolManager {
    readonly priority: number;
    readonly count: number;

    hasObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): boolean;

    getObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): ObjectPoolBase<T> | null;

    getAllObjectPools(sort: boolean, results: ObjectPoolBase<ObjectBase>[]): void;

    createSingleSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval?: number,
        capacity?: number,
        expireTime?: number,
        priority?: number
    ): ObjectPoolBase<T>;

    CreateMultiSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval?: number,
        capacity?: number,
        expireTime?: number,
        priority?: number
    ): ObjectPoolBase<T>;

    destroyObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): boolean;

    release(): void;

    releaseAllUnused(): void;
}
