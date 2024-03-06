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

function set_state(text: string) {
    set_text('ads_result', text);
}

export function init(this: props): void {
    Manager.init_script();
    this.druid = druid.new(this);
    this.druid.new_button('btnHome', () => Scene.load('menu'));
    this.druid.new_button('btnInter', () => { set_state('Interstitial wait...'); Ads.show_interstitial(false, (state) => set_state('Interstitial: ' + state)); });
    this.druid.new_button('btnReward', () => { set_state('Rewarded wait...'); Ads.show_reward((state) => set_state('Rewarded: ' + state)); });
    this.druid.new_button('btnShowBanner', () => { Ads.show_banner(); set_state('Banner show'); });
    this.druid.new_button('btnHideBanner', () => { Ads.hide_banner(); set_state('Banner hide'); });
    this.druid.new_button('btnSound', () => Sound.play('vic'));
    this.druid.new_button('btnHideShowGo', () => EventBus.trigger('MY_SHOW_HIDE_GO'));
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