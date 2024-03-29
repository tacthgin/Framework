import { _decorator, Component, Node, macro } from "cc";
import { GameEventArgs } from "../GameFramework/Script/Event/GameEventArgs";
const { ccclass, property } = _decorator;

class CustomEventArgs extends GameEventArgs {
    get id(): number {
        return 1;
    }

    clear(): void {}
}

@ccclass("Test2")
export class Test2 extends Component {
    private callback: Function | null = null;

    start() {
        // this.scheduleOnce(() => {
        //     GameFrameworkEntry.getModule<IEventManager>("EventManager").fireNow(this, new CustomEventArgs());
        // }, 5);
    }

    setCallback(callback: Function, thisArg?: any) {
        this.callback = callback;

        this.callback.call(thisArg);
    }
}
