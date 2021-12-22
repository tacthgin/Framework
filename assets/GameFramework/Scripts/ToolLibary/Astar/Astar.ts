import { AstarNode } from "./AstarNode";
import { IAstar } from "./IAstar";
import { IAstarHelp } from "./IAstarHelp";
import { IAstarMap } from "./IAstarMap";
import { IVec2 } from "./IVec2";

export class Astar implements IAstar {
    /** 关闭列表的节点不会在用到 */
    private _closeList: Set<number> = null!;
    /** 从开放列表取估值最小的路径来行走 */
    private _openList: Array<AstarNode> = null!;
    /** 是否缓存在开放列表中 */
    private _cachedOpenList: Set<number> = null!;
    /** A*地图 */
    private _astarMap: IAstarMap = null!;
    /** A*辅助器 */
    private _astarHelp: IAstarHelp | null = null;
    /** 暂时缓存节点 */
    private _cachedAstarNodes: Array<AstarNode> = null!;
    /** 已经释放的节点 */
    private _releasedAstarNodes: Array<AstarNode> = null!;

    constructor(astarMap: IAstarMap) {
        this._astarMap = astarMap;
        this._closeList = new Set<number>();
        this._openList = new Array<AstarNode>();
        this._cachedOpenList = new Set<number>();
        this._cachedAstarNodes = new Array<AstarNode>();
        this._releasedAstarNodes = new Array<AstarNode>();
    }

    /**
     * 设置A*辅助器
     * @param astarHelp
     */
    setAstarHelp(astarHelp: IAstarHelp): void {
        this._astarHelp = astarHelp;
    }

    /**
     * 创建路径
     * @param beginPosition 起始位置
     * @param endPosition 终点位置
     * @returns 路径列表
     */
    makePath(beginPosition: IVec2, endPosition: IVec2): Array<IVec2> {
        if (!this._astarHelp) {
            throw new Error("astar help not exist");
        }

        if (!this.inBoundary(endPosition)) {
            throw new Error("end position out of boundary");
        }

        let hValue = this._astarHelp.estimate(beginPosition, endPosition);
        if (hValue == 0) {
            throw new Error("distance is 0");
        }

        this.clear();

        this.addToOpenList(beginPosition, hValue, null);

        let node: AstarNode | null = null;
        let lastNode: AstarNode | null = null;
        while (this._openList.length > 0) {
            node = this.popOpenList();
            if (node.equals(endPosition)) {
                lastNode = node;
                break;
            }
            this.addAroundNodes(node, endPosition);
        }

        let path = new Array<IVec2>();

        // 判断父亲是不包含起点
        while (lastNode && lastNode.parent) {
            path.push(lastNode.position);
            lastNode = lastNode.parent;
        }

        path.reverse();
        this.recyle();

        return path;
    }

    /**
     * 清除缓存的节点
     */
    clearCacheNodes(): void {
        this._releasedAstarNodes.length = 0;
    }

    /**
     * 清除开放和关闭列表
     */
    private clear(): void {
        this._openList.length = 0;
        this._closeList.clear();
        this._cachedOpenList.clear();
    }

    /**
     * 回收节点
     */
    private recyle() {
        this._cachedAstarNodes.forEach((node) => {
            this._releasedAstarNodes.push(node);
        });
        this._cachedAstarNodes.length = 0;
        this._openList.forEach((node) => {
            this._releasedAstarNodes.push(node);
        });
    }

    /**
     * 位置是否在地图范围
     * @param position
     * @returns
     */
    private inBoundary(position: IVec2) {
        return position.x >= 0 && position.x < this._astarMap.width && position.y >= 0 && position.y < this._astarMap.height;
    }

    /**
     * 位置转换为唯一索引
     * @param position
     * @returns
     */
    private positionToIndex(position: IVec2): number {
        return position.y * this._astarMap.width + position.x;
    }

    /**
     * 添加位置到关闭列表
     * @param position
     */
    private addPositionToCloseList(position: IVec2) {
        let index = this.positionToIndex(position);
        if (!this._closeList.has(index)) {
            this._closeList.add(index);
        }
    }

    /**
     * 位置是否在关闭列表
     * @param position
     * @returns
     */
    private isPositionInCloseList(position: IVec2): boolean {
        return this._closeList.has(this.positionToIndex(position));
    }

    /** 插入进开放列表按f值排序 */
    private addToOpenList(position: IVec2, hValue: number, parentNode: AstarNode | null = null) {
        let node = this.acquireAstarNode(position.x, position.y, hValue, parentNode);
        let index = 0;
        for (let i = this._openList.length - 1; i >= 0; --i) {
            if (node.fValue < this._openList[i].fValue) {
                index = i + 1;
                break;
            }
        }
        this._openList.splice(index, 0, node);
        this._cachedOpenList.add(this.positionToIndex(position));
    }

    /**
     * 从开放列表取出估值最小的节点
     * @returns
     */
    private popOpenList() {
        let astarNode = this._openList.pop()!;
        let index = this.positionToIndex(astarNode.position);
        this._cachedOpenList.delete(index);
        this._cachedAstarNodes.push(astarNode);
        return astarNode;
    }

    /**
     * 添加当前节点周围的节点
     * @param currentNode
     * @param endPosition
     */
    private addAroundNodes(currentNode: AstarNode, endPosition: IVec2) {
        this.addPositionToCloseList(currentNode.position);

        this._astarHelp!.forEachAroundNodes((position: IVec2) => {
            let newPos: IVec2 = { x: currentNode.position.x + position.x, y: currentNode.position.y + position.y };
            if (this.inBoundary(newPos) && !this.isPositionInCloseList(newPos)) {
                if (!this._cachedOpenList.has(this.positionToIndex(newPos)) && this._astarMap.check(newPos)) {
                    this.addToOpenList(newPos, this._astarHelp!.estimate(newPos, endPosition), currentNode);
                } else {
                    this.addPositionToCloseList(newPos);
                }
            }
        });
    }

    /**
     * 获取节点
     * @param x
     * @param y
     * @param hValue
     * @param parentNode
     * @returns
     */
    private acquireAstarNode(x: number, y: number, hValue: number, parentNode: AstarNode | null = null): AstarNode {
        if (this._releasedAstarNodes.length > 0) {
            let node = this._releasedAstarNodes.pop()!;
            node.initialize(x, y, hValue, parentNode);
            return node;
        } else {
            return new AstarNode(x, y, hValue, parentNode);
        }
    }
}