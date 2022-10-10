
import { CommandBase } from "./CommandBase";

/**
 * 命令管理器接口
 */
export interface ICommandManager {
    /**
     * 设置或者获取命令对象池自动释放间隔
     */
    commandAutoRelaseInterval: number;

    /**
     * 设置或者获取命令对象池容量
     */
    commandCapacity: number;

    /**
     * 设置或者获取命令对象池过期时间
     */
    commandExpireTime: number;

    /**
     * 设置或者获取命令对象池优先级
     */
    commandPriority: number;

    /**
     * 设置对象池管理器
     * @param objectPoolManager 对象池管理器
     */
    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void;

    /**
     * 根据命令构造器获取命令
     * @param commandConstructor 命令构造器
     * @returns 命令
     */
    createCommand<T extends CommandBase>(commandConstructor: Constructor<T>): T;

    /**
     * 清理命令
     * @param command 命令
     */
    destroyCommand<T extends CommandBase>(command: T): void;
}
