/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as druid from 'druid.druid';
import { Messages } from "./modules_const";

/*
    Модуль для работы со звуком
*/

declare global {
    const Sound: ReturnType<typeof SoundModule>;
}

export function register_sound() {
    (_G as any).Sound = SoundModule();
}

function SoundModule() {

    function init() {
        set_active(is_active());
        bind_messsages();
        play('empty');
    }

    function attach_druid_click(name = 'btn') {
        druid.set_sound_function(() => play(name));
    }

    function bind_messsages() {
        EventBus.on('SYS_STOP_SND', (message) => {
            sound.stop('/sounds#' + message.name);
        });
        EventBus.on('SYS_PLAY_SND', (message) => {
            sound.play('/sounds#' + message.name, { speed: message.speed, gain: message.volume });
        });
    }

    function is_active() {
        return Storage.get_bool('is_sound', true);
    }

    function set_active(active: boolean) {
        Storage.set('is_sound', active);
        sound.set_group_gain('master', active ? 1 : 0);
    }

    function play(name: string, speed = 1, volume = 1) {
        if (!is_active())
            return;
        EventBus.trigger('SYS_PLAY_SND', { name, speed, volume });
    }

    function stop(name: string) {
        EventBus.trigger('SYS_STOP_SND', { name });
    }

    function set_pause(val: boolean) {
        const scene_name = Scene.get_current_name();
        if (scene_name != '')
            EventBus.trigger('ON_SOUND_PAUSE', { val }, false);
        if (!is_active())
            return;
        sound.set_group_gain('master', val ? 0 : 1);
    }

    init();

    return { is_active, set_active, play, stop, set_pause, attach_druid_click };
}