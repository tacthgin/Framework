export abstract class FsmBase {
    private _name: string = "";

    set name(value: string) {
        this._name = value;
    }

    get name(): string {
        return this._name;
    }

    abstract get fsmStateCount(): number;

    abstract get isRunning(): boolean;

    abstract get isDestroyed(): boolean;

    abstract get currentStateName(): string;

    abstract get currentStateTime(): number;

    abstract update(elapseSeconds: number): void;

    abstract shutDown(): void;
}
