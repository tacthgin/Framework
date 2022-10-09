import { assetManager, Component, director, resources, _decorator } from "cc";
import { GameFrameworkEntry } from "../../Script/Base/GameFrameworkEntry";
import { GameFrameworkError } from "../../Script/Base/GameFrameworkError";
import { GameFrameworkLog } from "../../Script/Base/Log/GameFrameworkLog";
import { IEventManager } from "../../Script/Event/IEventManager";
import { IFsmManager } from "../../Script/Fsm/IFsmManager";
import { IObejctPoolManager } from "../../Script/ObjectPool/IObejctPoolManager";
import { IResourceManager } from "../../Script/Resource/IResourceManager";
import { ISaveManager } from "../../Script/Save/ISaveManager";
import { WebSaveHelper } from "../../Script/Save/WebSaveHelper";
import { ISceneManager } from "../../Script/Scene/ISceneManager";
import { ISoundManager } from "../../Script/Sound/ISoundManager";
import { IUIManager } from "../../Script/UI/IUIManager";
import { Utility } from "../../Script/Utility/Utility";
import { CHotUpdateHelper } from "../Helper/HotUpdate/CHotUpdateHelper";
import { WebLogHelper } from "../Helper/Log/WebLogHelper";
import { CNodeHelper } from "../Helper/NodePool/CNodeHelper";
import { CPlatformHelper } from "../Helper/Platform/CPlatformHelper";
import { ResourcePathHelper } from "../Helper/Resource/ResourcePathHelper";
import { CSceneHelper } from "../Helper/Scene/CSceneHelper";
import { CSoundHelper } from "../Helper/Sound/CSoundHelper";
import { CUIFormHelper } from "../Helper/UI/CUIFormHelper";
import { ICommandManager } from "../MVC/Command/ICommandManager";
import { IModelManager } from "../MVC/Model/IModelManager";
import { ISystemManager } from "../MVC/System/ISystemManager";
import { INodePoolManager } from "../NodePool/INodePoolManager";
import { IPlatformManager } from "../Platform/IPlatformManager";
import { SoundConstant } from "../Sound/SoundConstant";
import { UIConstant } from "../UI/UIConstant";
import { AppModuleManager } from "./AppModuleManager";

const { ccclass, executionOrder } = _decorator;

/**
 * 应用游戏入口
 */
@ccclass("GameApp")
@executionOrder(1)
export class GameApp extends Component {
    private static _instance: GameApp | null = null;
    /** 引用计数 */
    private static _referenceCount: number = 0;

    static get instance(): GameApp {
        return this._instance!;
    }

    /**
     * 资源管理器
     */
    static get ResourceManager(): IResourceManager {
        return GameFrameworkEntry.getModule<IResourceManager>("ResourceManager");
    }

    /**
     * 事件管理器
     */
    static get EventManager(): IEventManager {
        return GameFrameworkEntry.getModule<IEventManager>("EventManager");
    }

    /**
     * 对象池管理器
     */
    static get ObjectPoolManager(): IObejctPoolManager {
        return GameFrameworkEntry.getModule<IObejctPoolManager>("ObjectPoolManager");
    }

    /**
     * 声音管理器
     */
    static get SoundManager(): ISoundManager {
        return GameFrameworkEntry.getModule<ISoundManager>("SoundManager");
    }

    /**
     * UI管理器
     */
    static get UIManager(): IUIManager {
        return GameFrameworkEntry.getModule<IUIManager>("UIManager");
    }

    /**
     * 本地存储管理器
     */
    static get SaveManager(): ISaveManager {
        return GameFrameworkEntry.getModule<ISaveManager>("SaveManager");
    }

    /**
     * 有限状态机管理器
     */
    static get FsmManager(): IFsmManager {
        return GameFrameworkEntry.getModule<IFsmManager>("FsmManager");
    }

    /**
     * 场景管理器
     */
    static get SceneManager(): ISceneManager {
        return GameFrameworkEntry.getModule<ISceneManager>("SceneManager");
    }

    /**
     * 节点对象池管理器
     */
    static get NodePoolManager(): INodePoolManager {
        return GameFrameworkEntry.getModule<INodePoolManager>("NodePoolManager");
    }

    /**
     * 命令管理器
     * @returns 命令管理器
     */
    static get CommandManager(): ICommandManager {
        return AppModuleManager.getModule<ICommandManager>("CommandManager");
    }

