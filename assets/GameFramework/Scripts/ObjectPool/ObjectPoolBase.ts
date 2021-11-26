import { ObjectBase } from "./ObjectBase";

/**
 * 对象池基类
 */
export abstract class ObjectPoolBase<T extends ObjectBase> {
    protected _name: string = "";
    protected _allowMultiSpawn: boolean = false;
    /**
     * 对象池名字
     */
    abstract get name(): string;

    /**
     * 当前对象池元素数量
     */
    abstract get count(): number;

    /**
     * 设置对象池容量
     */
    abstract set capacity(value: number);

    /**
     * 对象池容量
     */
    abstract get capacity(): number;

    /**
     *  设置对象池自动释放可释放对象的间隔秒数。
     */
    abstract set autoReleaseInterval(value: number);

    /**
     *  获取对象池自动释放可释放对象的间隔秒数。
     */
    abstract get autoReleaseInterval(): number;

    /**
     *  设置对象池过期时间。
     */
    abstract set expireTime(value: number);

    /**
     *  获取对象池过期时间。
     */
    abstract get expireTime();

    /**
     *  设置对象池的优先级。
     */
    abstract set priority(value: number);

    /**
     *  获取对象池的优先级。
     */
    abstract get priority();

    /**
     *  设置对象池中对象优先级
     */
    abstract setPriority(targetOrObject: object | T, priority: number): void;

    /**
     *  锁定对象池中对象
     */
    abstract setLocked(targetOrObject: object | T, locked: boolean): void;

    /**
     * 创建对象
     * @param obj 对象
     * @param spawned 对象是否已被获取
     */
    abstract register(obj: T, spawned: boolean): void;

    /**
     * 是否可以获取对象
     */
    abstract canSpawn(name: string): boolean;

    /**
     * 获取对象
     */
    abstract spawn(name: string): T | null;

    /**
     * 回收对象
     * @param obj
     */
    abstract upspawn(obj: T): void;

    /**
     * 释放对象。
     */
    abstract releaseObject(objectOrTarget: T | object): boolean;

    /**
     * 释放对象池中的可释放对象。
     */
    abstract release(): void;

    /**
     * 释放对象池中的所有未使用的对象
     */
    abstract releaseAllUnused(): void;

    abstract update(elapseSeconds: number): void;

    /**
     * 清理对象池
     */
    abstract shutDown(): void;
}
