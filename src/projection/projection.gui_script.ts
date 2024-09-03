/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as druid from 'druid.druid';
import { set_text } from '../utils/utils';

interface props {
    druid: DruidClass;
}

export function init(this: props): void {
    Manager.init_script();
    this.druid = druid.new(this);
    this.druid.new_button('btnHome', () => Scene.load('menu'));
    EventBus.on('SYS_ON_RESIZED', update_projection);
    update_projection();
}

function update_projection() {
    const [window_x, window_y] = window.get_size();
    const is_portrait = window_x < window_y || !Camera.is_dynamic_orientation();
    set_text('proj', Lang.get_text('projection') + ':\n' + (is_portrait ? 'portrait' : 'landscape'));
}


export function on_input(this: props, action_id: string | hash, action: unknown) {
    return this.druid.on_input(action_id, action);
}

export function update(this: props, dt: number): void {
    this.druid.update(dt);
}

export function on_message(this: props, message_id: string | hash, message: any, sender: string | hash | url): void {
    this.druid.on_message(message_id, message, sender);
}

export function final(this: props): void {
    Manager.final_script();
    this.druid.final();
}