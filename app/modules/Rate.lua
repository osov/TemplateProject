local ____exports = {}
local RateModule
local ____game_config = require("main.game_config")
local IS_HUAWEI = ____game_config.IS_HUAWEI
function RateModule()
    local _is_shown = false
    local function show()
        if System.platform == "Android" and not IS_HUAWEI or System.platform == "iPhone OS" or System.platform == "HTML5" and Ads.get_social_platform() == "yandex" or System.platform == "Windows" then
            EventBus.trigger("SYS_SHOW_RATE")
        end
    end
    local function _mark_shown()
        _is_shown = true
    end
    local function is_shown()
        local tmp = _is_shown
        _is_shown = false
        return tmp
    end
    return {show = show, is_shown = is_shown, _mark_shown = _mark_shown}
end
function ____exports.register_rate()
    _G.Rate = RateModule()
end
return ____exports
