import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkLinkedList } from "../Base/GameFrameworkLinkedList";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { IUIForm } from "./IUIForm";
import { IUIGroup } from "./IUIGroup";
import { IUIGroupHelp } from "./IUIGroupHelp";
import { UIFormInfo } from "./UIFormInfo";

export class UIGroup implements IUIGroup {
    private readonly _uiFormInfos: GameFrameworkLinkedList<UIFormInfo> = null!;
    private _name: string = null!;
    private _uiGroupHelp: IUIGroupHelp = null!;
    private _depth: number = 0;
    private _pause: boolean = false;

    constructor(name: string, depth: number, uiGroupHelp: IUIGroupHelp) {
        this._name = name;
        this._depth = depth;
        this._uiGroupHelp = uiGroupHelp;
    }

    get name(): string {
        return this._name;
    }

    set depth(value: number) {
        if (this._depth == value) {
            return;
        }
        this._depth = value;
        this._uiGroupHelp.setDepth(this._depth);
        this.refresh();
    }

    get depth(): number {
        return this._depth;
    }

    set pause(value: boolean) {
        if (this._pause == value) {
            return;
        }
        this._pause = value;
        this.refresh();
    }

    get pause(): boolean {
        return this._pause;
    }

    get uiFormCount(): number {
        return this._uiFormInfos.size;
    }

    get currentUIForm(): IUIForm {
        return null!;
    }

    get helper(): IUIGroupHelp {
        return this._uiGroupHelp;
    }

    hasUIForm(serialIdOrUIFormAssetName: string | number): boolean {
        if (typeof serialIdOrUIFormAssetName === "number") {
            for (let uiFormInfo of this._uiFormInfos) {
                if (uiFormInfo.uiForm.serialId === serialIdOrUIFormAssetName) {
                    return true;
                }
            }
        } else {
            if (!serialIdOrUIFormAssetName) {
                throw new GameFrameworkError("ui form asset name is invalid");
            }
            for (let uiFormInfo of this._uiFormInfos) {
                if (uiFormInfo.uiForm.uiFormAssetName === serialIdOrUIFormAssetName) {
                    return true;
                }
            }
        }

        return false;
    }

    getUIForm(serialIdOrUIFormAssetName: string | number): IUIForm | null {
        if (typeof serialIdOrUIFormAssetName === "number") {
            for (let uiFormInfo of this._uiFormInfos) {
                if (uiFormInfo.uiForm.serialId === serialIdOrUIFormAssetName) {
                    return uiFormInfo.uiForm;
                }
            }
        } else {
            if (!serialIdOrUIFormAssetName) {
                throw new GameFrameworkError("ui form asset name is invalid");
            }
            for (let uiFormInfo of this._uiFormInfos) {
                if (uiFormInfo.uiForm.uiFormAssetName === serialIdOrUIFormAssetName) {
                    return uiFormInfo.uiForm;
                }
            }
        }

        return null;
    }

    getUIForms(uiFormAssetName: string): IUIForm[] {
        if (!uiFormAssetName) {
            throw new GameFrameworkError("ui form asset name is invalid");
        }
        let uiForms: IUIForm[] = [];
        for (let uiFormInfo of this._uiFormInfos) {
            if (uiFormInfo.uiForm.uiFormAssetName === uiFormAssetName) {
                uiForms.push(uiFormInfo.uiForm);
            }
        }
        return uiForms;
    }

    getAllUIForms(): IUIForm[] {
        let uiForms: IUIForm[] = [];
        for (let uiFormInfo of this._uiFormInfos) {
            uiForms.push(uiFormInfo.uiForm);
        }
        return uiForms;
    }

    addUIForm(uiForm: IUIForm): void {
        this._uiFormInfos.addFirst(UIFormInfo.create(uiForm));
    }

    removeUIForm(uiForm: IUIForm): void {
        let uiFormInfo: UIFormInfo | null = this.getUIFormInfo(uiForm);
        if (!uiFormInfo) {
            throw new GameFrameworkError(`can't not find ui form info serialId: ${uiForm.serialId} asset name: ${uiForm.uiFormAssetName}`);
        }

        if (!uiFormInfo.covered) {
            uiFormInfo.covered = true;
            uiForm.onCover();
        }

        if (!uiFormInfo.paused) {
            uiFormInfo.paused = true;
            uiForm.onPause();
        }

        if (!this._uiFormInfos.remove(uiFormInfo)) {
            throw new GameFrameworkError(`UI group ${this._name} not exists specified UI form [${uiForm.serialId}]${uiForm.uiFormAssetName}`);
        }

        ReferencePool.release(uiFormInfo);
    }

    refocusUIForm(uiForm: IUIForm) {
        let uiFormInfo: UIFormInfo | null = this.getUIFormInfo(uiForm);
        if (!uiFormInfo) {
            throw new GameFrameworkError(`can't not find ui form info serialId: ${uiForm.serialId} asset name: ${uiForm.uiFormAssetName}`);
        }
        this._uiFormInfos.remove(uiFormInfo);
        this._uiFormInfos.addFirst(uiFormInfo);
    }

    private refresh(): void {
        
    }

    private getUIFormInfo(uiForm: IUIForm): UIFormInfo | null {
        for (let uiFormInfo of this._uiFormInfos) {
            if (uiFormInfo.uiForm === uiForm) {
                return uiFormInfo;
            }
        }
        return null;
    }
}
