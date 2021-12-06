import { IRerference } from "../ReferencePool/IRerference";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { BaseEventArgs } from "./BaseEventArgs";

export class GameEvent<T extends BaseEventArgs> implements IRerference {
    private _sender: object | null = null;
    private _eventArgs: T | null = null;

    get sender(): object | null {
        return this._sender;
    }

    get eventArgs(): T | null {
        return this._eventArgs;
    }

    static create<T extends BaseEventArgs>(sender: object, eventArgs: T): GameEvent<T> {
        let eventNode: GameEvent<T> = ReferencePool.acquire(GameEvent);
        eventNode._sender = sender;
        eventNode._eventArgs = eventArgs;
        return eventNode;
    }

    clear(): void {
        this._sender = null;
        this._eventArgs = null;
    }
}
