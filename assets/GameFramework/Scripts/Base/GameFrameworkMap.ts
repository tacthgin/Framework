/**
 * 游戏多重元素map
 */
export class GameFrameworkMap<K, V> {
    private _map: Map<K, Array<V>> = new Map<K, Array<V>>();

    get size(): number {
        return this._map.size;
    }

    clear(): void {
        this._map.clear();
    }

    delete(key: K, value?: V): boolean {
        if (!value) {
            return this._map.delete(key);
        } else {
            let array = this._map.get(key);
            if (array) {
                let index = array.indexOf(value);
                if (index != -1) {
                    array.splice(index, 1);
                    return true;
                }
            }
        }
        return false;
    }

    forEach(callbackfn: (value: V[], key: K, map: Map<K, V[]>) => void, thisArg?: any): void {
        this._map.forEach(callbackfn, thisArg);
    }

    get(key: K): V[] | undefined {
        return this._map.get(key);
    }

    has(key: K, value?: V): boolean {
        if (!value) {
            return this._map.has(key);
        } else {
            let array = this._map.get(key);
            if (array) {
                return array.indexOf(value) != -1;
            }
        }
        return false;
    }

    set(key: K, value: V): this {
        let array = this._map.get(key);
        if (!array) {
            array = new Array<V>();
            this._map.set(key, array);
        }

        if (array.indexOf(value) == -1) {
            array.push(value);
        }

        return this;
    }

    entries(): IterableIterator<[K, V[]]> {
        return this._map.entries();
    }

    keys(): IterableIterator<K> {
        return this._map.keys();
    }

    values(): IterableIterator<V[]> {
        return this._map.values();
    }

    [Symbol.iterator](): IterableIterator<[K, V[]]> {
        return this._map.entries();
    }

    [Symbol.toStringTag]: string = `[object GameFrameworkMap]`;
}
