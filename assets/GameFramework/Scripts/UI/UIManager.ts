import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IObjectPool } from "../ObjectPool/IObjectPool";
import { IResourceManager } from "../Resource/IResourceManager";
import { IUIForm } from "./IUIForm";
import { IUIFormHelp } from "./IUIFormHelp";
import { IUIGroup } from "./IUIGroup";
import { IUIGroupHelp } from "./IUIGroupHelp";
import { IUIManager } from "./IUIManager";
import { UIFormInstanceObject } from "./UIFormInstanceObject";
import { UIGroup } from "./UIGroup";

@GameFrameworkEntry.registerModule("UIManager")
export class UIManager extends GameFrameworkModule implements IUIManager {
    private readonly _uiGroups: Map<string, UIGroup> = null!;
    private _resourceManger: IResourceManager | null = null;
    private _objectPoolManager: IObejctPoolManager | null = null;
    private _instancePool: IObjectPool<UIFormInstanceObject> = null!;
    private _uiFormHelp: IUIFormHelp | null = null;
    private _serialId: number = 0;
    static readonly defaultUIGroupName: string = "default_ui_group";

    constructor() {
        super();
        this._uiGroups = new Map<string, UIGroup>();
        this._serialId = 0;
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
        this._uiFormHelp = uiFormHelp;
    }

    hasUIGroup(uiGroupName: string): boolean {
        if (!uiGroupName) {
            throw new GameFrameworkError("ui group name is invalid");
        }

        return this._uiGroups.has(uiGroupName);
    }

    getUIGroup(uiGroupName: string): IUIGroup | null {
        if (!uiGroupName) {
            throw new GameFrameworkError("ui group name is invalid");
        }
        let group = this._uiGroups.get(uiGroupName);
        if (group) {
            return group as IUIGroup;
        }
        return null;
    }

    getAllUIGroups(): IUIGroup[] {
        let uiGroups: Array<IUIGroup> = new Array<IUIGroup>(this._uiGroups.size);
        let index = 0;
        for (let pair of this._uiGroups) {
            uiGroups[index++] = pair[1];
        }
        return uiGroups;
    }

    addUIGroup(uiGroupName: string, uiGroupDepth: number, uiGroupHelp: IUIGroupHelp): boolean {
        if (!uiGroupName) {
            throw new GameFrameworkError("ui group name is invalid");
        }

        if (this.hasUIGroup(uiGroupName)) {
            return false;
        }

        this._uiGroups.set(uiGroupName, new UIGroup(uiGroupName, uiGroupDepth, uiGroupHelp));

        return true;
    }

    hasUIForm(serialIdOrUIFormAssetName: string | number): boolean {
        for (let pair of this._uiGroups) {
            if (pair[1].hasUIForm(serialIdOrUIFormAssetName)) {
                return true;
            }
        }
        return false;
    }

    getUIForm(serialIdOrUIFormAssetName: string | number): IUIForm | null {
        for (let pair of this._uiGroups) {
            let uiForm = pair[1].getUIForm(serialIdOrUIFormAssetName);
            if (uiForm) {
                return uiForm;
            }
        }
        return null;
    }

    getUIForms(uiFormAssetName: string): IUIForm[] {
        let results: IUIForm[] = [];
        for (let pair of this._uiGroups) {
            results = results.concat(pair[1].getUIForms(uiFormAssetName));
        }
        return results;
    }

    getAllLoadedUIForms(): IUIForm[] {
        let results: IUIForm[] = [];
        for (let pair of this._uiGroups) {
            results = results.concat(pair[1].getAllUIForms());
        }
        return results;
    }

    getAllLoadingUIFormSerialIds(): number[] {
        throw new Error("Method not implemented.");
    }

    isLoadingUIForm(serialIdOrUIFormAssetName: string | number): boolean {
        throw new Error("Method not implemented.");
    }

    openUIForm(uiFormAssetName: string, uiGroupName?: string, pauseCoveredUIForm: boolean = false, userData: object | null = null): number {
        if (!this._resourceManger) {
            throw new GameFrameworkError("resouce manager not exist");
        }

        if (!this._objectPoolManager) {
            throw new GameFrameworkError("object pool manager not exist");
        }

        if (!uiFormAssetName) {
            throw new GameFrameworkError("ui form asset name is invalid");
        }

        if (!uiGroupName) {
            uiGroupName = UIManager.defaultUIGroupName;
        }

        let uiGroup = this.getUIGroup(uiGroupName);
        if (!uiGroup) {
            throw new GameFrameworkError(`ui group name: ${uiGroupName} has not exist`);
        }

        let serialId = ++this._serialId;
        let uiFromInstanceObject = this._instancePool.spawn();
        if (uiFromInstanceObject) {
            this.internalOpenUIForm(serialId, uiFormAssetName, uiGroup as UIGroup, uiFromInstanceObject, pauseCoveredUIForm, false, 0, userData);
        } else {
        }
        return serialId;
    }

    closeUIForm(serialIdOrUIForm: number | IUIForm, userData?: object): void {
        throw new Error("Method not implemented.");
    }

    closeAllLoadedUIForms(userData?: object): void {
        throw new Error("Method not implemented.");
    }

    closeAllLoadingUIForms(): void {
        throw new Error("Method not implemented.");
    }

    refocusUIForm(uiForm: IUIForm, userData?: object): void {
        throw new Error("Method not implemented.");
    }

    setUIFormInstanceLocked(uiFormInstance: object, locked: boolean): void {
        this._instancePool.setLocked(uiFormInstance, locked);
    }

    setUIFormInstancePriority(uiFormInstance: object, priority: number): void {
        this._instancePool.setPriority(uiFormInstance, priority);
    }

    private internalOpenUIForm(
        serialId: number,
        uiFormAssetName: string,
        uiGroup: UIGroup,
        uiFormInstance: object,
        pauseCoveredUIForm: boolean,
        isNewInstance: boolean,
        duration: number,
        userData: object | null
    ) {}
}
