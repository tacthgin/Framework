import { Component, find, _decorator } from "cc";
import { Constructor } from "../GameFramework/Scripts/Base/DataStruct/Constructor";
import { ConstructorNamePair } from "../GameFramework/Scripts/Base/DataStruct/ConstructorNamePair";
import { GameFrameworkLinkedList } from "../GameFramework/Scripts/Base/GameFrameworkLinkedList";
import { GameFrameworkMap } from "../GameFramework/Scripts/Base/GameFrameworkMap";
import { GameFrameworkLog } from "../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { WebLogHelp } from "../GameFramework/Scripts/Base/Log/WebLogHelp";
import { IRerference } from "../GameFramework/Scripts/Base/ReferencePool/IRerference";
import { ReferenceCollection } from "../GameFramework/Scripts/Base/ReferencePool/ReferenceCollection";
import { ReferencePool } from "../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { EventManager } from "../GameFramework/Scripts/Event/EventManager";
import { IEventManager } from "../GameFramework/Scripts/Event/IEventManager";
import { IObejctPoolManager } from "../GameFramework/Scripts/ObjectPool/IObejctPoolManager";
import { ObjectBase } from "../GameFramework/Scripts/ObjectPool/ObjectBase";
import { ObjectPoolManager } from "../GameFramework/Scripts/ObjectPool/ObjectPoolManager";
import { Utility } from "../GameFramework/Scripts/Utility/Utility";
import { Test2 } from "./Test2";
const { ccclass, property } = _decorator;

class B extends ObjectBase {
    constructor() {
        super();
    }
    clear(): void {}
}

class HelloWorldClass implements IRerference {
    clear(): void {}
}

interface A {}

class C<T> {}

@ccclass("Test")
export class Test extends Component {
    private a: number = 1;
    start() {
        let manager: IObejctPoolManager = new ObjectPoolManager();
        let objectPool = manager.createSingleSpawnObjectPool(B, "test b", 5, 10);
        for (let i = 0; i < 5; i++) {
            let b = new B();
            b.initialize("", new C());
            objectPool.register(b, true);
        }
        let results: any[] = [];
        manager.getAllObjectPools(true, results);
        console.log(results, manager.hasObjectPool(B, "test b"));

        let amap = new GameFrameworkMap<IEventManager, string>();
        amap.set(new EventManager(), "2");
        amap.set("1", "3");
        console.log(amap);

        for (let key of amap) {
            console.log(key);
            key[1].printList();
        }

        find("test2", this.node)?.getComponent(Test2)?.setCallback(this.testa);

        console.log(this.testa, this.testa.bind(this), this.testa == this.testa);
        // let list = new GameFrameworkLinkedList<number>();
        // list.addLast(3);
        // list.addLast(2);
        // list.addLast(1);
        // list.printList();

        // let node = list.get(2);
        // list.addBefore(node!, 4);
        // list.addAfter(node!, 5);
        // list.printList();
        // list.removeFirst();
        // list.removeFirst();
        // list.addFirst(7);
        // list.removeLast();
        // list.addLast(9);
        // list.addLast(10);
        // list.printList();
    }

    testa() {
        ++this.a;
        console.log("a", this, this.a);
    }
}
