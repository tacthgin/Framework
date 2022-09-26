import { IAstarVec2 } from "./IAstarVec2";

/**
 * A*地图接口
 */
export interface IAstarMap {
    /**
     * 地图宽度
     */
    readonly width: number;

    /**
     * 地图高度
     */
    readonly height: number;

    /**
     * 检查该位置是否可以行走
     * @param position
     */
    check(position: IAstarVec2): boolean;
}
