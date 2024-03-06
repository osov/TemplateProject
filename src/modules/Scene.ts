/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { hex2rgba } from "../utils/utils";

/*
    Модуль для работы со сценой
*/

declare global {
    const Scene: ReturnType<typeof SceneModule>;
}

export function register_scene() {
    (_G as any).Scene = SceneModule();
}


function SceneModule() {
    let last_loading_scene = '';
    let last_scene = '';
    const MANAGER_ID = 'main:/manager';

    function init() {
        if (System.platform == 'HTML5')
            html5.run(`window.set_light = function(val){document.body.style.backgroundColor = val}`);
        bind_messsages();
    }

    function bind_messsages() {
        EventBus.on('SYS_RESTART_SCENE', (message) => {
            if (last_scene == '')
                return Log.warn('Сцена для перезагрузки не найдена');
            const n = MANAGER_ID + "#" + last_scene;
            msg.post(n, "disable");
            msg.post(n, "final");
            msg.post(n, "unload");
            is_restarting_scene = true;
        });

        EventBus.on('SYS_LOAD_SCENE', (message) => {
            // ждем готовности модулей
            if (!Manager.is_ready()) {
                Log.error('Нельзя загрузить сцену, т.к. менеджер еще не готов');
                return;
            }
            last_loading_scene = message.name;
            msg.post(MANAGER_ID + "#" + message.name, "load");
        });
    }

    function set_bg(color: string) {
        msg.post("@render:", "clear_color", { color: hex2rgba(color, 0) });
        if (System.platform == 'HTML5')
            html5.run(`set_light('` + color + `')`);
    }

    // загрузить сцену с именем
    function load(name: string) {
        EventBus.trigger('SYS_LOAD_SCENE', { name });
    }

    function restart() {
        EventBus.trigger('SYS_RESTART_SCENE');
    }

    let is_restarting_scene = false;
    function _on_message(_this: any, message_id: hash, _message: any, sender: hash) {
        if (message_id == hash("proxy_unloaded")) {
            if (is_restarting_scene && last_scene != '') {
                last_loading_scene = last_scene;
                msg.post(MANAGER_ID + "#" + last_scene, "load");
            }
        }
        if (message_id == hash("proxy_loaded")) {
            if (last_scene != '' && !is_restarting_scene) {
                const n = MANAGER_ID + "#" + last_scene;
                msg.post(n, "disable");
                msg.post(n, "final");
                msg.post(n, "unload");
                last_scene = '';
            }
            is_restarting_scene = false;
            msg.post(sender, "init");
            msg.post(sender, "enable");
            last_scene = last_loading_scene;
            last_loading_scene = '';
            //EventBus.trigger('SCENE_LOADED', { name: last_scene });
        }
    }

    function get_current_name() {
        return last_scene;
    }

    init();

    return { _on_message, restart, load, set_bg, get_current_name };
}