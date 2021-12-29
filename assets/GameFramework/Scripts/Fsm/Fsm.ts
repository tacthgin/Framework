import { Constructor } from "../Base/DataStruct/Constructor";
import { Variable } from "../Base/Variable/Variable";
import { FsmBase } from "./FsmBase";
import { FsmState } from "./FsmState";
import { IFsm } from "./IFsm";

export class Fsm<T extends Constructor<T>> extends FsmBase implements IFsm<T> {
    private _owner: T | null = null;
    private readonly _states: Map<Constructor<FsmState<T>>, FsmState<T>> = null!;
    private _datas: Map<string, Variable<Object>> | null = null;
    private _currentState: FsmState<T> | null = null;
    private _isDestoryed: boolean = false;

    constructor() {
        super();
        this._states = new Map<Constructor<FsmState<T>>, FsmState<T>>();
    }

    get owner(): T {
        return this._owner!;
    }

    get currentState(): FsmState<T> | null {
        return this._currentState;
    }

    get fsmStateCount(): number {
        return this._states.size;
    }

    get isRunning(): boolean {
        return this._currentState != null;
    }

    get isDestroyed(): boolean {
        return this._isDestoryed;
    }

    get currentStateName(): string {
        throw new Error("Method not implemented.");
    }

    get currentStateTime(): number {
        throw new Error("Method not implemented.");
    }

    update(elapseSeconds: number): void {
        throw new Error("Method not implemented.");
    }

    shutDown(): void {
        throw new Error("Method not implemented.");
    }

    start<TState extends FsmState<T>>(): void {
        throw new Error("Method not implemented.");
    }
    hasState<TState extends FsmState<T>>(): boolean {
        throw new Error("Method not implemented.");
    }
    getState<TState extends FsmState<T>>(): FsmState<T> {
        throw new Error("Method not implemented.");
    }
    getAllStates(): FsmState<T>[] {
        throw new Error("Method not implemented.");
    }
    hasData(name: string): boolean {
        throw new Error("Method not implemented.");
    }
    getData<TData extends Variable<Object>>(name: string): TData {
        throw new Error("Method not implemented.");
    }
    setData<TData extends Variable<Object>>(name: string, data: TData): void {
        throw new Error("Method not implemented.");
    }
    removeData(name: string): boolean {
        throw new Error("Method not implemented.");
    }

    clear(): void {
        throw new Error("Method not implemented.");
    }

    changeState(stateConstructor: Constructor<FsmState<T>>): void {}
}
