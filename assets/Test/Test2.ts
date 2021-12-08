import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Test2")
export class Test2 extends Component {
    private callback: Function | null = null;

    onLoad() {
        
    }

    setCallback(callback: Function, thisArg?: any) {
        this.callback = callback;

        this.callback();
    }
}
