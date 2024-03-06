local ____exports = {}
local SceneModule
local ____utils = require("utils.utils")
local hex2rgba = ____utils.hex2rgba
function SceneModule()
    local bind_messsages, last_loading_scene, last_scene, MANAGER_ID, is_restarting_scene
    function bind_messsages()
        EventBus.on(
            "SYS_RESTART_SCENE",
            function(message)
                if last_scene == "" then
                    return Log.warn("Сцена для перезагрузки не найдена")
                end
                local n = (MANAGER_ID .. "#") .. last_scene
                msg.post(n, "disable")
                msg.post(n, "final")
                msg.post(n, "unload")
                is_restarting_scene = true
            end
        )
        EventBus.on(
            "SYS_LOAD_SCENE",
            function(message)
                if not Manager.is_ready() then
                    Log.error("Нельзя загрузить сцену, т.к. менеджер еще не готов")
                    return
                end
                last_loading_scene = message.name
                msg.post((MANAGER_ID .. "#") .. message.name, "load")
            end
        )
    end
    last_loading_scene = ""
    last_scene = ""
    MANAGER_ID = "main:/manager"
    local function init()
        if System.platform == "HTML5" then
            html5.run("window.set_light = function(val){document.body.style.backgroundColor = val}")
        end
        bind_messsages()
    end
    local function set_bg(color)
        msg.post(
            "@render:",
            "clear_color",
            {color = hex2rgba(color, 0)}
        )
        if System.platform == "HTML5" then
            html5.run(("set_light('" .. color) .. "')")
        end
    end
    local function load(name)
        EventBus.trigger("SYS_LOAD_SCENE", {name = name})
    end
    local function restart()
        EventBus.trigger("SYS_RESTART_SCENE")
    end
    is_restarting_scene = false
    local function _on_message(_this, message_id, _message, sender)
        if message_id == hash("proxy_unloaded") then
            if is_restarting_scene and last_scene ~= "" then
                last_loading_scene = last_scene
                msg.post((MANAGER_ID .. "#") .. last_scene, "load")
            end
        end
        if message_id == hash("proxy_loaded") then
            if last_scene ~= "" and not is_restarting_scene then
                local n = (MANAGER_ID .. "#") .. last_scene
                msg.post(n, "disable")
                msg.post(n, "final")
                msg.post(n, "unload")
                last_scene = ""
            end
            is_restarting_scene = false
            msg.post(sender, "init")
            msg.post(sender, "enable")
            last_scene = last_loading_scene
            last_loading_scene = ""
        end
    end
    local function get_current_name()
        return last_scene
    end
    init()
    return {
        _on_message = _on_message,
        restart = restart,
        load = load,
        set_bg = set_bg,
        get_current_name = get_current_name
    }
end
function ____exports.register_scene()
    _G.Scene = SceneModule()
end
return ____exports
