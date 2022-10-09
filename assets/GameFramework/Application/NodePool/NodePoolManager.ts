import { INodeHelper } from "./INodeHelper";
import { INodePoolManager } from "./INodePoolManager";
import { INodeBase } from "./INodeBase";
import { NodeObject } from "./NodeObject";
import { Constructor } from "../../Script/Base/DataStruct/Constructor";
import { GameFrameworkError } from "../../Script/Base/GameFrameworkError";
import { IObejctPoolManager } from "../../Script/ObjectPool/IObejctPoolManager";
import { IObjectPool } from "../../Script/ObjectPool/IObjectPool";
import { IResourceManager } from "../../Script/Resource/IResourceManager";

/**
 * 节点池管理器
 */
export class NodePoolManager implements INodePoolManager {
    private readonly _nodePools: Map<string, IObjectPool<NodeObject>> = null!;
    private readonly _constructorToNameMap: Map<Constructor<INodeBase>, string> = null!;
    private _resourceManager: IResourceManager | null = null;
    private _objectPoolManager: IObejctPoolManager | null = null;
    private _nodeHelper: INodeHelper | null = null;

    constructor() {
        this._nodePools = new Map<string, IObjectPool<NodeObject>>();
        this._constructorToNameMap = new Map<Constructor<INodeBase>, string>();
    }

    shutDown(): void {
        this._nodePools.clear();
        this._constructorToNameMap.clear();
    }

    setResourceManager(resourceManager: IResourceManager): void {
        this._resourceManager = resourceManager;
    }

    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void {
        this._objectPoolManager = objectPoolManager;
    }

    setNodeHelper(nodeHelper: INodeHelper): void {
        this._nodeHelper = nodeHelper;
    }

    hasNodePool<T extends INodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): boolean {
        let nodePoolName = this.internalGetPoolName(nodeConstructorOrNodePoolName);
        return this._nodePools.has(nodePoolName);
    }

    getNodePool<T extends INodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): IObjectPool<NodeObject> | null {
        let nodePoolName = this.internalGetPoolName(nodeConstructorOrNodePoolName);
        let objectPool = this._nodePools.get(nodePoolName);
        if (objectPool) {
            return objectPool;
        }

        return null;
    }

    createNodePool<T extends INodeBase>(nodePoolName: string, nodeConstructor?: Constructor<T>): IObjectPool<NodeObject> {
        if (!nodePoolName) {
            throw new GameFrameworkError("nodePoolName is invalid");
        }

        let objectPool = this._nodePools.get(nodePoolName);
        if (objectPool) {
            throw new GameFrameworkError(`node pool ${nodePoolName} is exist`);
        }

        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        objectPool = this._objectPoolManager.createSingleSpawnObjectPool(NodeObject, nodePoolName);
        this._nodePools.set(nodePoolName, objectPool);
        if (nodeConstructor) {
            if (this._constructorToNameMap.has(nodeConstructor)) {
                throw new GameFrameworkError(`${nodePoolName} already exist node constructor`);
            } else {
                this._constructorToNameMap.set(nodeConstructor, nodePoolName);
            }
        }

        return objectPool;
    }

    destroyNodePool<T extends INodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): boolean {
        if (typeof nodeConstructorOrNodePoolName === "string" && !nodeConstructorOrNodePoolName) {
            throw new GameFrameworkError("node pool name is invalid");
        }

        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        let nodePoolName = this.internalGetPoolName(nodeConstructorOrNodePoolName);
        let objectPool = this._nodePools.get(nodePoolName);
        if (objectPool) {
            return this._objectPoolManager.destroyObjectPool(NodeObject, nodePoolName);
        }

        return false;
    }

    createNode<T extends INodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, asset: object, name?: string): object {
        if (!this._nodeHelper) {
            throw new GameFrameworkError("you must set node help first");
        }

        let objectPool = this.getNodePool(nodeConstructorOrNodePoolName);
        if (!objectPool) {
            throw new GameFrameworkError("object pool is not exist, you must create first");
        }

        name = name || "";

        let nodeObject = objectPool.spawn(name);
        if (!nodeObject) {
            nodeObject = NodeObject.create(name, this._nodeHelper.instantiateNode(asset), this._nodeHelper);
            objectPool.register(nodeObject, true);
        }

        return nodeObject.target as T;
    }

    async createNodeWithPath<T extends INodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, assetPath: string, name?: string): Promise<object> {
        if (!this._resourceManager) {
            throw new GameFrameworkError("you must set resource manager first");
        }

        let asset = this._resourceManager.getAsset(assetPath);
        if (!asset) {
            asset = await this._resourceManager.loadAsset(assetPath);
            if (!asset) {
                throw new GameFrameworkError(`${assetPath} asset is invalid`);
            }
        }

        return this.createNode(nodeConstructorOrNodePoolName, asset, name);
    }

    releaseNode<T extends INodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, node: object): boolean {
        let objectPool = this.getNodePool(nodeConstructorOrNodePoolName);
        if (objectPool) {
            objectPool.upspawn(node);
            return true;
        }
        return false;
    }

    /**
     * 获取节点池名字
     * @param nodeConstructorOrNodePoolName 节点池名字或者节点构造器
     * @returns 节点池名字
     */
    private internalGetPoolName<T extends INodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string): string {
        return typeof nodeConstructorOrNodePoolName === "string" ? nodeConstructorOrNodePoolName : this._constructorToNameMap.get(nodeConstructorOrNodePoolName) || "";
    }
}
