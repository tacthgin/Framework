import { GameFrameworkError } from "../GameFrameworkError";
import { GameFrameworkMap } from "../GameFrameworkMap";
import { BaseEventArgs } from "./BaseEventArgs";
import { GameEvent } from "./GameEvent";
import { GameEventHandle } from "./GameEventHandle";

export class EventPool<T extends BaseEventArgs> {
    private readonly _eventHandles: GameFrameworkMap<number, GameEventHandle<T>> = null!;
    private readonly _events: Array<GameEvent<T>> = null!;

    constructor() {
        this._eventHandles = new GameFrameworkMap<number, GameEventHandle<T>>();
        this._events = new Array<GameEvent<T>>();
    }

    on(id: number, eventHandle: GameEventHandle<T>): void {
        if (!eventHandle) {
            throw new GameFrameworkError("eventHandle is invalid");
        }
        this._eventHandles.set(id, eventHandle);
    }

    off(id: number, eventHandle: GameEventHandle<T>): void {
        if (!eventHandle) {
            throw new GameFrameworkError("eventHandle is invalid");
        }
        this._eventHandles.delete(id);
    }

    hasListener(id: number, eventHandle: GameEventHandle<T>): boolean {
        if (!eventHandle) {
            throw new GameFrameworkError("eventHandle is invalid");
        }
        return this._eventHandles.has(id, eventHandle);
    }

    emit() {}
}
