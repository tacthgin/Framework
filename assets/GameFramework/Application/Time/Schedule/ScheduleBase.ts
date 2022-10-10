import { IScheduleBase } from "./IScheduleBase";
import { TimeManager } from "../TimeManager";
import { GameFrameworkError } from "../../../Script/Base/GameFrameworkError";

/** 定时器基类 */
export class ScheduleBase implements IScheduleBase {
    private _pause: boolean = false;

    set pause(value: boolean) {
        this._pause = value;
    }

    get pause(): boolean {
        return this._pause;
    }

    awake(): void {
        TimeManager.addTarget(this);
    }

    clear(): void {
        TimeManager.removeTarget(this);
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
}
