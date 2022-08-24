import { IRerference } from "../../Base/ReferencePool/IRerference";

export interface IScheduleBase extends IRerference {
    /**
     * 帧轮询
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number): void;

    /**
     * 物理帧轮询
     * @param elapseSeconds 逻辑流逝时间
     */
    fixedUpdate?(elapseSeconds: number): void;
}
