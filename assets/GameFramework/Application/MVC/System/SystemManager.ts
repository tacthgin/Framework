import { GameFrameworkLinkedList } from "../../../Script/Base/Container/GameFrameworkLinkedList";
import { Constructor } from "../../../Script/Base/DataStruct/Constructor";
import { GameFrameworkError } from "../../../Script/Base/GameFrameworkError";
import { ReferencePool } from "../../../Script/Base/ReferencePool/ReferencePool";
import { AppModuleManager } from "../../Base/AppModuleManager";
import { CommandObject } from "../Command/CommandObject";
import { ISystemManager } from "./ISystemManager";
import { SystemBase } from "./SystemBase";

/**
 * 系统管理器
 */
@AppModuleManager.registerModule("SystemManager")
export class SystemManager implements ISystemManager {
    private static readonly s_nameConstructors: Map<Constructor<SystemBase>, string> = new Map<Constructor<SystemBase>, string>();
    private static readonly s_scheduleConstructors: Map<Constructor<SystemBase>, boolean> = new Map<Constructor<SystemBase>, boolean>();
    private _uniqueSystems: Map<Constructor<SystemBase>, SystemBase> = null!;

    constructor() {
        this._uniqueSystems = new Map<Constructor<SystemBase>, SystemBase>();
    }

    /**
     * 注册装饰函数
     * @param className 类名
     * @param 打开系统定时器
     * @returns
     */
    static registerSystem(className: string, openSchedule: boolean = false): (target: Constructor<SystemBase>) => void {
        return (target: Constructor<SystemBase>) => {
            this.s_nameConstructors.set(target, className);
            this.s_scheduleConstructors.set(target, openSchedule);
        };
    }

    /**
     * 关闭命令管理器
     */
    shutDown() {
        this._uniqueSystems.clear();
    }

    createSystem<T extends SystemBase>(systemConstructor: Constructor<T>): T {
        let name = SystemManager.s_nameConstructors.get(systemConstructor);
        if (!name) {
            throw new GameFrameworkError(`system does not reigster`);
        }

        let commandObject: CommandObject | null = this._systemPool.spawn(name);
        let system: T | null = null;
        if (!commandObject) {
            system = ReferencePool.acquire(systemConstructor);
            commandObject = CommandObject.create(name, system);
            this._systemPool.register(commandObject, true);
        } else {
            system = commandObject.target as T;
        }

        system.awake();

        return system;
    }

    destroySystem<T extends SystemBase>(system: T): void {}

    createUniqueSystem<T extends SystemBase>(systemConstructor: Constructor<T>): T {}

    destroyUniqueSystem<T extends SystemBase>(systemConstructor: Constructor<T>): boolean {}
}
