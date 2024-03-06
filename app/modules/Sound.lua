local ____exports = {}
local SoundModule
local druid = require("druid.druid")
function SoundModule()
    local bind_messsages, is_active, set_active, play
    function bind_messsages()
        EventBus.on(
            "SYS_STOP_SND",
            function(message)
                sound.stop("/sounds#" .. message.name)
            end
        )
        EventBus.on(
            "SYS_PLAY_SND",
            function(message)
                sound.play("/sounds#" .. message.name, {speed = message.speed, gain = message.volume})
            end
        )
    end
    function is_active()
        return Storage.get_bool("is_sound", true)
    end
    function set_active(active)
        Storage.set("is_sound", active)
        sound.set_group_gain("master", active and 1 or 0)
    end
    function play(name, speed, volume)
        if speed == nil then
            speed = 1
        end
        if volume == nil then
            volume = 1
        end
        if not is_active() then
            return
        end
        EventBus.trigger("SYS_PLAY_SND", {name = name, speed = speed, volume = volume})
    end
    local function init()
        set_active(is_active())
        bind_messsages()
        play("empty")
    end
    local function attach_druid_click(name)
        if name == nil then
            name = "btn"
        end
        druid.set_sound_function(function() return play(name) end)
    end
    local function stop(name)
        EventBus.trigger("SYS_STOP_SND", {name = name})
    end
    local function set_pause(val)
        local scene_name = Scene.get_current_name()
        if scene_name ~= "" then
            EventBus.trigger("ON_SOUND_PAUSE", {val = val}, false)
        end
        if not is_active() then
            return
        end
        sound.set_group_gain("master", val and 0 or 1)
    end
    init()
    return {
        is_active = is_active,
        set_active = set_active,
        play = play,
        stop = stop,
        set_pause = set_pause,
        attach_druid_click = attach_druid_click
    }
end
function ____exports.register_sound()
    _G.Sound = SoundModule()
end
return ____exports
