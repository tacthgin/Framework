import { ISoundAgent } from "./ISoundAgent";
import { ISoundGroup } from "./ISoundGroup";

export class SoundAgent implements ISoundAgent {
    private _soundAsset: object | null = null;
    
    constructor() {}

    get soundGroup(): ISoundGroup {}

    get soundId(): number {}

    get isPlaying(): boolean {}

    get length(): number {}

    set time(value: number) {}

    get time(): number {}

    get mute(): boolean {}

    set muteInSoundGroup(value: boolean) {}

    get muteInSoundGroup(): boolean {}

    set loop(value: boolean) {}

    get loop(): boolean {}

    get volume(): number {}

    set volumeInSoundGroup(value: number) {}

    get volumeInSoundGroup(): number {}

    play(): void {
        throw new Error("Method not implemented.");
    }

    stop(): void {
        throw new Error("Method not implemented.");
    }

    resume(): void {
        throw new Error("Method not implemented.");
    }

    pause(): void {
        throw new Error("Method not implemented.");
    }
}
