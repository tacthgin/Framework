import { GameFrameworkLinkedList } from "../Base/GameFrameworkLinkedList";
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
                
            }
        }
    }

    getUIForm(serialIdOrUIFormAssetName: string | number): IUIForm | null {
        throw new Error("Method not implemented.");
    }

    getUIForms(uiFormAssetName: string): IUIForm[] {
        throw new Error("Method not implemented.");
    }

    getAllUIForms(): IUIForm[] {
        throw new Error("Method not implemented.");
    }

    private refresh() {}
}
