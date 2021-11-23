import { GameFrameworkError } from "../GameFrameworkError";
import { IRerference } from "./IRerference";

export class ReferenceCollection {
    private _references: IRerference[] = [];
    private _referenceType: { new (): any } = null!;
    private _enableStrictCheck: boolean = false;
    private _addReferenceCount: number = 0;
    private _removeReferenceCount: number = 0;
    private _acquireReferenceCount: number = 0;
    private _usingRerferenceCount: number = 0;
    private _releaseRerferenceCount: number = 0;

    constructor(referenceType: { new (): any }) {
        this._referenceType = referenceType;
    }

    get unusedReferenceCount(): number {
        return this._references.length;
    }

    get addReferenceCount(): number {
        return this._addReferenceCount;
    }

    get removeReferenceCount(): number {
        return this._removeReferenceCount;
    }

    get acquireReferenceCount(): number {
        return this._acquireReferenceCount;
    }

    get usingRerferenceCount(): number {
        return this._usingRerferenceCount;
    }

    get releaseRerferenceCount(): number {
        return this._releaseRerferenceCount;
    }

    acquire<T extends IRerference>(type: { new (): T }): T {
        if (type != this._referenceType) {
            throw new GameFrameworkError("类型不合法");
        }
        ++this._acquireReferenceCount;
        ++this._usingRerferenceCount;
        if (this._references.length > 0) {
            return this._references.pop() as T;
        }
        ++this._addReferenceCount;
        return new type();
    }

    release(reference: IRerference): void {
        reference.clear();
        if (this._enableStrictCheck && this._references.indexOf(reference) != -1) {
            throw new GameFrameworkError("引用已经被释放");
        }
        this._references.push(reference);
        --this._releaseRerferenceCount;
        --this._usingRerferenceCount;
    }

    add(count: number): void {
        this._addReferenceCount += count;
        while (count-- > 0) {
            this._references.push(new this._referenceType());
        }
    }

    remove(count: number) {
        if (count > this._references.length) {
            count = this._references.length;
        }
        this._removeReferenceCount += count;
        while (count-- > 0) {
            this._references.pop();
        }
    }

    removeAll() {
        this._removeReferenceCount += this._references.length;
        this._references.length = 0;
    }
}
