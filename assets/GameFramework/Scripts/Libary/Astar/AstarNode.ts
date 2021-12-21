import { IVec2 } from "./IVec2";

/**
 * A*节点
 */
export class AstarNode {
    private _parent: AstarNode | null = null;
    private _position: IVec2 = null!;
    private _gValue: number = 0;
    private _fValue: number = 0;

    /**
     *
     * @param position 当前节点位置
     * @param hValue 预估值
     * @param parentNode 父结点
     */
    constructor(x: number, y: number, hValue: number, parentNode: AstarNode | null = null) {
        this.initialize(x, y, hValue, parentNode);
    }

    /**
     * 父节点
     */
    get parent() {
        return this._parent;
    }

    /**
     * 当前节点位置
     */
    get position() {
        return this._position;
    }

    /**
     * 当前结点离起始点的路程叠加
     */
    get gValue() {
        return this._gValue;
    }

    /** 该结点的总路程，f = g + h（总得预估值）*/
    get fValue() {
        return this._fValue;
    }

    /**
     * 初始化节点属性
     * @param x
     * @param y
     * @param hValue
     * @param parentNode
     */
    initialize(x: number, y: number, hValue: number, parentNode: AstarNode | null = null) {
        this._parent = parentNode;
        if (this._position) {
            this._position.x = x;
            this._position.y = y;
        } else {
            this._position = { x: x, y: y };
        }
        this._gValue = parentNode ? parentNode.gValue + 1 : 0;
        this._fValue = this._gValue + hValue;
    }

    /**
     * 节点位置是否相等
     * @param position
     * @returns
     */
    equals(position: IVec2) {
        return this._position.x == position.x && this._position.y == position.y;
    }
}
