import { IRerference } from "../Base/ReferencePool/IRerference";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { UIGroup } from "./UIGroup";

export class OpenUIFormInfo implements IRerference {
    private _uiGroup: UIGroup | null = null;
    private _serialId: number = 0;
    private _pauseCoveredUIForm: boolean = false;
    private _userData: object | null = null;

    static create(uiGroup: UIGroup, serialId: number, pauseCoveredUIForm: boolean, userData: object): OpenUIFormInfo {
        let openUIFormInfo = ReferencePool.acquire(OpenUIFormInfo);
        openUIFormInfo._uiGroup = uiGroup;
        openUIFormInfo._serialId = serialId;
        openUIFormInfo._pauseCoveredUIForm = pauseCoveredUIForm;
        openUIFormInfo._userData = userData;
        return openUIFormInfo;
    }

    clear(): void {
        this._uiGroup = null;
        this._userData = null;
        this._serialId = 0;
        this._pauseCoveredUIForm = false;
    }
}
