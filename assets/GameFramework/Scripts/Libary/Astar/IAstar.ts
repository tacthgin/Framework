import { IAstarHelp } from "./IAstarHelp";
import { IVec2 } from "./IVec2";

/**
 * A*接口
 */
export interface IAstar {
    /**
     * 设置A*辅助器
     * @param astarHelp
     */
    setAstarHelp(astarHelp: IAstarHelp): void;

    /**
     * 创建路径
     */
    makePath(beginPosition: IVec2, endPosition: IVec2): Array<IVec2>;
}
