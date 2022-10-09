import { Button, Enum, Node, _decorator } from "cc";
import { IUIGroup } from "../../../Script/UI/IUIGroup";
import { GameApp } from "../../Base/GameApp";
import { DialogAction } from "./DialogAction/DialogAction";
import { DialogActionBase } from "./DialogAction/DialogActionBase";
import { DialogActionFactory } from "./DialogActionFactory";
import { DialogUIForm } from "./DialogUIForm";

const { ccclass, property } = _decorator;

Enum(DialogAction);

@ccclass("DialogBase")
export class DialogBase extends DialogUIForm {
    @property({
        type: Node,
        tooltip: "弹窗中心内容，适用于做弹窗动作，默认选择弹窗node",
    })
    private dialogContent: Node = null!;

    /** 点击弹窗空白关闭 */
    @property({
        tooltip: "点击弹窗空白关闭",
    })
    private clickBgClose: boolean = false;

    /** 使用弹窗动作 */
    @property({
        tooltip: "弹窗默认动作",
        type: DialogAction,
    })
    private actionType: DialogAction = DialogAction.NoneAction;

    /** 运行中的弹窗动作 */
    private _dialogAction: DialogActionBase | null = null;

    /** 加载背景按钮等初始化 */
    __preload() {
        this.dialogContent = this.dialogContent || this.node;
    }

    onInit(serialId: number, uiFormAssetName: string, uiGroup: IUIGroup, pauseCoveredUIForm: boolean, isNewInstance: boolean, userData?: Object) {
        super.onInit(serialId, uiFormAssetName, uiGroup, pauseCoveredUIForm, isNewInstance, userData);
        if (!this._dialogAction) {
            this._dialogAction = DialogActionFactory.getAction(this.actionType, this.dialogContent, this.closeCallback.bind(this));
        }
        this._dialogAction.executeStartAction();
    }

    /**
     * 关闭弹窗接口
     * @param useAction 默认使用动作关闭
     */
    close(useAction: boolean = true) {
        if (useAction) {
            this._dialogAction?.executeEndAction();
        } else {
            this._dialogAction?.resetAction();
            this.closeCallback();
        }
    }

    private closeCallback() {
        this._dialogAction = null;
        GameApp.UIManager.closeUIForm(this);
        this.node.removeFromParent();
    }

    private onCloseBtnClick(button: Button, customEventData: string) {
        this.close();
    }
}
