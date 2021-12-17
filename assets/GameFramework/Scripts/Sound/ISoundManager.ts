import { IResourceManager } from "../Resource/IResourceManager";
import { ISoundHelp } from "./ISoundHelp";

export interface ISoundManager {
    setResourceManager(resourceManager: IResourceManager): void;

    setSoundHelp(soundHelp: ISoundHelp): void;

    playSound(soundAssetPath: string, soundGroupName?: string): Promise<number>;

    pauseSound(soundId: number): void;

    resumeSound(soundId: number): void;

    stopSound(soundId: number): void;
}
