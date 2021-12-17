import { GameFrameworkError } from "../Base/GameFrameworkError";
import { ISoundGroup } from "./ISoundGroup";
import { ISoundHelp } from "./ISoundHelp";
import { PlaySoundParams } from "./PlaySoundParams";
import { SoundAgent } from "./SoundAgent";

export class SoundGroup implements ISoundGroup {
    private _soundHelp: ISoundHelp | null = null;
    private _name: string = "";
    private _soundAgents: Array<SoundAgent> = null!;
    private _mute: boolean = false;
    private _volume: number = 1;

    constructor(name: string) {
        if (!name) {
            throw new GameFrameworkError("sound group name is invalid");
        }
        this._name = name;
        this._soundAgents = new Array<SoundAgent>();
    }

    get name(): string {
        return this._name;
    }

    get soundAgentCount(): number {
        return this._soundAgents.length;
    }

    set mute(value: boolean) {
        this._mute = value;
    }

    get mute(): boolean {
        return this._mute;
    }

    set volume(value: number) {
        this._volume = value;
    }

    get volume(): number {
        return this._volume;
    }

    addSoundHelp(soundHelp: ISoundHelp) {
        this._soundHelp = soundHelp;
    }

    playSound(soundId: number, soundAsset: object, playSoundParams: PlaySoundParams) {
        let candidateAgent: SoundAgent | null = null;
        for (let soundAgent of this._soundAgents) {
            if (!soundAgent.isPlaying) {
                candidateAgent = soundAgent;
                break;
            }
        }

        if (candidateAgent && candidateAgent.setSoundAsset(soundAsset)) {
            candidateAgent.soundId = soundId
            candidateAgent.volume = playSoundParams.volume
            candidateAgent.loop = playSoundParams.loop
            candidateAgent.play()
        }
    }

    pauseSound(soundId: number) {}

    resumeSound(soundId: number) {}

    stopSound(soundId: number) {}

    stopAllLoadedSounds(): void {
        this._soundAgents.forEach((soundAgent: SoundAgent) => {
            soundAgent.stop();
        });
    }
}
