import { IAstarVec2 } from "./IAstarVec2";

/**
 * A*辅助器接口
 */
export interface IAstarHelper {
    /**
     * 当前位置到结束位置的最短预估值
     * @param currentPosition
     * @param endPosition
     */
    estimate(currentPosition: IAstarVec2, endPosition: IAstarVec2): number;

    /**
     * 遍历A*当前节点周围，不同辅助器，遍历的节点不同
     * @param callbackfn 遍历节点的回调函数
     * @param thisArg
     */
    forEachAroundNodes(callbackfn: (position: IAstarVec2) => void, thisArg?: any): void;
}
