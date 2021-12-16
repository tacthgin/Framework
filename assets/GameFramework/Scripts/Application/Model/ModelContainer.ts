import { Constructor } from "../../Base/DataStruct/Constructor";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { GameFrameworkLinkedList, LinkedListNode } from "../../Base/GameFrameworkLinkedList";
import { IModel } from "./IModel";
import { ModelBase } from "./ModelBase";

/**
 * model容器
 */
export class ModelContainer {
    private static s_modelConstructors: Array<Constructor<ModelBase>> = new Array<Constructor<ModelBase>>();
    private _models: GameFrameworkLinkedList<ModelBase> = null!;
    private _cachedModels: Map<Constructor<ModelBase>, ModelBase> = null!;

    constructor() {
        this._models = new GameFrameworkLinkedList<ModelBase>();
        this._cachedModels = new Map<Constructor<ModelBase>, ModelBase>();
    }

    static registerModel(): (target: Constructor<ModelBase>) => void {
        return (target: Constructor<ModelBase>) => {
            this.s_modelConstructors.push(target);
        };
    }

    update(elapseSeconds: number) {
        this._models.forEach((node: LinkedListNode<ModelBase>) => {
            node.value.update(elapseSeconds);
        });
    }

    shutDown() {
        this._models.forEach((node: LinkedListNode<ModelBase>) => {
            node.value.shutDown();
        });
    }

    getModel<T extends IModel>(constructor: Constructor<T>): T {
        let ctor = constructor as unknown as Constructor<ModelBase>;
        let model = this._cachedModels.get(ctor);
        if (!model) {
            let index = ModelContainer.s_modelConstructors.indexOf(ctor);
            if (index != -1) {
                model = this.createModel(ctor);
            } else {
                throw new GameFrameworkError("model has not register");
            }
        }
        return model as unknown as T;
    }

    private createModel<T extends ModelBase>(constructor: Constructor<T>): T {
        let model = new constructor();
        let node: LinkedListNode<ModelBase> | null = null;

        if (this._models.size > 0) {
            for (let listNode of this._models) {
                if (model.priority >= listNode.value.priority) {
                    node = listNode;
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
