import { Component, _decorator } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { IEventManager } from "../Event/IEventManager";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IResourceManager } from "../Resource/IResourceManager";
import { ISoundManager } from "../Sound/ISoundManager";
import { IModel } from "./Model/IModel";
import { ModelContainer } from "./Model/ModelContainer";

const { ccclass, property } = _decorator;

@ccclass("GameApp")
export class GameApp extends Component {
    private static _instance: GameApp | null = null;
    private _modelContainer: ModelContainer = null!;

    static get instance(): GameApp {
        return this._instance!;
    }

    static get ResourceManager(): IResourceManager {
        return GameFrameworkEntry.getModule<IResourceManager>("ResourceManager");
    }

    static get EventManager(): IEventManager {
        return GameFrameworkEntry.getModule<IEventManager>("EventManager");
    }

    static get ObjectPoolManager(): IObejctPoolManager {
        return GameFrameworkEntry.getModule<IObejctPoolManager>("ObjectPoolManager");
    }

    static get SoundManager(): ISoundManager {
        return GameFrameworkEntry.getModule<ISoundManager>("SoundManager");
    }

    static getModel<T extends IModel>(constructor: Constructor<IModel>): T {
        return GameApp.instance._modelContainer.getModel(constructor) as T;
    }

    onLoad() {
        if (GameApp._instance) {
            this.destroy();
            return;
        } else {
            GameApp._instance = this;
        }
        this.initialize();
    }

    onDestroy() {
        GameApp._instance = null;
    }

    private initialize() {
        //初始化框架

        //初始化model
        this._modelContainer = new ModelContainer();
    }
}
