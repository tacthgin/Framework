import { GameFrameworkError } from "../GameFrameworkError";
import { GameFrameworkMap } from "../GameFrameworkMap";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { BaseEventArgs } from "./BaseEventArgs";
import { Event } from "./Event";
import { EventHandle, EventHandleTarget } from "./EventHandle";

export class EventPool<T extends BaseEventArgs> {
    private readonly _eventHandles: GameFrameworkMap<number, EventHandleTarget<T>> = null!;
    private readonly _targetHandles: GameFrameworkMap<object, EventHandleTarget<T>> = null!;
    private readonly _events: Array<Event<T>> = null!;

    constructor() {
        this._eventHandles = new GameFrameworkMap<number, EventHandleTarget<T>>();
        this._targetHandles = new GameFrameworkMap<object, EventHandleTarget<T>>();
        this._events = new Array<Event<T>>();
    }

    subscribe(id: number, eventHandle: EventHandle<T>, thisArg?: any): void {
        if (!eventHandle) {
            throw new GameFrameworkError("eventHandle is invalid");
        }
        let eventHandleTarget = EventHandleTarget.create(id, thisArg, eventHandle);
        this._eventHandles.set(id, eventHandleTarget);
        if (thisArg) {
            this._targetHandles.set(thisArg, eventHandleTarget);
        }
    }

    unsubscribe(id: number, eventHandle: EventHandle<T>, thisArg?: any): void {
        if (!eventHandle) {
            throw new GameFrameworkError("eventHandle is invalid");
        }
        let list = this._eventHandles.get(id);
        if (list) {
            let node = list.find((eventTargetHandle: EventHandleTarget<T>) => {
                return eventTargetHandle.handle == eventHandle && eventTargetHandle.target == thisArg;
            });
            if (node) {
                list.remove(node);
                this._targetHandles.delete(node.value!.target!, node.value!);
                this.releaseEventHandleTarget(node.value!);
            }
        }
    }

    unsubscribeTarget(target: object) {
        let list = this._targetHandles.get(target);
        if (list) {
            list.forEach((eventHandleTarget: EventHandleTarget<T>) => {
                this._eventHandles.delete(eventHandleTarget.id!, eventHandleTarget);
                this.releaseEventHandleTarget(eventHandleTarget);
            });
            this._targetHandles.delete(target);
        }
    }

    check(id: number, eventHandle: EventHandle<T>, thisArg?: any): boolean {
        if (!eventHandle) {
            throw new GameFrameworkError("eventHandle is invalid");
        }

        let list = this._eventHandles.get(id);
        if (list) {
            let node = list.find((eventTargetHandle: EventHandleTarget<T>) => {
                return eventTargetHandle.handle == eventHandle && eventTargetHandle.target == thisArg;
            });
            return node != null;
        }
        return false;
    }

    fire(sender: object, e: T) {}

    private releaseEventHandleTarget(eventHandleTarget: EventHandleTarget<T>) {
        ReferencePool.release(eventHandleTarget);
    }
}
