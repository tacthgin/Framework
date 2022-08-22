import { GameFrameworkError } from "../Base/GameFrameworkError";
import { IRerference } from "../Base/ReferencePool/IRerference";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { ObjectBase } from "./ObjectBase";

export class Object<T extends ObjectBase> implements IRerference {
    private _object: T = null!;
    private _spawnCount: number = 0;

    get name(): string {
        return this._object.name;
    }

    set locked(value: boolean) {
        this._object.locked = value;
    }

    get locked(): boolean {
        return this._object.locked;
    }

    set priority(value: number) {
        this._object.priority = value;
    }

    get priority(): number {
        return this._object.priority;
    }

    get lastUseTime(): number {
        return this._object.lastUseTime;
    }

    get customCanReleaseFlag(): boolean {
        return this._object.customCanReleaseFlag;
    }

    get isInUse(): boolean {
        return this._spawnCount > 0;
    }

    get spawnCount(): number {
        return this._spawnCount;
    }

    static create<T extends ObjectBase>(object: T, spawned: boolean): Object<T> {
        if (!object) {
            throw new GameFrameworkError("object is invalid");
        }

        let internalObject: Object<T> = ReferencePool.acquire<Object<T>>(Object);
        internalObject._object = object;
        internalObject._spawnCount = spawned ? 1 : 0;
        if (spawned) {
            object.onSpawn();
        }
        return internalObject;
    }

    clear(): void {
        this._object = null!;
        this._spawnCount = 0;
    }

    peek(): T {
        return this._object;
    }

    spawn(): T {
        ++this._spawnCount;
        this._object.lastUseTime = Date.now();
        this._object.onSpawn();
        return this._object;
    }

    unspawn(): void {
        --this._spawnCount;
        this._object.lastUseTime = Date.now();
        this._object.onUnspawn();
        if (this._spawnCount < 0) {
            throw new GameFrameworkError(`object ${this.name} spawn count is less than 0`);
        }
    }

    release(isShutdown: boolean): void {
        this._object.release(isShutdown);
        ReferencePool.release(this._object);
    }
}
