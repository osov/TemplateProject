/* eslint-disable @typescript-eslint/no-empty-interface */

interface props {
    is_visible: boolean
}

export function init(this: props) {
    Manager.init_script();
    EventBus.on('ON_INTER_SHOWN', (state) => label.set_text('/logic#label', 'Inter: ' + (state.result ? 'true' : 'false')));
    EventBus.on('ON_REWARDED_SHOWN', (state) => label.set_text('/logic#label', 'Rewarded: ' + (state.result ? 'true' : 'false')));
    // user event from GUI
    this.is_visible = true;
    EventBus.on('MY_SHOW_HIDE_GO', () => { this.is_visible = !this.is_visible; msg.post('/go', this.is_visible ? 'enable' : 'disable'); }, true);
}

export function on_message(this: props, message_id: string | hash, message: any, sender: string | hash | url): void {
    Manager.on_message(this, message_id, message, sender);
}


export function final(this: props) {
    Manager.final_script();
}

