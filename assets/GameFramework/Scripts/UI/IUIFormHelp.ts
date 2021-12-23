import { IUIForm } from "./IUIForm";
import { IUIGroup } from "./IUIGroup";

/**
 * 界面辅助器接口
 */
export interface IUIFormHelp {
    /**
     * 实例化界面
     * @param uiformAsset 需要实例化的界面资源
     */
    instantiateUIForm(uiformAsset: object): void;

    /**
     * 创建界面
     * @param uiformInstance 界面示例
     * @param uiGroup 界面所属的界面组
     * @param userData 用户数据
     */
    createUIForm(uiformInstance: object, uiGroup: IUIGroup, userData: object): IUIForm;

    /**
     * 释放界面
     * @param uiformAsset 要释放的界面资源
     * @param uiformInstance 要释放的界面实例
     */
    releaseUIForm(uiformAsset: object, uiformInstance: object): void;
}
