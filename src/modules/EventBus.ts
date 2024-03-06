/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */


import { MessageId, Messages } from "./modules_const";
import * as event from 'event.event';

/*
    шина сообщений
*/

declare global {
    const EventBus: ReturnType<typeof EventBusModule>;
}


export function register_event_bus() {
    if (!event)
        return Log.error('Не подключена библиотека event.event');
    event.set_logger({ error: Log.error });
    (_G as any).EventBus = EventBusModule();
}

type FncOnCallback<T> = (data: T) => void;

interface ListenerInfo {
    callback: FncOnCallback<any>;
    callback_context: any;
    once: boolean;
    id_script: string;
}

function EventBusModule() {
    const bus_log = Log.get_with_prefix('Bus');
    const events: { [id_message: string]: IEventClass } = {};
    const listeners: { [id_message: string]: ListenerInfo[] } = {};

    function url_to_key(url: any) {
        return hash_to_hex(url.socket) + hash_to_hex(url.path) + hash_to_hex(url.fragment || hash(""));
    }

    function _on<T extends MessageId>(message_id: T, callback: FncOnCallback<Messages[T]>, callback_context: any, once: boolean) {
        if (!events[message_id])
            events[message_id] = event.create();
        if (!listeners[message_id])
            listeners[message_id] = [];
        listeners[message_id].push({ callback, callback_context, once, id_script: url_to_key(msg.url()) });
        events[message_id].subscribe(callback);
    }

    function on<T extends MessageId>(message_id: T, callback: FncOnCallback<Messages[T]>, callback_context?: any) {
        _on(message_id, callback, callback_context, false);
    }

    function once<T extends MessageId>(message_id: T, callback: FncOnCallback<Messages[T]>, callback_context?: any) {
        _on(message_id, callback, callback_context, true);
    }

    function off<T extends MessageId>(message_id: T, callback: FncOnCallback<Messages[T]>) {
        if (!events[message_id]) {
            bus_log.warn(`Ни один слушатель для события не зарегистрирован: ${message_id}, off`);
            return;
        }
        events[message_id].unsubscribe(callback);
    }

    function off_all_id_message<T extends MessageId>(message_id: T) {
        if (!events[message_id]) {
            bus_log.warn(`Ни один слушатель для события не зарегистрирован: ${message_id}, off_all_id_message`);
            return;
        }
        events[message_id].clear();
        delete events[message_id];
    }

    function off_all_context(context: any) {
        for (const id_message in listeners) {
            const listener = listeners[id_message];
            for (let i = listener.length - 1; i >= 0; i--) {
                const l = listener[i];
                if (l.callback_context == context) {
                    events[id_message].unsubscribe(l.callback);
                    listener.splice(i, 1);
                }
            }
        }
    }

    function off_all_current_script() {
        const url = msg.url();
        const url_key = url_to_key(url);
        for (const id_message in listeners) {
            const listener = listeners[id_message];
            for (let i = listener.length - 1; i >= 0; i--) {
                const l = listener[i];
                if (l.id_script == url_key) {
                    events[id_message].unsubscribe(l.callback);
                    listener.splice(i, 1);
                    //log('off_all_current_script', id_message);
                }
            }
        }
    }

    function trigger<T extends MessageId>(message_id: T, message_data?: Messages[T], show_warning = true) {
        if (!events[message_id]) {
            if (show_warning)
                bus_log.warn(`Ни один слушатель для события не зарегистрирован: ${message_id}, trigger/send`);
            return;
        }

        events[message_id].trigger(message_data);
        const listener = listeners[message_id];
        for (let i = listener.length - 1; i >= 0; i--) {
            const l = listener[i];
            if (l.once)
                events[message_id].unsubscribe(l.callback);
        }
    }

    function send<T extends MessageId>(message_id: T, message_data?: Messages[T]) {
        return trigger(message_id, message_data);
    }

    return { on, once, off, off_all_id_message, off_all_context, off_all_current_script, send, trigger };


}