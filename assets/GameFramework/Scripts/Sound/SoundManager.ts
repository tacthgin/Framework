import { AudioClip } from "cc";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IResourceManager } from "../Resource/IResourceManager";
import { ISoundHelp } from "./ISoundHelp";
import { ISoundManager } from "./ISoundManager";
import { SoundGroup } from "./SoundGroup";

@GameFrameworkEntry.registerModule("SoundManager")
export class SoundManager extends GameFrameworkModule implements ISoundManager {
    private _soundGroups: Map<string, SoundGroup> = null!;
    private _resourceManager: IResourceManager | null = null;
    private _soundHelp: ISoundHelp | null = null;
    private _serialId: number = 0;

    constructor() {
        super();
        this._soundGroups = new Map<string, SoundGroup>();
    }

    get priority(): number {
        return 7;
    }

    update(elapseSeconds: number): void {
        throw new Error("Method not implemented.");
    }

    shutDown(): void {
        throw new Error("Method not implemented.");
    }

    setResourceManager(resourceManager: IResourceManager) {
        this._resourceManager = resourceManager;
    }

    setSoundHelp(soundHelp: ISoundHelp): void {
        this._soundHelp = soundHelp;
    }

    async playSound(soundAssetPath: string, soundGroupName: string = ""): Promise<number> {
        if (!this._resourceManager) {
            throw new GameFrameworkError("resource mamager not exist");
        }
        let audioClip = await this._resourceManager.internalResourceLoader.loadAsset(soundAssetPath, AudioClip);
        if (!audioClip) {
            throw new GameFrameworkError(`audio clip ${soundAssetPath} not exist`);
        }

        soundGroupName = soundGroupName || soundAssetPath;
        return 1;
    }

    pauseSound(soundId: number) {}

    resumeSound(soundId: number) {}

    stopSound(soundId: number) {}
}
