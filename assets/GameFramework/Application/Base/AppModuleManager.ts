import { Constructor } from "../../Script/Base/DataStruct/Constructor";
import { GameFrameworkError } from "../../Script/Base/GameFrameworkError";
import { TimeManager } from "../Time/TimeManager";

export class AppModuleManager {
    private static s_appModules: Map<string, object> = new Map<string, object>();
    private static s_appModulesConstrustor: Map<string, Constructor> = new Map<string, Constructor>();

    static update(elapseSeconds: number): void {
        TimeManager.update(elapseSeconds);
    }

    static registerModule(className: string): (target: Constructor) => void {
        return (target: Constructor) => {
            this.s_appModulesConstrustor.set(className, target);
        };
    }

    static getModule<T extends object>(className: string): T {
        let module = this.s_appModules.get(className);
        if (!module) {
            let moduleConstructor = this.s_appModulesConstrustor.get(className);
            if (!moduleConstructor) {
                throw new GameFrameworkError(`${className} can't find app module`);
            }
            module = new moduleConstructor();
            this.s_appModules.set(className, module);
        }
        return module as unknown as T;
    }
}
