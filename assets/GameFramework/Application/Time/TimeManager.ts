import { GameFrameworkLinkedList, LinkedListNode } from "../../Script/Base/Container/GameFrameworkLinkedList";
import { GameFrameworkMap } from "../../Script/Base/Container/GameFrameworkMap";
import { GameFrameworkError } from "../../Script/Base/GameFrameworkError";
import { ReferencePool } from "../../Script/Base/ReferencePool/ReferencePool";
import { IScheduleBase } from "./Schedule/IScheduleBase";
import { ScheduleInfo } from "./Schedule/ScheduleInfo";

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
    /** 物理步长 */
    private static _fixedTimeStep: number = 1 / 60;
    /** 物理累计时间 */
    private static _fixedCurrentTime: number = 0;

    static set fixedTimeStep(value: number) {
        this._fixedTimeStep = value;
    }

    /**
     * 物理步长
     */
    static get fixedTimeStep(): number {
        return this._fixedTimeStep;
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
     * 从帧更新池放入或者拿出
     * @param target 定时器目标
     * @param addOrRemove 放入(true)还是拿出(false)
     */
    static addOrRemoveFromUpdatePool(target: IScheduleBase, addOrRemove: boolean): void {
        if (addOrRemove) {
            this._updateSet.add(target);
        } else {
            this._updateSet.delete(target);
        }
    }

    /**
     * 从物理帧更新池放入或者拿出
     * @param target 定时器目标
     * @param addOrRemove 放入(true)还是拿出(false)
     */
    static addOrRemoveFromFixedUpdatePool(target: IScheduleBase, addOrRemove: boolean): void {
        if (addOrRemove) {
            this._fixedUpdateSet.add(target);
            if (!target.fixedUpdate) {
                throw new GameFrameworkError("you must set fixedUpdate function first");
            }
        } else {
            this._fixedUpdateSet.delete(target);
            if (this._fixedUpdateSet.size == 0) {
                this._fixedCurrentTime = 0;
            }
        }
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
                scheduleBase.update(elapseSeconds);
            }
        }
    }

    /**
     * 每物理帧轮询
     * @param elapseSeconds 逻辑流逝时间
     */
    private static internalFixedUpdate(elapseSeconds: number): void {
        if (this._fixedUpdateSet.size > 0) {
            this._fixedCurrentTime += elapseSeconds;
            while (this._fixedCurrentTime >= this._fixedTimeStep) {
                for (let scheduleBase of this._fixedUpdateSet) {
                    scheduleBase.fixedUpdate!(this._fixedTimeStep);
                }

                this._fixedCurrentTime -= this._fixedTimeStep;
            }
        }
    }
}
