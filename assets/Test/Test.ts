import { _decorator, Component, Node } from "cc";
import { DateUtility } from "../GameFramework/Scripts/Utility/DateUtility";
import { Random } from "../GameFramework/Scripts/Utility/Random";
const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends Component {
    start() {
        for (let i = 0; i < 100; i++) {
            console.log(Random.randomSeed(1, 3));
        }

        console.log(DateUtility.format(Date.now(), "hh:mm:ss"));
        console.log(DateUtility.formatInterval(100, "h:m:s"));
    }
}
