import { GameFrameworkLinkedList } from "../Base/GameFrameworkLinkedList";
import { IUIForm } from "./IUIForm";
import { IUIGroup } from "./IUIGroup";
import { IUIGroupHelp } from "./IUIGroupHelp";
import { UIFormInfo } from "./UIFormInfo";

export class UIGroup implements IUIGroup {
    private readonly _uiForms: GameFrameworkLinkedList<UIFormInfo> = null!;
    private _name: string = null!;
    private _uiGroupHelp: IUIGroupHelp = null!;
    private _depth: number = 0;
    private _pause: boolean = false;

    constructor(uiGroupName: string, uiGroupHelp: IUIGroupHelp) {
        this._name = uiGroupName;
        this._uiGroupHelp = uiGroupHelp;
    }

    get name(): string {
        return this._name;
    }

    set depth(value: number) {
        this._depth = value;
    }

    get depth(): number {
        return this._depth;
    }

    set pause(value: boolean) {
        this._pause = value;
    }

    get pause(): boolean {
        return this._pause;
    }

    get uiformCount(): number {
        return this._uiForms.size;
    }

    get currentUIForm(): IUIForm {
        return null!;
    }

    get helper(): IUIGroupHelp {
        return this._uiGroupHelp;
    }

    hasUIForm(serialIdOrUIFormAssetName: string | number): boolean {
        throw new Error("Method not implemented.");
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
}
