import { Vec3 } from "cc";
import { GameApp } from "../Base/GameApp";
import { ToastType } from "./Toast/ToastType";
import { UIConstant } from "./UIConstant";

/**
 * UI工厂
 */
export class UIFactory {
    private static s_toastAssetPath: string = "Prefab/Base/ColorToast";

    /**
     * 打开弹窗界面
     * @param path 弹窗界面资源名称
     * @param userData 用户数据
     * @param pauseCoveredUIForm 是否暂停被覆盖的界面
     * @returns 界面序列编号
     */
    static async showDialog(path: string, userData?: Object, pauseCoveredUIForm: boolean = false, position: Vec3 = Vec3.ZERO): Promise<number> {
        let uiManager = GameApp.UIManager;
        let dialogId = await uiManager.openUIForm(path, UIConstant.DIALOG_LAYER_GROUP, pauseCoveredUIForm, userData);
        let uiForm = uiManager.getUIForm(dialogId);
        if (uiForm) {
            (uiForm as any).node.position = position;
        }

        return dialogId;
    }

    /**
     * 打开飘字界面
     * @param content 飘字界面内容
     * @param toastType 飘字界面类型，正常白字或者富文本
     * @returns 界面序列编号
     */
    static showToast(content: string, toastType: ToastType = ToastType.NORAML): Promise<number> {
        return GameApp.UIManager.openUIForm(this.s_toastAssetPath, UIConstant.TOAST_LAYER_GROUP, false, { content: content, toastType: toastType });
    }
}
