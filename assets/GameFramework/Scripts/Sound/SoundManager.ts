import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IResourceManager } from "../Resource/IResourceManager";
import { ResourceManager } from "../Resource/ResourceManager";
import { ISoundManager } from "./ISoundManager";
import { SoundGroup } from "./SoundGroup";

export class SoundManager extends GameFrameworkModule implements ISoundManager {
    private _soundGroups: Map<string, SoundGroup> = null!;
    private _resourceManager: IResourceManager = null!;

    constructor() {
        super();
        this._soundGroups = new Map<string, SoundGroup>();
    }

    get priority(): number {
        return 7;
    }

    setResourceManager(resourceManager: ResourceManager) {
        this._resourceManager = resourceManager;
    }

    update(elapseSeconds: number): void {
        throw new Error("Method not implemented.");
    }

    shutDown(): void {
        throw new Error("Method not implemented.");
    }

    playSound(soundAssetPath: string, soundGroupName: string = "") {}
}
