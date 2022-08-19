import { IAstarHelper } from "../IAstarHelper";
import { IAstarVec2 } from "../IAstarVec2";

/**
 * 走十字格子的A*辅助器
 */
export class CrossAstarHelper implements IAstarHelper {
    static s_roundNodes: Array<IAstarVec2> = new Array<IAstarVec2>({ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 });

    estimate(currentPosition: IAstarVec2, endPosition: IAstarVec2): number {
        return Math.abs(endPosition.y - currentPosition.y) + Math.abs(endPosition.x - currentPosition.x);
    }

    forEachAroundNodes(callbackfn: (position: IAstarVec2) => void, thisArg?: any): void {
        CrossAstarHelper.s_roundNodes.forEach((position: IAstarVec2) => {
            callbackfn.call(thisArg, position);
        });
    }
}
