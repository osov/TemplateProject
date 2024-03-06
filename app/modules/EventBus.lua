local ____lualib = require("lualib_bundle")
local __TS__Delete = ____lualib.__TS__Delete
local __TS__ArraySplice = ____lualib.__TS__ArraySplice
local ____exports = {}
local EventBusModule
local event = require("event.event")
function EventBusModule()
    local bus_log = Log.get_with_prefix("Bus")
    local events = {}
    local listeners = {}
    local function url_to_key(url)
        return (hash_to_hex(url.socket) .. hash_to_hex(url.path)) .. hash_to_hex(url.fragment or hash(""))
    end
    local function _on(message_id, callback, callback_context, once)
        if not events[message_id] then
            events[message_id] = event.create()
        end
        if not listeners[message_id] then
            listeners[message_id] = {}
        end
        local ____listeners_message_id_0 = listeners[message_id]
        ____listeners_message_id_0[#____listeners_message_id_0 + 1] = {
            callback = callback,
            callback_context = callback_context,
            once = once,
            id_script = url_to_key(msg.url())
        }
        events[message_id]:subscribe(callback)
    end
    local function on(message_id, callback, callback_context)
        _on(message_id, callback, callback_context, false)
    end
    local function once(message_id, callback, callback_context)
        _on(message_id, callback, callback_context, true)
    end
    local function off(message_id, callback)
        if not events[message_id] then
            bus_log.warn(("Ни один слушатель для события не зарегистрирован: " .. message_id) .. ", off")
            return
        end
        events[message_id]:unsubscribe(callback)
    end
    local function off_all_id_message(message_id)
        if not events[message_id] then
            bus_log.warn(("Ни один слушатель для события не зарегистрирован: " .. message_id) .. ", off_all_id_message")
            return
        end
        events[message_id]:clear()
        __TS__Delete(events, message_id)
    end
    local function off_all_context(context)
        for id_message in pairs(listeners) do
            local listener = listeners[id_message]
            do
                local i = #listener - 1
                while i >= 0 do
                    local l = listener[i + 1]
                    if l.callback_context == context then
                        events[id_message]:unsubscribe(l.callback)
                        __TS__ArraySplice(listener, i, 1)
                    end
                    i = i - 1
                end
            end
        end
    end
    local function off_all_current_script()
        local url = msg.url()
        local url_key = url_to_key(url)
        for id_message in pairs(listeners) do
            local listener = listeners[id_message]
            do
                local i = #listener - 1
                while i >= 0 do
                    local l = listener[i + 1]
                    if l.id_script == url_key then
                        events[id_message]:unsubscribe(l.callback)
                        __TS__ArraySplice(listener, i, 1)
                    end
                    i = i - 1
                end
            end
        end
    end
    local function trigger(message_id, message_data, show_warning)
        if show_warning == nil then
            show_warning = true
        end
        if not events[message_id] then
            if show_warning then
                bus_log.warn(("Ни один слушатель для события не зарегистрирован: " .. message_id) .. ", trigger/send")
            end
            return
        end
        events[message_id]:trigger(message_data)
        local listener = listeners[message_id]
        do
            local i = #listener - 1
            while i >= 0 do
                local l = listener[i + 1]
                if l.once then
                    events[message_id]:unsubscribe(l.callback)
                end
                i = i - 1
            end
        end
    end
    local function send(message_id, message_data)
        return trigger(message_id, message_data)
    end
    return {
        on = on,
        once = once,
        off = off,
        off_all_id_message = off_all_id_message,
        off_all_context = off_all_context,
        off_all_current_script = off_all_current_script,
        send = send,
        trigger = trigger
    }
end
function ____exports.register_event_bus()
    if not event then
        return Log.error("Не подключена библиотека event.event")
    end
    event.set_logger({error = Log.error})
    _G.EventBus = EventBusModule()
end
return ____exports