    /**
     * 系统管理器
     * @returns 系统管理器
     */
    static get SystemManager(): ISystemManager {
        return AppModuleManager.getModule<ISystemManager>("SystemManager");
    }

    /**
     * 平台管理器
     * @returns 平台管理器
     */
    static get PlatformManager(): IPlatformManager {
        return AppModuleManager.getModule<IPlatformManager>("PlatformManager");
    }

    /**
     * 模型管理器
     * @returns 模型管理器
     */
    static get ModelManager(): IModelManager {
        return AppModuleManager.getModule<IModelManager>("ModelManager");
    }

    onLoad() {
        if (GameApp._instance) {
            this.node.destroy();
            return;
        } else {
            ++GameApp._referenceCount;
            GameApp._instance = this;
            director.addPersistRootNode(this.node);
        }
        this.initialize();
    }

    onDestroy() {
        --GameApp._referenceCount;
        if (GameApp._referenceCount == 0) {
            GameApp._instance = null;
            GameFrameworkEntry.shutDown();
        }
    }

    update(elapseSeconds: number) {
        GameFrameworkEntry.update(elapseSeconds);
        AppModuleManager.update(elapseSeconds);
    }

    private initialize() {
        //初始化框架
        this.initalizeFramework();
        //初始化应用模块
        this.initializeAppModule();
        //初始化热更新
        this.initializeHotUpdate();
    }

    private initalizeFramework() {
        //设置日志辅助
        GameFrameworkLog.setLogHelper(new WebLogHelper());
        //初始化resource
        let resourceManager = GameApp.ResourceManager;
        resourceManager.setResourcePathHelper(new ResourcePathHelper());
        resourceManager.setAssetManager(assetManager as any);
        resourceManager.setInternalResourceLoader(resources as any);
        //对象池管理
        let objectPoolManager = GameApp.ObjectPoolManager;
        //初始化ui模块
        let uiManager = GameApp.UIManager;
        uiManager.setResourceManager(resourceManager);
        uiManager.setObjectPoolManager(objectPoolManager);
        let uiFormHelper = this.getComponent(CUIFormHelper);
        if (uiFormHelper) {
            uiManager.setUIFormHelper(uiFormHelper);
            //创建弹窗和toast的ui组
            uiManager.addUIGroup(UIConstant.DIALOG_LAYER_GROUP, 0, uiFormHelper.getDialogUIGroupHelper());
            uiManager.addUIGroup(UIConstant.TOAST_LAYER_GROUP, 1, uiFormHelper.getToastUIGroupHelper());
        } else {
            throw new GameFrameworkError("you must set ui form help first");
        }

        //初始化声音模块
        let soundManager = GameApp.SoundManager;
        soundManager.setResourceManager(resourceManager);
        let soundHelper = this.getComponent(CSoundHelper);
        if (soundHelper) {
            soundManager.setSoundHelper(soundHelper);
            soundManager.addSoundGroup(SoundConstant.SOUND_BACKGROUND_GROUP);
            soundManager.addSoundGroup(SoundConstant.SOUND_EFFECT_GROUP);
        } else {
            throw new GameFrameworkError("sound helper is invalid");
        }
        //初始化存储模块
        GameApp.SaveManager.setSaveHelper(new WebSaveHelper());
        //初始化场景管理
        GameApp.SceneManager.setSceneHelper(new CSceneHelper());
        //初始化JSON工具类
        Utility.Json.setSystemUtility(Utility.System);
    }

    private initializeAppModule() {
        //初始化节点对象池
        let nodePoolManager = GameApp.NodePoolManager;
        nodePoolManager.setResourceManager(GameApp.ResourceManager);
        nodePoolManager.setObjectPoolManager(GameApp.ObjectPoolManager);
        nodePoolManager.setNodeHelper(new CNodeHelper());
        GameApp.ModelManager.setSaveManager(GameApp.SaveManager);
        GameApp.CommandManager.setObjectPoolManager(GameApp.ObjectPoolManager);
        GameApp.PlatformManager.setPlatformHelper(new CPlatformHelper());
    }

    private initializeHotUpdate() {
        let hotUpdateHelper = new CHotUpdateHelper();
        hotUpdateHelper.setPlatformManager(GameApp.PlatformManager);
        hotUpdateHelper.setSaveManager(GameApp.SaveManager);
        GameApp.ResourceManager.setHotUpdateHelper(hotUpdateHelper);
    }
}
