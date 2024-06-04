/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as druid from 'druid.druid';
import { StepMode } from '../main/game_config';
import { hide_gui_list, set_text, show_gui_list } from '../utils/utils';

interface props {
    druid: DruidClass;
}

function start_game(size: number) {
    hide_gui_list(['popup_start_game']);
    EventBus.trigger('START_GAME', { size });
}

export function init(this: props): void {
    Manager.init_script();
    this.druid = druid.new(this);
    this.druid.new_button('btnHome', () => Scene.load('menu'));
    this.druid.new_button('box_3', () => start_game(3));
    this.druid.new_button('box_4', () => start_game(4));
    this.druid.new_button('box_5', () => start_game(5));
    this.druid.new_button('btn_restart', () => Scene.restart());
    EventBus.on('CURRENT_STEP', (e) => set_text('step', 'Ход: ' + (e.step == StepMode.X ? 'X' : (e.step == StepMode.O ? 'O' : '-'))));
    EventBus.on('END_GAME', (e) => {
        timer.delay(1, false, () => show_gui_list(['popup_end_game']));
        if (!e.is_win)
            set_text('game_text', 'Ничья');
        else
            set_text('game_text', e.is_x ? 'Вы победили' : 'Вы проиграли');
    });
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