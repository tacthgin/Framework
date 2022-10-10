import { GameFrameworkLinkedList, LinkedListNode } from "../../Script/Base/Container/GameFrameworkLinkedList";
import { GameFrameworkMap } from "../../Script/Base/Container/GameFrameworkMap";
import { GameFrameworkError } from "../../Script/Base/GameFrameworkError";
import { ReferencePool } from "../../Script/Base/ReferencePool/ReferencePool";
import { IScheduleBase } from "./Schedule/IScheduleBase";
import { ScheduleInfo } from "./Schedule/ScheduleInfo";
import { TimeInfo } from "./TimeInfo";

/**
 * 时间管理器
 */
export class TimeManager {
    /** 定时器句柄 */
    private static readonly _scheduleHandlers: GameFrameworkLinkedList<ScheduleInfo> = new GameFrameworkLinkedList<ScheduleInfo>();
    /** 定时器信息字典 */
    private static readonly _scheduleInfoMap: GameFrameworkMap<IScheduleBase, ScheduleInfo> = new GameFrameworkMap<IScheduleBase, ScheduleInfo>();
    /** 帧更新集合 */
    private static readonly _updateSet: Set<IScheduleBase> = new Set<IScheduleBase>();
    /** 物理帧更新集合 */
    private static readonly _fixedUpdateSet: Set<IScheduleBase> = new Set<IScheduleBase>();
    /** 时间相关的配置 */
    private static _timeInfo: TimeInfo = new TimeInfo();

    static set fixedTimeStep(value: number) {
        this._timeInfo.fixedTimeStep = value;
    }

    /**
     * 物理步长
     */
    static get fixedTimeStep(): number {
        return this._timeInfo.fixedTimeStep;
    }

    /**
     * 开启定时器
     * @param handler 回调函数
     * @param target 定时器目标
     * @param interval 定时器间隔
     * @param count 定时个数,默认为无限大
     * @param priority 定时器优先级
     */
    static schedule(handler: Function, target: IScheduleBase, interval: number, count: number = Number.MAX_SAFE_INTEGER, priority: number = 0): void {
        if (interval < 0) {
            throw new GameFrameworkError("interval is invalid");
        }

        if (count <= 0) {
            throw new GameFrameworkError("count is invalid");
        }

        let currentScheduleInfo = ScheduleInfo.create(handler, target, interval, count, priority);
        let node: LinkedListNode<ScheduleInfo> | null = this._scheduleHandlers.find((scheduleInfo) => {
            return currentScheduleInfo.priority >= scheduleInfo.priority;
        });

        if (node) {
            this._scheduleHandlers.addBefore(node, currentScheduleInfo);
        } else {
            this._scheduleHandlers.addLast(currentScheduleInfo);
        }

        this._scheduleInfoMap.set(target, currentScheduleInfo);
    }

    /**
     * 取消定时器
     * @param handler 回调函数
     * @param target 定时器目标
     */
    static unschedule(handler: Function, target: IScheduleBase): void {
        let scheduleHandles = this._scheduleInfoMap.get(target);
        if (scheduleHandles) {
            let node = scheduleHandles.find((scheduleInfo: ScheduleInfo) => {
                return scheduleInfo.handler === handler && scheduleInfo.target === target;
            }, this);

            if (node) {
                ReferencePool.release(node.value);
                this._scheduleHandlers.remove(node);
                scheduleHandles.remove(node);
            }
        }
    }

    /**
     * 取消目标上的所有定时器
     * @param target 定时器目标
     */
    static unscheduleAll(target: IScheduleBase): void {
        let scheduleHandles = this._scheduleInfoMap.get(target);
        if (scheduleHandles) {
            let current = scheduleHandles.first;
            let next: LinkedListNode<ScheduleInfo> | null = null;
            while (current) {
                next = current.next;
                ReferencePool.release(current.value);
                this._scheduleHandlers.remove(current);
                current = next;
            }

            scheduleHandles.clear();
        }
    }

    /**
     * 添加更新目标
     * @param target 目标
     */
    static addTarget(target: IScheduleBase) {
        target?.update && this._updateSet.add(target);
        target?.fixedUpdate && this._fixedUpdateSet.add(target);
    }

    /**
     * 移除更新目标
     * @param target 目标
     */
    static removeTarget(target: IScheduleBase) {
        target?.update && this._updateSet.delete(target);
        if (target?.fixedUpdate) {
            this._fixedUpdateSet.delete(target);
            if (this._fixedUpdateSet.size == 0) {
                this._timeInfo.fixedCurrentTime = 0;
            }
        }

        this.unscheduleAll(target);
    }

    /**
     * 轮询定时器
     * @param elapseSeconds 逻辑流逝时间
     */
    static update(elapseSeconds: number): void {
        this.internalFixedUpdate(elapseSeconds);
        this.internalUpdate(elapseSeconds);
    }

    /**
     * 每帧轮询
     * @param elapseSeconds 逻辑流逝时间
     */
    private static internalUpdate(elapseSeconds: number): void {
        if (this._scheduleHandlers.size > 0) {
            let current: LinkedListNode<ScheduleInfo> | null = this._scheduleHandlers.first;
            let next: LinkedListNode<ScheduleInfo> | null = null;
            let value: any = null;
            while (current) {
                value = current.value;
                value.update(elapseSeconds);
                if (value.isStoped()) {
                    next = current.next;
                    ReferencePool.release(value);
                    this._scheduleHandlers.remove(current);
                    this._scheduleInfoMap.delete(value.target, value);
                    current = next;
                } else {
                    current = current.next;
                }
            }
        }

        if (this._updateSet.size > 0) {
            for (let scheduleBase of this._updateSet) {
                scheduleBase.update!(elapseSeconds);
            }
        }
    }

    /**
     * 每物理帧轮询
     * @param elapseSeconds 逻辑流逝时间
     */
    private static internalFixedUpdate(elapseSeconds: number): void {
        if (this._fixedUpdateSet.size > 0) {
            let fixedTimeStep = this._timeInfo.fixedTimeStep;
            this._timeInfo.fixedCurrentTime += elapseSeconds;
            while (this._timeInfo.fixedCurrentTime >= fixedTimeStep) {
                for (let scheduleBase of this._fixedUpdateSet) {
                    scheduleBase.fixedUpdate!(fixedTimeStep);
                }
                this._timeInfo.fixedCurrentTime -= fixedTimeStep;
            }
        }
    }
}
