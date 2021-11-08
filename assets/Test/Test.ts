import { Component, _decorator } from "cc";
import { Utility } from "../GameFramework/Scripts/Utility/Utility";
const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends Component {
    start() {
        console.log(Utility.Random.randomInt(1, 3));
        console.log(Utility.Date.format(Date.now(), "h:m:s"));
    }
}
