import { resources } from "cc";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IResourceLoader } from "./IResourceLoader";
import { IResourceLoaderHelp } from "./IResourceLoaderHelp";
import { IResourceManager } from "./IResourceManager";
import { ResourceLoader } from "./ResourceLoader";

export class ResourceManager extends GameFrameworkModule implements IResourceManager {
    private _resourceLoaders: Map<string, ResourceLoader> = null!;

    constructor() {
        super();
        this._resourceLoaders = new Map<string, ResourceLoader>();
        this.createResourceLoader("resources", resources);
    }

    get priority(): number {
        return 7;
    }

    get internalResourceLoader(): IResourceLoader {
        return this.getResourceLoader("resources")!;
    }

    update(elapseSeconds: number): void {}

    shutDown(): void {
        this._resourceLoaders.clear();
    }

    getResourceLoader(name: string): IResourceLoader | null {
        let resourceLoader = this._resourceLoaders.get(name);
        if (resourceLoader) {
            return resourceLoader;
        }
        return null;
    }

    createResourceLoader(name: string, bundle: IResourceLoaderHelp) {
        let resourceLoader = this._resourceLoaders.get(name);
        if (resourceLoader) {
            throw new GameFrameworkError(`has exist resource loader ${name}`);
        }
        resourceLoader = new ResourceLoader(bundle);
        this._resourceLoaders.set(name, resourceLoader);
    }
}
