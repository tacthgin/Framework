import { Component, _decorator } from "cc";
import { GameFrameworkLog } from "../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { WebLogHelp } from "../GameFramework/Scripts/Base/Log/WebLogHelp";
import { IRerference } from "../GameFramework/Scripts/Base/ReferencePool/IRerference";
import { ReferenceCollection } from "../GameFramework/Scripts/Base/ReferencePool/ReferenceCollection";
import { Utility } from "../GameFramework/Scripts/Utility/Utility";
const { ccclass, property } = _decorator;

class B implements IRerference {
    constructor() {}
    clear(): void {
        throw new Error("Method not implemented.");
    }
}

class HelloWorldClass {}

interface A<T extends HelloWorldClass> {}

class C implements A<HelloWorldClass> {}

@ccclass("Test")
export class Test extends Component {
    start() {
        console.log(Utility.Random.randomInt(1, 3));
        console.log(Utility.Date.format(Date.now(), "h:m:s"));

        let a = {
            [HelloWorldClass.name]: 123,
        };
        console.log(typeof B, new B());

        let collection = new ReferenceCollection(HelloWorldClass);
        collection.acquire(B);

        let aa: { [key: { new (): any }]: number } | null = null;
    }
}
