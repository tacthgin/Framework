import { Constructor } from "../Base/DataStruct/Constructor";
import { Fsm } from "./Fsm";
import { IFsm } from "./IFsm";

export abstract class FsmState<T extends Constructor<T>> {
    protected onInit(fsm: IFsm<T>): void {}

    protected onEnter(fsm: IFsm<T>): void {}

    protected onUpdate(fsm: IFsm<T>, elapseSeconds: number): void {}

    protected onLeave(fsm: IFsm<T>, isShutDown: boolean): void {}

    protected onDestroy(fsm: IFsm<T>): void {}

    protected changeState(fsm: IFsm<T>, stateConstructor: Constructor<FsmState<T>>): void {
        let fsmImplement = fsm as Fsm<T>;
        fsmImplement.changeState(stateConstructor);
    }
}
