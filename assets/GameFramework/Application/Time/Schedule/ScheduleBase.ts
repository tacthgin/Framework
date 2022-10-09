import { IScheduleBase } from "./IScheduleBase";
import { TimeManager } from "../TimeManager";
import { GameFrameworkError } from "../../../Script/Base/GameFrameworkError";

/** 定时器基类 */
export class ScheduleBase implements IScheduleBase {
    private _isUpdate: boolean = false;
    private _isFiexedUpdate: boolean = false;

    set isUpdate(value: boolean) {
        if (this._isUpdate === value) return;
        this._isUpdate = value;
        TimeManager.addOrRemoveFromUpdatePool(this, this._isUpdate);
    }

    /** 是否需要每帧更新 */
    get isUpdate(): boolean {
        return this._isUpdate;
    }

    set isFixedUpdate(value: boolean) {
        if (this._isFiexedUpdate === value) return;
        this._isFiexedUpdate = value;
        TimeManager.addOrRemoveFromFixedUpdatePool(this, this._isFiexedUpdate);
    }

    /** 是否需要每物理帧更新 */
    get isFixedUpdate(): boolean {
        return this._isFiexedUpdate;
    }

    clear(): void {
        this.unscheduleAll();
        this.isUpdate = false;
        this.isFixedUpdate = false;
    }

    /**
     * 开启定时器
     * @param handler 回调函数
     * @param interval 定时器间隔
     * @param count 定时个数,默认为无限大
     * @param priority 定时器优先级
     */
    schedule(handler: Function, interval: number, count: number = Number.MAX_SAFE_INTEGER, priority: number = 0): void {
        TimeManager.schedule(handler, this, interval, count, priority);
    }

    /**
     * 开启一次定时器
     * @param handler 回调函数
     * @param interval 定时器间隔
     * @param priority 定时器优先级
     */
    scheduleOnce(handler: Function, interval: number, priority: number = 0): void {
        this.schedule(handler, interval, 1, priority);
    }

    /**
     * 取消定时器
     * @param handler 回调函数
     */
    unschedule(handler: Function): void {
        TimeManager.unschedule(handler, this);
    }

    /**
     * 取消所有定时器
     */
    unscheduleAll(): void {
        TimeManager.unscheduleAll(this);
    }

    /**
     * 睡眠
     * @param seconds 睡眠秒数
     * @returns
     */
    sleep(seconds: number): Promise<boolean> {
        if (seconds < 0) {
            throw new GameFrameworkError("seconds is invalid");
        }

        return new Promise<boolean>((resolve) => {
            this.scheduleOnce(() => {
                resolve(true);
            }, seconds);
        });
    }

    /**
     * 轮询定时器
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number): void {}
}
