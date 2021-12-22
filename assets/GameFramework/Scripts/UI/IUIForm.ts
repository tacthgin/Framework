import { IUIGroup } from "./IUIGroup";

export interface IUIForm {
    /**
     * 获取界面序列编号
     */
    readonly serialId: number;

    /**
     * 获取界面资源名称
     */
    readonly uiFormAssetName: string;

    /**
     * 获取界面实例
     */
    readonly handle: object;

    /**
     * 获取界面所属的界面组
     */
    readonly uiGroup: IUIGroup;

    /**
     * 获取界面在界面组中的深度
     */
    readonly depthInUIGroup: number;

    /**
     * 获取是否暂停被覆盖的界面。
     */
    readonly pauseCoveredUIForm: boolean;

    /**
     * 初始化界面
     * @param serialId
     * @param uiFormAssetName
     * @param uiGroup
     * @param pauseCoveredUIForm
     * @param isNewInstance
     * @param userData
     */
    onInit(serialId: number, uiFormAssetName: string, uiGroup: IUIGroup, pauseCoveredUIForm: boolean, isNewInstance: boolean, userData: object): void;

    /**
     * 界面回收
     */
    onRecyle(): void;

    /**
     * 界面打开
     * @param userData
     */
    onOpen(userData: object): void;

    /**
     * 界面关闭
     * @param isShutDown
     * @param userData
     */
    onClose(isShutDown: boolean, userData: object): void;

    /**
     * 界面暂停
     */
    onPause(): void;

    /**
     * 界面暂停恢复
     */
    onResume(): void;

    /**
     * 界面被遮挡
     */
    onCover(): void;

    /**
     * 界面遮挡恢复
     */
    onReveal(): void;

    /**
     * 界面激活
     * @param userData
     */
    onRefocus(userData: object): void;

    /**
     * 界面轮询
     * @param elapseSeconds
     */
    onUpdate(elapseSeconds: number): void;

    /**
     * 界面深度改变
     * @param uiGroupDepth
     * @param depthInUIGroup
     */
    onDepthChanged(uiGroupDepth: number, depthInUIGroup: number): void;
}
