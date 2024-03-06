local ____lualib = require("lualib_bundle")
local __TS__StringIncludes = ____lualib.__TS__StringIncludes
local ____exports = {}
____exports.IS_DEBUG_MODE = false
____exports.IS_HUAWEI = sys.get_sys_info().system_name == "Android" and __TS__StringIncludes(
    sys.get_config("android.package"),
    "huawei"
)
____exports.ADS_CONFIG = {
    is_mediation = sys.get_sys_info().system_name == "Android" or sys.get_sys_info().system_name == "iPhone OS",
    id_banners = sys.get_sys_info().system_name == "Android" and ({____exports.IS_HUAWEI and "R-M-6407344-1" or "R-M-6407238-1"}) or ({"R-M-6406678-1"}),
    id_inters = sys.get_sys_info().system_name == "Android" and ({____exports.IS_HUAWEI and "R-M-6407344-2" or "R-M-6407238-2"}) or ({"R-M-6406678-2"}),
    id_reward = {},
    banner_on_init = false,
    ads_interval = 3 * 60,
    ads_delay = 30
}
____exports.VK_SHARE_URL = "https://vk.com/app51867396"
____exports.OK_SHARE_TEXT = ""
____exports.ID_YANDEX_METRICA = sys.get_sys_info().system_name == "Android" and "c1ce595b-7bf8-4b99-b487-0457f8da7b95" or "91a2fd82-b0de-4fb2-b3a7-03bff14b9d09"
____exports.RATE_FIRST_SHOW = 24 * 60 * 60
____exports.RATE_SECOND_SHOW = 3 * 24 * 60 * 60
____exports._GAME_CONFIG = {}
____exports._STORAGE_CONFIG = {}
return ____exports
