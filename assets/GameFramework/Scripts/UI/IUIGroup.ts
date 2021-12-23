import { IUIForm } from "./IUIForm";
import { IUIGroupHelp } from "./IUIGroupHelp";

/**
 * 界面组接口
 */
export interface IUIGroup {
    /**
     * 获取组名称
     */
    readonly name: string;

    /**
     * 获取或者设置界面组深度
     */
    depth: number;

    /**
     * 获取或设置界面组是否暂停
     */
    pause: boolean;

    /**
     * 获取界面组中界面数量
     */
    readonly uiformCount: number;

    /**
     * 获取当前界面
     */
    readonly currentUIForm: IUIForm;

    /**
     * 获取界面组辅助器
     */
    readonly helper: IUIGroupHelp;

    /**
     * 界面组中是否存在界面
     * @param serialIdOrUIFormAssetName 界面序列编号或者界面资源名称
     */
    hasUIForm(serialIdOrUIFormAssetName: number | string): boolean;

    /**
     * 从界面组获取界面
     * @param serialIdOrUIFormAssetName 界面序列编号或者界面资源名称
     */
    getUIForm(serialIdOrUIFormAssetName: number | string): boolean;

    /**
     * 从界面组获取界面
     * @param uiformAssetName 界面资源名称
     */
    getUIForms(uiformAssetName: string): IUIForm[];

    /**
     * 从界面组中获取所有界面
     */
    getAllUIForms(): IUIForm[];
}
