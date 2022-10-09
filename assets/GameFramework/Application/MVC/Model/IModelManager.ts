import { Constructor } from "../../../Script/Base/DataStruct/Constructor";
import { ISaveManager } from "../../../Script/Save/ISaveManager";
import { IModel } from "./IModel";

export interface IModelManager {
    /**
     * 设置存储管理器
     * @param saveManager 存储管理器
     */
    setSaveManager(saveManager: ISaveManager): void;

    /**
     * 初始化所有模型
     */
    initModels(): void;

    /**
     * 根据模型构造获取模型
     * @param constructor 模型构造器
     * @returns 模型
     */
    getModel<T extends IModel>(constructor: Constructor<T>): T;

    /**
     * 根据模型类名获取模型
     * @param className 类名
     * @returns 模型
     */
    getModelWithName<T extends IModel>(className: string): T;
}
