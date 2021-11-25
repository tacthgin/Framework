import { IRerference } from "./IRerference";
import { ReferenceType } from "./ReferenceType";

export class ReferencePoolInfo {
    private _referenceType: ReferenceType<IRerference> = null!;
    private _addReferenceCount: number = 0;
    private _removeReferenceCount: number = 0;
    private _acquireReferenceCount: number = 0;
    private _usingRerferenceCount: number = 0;
    private _releaseRerferenceCount: number = 0;

    constructor(
        referenceType: ReferenceType<IRerference>,
        addReferenceCount: number,
        removeReferenceCount: number,
        acquireReferenceCount: number,
        usingRerferenceCount: number,
        releaseRerferenceCount: number
    ) {
        this._referenceType = referenceType;
        this._addReferenceCount = addReferenceCount;
        this._removeReferenceCount = removeReferenceCount;
        this._acquireReferenceCount = acquireReferenceCount;
        this._usingRerferenceCount = usingRerferenceCount;
        this._releaseRerferenceCount = releaseRerferenceCount;
    }

    get referenceType(): ReferenceType<IRerference> {
        return this._referenceType;
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
}
