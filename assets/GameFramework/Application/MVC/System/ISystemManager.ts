import { Constructor } from "../../../Script/Base/DataStruct/Constructor";
import { SystemBase } from "./SystemBase";

/**
 * 命令管理器接口
 */
export interface ISystemManager {
    /**
     * 根据系统构造器获取系统
     * @param systemConstructor 系统构造器
     * @returns 系统
     */
    createSystem<T extends SystemBase>(systemConstructor: Constructor<T>): T;

    /**
     * 清理系统
     * @param system 系统
     */
    destroySystem<T extends SystemBase>(system: T): void;

    /**
     * 根据系统构造器获取唯一实例系统
     * @param systemConstructor 系统构造器
     * @returns 唯一实例系统
     */
    createUniqueSystem<T extends SystemBase>(systemConstructor: Constructor<T>): T;

    /**
     * 清理唯一实例系统
     * @param system 系统
     * @returns 删除唯一实例系统是否成功
     */
    destroyUniqueSystem<T extends SystemBase>(systemConstructor: Constructor<T>): boolean;
}
