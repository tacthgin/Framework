// import { Asset, assetManager, AudioClip, ImageAsset, JsonAsset, Prefab, resources, SpriteFrame, TiledMapAsset } from "cc";
// import { BaseEvent } from "../Base/BaseContant";
// import { Fn } from "../Util/Fn";
// import { NotifyCenter } from "./NotifyCenter";

// export enum ResourceType {
//     JSON = "Json",
//     SPRITE = "Sprites",
//     AUIDO = "Audio",
//     TILED_MAP = "TiledMap",
// }

// /** resources资源加载管理 */
// export class ResourceManager {
//     /** 所有类型资源 */
//     private assets: any = {};
//     /** 预加载资源 */
//     private resourcePromises: Promise<any>[] = [];
//     private resourceAssetConfig: Readonly<any> = {
//         [ResourceType.JSON]: JsonAsset,
//         [ResourceType.SPRITE]: SpriteFrame,
//         [ResourceType.AUIDO]: AudioClip,
//         [ResourceType.TILED_MAP]: TiledMapAsset,
//     };
//     /** 预加载资源完成个数 */
//     private resourceCompleteCount: number = 0;
//     /** 资源完成的类型 */
//     private resourceCompleteTypes: { [key: string]: boolean } = {};
//     /** 预加载预设 */
//     private preloadPrefabs: any = {};
//     /** 远程图片集合 */
//     private remoteImages: { [key: string]: SpriteFrame } = {};

//     init() {
//         for (let type in ResourceType) {
//             this.resourcePromises.push(this.createResourcePromise((ResourceType as any)[type]));
//         }
//         return this;
//     }

//     /** 加载所有资源 */
//     loadResources() {
//         this.resourceCompleteCount = 0;
//         if (this.resourcePromises.length > 0) {
//             Promise.all(this.resourcePromises)
//                 .then((results) => {
//                     NotifyCenter.emit(BaseEvent.ALL_RESOURCES_LOAD_SUCCESS);
//                 })
//                 .catch((type: ResourceType) => {
//                     console.error(`加载资源类型${type}失败`);
//                     NotifyCenter.emit(BaseEvent.ALL_RESOURCES_LOAD_FAILED);
//                 });
//         }
//     }

//     private createResourcePromise(type: string) {
//         return new Promise((resolve, reject) => {
//             if (this.resourceCompleteTypes[type]) {
//                 resolve(type);
//                 return;
//             }

//             let now = Date.now();
//             resources.loadDir(
//                 type,
//                 this.resourceAssetConfig[type],
//                 (finished: number, total: number) => {
//                     this.onProgress(type, finished / total);
//                 },
//                 (err, assets) => {
//                     if (err) {
//                         console.error(err);
//                         reject(type);
//                         return;
//                     }
//                     console.log(`加载${type}资源: ${Date.now() - now}ms`);
//                     this.setAssets(type, assets);
//                     this.resourceCompleteTypes[type] = true;
//                     resolve(type);
//                     NotifyCenter.emit(BaseEvent.RESOURCE_COMPLETE, type);
//                 }
//             );
//         });
//     }

//     private setAssets(type: string, assets: Asset[]) {
//         let data: any = {};
//         if (type != ResourceType.JSON) {
//             if (type == ResourceType.SPRITE) {
//                 assets.forEach((asset) => {
//                     let assetInfo: any = resources.getAssetInfo(asset._uuid);
//                     data[assetInfo.path.replace("/spriteFrame", "")] = asset;
//                 });
//             } else {
//                 assets.forEach((asset) => {
//                     let assetInfo: any = resources.getAssetInfo(asset._uuid);
//                     data[assetInfo.path] = asset;
//                 });
//             }
//             this.assets[type] = data;
//         } else {
//             assets.forEach((asset: any) => {
//                 data[asset.name] = asset.json;
//             });
//             this.assets[type] = data;
//         }
//         ++this.resourceCompleteCount;
//     }

//     private onProgress(type: string, progress: number) {
//         //console.log(this.resourceCompleteCount, progress);
//         progress = this.resourceCompleteCount / this.resourcePromises.length + (1 / this.resourcePromises.length) * progress;
//         NotifyCenter.emit(BaseEvent.RESOURCE_PROGRESS, type, progress);
//     }

//     getAssets(type: ResourceType): any {
//         return this.assets[type] || null;
//     }

//     getAsset<T extends Asset>(type: ResourceType | Fn.Constructor<T>, path: string): T | null {
//         let asset = null;
//         if (typeof type == "string") {
//             asset = this.assets[type][`${type}/${path}`];
//         } else {
//             for (let typeName in this.resourceAssetConfig) {
//                 if (this.resourceAssetConfig[typeName] == type) {
//                     asset = this.assets[typeName][`${typeName}/${path}`];
//                     break;
//                 }
//             }
//         }

//         if (!asset) {
//             console.warn("找不到资源", path);
//             return null;
//         }

//         return asset;
//     }

//     getSpriteFrame(path: string): SpriteFrame | null {
//         return this.getAsset(ResourceType.SPRITE, path);
//     }

//     /**
//      * 加载单个资源
//      * @param path 路径
//      * @param type 资源类型构造
//      * @returns
//      */
//     loadAsset<T extends Asset>(path: string): Promise<T | null> {
//         return new Promise((resolve) => {
//             let asset = resources.get<T>(path);
//             if (asset) {
//                 resolve(asset as T);
//             } else {
//                 resources.load<T>(path, (err, asset: T) => {
//                     if (err) {
//                         console.error(err);
//                         resolve(null);
//                         return;
//                     }
//                     resolve(asset);
//                 });
//             }
//         });
//     }

//     /**
//      * 加载资源文件夹
//      * @param path 路径
//      * @param type 资源类型构造
//      */
//     loadAssetDir<T extends Asset>(path: string, type?: Fn.Constructor<T>): Promise<T[] | null> {
//         return new Promise((resolve) => {
//             resources.loadDir(path, type as any, (err, assets) => {
//                 if (err) {
//                     console.error(err);
//                     resolve(null);
//                     return;
//                 }
//                 resolve(assets as any[]);
//             });
//         });
//     }

//     async loadPrefabDir(path: string) {
//         let assets = await this.loadAssetDir(path, Prefab);
//         if (assets) {
//             assets.forEach((asset) => {
//                 this.preloadPrefabs[asset.name] = asset;
//             });
//         }
//     }

//     getPrefab(name: string): Prefab {
//         return this.preloadPrefabs[name] || null;
//     }

//     async loadRemoteImage(url: string) {
//         if (!url) {
//             return null;
//         }

//         if (!this.remoteImages[url]) {
//             let loadFunc = () => {
//                 return new Promise((resolve, reject) => {
//                     assetManager.loadRemote(url, (err: Error, texture: ImageAsset) => {
//                         if (err) {
//                             console.error(err);
//                             reject(null);
//                             return;
//                         } else {
//                             resolve(texture);
//                         }
//                     });
//                 });
//             };

//             let texture = await loadFunc();
//             if (texture) {
//                 this.remoteImages[url] = SpriteFrame.createWithImage(texture as any);
//             } else {
//                 return null;
//             }
//         }

//         return this.remoteImages[url];
//     }

//     releaseResDir(type: ResourceType) {
//         let assets = this.assets[type];
//         if (assets) {
//             assets.forEach((asset: Asset) => {
//                 assetManager.releaseAsset(asset);
//             });
//         }
//     }
// }
