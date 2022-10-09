import { Constructor } from "../../Script/Base/DataStruct/Constructor";
import { IModel } from "../MVC/Model/IModel";
import { TimeManager } from "../Time/TimeManager";

export class AppModuleManager {
    static getModule<T>(name: string): T {}

    static getModel<T extends IModel>(constructor: Constructor<T>): T {}

    static update(elapseSeconds: number): void {
        TimeManager.update(elapseSeconds);
    }
}
