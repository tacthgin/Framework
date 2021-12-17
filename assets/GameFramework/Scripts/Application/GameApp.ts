import { Component, game, _decorator } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkLog } from "../Base/Log/GameFrameworkLog";
import { WebLogHelp } from "../Base/Log/WebLogHelp";
import { IEventManager } from "../Event/IEventManager";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IResourceManager } from "../Resource/IResourceManager";
import { ISoundManager } from "../Sound/ISoundManager";
import { IUIManager } from "../UI/IUIManager";
import { Utility } from "../Utility/Utility";
import { IModel } from "./Model/IModel";
import { ModelContainer } from "./Model/ModelContainer";

const { ccclass } = _decorator;

/**
 * 应用游戏入口
 */
@ccclass("GameApp")
export class GameApp extends Component {
    private static _instance: GameApp | null = null;
    private _modelContainer: ModelContainer = null!;

    static get instance(): GameApp {
        return this._instance!;
    }

    /**
     * 资源管理
     */
    static get ResourceManager(): IResourceManager {
        return GameFrameworkEntry.getModule<IResourceManager>("ResourceManager");
    }

    /**
     * 事件管理
     */
    static get EventManager(): IEventManager {
        return GameFrameworkEntry.getModule<IEventManager>("EventManager");
    }

    /**
     * 对象池管理
     */
    static get ObjectPoolManager(): IObejctPoolManager {
        return GameFrameworkEntry.getModule<IObejctPoolManager>("ObjectPoolManager");
    }

    /**
     * 声音管理
     */
    static get SoundManager(): ISoundManager {
        return GameFrameworkEntry.getModule<ISoundManager>("SoundManager");
    }

    /**
     * UI管理
     */
    static get UIManager(): IUIManager {
        return GameFrameworkEntry.getModule<IUIManager>("UIManager");
    }

    /**
     * 根据构造获取模型
     * @param constructor
     * @returns
     */
    static getModel<T extends IModel>(constructor: Constructor<IModel>): T {
        return GameApp.instance._modelContainer.getModel(constructor) as T;
    }

    onLoad() {
        if (GameApp._instance) {
            this.destroy();
            return;
        } else {
            GameApp._instance = this;
            game.addPersistRootNode(this.node);
        }
        this.initialize();
    }

    onDestroy() {
        GameApp._instance = null;
    }

    private initialize() {
        //初始化框架
        this.initalizeFramework();
        //初始化model
        this._modelContainer = new ModelContainer();
    }

    private initalizeFramework() {
        GameFrameworkLog.setLogHelp(new WebLogHelp());
        let resourceManager = GameApp.ResourceManager;
        GameApp.UIManager.setResourceManager(resourceManager);
        GameApp.SoundManager.setResourceManager(resourceManager);
        Utility.Json.setResourceManager(resourceManager);
        Utility.Json.setSystemUtility(Utility.System);
    }
}
