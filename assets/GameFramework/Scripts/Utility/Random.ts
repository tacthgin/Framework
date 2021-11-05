/**
 * 随机工具类
 */
export class Random {
    /** 随机种子,默认为当前时间戳 */
    private static seed: number = Date.now();

    /**
     * 设置随机种子
     * @param seed 种子
     */
    static setSeed(seed: number) {
        this.seed = seed;
    }

    /**
     * 获取随机数
     * @returns
     */
    private static getRandom() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    /**
     * 根据随机种子范围随机
     * @param min 最小值
     * @param max 最大值
     * @returns
     */
    static randomSeed(min: number, max: number) {
        return this.getRandom() * (max - min) + min;
    }

    /**
     * 根据随机种子，整数范围随机，含最大值，含最小值
     * @param min 最小值
     * @param max 最大值
     * @returns
     */
    static randomSeedInt(min: number, max: number) {
        return this.getRandom() * (max - min) + min;
    }

    /**
     * 任意数范围随机，这个值不小于 min（有可能等于），并且小于（不等于）max
     * @param min 最小值
     * @param max 最大值
     * @returns
     */
    static random(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.getRandom() * (max - min + 1)) + min;
    }

    /**
     * 整数范围随机，含最大值，含最小值
     * @param min 最小值
     * @param max 最大值
     * @returns
     */
    static randomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 数组随机取一个值
     * @param array 任意数组
     * @returns
     */
    static randomArray<T>(array: T[]): T {
        if (!array || array.length == 0) {
            return null;
        }
        return array[this.randomInt(0, array.length - 1)];
    }

    static randomArrayNotRepeat<T>(array: T[], count: number): T[] {
        if (!array || array.length < count) {
            return [];
        }

        let lastIndex = array.length - 1;

        let randomIndexs = [];
        while (randomIndexs.length < count) {
            let value = this.random(0, lastIndex);
            while (randomIndexs.indexOf(value) != -1) {
                value = this.random(0, lastIndex);
            }
            randomIndexs.push(value);
        }

        for (let i = 0; i < randomIndexs.length; i++) {
            randomIndexs[i] = array[randomIndexs[i]];
        }

        return randomIndexs;
    }
}
