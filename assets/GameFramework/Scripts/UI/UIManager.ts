import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IResourceManager } from "../Resource/IResourceManager";
import { IUIManager } from "./IUIManager";

@GameFrameworkEntry.registerModule("UIManager")
export class UIManager extends GameFrameworkModule implements IUIManager {
    private _resourceManger: IResourceManager | null = null;

    update(elapseSeconds: number): void {}

    shutDown(): void {}

    setResourceManager(resourceManager: IResourceManager): void {
        this._resourceManger = resourceManager;
    }
}
