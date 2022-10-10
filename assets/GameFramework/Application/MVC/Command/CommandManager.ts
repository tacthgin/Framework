import { CommandBase } from "./CommandBase";
import { CommandObject } from "./CommandObject";
import { ICommandManager } from "./ICommandManager";
import { SystemBase } from "../System/SystemBase";

/**
 * 命令、系统管理器
 */
export class CommandManager implements ICommandManager {
    private static readonly s_nameConstructors: Map<Constructor<CommandBase | SystemBase>, string> = new Map<Constructor<CommandBase | SystemBase>, string>();
    private static readonly s_scheduleConstructors: Map<Constructor<CommandBase | SystemBase>, boolean> = new Map<Constructor<CommandBase | SystemBase>, boolean>();
    private _objectPoolManager: IObejctPoolManager | null = null;
    private _commandPool: IObjectPool<CommandObject> = null!;

    set commandAutoRelaseInterval(value: number) {
        this._commandPool.autoReleaseInterval = value;
    }

    get commandAutoRelaseInterval(): number {
        return this._commandPool.autoReleaseInterval;
    }

    set commandCapacity(value: number) {
        this._commandPool.capacity = value;
    }

    get commandCapacity(): number {
        return this._commandPool.capacity;
    }

    set commandExpireTime(value: number) {
        this._commandPool.expireTime = value;
    }

    get commandExpireTime(): number {
        return this._commandPool.expireTime;
    }

    set commandPriority(value: number) {
        this._commandPool.priority = value;
    }

    get commandPriority(): number {
        return this._commandPool.priority;
    }

    static registerCommand(className: string): (target: Constructor<CommandBase>) => void {
        return (target: Constructor<CommandBase>) => {
            this.s_nameConstructors.set(target, className);
        };
    }

    /**
     * 轮询命令
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number) {
        for (let system of this._updateSystemPool) {
            system.update(elapseSeconds);
        }
    }

    /**
     * 关闭命令管理器
     */
    shutDown() {
        this._updateSystemPool.clear();
        this._uniqueSystems.clear();
    }

    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void {
        this._objectPoolManager = objectPoolManager;
        this._commandPool = this._objectPoolManager.createSingleSpawnObjectPool(CommandObject, "command pool");
        this._systemPool = this._objectPoolManager.createSingleSpawnObjectPool(CommandObject, "system pool");
    }

    createCommand<T extends CommandBase>(commandConstructor: Constructor<T>): T {
        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        let name = CommandManager.s_nameConstructors.get(commandConstructor);
        if (!name) {
            throw new GameFrameworkError(`command does not reigster`);
        }

        let commandObject: CommandObject | null = this._commandPool.spawn(name);
        if (!commandObject) {
            commandObject = CommandObject.create(name, ReferencePool.acquire(commandConstructor));
            this._commandPool.register(commandObject, true);
        }

        return commandObject.target as T;
    }

    destroyCommand<T extends CommandBase>(command: T): void {
        this._commandPool.upspawn(command);
    }
}
