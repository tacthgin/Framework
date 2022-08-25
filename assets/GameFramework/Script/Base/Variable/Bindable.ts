import { GameFrameworkMap } from "../Container/GameFrameworkMap";
import { GameFrameworkError } from "../GameFrameworkError";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { Variable } from "./Variable";

export type BindableEventHandle<T> = (value: T) => void;

/**
 * 数据绑定
 */
export class Bindable<T> extends Variable<T> {
    private _eventPool: GameFrameworkMap<object | undefined, BindableEventHandle<T>> = null!;

    constructor() {
        super();
        this._eventPool = new GameFrameworkMap<object | undefined, BindableEventHandle<T>>();
    }

    set value(value: T) {
        if (this.value === value) {
            return;
        }
        super.value = value;
        this.fireNow();
    }

    get value(): T {
        return super.value;
    }

    clear(): void {
        super.clear();
        this._eventPool.clear();
    }

    static create<T>(defeultValue: T | null = null): Bindable<T> {
        let bindable = ReferencePool.acquire<Bindable<T>>(Bindable);
        if (defeultValue !== null) {
            bindable.value = defeultValue;
        }
        return bindable;
    }

    check(eventHandler: BindableEventHandle<T>, thisArg?: object) {
        return this._eventPool.has(thisArg, eventHandler);
    }

    subscribe(eventHandler: BindableEventHandle<T>, thisArg?: object) {
        this._eventPool.set(thisArg, eventHandler);
    }

    unsubscribe(eventHandler: BindableEventHandle<T>, thisArg?: object) {
        this._eventPool.delete(thisArg, eventHandler);
    }

    unsubscribeTarget(target: object): void {
        if (!target) {
            throw new GameFrameworkError("target is invalid");
        }
        this._eventPool.delete(target);
    }

    private fireNow() {
        for (let [thisArg, handlers] of this._eventPool) {
            for (let handler of handlers) {
                handler.call(thisArg, this.value);
            }
        }
    }
}
