import { IUIForm } from "./IUIForm";
import { IUIGroup } from "./IUIGroup";

/**
 * 界面辅助器接口
 */
export interface IUIFormHelp {
    /**
     * 实例化界面
     * @param uiFormAsset 需要实例化的界面资源
     */
    instantiateUIForm(uiFormAsset: object): void;

    /**
     * 创建界面
     * @param uiFormInstance 界面示例
     * @param uiGroup 界面所属的界面组
     * @param userData 用户数据
     * @returns 界面
     */
    createUIForm(uiFormInstance: object, uiGroup: IUIGroup, userData: object): IUIForm;

    /**
     * 释放界面
     * @param uiFormAsset 要释放的界面资源
     * @param uiFormInstance 要释放的界面实例
     */
    releaseUIForm(uiFormAsset: object, uiFormInstance: object): void;
}
