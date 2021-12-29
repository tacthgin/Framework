import { Constructor } from "../Base/DataStruct/Constructor";
import { IRerference } from "../Base/ReferencePool/IRerference";
import { Variable } from "../Base/Variable/Variable";
import { FsmState } from "./FsmState";

export interface IFsm<T extends Constructor<T>> extends IRerference {
    readonly name: string;

    readonly owner: T;

    readonly fsmStateCount: number;

    readonly isRunning: boolean;

    readonly isDestroyed: boolean;

    readonly currentState: FsmState<T> | null;

    readonly currentStateTime: number;

    start<TState extends FsmState<T>>(): void;

    hasState<TState extends FsmState<T>>(): boolean;

    getState<TState extends FsmState<T>>(): FsmState<T>;

    getAllStates(): FsmState<T>[];

    hasData(name: string): boolean;

    getData<TData extends Variable<Object>>(name: string): TData;

    setData<TData extends Variable<Object>>(name: string, data: TData): void;

    removeData(name: string): boolean;
}
