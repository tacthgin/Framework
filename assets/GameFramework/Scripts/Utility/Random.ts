/**
 * 随机工具类
 */
export class Random {
    /** 随机种子,默认为当前时间戳 */
    private seed: number = Date.now();

    /**
     * 设置随机种子
     * @param seed 种子
     */
    setSeed(seed: number): void {
        this.seed = seed;
    }

    /**
     * 获取随机数
     * @returns
     */
    getRandom(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    /**
     * 根据随机种子范围随机
     * @param min 最小值
     * @param max 最大值
     * @returns
     */
    randomSeed(min: number, max: number): number {
        return this.getRandom() * (max - min) + min;
    }

    /**
     * 根据随机种子，整数范围随机，含最大值，含最小值
     * @param min 最小值
     * @param max 最大值
     * @returns
     */
    randomSeedInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.getRandom() * (max - min + 1)) + min;
    }

    /**
     * 任意数范围随机，这个值不小于 min（有可能等于），并且小于（不等于）max
     * @param min 最小值
     * @param max 最大值
     * @returns
     */
    random(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * 整数范围随机，含最大值，含最小值
     * @param min 最小值
     * @param max 最大值
     * @returns
     */
    randomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 数组随机取一个值
     * @param array 任意数组
     * @returns
     */
    randomArray<T>(array: T[]): T | null {
        if (!array || array.length == 0) {
            return null;
        }
        return array[this.randomInt(0, array.length - 1)];
    }

    /**
     * 从数组中随机count个不同的元素
     * @param array 任意数组
     * @param count 随机个数
     * @returns
     */
    randomArrayDifferences<T>(array: T[], count: number): T[] {
        if (!array) {
            return [];
        } else if (array.length <= count) {
            return array;
        }

        let indexes = {};
        let randomIndexs = [];

        //交换尾部，随机头部部分
        let length = -1;
        while (randomIndexs.length < count) {
            length = array.length - randomIndexs.length;
            let index = Math.floor(Math.random() * length);
            randomIndexs.push(indexes[index] || index);
            indexes[index] = indexes[length - 1] || length - 1;
        }

        for (let i = 0; i < randomIndexs.length; i++) {
            randomIndexs[i] = array[randomIndexs[i]];
        }

        return randomIndexs;
    }
}
