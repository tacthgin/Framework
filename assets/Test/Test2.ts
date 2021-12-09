import { _decorator, Component, Node } from "cc";
import { GameFrameworkEntry } from "../GameFramework/Scripts/Base/GameFrameworkEntry";
import { GameEventArgs } from "../GameFramework/Scripts/Event/GameEventArgs";
import { IEventManager } from "../GameFramework/Scripts/Event/IEventManager";
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
        this.scheduleOnce(() => {
            GameFrameworkEntry.getModule<IEventManager>("EventManager").fireNow(this, new CustomEventArgs());
        }, 5);
    }

    setCallback(callback: Function, thisArg?: any) {
        this.callback = callback;

        this.callback.call(thisArg);
    }
}
