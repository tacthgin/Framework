import { IAstarHelper } from "./IAstarHelper";
import { IAstarMap } from "./IAstarMap";
import { IAstarVec2 } from "./IAstarVec2";

/**
 * A*接口
 */
export interface IAstar {
    /**
     * 缓存的节点个数
     */
    readonly astarNodeCount: number;

    /**
     * 设置A*地图
     * @param astarMap 地图
     */
    setAstarMap(astarMap: IAstarMap): void;

    /**
     * 设置A*辅助器
     * @param astarHelper
     */
    setAstarHelper(astarHelper: IAstarHelper): void;

    /**
     * 创建路径
     * @param beginPosition 起始位置
     * @param endPosition 终点位置
     * @returns 路径列表
     */
    makePath(beginPosition: IAstarVec2, endPosition: IAstarVec2): Array<IAstarVec2>;

    /**
     * 清除缓存的节点
     */
    clearCacheNodes(): void;
}
