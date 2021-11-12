import { IObjectPool } from "./IObjectPool";
import { ObjectBase } from "./ObjectBase";

export interface IObejctPoolManager {
    getObjectPool<T extends ObjectBase>(name: string): IObjectPool<T>;
}
