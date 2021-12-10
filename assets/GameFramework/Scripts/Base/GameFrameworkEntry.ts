import { Constructor } from "./DataStruct/Constructor";
import { GameFrameworkError } from "./GameFrameworkError";
import { GameFrameworkLinkedList, LinkedListNode } from "./GameFrameworkLinkedList";
import { GameFrameworkModule } from "./GameFrameworkModule";

export class GameFrameworkEntry {
    private static s_gameFrameworkModules: GameFrameworkLinkedList<GameFrameworkModule> = new GameFrameworkLinkedList<GameFrameworkModule>();
    private static s_gameFrameworkModulesConstrustor: Map<string, Constructor> = new Map<string, Constructor>();
    private static s_cachedGameFrameworkModule: Map<string, GameFrameworkModule> = new Map<string, GameFrameworkModule>();

    static update(elapseSeconds: number): void {
        this.s_gameFrameworkModules.forEach((node: LinkedListNode<GameFrameworkModule>) => {
            node.value.update(elapseSeconds);
        });
    }

    static shutDown(): void {
        for (let current = this.s_gameFrameworkModules.last; current != null; current = current.previous) {
            current.value.shutDown();
        }
        this.s_cachedGameFrameworkModule.clear();
        this.s_gameFrameworkModulesConstrustor.clear();
    }

    static registerModule(className: string): (target: Constructor) => void {
        return (target: Constructor) => {
            this.s_gameFrameworkModulesConstrustor.set(className, target);
        };
    }

    static getModule<T>(className: string): T {
        let module = this.s_cachedGameFrameworkModule.get(className);
        if (!module) {
            let moduleConstructor = this.s_gameFrameworkModulesConstrustor.get(className);
            if (!moduleConstructor) {
                throw new GameFrameworkError(`${className} can't find module`);
            }
            module = this.createModule(moduleConstructor);
            this.s_cachedGameFrameworkModule.set(className, module);
        }
        return module as unknown as T;
    }

    private static createModule(constructor: Constructor): GameFrameworkModule {
        let module: GameFrameworkModule = new constructor() as GameFrameworkModule;
        let node: LinkedListNode<GameFrameworkModule> | null = null;
        if (this.s_gameFrameworkModules.size > 0) {
            for (let listNode of this.s_gameFrameworkModules) {
                if (module.priority >= listNode.value.priority) {
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

        return module;
    }
}
