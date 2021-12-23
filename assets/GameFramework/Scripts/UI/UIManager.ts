import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IObjectPool } from "../ObjectPool/IObjectPool";
import { IResourceManager } from "../Resource/IResourceManager";
import { IUIForm } from "./IUIForm";
import { IUIFormHelp } from "./IUIFormHelp";
import { IUIGroup } from "./IUIGroup";
import { IUIGroupHelp } from "./IUIGroupHelp";
import { IUIManager } from "./IUIManager";

@GameFrameworkEntry.registerModule("UIManager")
export class UIManager extends GameFrameworkModule implements IUIManager {
    private readonly _uiGroups: Map<string, UIGroup> = null!;
    private _resourceManger: IResourceManager | null = null;
    private _objectPoolManager: IObejctPoolManager | null = null;
    private _instancePool: IObjectPool<UIFormInstanceObject> = null!;

    constructor() {
        super();
        this._uiGroups = new Map<string, UIGroup>();
    }

    get uiGroupCount(): number {
        return this._uiGroups.size;
    }

    set instanceAutoRelaseInterval(value: number) {
        this._instancePool.autoReleaseInterval = value;
    }

    get instanceAutoRelaseInterval(): number {
        return this._instancePool.autoReleaseInterval;
    }

    set instanceCapacity(value: number) {
        this._instancePool.capacity = value;
    }

    get instanceCapacity(): number {
        return this._instancePool.capacity;
    }

    set instanceExpireTime(value: number) {
        this._instancePool.expireTime = value;
    }

    get instanceExpireTime(): number {
        return this._instancePool.expireTime;
    }

    set instancePriority(value: number) {
        this._instancePool.priority = value;
    }

    get instancePriority(): number {
        return this._instancePool.priority;
    }

    update(elapseSeconds: number): void {}

    shutDown(): void {
        this._uiGroups.clear();
    }

    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void {
        this._objectPoolManager = objectPoolManager;
        this._instancePool = this._objectPoolManager.createSingleSpawnObjectPool(UIFormInstanceObject, "UI Instance Pool");
    }

    setResourceManager(resourceManager: IResourceManager): void {
        this._resourceManger = resourceManager;
    }

    setUIFormHelp(uiFormHelp: IUIFormHelp): void {
        throw new Error("Method not implemented.");
    }

    hasUIGroup(uiGroupName: string): boolean {
        throw new Error("Method not implemented.");
    }
    getUIGroup(uiGroupName: string): IUIGroup | null {
        throw new Error("Method not implemented.");
    }
    getAllUIGroups(): IUIGroup[] {
        throw new Error("Method not implemented.");
    }
    addUIGroup(uiGroupName: string, uiGroupHelp: IUIGroupHelp): boolean {
        throw new Error("Method not implemented.");
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
    getAllLoadedUIForms(): IUIForm[] {
        throw new Error("Method not implemented.");
    }
    getAllLoadingUIFormSerialIds(): number[] {
        throw new Error("Method not implemented.");
    }
    isLoadingUIForm(serialIdOrUIFormAssetName: string | number): boolean {
        throw new Error("Method not implemented.");
    }
    openUIForm(uiFormAssetName: string, uiGroupName: string): number {
        throw new Error("Method not implemented.");
    }
    closeUIForm(serialIdOrUIForm: number | IUIForm, userData?: object): void {
        throw new Error("Method not implemented.");
    }
    closeAllLoadedUIForms(userData?: object): void {
        throw new Error("Method not implemented.");
    }
    closeAllLoadeingUIForms(): void {
        throw new Error("Method not implemented.");
    }
    refocusUIForm(uiForm: IUIForm, userData?: object): void {
        throw new Error("Method not implemented.");
    }
    setUIFormInstanceLocked(uiFormInstance: object, locked: boolean): void {
        throw new Error("Method not implemented.");
    }
    setUIFormInstancePriority(uiFormInstance: object, priority: number): void {
        throw new Error("Method not implemented.");
    }
}
