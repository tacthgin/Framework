import { assetManager, Component, find, resources, Sprite, SpriteFrame, _decorator } from "cc";
import { GameApp } from "../GameFramework/Scripts/Application/GameApp";
import { Constructor } from "../GameFramework/Scripts/Base/DataStruct/Constructor";
import { ConstructorNamePair } from "../GameFramework/Scripts/Base/DataStruct/ConstructorNamePair";
import { GameFrameworkEntry } from "../GameFramework/Scripts/Base/GameFrameworkEntry";
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
    @property(Sprite)
    private testSp: Sprite = null!;

    start() {
        //GameFrameworkEntry.getModule<IEventManager>("EventManager").subscribe(1, this.onCallback, this);
        this.testC();
    }

    onCallback(sender: object, e: any) {
        console.log("receive sender", sender, e);
    }

    testb() {}

    testa() {
        ++this.a;
        console.log("a", this, this.a);
    }

    async testC() {
        console.log(Date.now());
        let sp = await GameApp.ResourceManager.internalResourceLoader.loadAssetWithCallback("1/player_down_0", SpriteFrame, null, (err, data) => {
            console.log(GameApp.ResourceManager.internalResourceLoader.getAsset("1/player_down_0", SpriteFrame), data);
        });
        console.log(Date.now());
    }
}
