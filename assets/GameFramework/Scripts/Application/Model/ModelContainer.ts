import { Constructor } from "../../Base/DataStruct/Constructor";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { GameFrameworkLinkedList, LinkedListNode } from "../../Base/GameFrameworkLinkedList";
import { ISaveManager } from "../../Save/ISaveManager";
import { IModel } from "./IModel";
import { ModelBase } from "./ModelBase";

/**
 * model容器
 */
export class ModelContainer {
    private static s_modelConstructors: Map<string, Constructor<ModelBase>> = new Map<string, Constructor<ModelBase>>();
    private static s_nameConstructors: Map<Constructor<ModelBase>, string> = new Map<Constructor<ModelBase>, string>();
    private _models: GameFrameworkLinkedList<ModelBase> = null!;
    private _cachedModels: Map<Constructor<ModelBase>, ModelBase> = null!;
    private _saveManager: ISaveManager | null = null;

    constructor() {
        this._models = new GameFrameworkLinkedList<ModelBase>();
        this._cachedModels = new Map<Constructor<ModelBase>, ModelBase>();
    }

    /**
     * 模型注册装饰函数
     * @param className 类名
     * @returns
     */
    static registerModel(className: string): (target: Constructor<ModelBase>) => void {
        return (target: Constructor<ModelBase>) => {
            this.s_modelConstructors.set(className, target);
            this.s_nameConstructors.set(target, className);
        };
    }

    update(elapseSeconds: number) {
        this._models.forEach((modelBase: ModelBase) => {
            modelBase.update(elapseSeconds);
        });
    }

    shutDown() {
        this._models.forEach((modelBase: ModelBase) => {
            modelBase.shutDown();
        });
    }

    setSaveManager(saveManager: ISaveManager) {
        this._saveManager = saveManager;
    }

    /**
     * 根据模型构造获取模型
     * @param constructor 模型构造器
     * @returns 模型
     */
    getModel<T extends IModel>(constructor: Constructor<T>): T {
        let ctor = constructor as unknown as Constructor<ModelBase>;
        let model = this._cachedModels.get(ctor);
        if (!model) {
            let className = ModelContainer.s_nameConstructors.get(ctor);
            if (className) {
                model = this.createModel(ctor);
            } else {
                throw new GameFrameworkError(`${className} model has not register`);
            }
        }
        return model as unknown as T;
    }

    /**
     * 根据模型类名获取模型
     * @param className 类名
     * @returns 模型
     */
    getModelWithName<T extends IModel>(className: string): T {
        let ctor = ModelContainer.s_modelConstructors.get(className);
        if (ctor) {
            let model = this._cachedModels.get(ctor);
            if (!model) {
                model = this.createModel(ctor);
            }
            return model as unknown as T;
        } else {
            throw new GameFrameworkError(`${className} model has not register`);
        }
    }

    /**
     * 创建模型
     * @param constructor 模型构造器
     * @returns 模型
     */
    private createModel<T extends ModelBase>(constructor: Constructor<T>): T {
        let model = new constructor();
        let node: LinkedListNode<ModelBase> | null = null;

        if (this._models.size > 0) {
            for (let current = this._models.first; current != null; current = current.next) {
                if (model.priority >= current.value.priority) {
                    node = current;
                    break;
                }
            }
        }

        if (node) {
            this._models.addBefore(node, model);
        } else {
            this._models.addLast(model);
        }

        this._cachedModels.set(constructor, model);

        return model;
    }
}
