/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { GameLogic, IGameLogic } from "./GameLogic";
import { GameView, IGameView } from "./GameVIew";

interface props {
    logic: IGameLogic;
    view: IGameView;
}

export function init(this: props) {
    Manager.init_script();
    msg.post('.', ID_MESSAGES.MSG_INPUT_FOCUS);
    this.logic = GameLogic();
    this.view = GameView();
    this.logic.init();
    this.view.init();
}

export function on_message(this: props, message_id: string | hash, message: any, sender: string | hash | url): void {
    Manager.on_message(this, message_id, message, sender);
}

export function on_input(this: props, action_id: hash, action: any) {
    this.view.on_input(action_id, action);
}


export function final(this: props) {
    Manager.final_script();
}

