import { Component, _decorator } from "cc";
import { Constructor } from "../GameFramework/Scripts/Base/DataStruct/Constructor";
import { ConstructorNamePair } from "../GameFramework/Scripts/Base/DataStruct/ConstructorNamePair";
import { GameFrameworkLog } from "../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { WebLogHelp } from "../GameFramework/Scripts/Base/Log/WebLogHelp";
import { IRerference } from "../GameFramework/Scripts/Base/ReferencePool/IRerference";
import { ReferenceCollection } from "../GameFramework/Scripts/Base/ReferencePool/ReferenceCollection";
import { ReferencePool } from "../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { Utility } from "../GameFramework/Scripts/Utility/Utility";
const { ccclass, property } = _decorator;

class B implements IRerference {
    constructor() {}
    clear(): void {}
}

class HelloWorldClass implements IRerference {
    clear(): void {}
}

interface A {}

class C<T> {}

@ccclass("Test")
export class Test extends Component {
    start() {
        let map: Map<ConstructorNamePair<B>, string> = new Map<ConstructorNamePair<B>, string>();
        map.set(new ConstructorNamePair(B), "hhaha");
        console.log(map.has(new ConstructorNamePair(B)));
        Symbol.toPrimitive
    }
}
