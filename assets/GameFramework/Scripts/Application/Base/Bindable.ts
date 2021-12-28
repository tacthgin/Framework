export type BindableEventHandle<T> = (value: T) => void;

export class Bindable<T> {
    private _value: T | null = null;
    private _eventPool: Map<BindableEventHandle<T>, any> = null!;

    constructor(defeult: T) {
        this.value = defeult;
    }

    set value(value: T) {
        if (this._value === value) {
            return;
        }
        this._value = value;
        this.fireNow();
    }

    get value(): T {
        return this._value!;
    }

    check(eventHandle: BindableEventHandle<T>, thisArg?: any) {
        return this._eventPool.has(eventHandle);
    }

    subscribe(eventHandle: BindableEventHandle<T>, thisArg?: any) {
        this._eventPool.set(eventHandle, thisArg);
    }

    unsubscribe(eventHandle: BindableEventHandle<T>, thisArg?: any) {
        this._eventPool.delete(eventHandle);
    }

    private fireNow() {
        for (let pair of this._eventPool) {
            pair[0].call(pair[1], this.value);
        }
    }
}
