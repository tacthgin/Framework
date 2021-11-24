import { Component, _decorator } from "cc";
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

interface A<T extends HelloWorldClass> {}

class C implements A<HelloWorldClass> {}

@ccclass("Test")
export class Test extends Component {
    start() {
        let b = ReferencePool.acquire(B);
        console.info(ReferencePool.getAllReferencePoolInfos());
        ReferencePool.release(b);
        console.info(ReferencePool.getAllReferencePoolInfos());
        ReferencePool.add(B, 3);
        console.info(ReferencePool.getAllReferencePoolInfos());
        ReferencePool.remove(B, 3);
        console.info(ReferencePool.getAllReferencePoolInfos());
    }
}
