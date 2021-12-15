import { IResourceManager } from "../Resource/IResourceManager";

export interface ISoundManager {
    setResourceManager(resourceManager: IResourceManager): void;

    playSound(soundAssetPath: string, soundGroupName?: string): Promise<number>;

    pauseSound(soundId: number): void;

    resumeSound(soundId: number): void;

    stopSound(soundId: number): void;
}
