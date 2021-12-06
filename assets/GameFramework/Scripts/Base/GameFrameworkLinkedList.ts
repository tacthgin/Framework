import { GameFrameworkError } from "./GameFrameworkError";

export class LinkedListNode<T> {
    private _next: LinkedListNode<T> | null = null;
    private _previous: LinkedListNode<T> | null = null;
    private _value: T | null = null;

    constructor(value: T) {
        this._value = value;
    }

    set next(value: LinkedListNode<T> | null) {
        this._next = value;
    }

    get next(): LinkedListNode<T> | null {
        return this._next;
    }

    set previous(value: LinkedListNode<T> | null) {
        this._previous = value;
    }

    get previous(): LinkedListNode<T> | null {
        return this._previous;
    }

    set value(value: T | null) {
        this._value = value;
    }

    get value(): T | null {
        return this._value;
    }
}

/** 双链表 */
export class GameFrameworkLinkedList<T> {
    private _first: LinkedListNode<T> | null = null;
    private _last: LinkedListNode<T> | null = null;
    private _size: number = 0;
    private readonly _cacheNodes: Array<LinkedListNode<T>> = null!;

    constructor() {
        this._cacheNodes = new Array<LinkedListNode<T>>();
    }

    get size(): number {
        return this._size;
    }

    get first(): LinkedListNode<T> | null {
        return this._first;
    }

    get last(): LinkedListNode<T> | null {
        return this._last;
    }

    get(value: T): LinkedListNode<T> | null {
        let current = this._first;
        while (current) {
            if (current.value == value) {
                return current;
            }
            current = current.next;
        }

        return null;
    }

    lastGet(value: T): LinkedListNode<T> | null {
        let current = this._last;
        while (current) {
            if (current.value == value) {
                return current;
            }
            current = current.previous;
        }
        return null;
    }

    has(value: T): boolean {
        return this.get(value) != null;
    }

    addFirst(value: T): void {
        if (this.size == 0) {
            this.addToEmpty(value);
        } else {
            this.addBefore(this._first!, value);
        }
    }

    addLast(value: T): void {
        if (this.size == 0) {
            this.addToEmpty(value);
        } else {
            this.addAfter(this._last!, value);
        }
    }

    addBefore(node: LinkedListNode<T>, value: T): void {
        if (!node) {
            throw new GameFrameworkError("node is invalid");
        }
        let newNode = this.acquireNode(value);
        newNode.next = node;
        newNode.previous = node.previous;
        node.previous = newNode;
        if (this._first == node) {
            this._first = newNode;
        }
    }

    addAfter(node: LinkedListNode<T>, value: T): void {
        if (!node) {
            throw new GameFrameworkError("node is invalid");
        }
        let newNode = this.acquireNode(value);
        newNode.previous = node;
        newNode.next = node.next;
        node.next = newNode;
        if (node == this._last) {
            this._last = newNode;
        }
    }

    remove(node: LinkedListNode<T> | T): void {
        if (!node) {
            throw new GameFrameworkError("node is invalid");
        }
        this.internalRemoveNode(node, false);
    }

    lastRemove(node: LinkedListNode<T> | T): void {
        if (!node) {
            throw new GameFrameworkError("node is invalid");
        }
        this.internalRemoveNode(node, true);
    }

    removeFirst(): void {
        if (!this.first) {
            throw new GameFrameworkError("first is invalid");
        }
        this.remove(this.first);
    }

    removeLast(): void {
        if (!this.last) {
            throw new GameFrameworkError("last is invalid");
        }
        this.remove(this.last);
    }

    forEach(callbackfn: (value: T, index: number, linkedList: GameFrameworkLinkedList<T>) => void, thisArg?: any): void {
        let current = this._first;
        let listIndex = 0;
        while (current) {
            callbackfn.call(thisArg, current.value!, listIndex++, this);
            current = current.next;
        }
    }

    [Symbol.iterator](): IterableIterator<T> {
        let current = this._first;
        return {
            next() {
                if (current) {
                    let value = current.value;
                    current = current.next;
                    return { done: false, value: value } as unknown as IteratorYieldResult<T>;
                } else {
                    return { done: true, value: undefined } as unknown as IteratorReturnResult<T>;
                }
            },

            [Symbol.iterator](): IterableIterator<T> {
                return this;
            },
        };
    }

    private acquireNode(value: T): LinkedListNode<T> {
        ++this._size;
        if (this._cacheNodes.length > 0) {
            let node = this._cacheNodes.pop();
            if (node) {
                node.value = value;
                return node;
            }
        }
        return new LinkedListNode(value);
    }

    private releaseNode(node: LinkedListNode<T>): void {
        node.value = null;
        this._cacheNodes.push(node);
    }

    private addToEmpty(value: T): void {
        let newNode = this.acquireNode(value);
        this._last = this._first = newNode;
    }

    private internalRemoveNode(nodeOrValue: LinkedListNode<T> | T, reverse: boolean) {
        let current = reverse ? this._last : this._first;
        let next = reverse
            ? (currentNode: LinkedListNode<T>) => {
                  return currentNode.previous;
              }
            : (currentNode: LinkedListNode<T>) => {
                  return currentNode.next;
              };

        while (current) {
            if (GameFrameworkLinkedList.compareTo(current, nodeOrValue)) {
                if (current.previous) {
                    current.previous.next = current.next;
                }

                if (current.next) {
                    current.next.previous = current.previous;
                }
                --this._size;
                this.releaseNode(current);
                break;
            }
            current = next(current);
        }
    }

    private static compareTo<T>(left: LinkedListNode<T>, right: LinkedListNode<T> | T) {
        return right instanceof LinkedListNode ? left == right : left.value == right;
    }

    printList() {
        let current = this._first;
        while (current) {
            console.log(current.value);
            current = current.next;
        }
    }
}
