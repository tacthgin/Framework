import { PlaySoundParams } from "../../Script/Sound/PlaySoundParams";
import { GameApp } from "../Base/GameApp";
import { SoundConstant } from "./SoundConstant";

/**
 * 声音工厂
 */
export class SoundFactory {
    private static _backgroundSoundId: number = -1;

    /**
     * 播放背景音乐
     * @param soundAssetPath  声音资源路径
     * @param playSoundParams 声音播放参数
     */
    static async playBackgroundSound(soundAssetPath: string, playSoundParams?: PlaySoundParams): Promise<void> {
        if (this._backgroundSoundId != -1) {
            this.stopBackgroundSound();
        }
        if (!playSoundParams) {
            playSoundParams = PlaySoundParams.create(true);
        }
        this._backgroundSoundId = await GameApp.SoundManager.playSound(soundAssetPath, SoundConstant.SOUND_BACKGROUND_GROUP, playSoundParams);
    }

    /**
     * 恢复背景音乐
     */
    static resumeBackgroundSound() {
        GameApp.SoundManager.resumeSound(this._backgroundSoundId);
    }

    /**
     * 暂停背景音乐
     */
    static pauseBackgroundSound() {
        GameApp.SoundManager.pauseSound(this._backgroundSoundId);
    }

    /**
     * 停止背景音乐
     */
    static stopBackgroundSound() {
        GameApp.SoundManager.stopSound(this._backgroundSoundId);
        this._backgroundSoundId = -1;
    }

    /**
     * 播放声音特效
     * @param soundAssetPath  声音资源路径
     * @param playSoundParams 声音播放参数
     */
    static async playEffectSound(soundAssetPath: string, playSoundParams?: PlaySoundParams): Promise<number> {
        return await GameApp.SoundManager.playSound(soundAssetPath, SoundConstant.SOUND_EFFECT_GROUP, playSoundParams);
    }
}
