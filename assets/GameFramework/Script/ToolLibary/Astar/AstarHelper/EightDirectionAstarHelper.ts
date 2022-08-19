import { IAstarHelper } from "../IAstarHelper";
import { IAstarVec2 } from "../IAstarVec2";

/**
 * 八方向格子的A*辅助器
 */
export class EightDirectionAstarHelper implements IAstarHelper {
    static s_roundNodes: Array<IAstarVec2> = new Array<IAstarVec2>(
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 }
    );

    estimate(currentPosition: IAstarVec2, endPosition: IAstarVec2): number {
        let y = endPosition.y - currentPosition.y;
        let x = endPosition.x - currentPosition.x;
        return Math.sqrt(x * x + y * y);
    }

    forEachAroundNodes(callbackfn: (position: IAstarVec2) => void, thisArg?: any): void {
        EightDirectionAstarHelper.s_roundNodes.forEach((position: IAstarVec2) => {
            callbackfn.call(thisArg, position);
        });
    }
}
