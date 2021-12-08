import { Constructor } from "./DataStruct/Constructor";
import { GameFrameworkLinkedList, LinkedListNode } from "./GameFrameworkLinkedList";
import { GameFrameworkModule } from "./GameFrameworkModule";

export class GameFrameworkEntry {
    private static s_gameFrameworkModules: GameFrameworkLinkedList<GameFrameworkModule> = new GameFrameworkLinkedList<GameFrameworkModule>();
    private static s_gameFrameworkModulesConstrustor: Map<Constructor, string> = new Map<Constructor, string>();

    static createModules(): void {
        this.s_gameFrameworkModulesConstrustor.forEach((flag: string, constructor: Constructor) => {
            this.createModule(constructor);
        });
    }

    static registerModule(interfaceFlag: string): (target: Constructor) => void {
        return (target: Constructor) => {
            this.s_gameFrameworkModulesConstrustor.set(target, interfaceFlag);
        };
    }

    static getModule<T>(): T | null {
        for (let listNode of this.s_gameFrameworkModules) {
            let interfaceFlag = this.s_gameFrameworkModulesConstrustor.get(listNode.value!.constructor as Constructor);
            if (interfaceFlag && this.isInterface<T>(listNode.value!, interfaceFlag)) {
                return listNode.value! as T;
            }
        }
        return null;
    }

    private static isInterface<T>(obj: any, interfaceFlag: string): obj is T {
        return interfaceFlag in obj;
    }

    private static createModule(constructor: Constructor): void {
        let module: GameFrameworkModule = new constructor() as GameFrameworkModule;
        let node: LinkedListNode<GameFrameworkModule> | null = null;
        if (this.s_gameFrameworkModules.size > 0) {
            for (let listNode of this.s_gameFrameworkModules) {
                if (module.priority >= listNode.value!.priority) {
                    node = listNode;
                    break;
                }
            }
        }
        if (node) {
            this.s_gameFrameworkModules.addBefore(node, module);
        } else {
            this.s_gameFrameworkModules.addLast(module);
        }
    }
}
