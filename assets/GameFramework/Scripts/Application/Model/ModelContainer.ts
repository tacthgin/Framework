import { Constructor } from "../../Base/DataStruct/Constructor";
import { IModel } from "./IModel";

export class ModelContainer {
    private static s_models: Map<Constructor<IModel>, IModel> = new Map<Constructor<IModel>, IModel>();

    static registerModel(): (target: Constructor<IModel>) => void {
        return (target: Constructor<IModel>) => {
            //this.s_models.set(className, target);
        };
    }

    static getModel(constructor: Constructor<IModel>) {
        let model = this.s_models.get;
    }

    createModel(constructor: Constructor<IModel>) {}
}
