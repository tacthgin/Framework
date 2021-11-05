import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    start() {
        for (let i = 0; i < 100; i++) {
            console.log(Utility.Random.randomSeed(1, 3));
        }
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
