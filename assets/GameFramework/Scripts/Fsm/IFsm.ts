import { Constructor } from "../Base/DataStruct/Constructor";
import { FsmState } from "./FsmState";

export interface IFsm<T extends Constructor<T>> {
    readonly name: string;

    readonly owner: T;

    readonly fsmStateCount: number;

    readonly isRunning: boolean;

    readonly isDestroyed: boolean;

    readonly currentState: FsmState<T>;

    readonly currentStateTime: number;

    start<TState extends FsmState<T>>(): void;

    hasState<TState extends FsmState<T>>(): boolean;

    getState<TState extends FsmState<T>>(): FsmState<T>;

    getAllStates(): FsmState<T>[];
}
