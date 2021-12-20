import { GameFrameworkError } from "../Base/GameFrameworkError";
import { ISoundAgent } from "./ISoundAgent";
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

    /**
     * 添加声音辅助器
     * @param soundHelp
     */
    addSoundHelp(soundHelp: ISoundHelp): void {
        this._soundHelp = soundHelp;
    }

    /**
     * 播放声音
     * @param soundId 声音id
     * @param soundAsset 声音资源
     * @param playSoundParams 播放声音需要的参数
     * @returns 声音代理
     */
    playSound(soundId: number, soundAsset: object, playSoundParams: PlaySoundParams): void {
        let candidateAgent: SoundAgent | null = null;
        for (let soundAgent of this._soundAgents) {
            if (!soundAgent.isPlaying) {
                candidateAgent = soundAgent;
                break;
            }
        }

        if (!candidateAgent) {
            if (this._soundHelp) {
                let soundAgentHelp = this._soundHelp.acquireSoundAgentHelp();
                candidateAgent = new SoundAgent(this, soundAgentHelp);
                this._soundAgents.push(candidateAgent);
            } else {
                throw new GameFrameworkError("sound help not exist");
            }
        }

        if (candidateAgent && candidateAgent.setSoundAsset(soundAsset)) {
            candidateAgent.soundId = soundId;
            candidateAgent.volumeInSoundGroup = playSoundParams.volumeInSoundGroup;
            candidateAgent.muteInSoundGroup = playSoundParams.muteInSoundGroup;
            candidateAgent.loop = playSoundParams.loop;
            candidateAgent.time = playSoundParams.time;
            candidateAgent.play();
        } else {
            throw new GameFrameworkError("set sound asset failed");
        }
    }

    /**
     * 暂停声音
     * @param soundId 声音id
     */
    pauseSound(soundId: number): boolean {
        for (let soundAgent of this._soundAgents) {
            if (soundAgent.soundId == soundId) {
                soundAgent.pause();
                return true;
            }
        }
        return false;
    }

    /**
     * 恢复声音播放
     * @param soundId 声音id
     */
    resumeSound(soundId: number): boolean {
        for (let soundAgent of this._soundAgents) {
            if (soundAgent.soundId == soundId) {
                soundAgent.resume();
                return true;
            }
        }
        return false;
    }

    /**
     * 停止声音
     * @param soundId 声音id
     */
    stopSound(soundId: number): boolean {
        for (let soundAgent of this._soundAgents) {
            if (soundAgent.soundId == soundId) {
                soundAgent.stop();
                return true;
            }
        }
        return false;
    }

    /**
     * 停止所有播放的声音
     */
    stopAllLoadedSounds(): void {
        for (let soundAgent of this._soundAgents) {
            if (soundAgent.isPlaying) {
                soundAgent.stop();
            }
        }
    }
}
