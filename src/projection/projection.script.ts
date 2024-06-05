/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { hex2rgba } from "../utils/utils";

interface props {
}


export function init(this: props): void {
    Manager.init_script();
    msg.post('.', ID_MESSAGES.MSG_INPUT_FOCUS);
    EventBus.on('SYS_ON_RESIZED', (e) => {
        const ltrb = Camera.get_ltrb();
        const width = 540;
        const offset = 10;
        go.set_position(vmath.vector3(width / 2, -offset, 0), 'top_base');
        go.set_position(vmath.vector3(width / 2, ltrb.w / 2 + offset, 0), 'center_base');
        go.set_position(vmath.vector3(0, ltrb.w / 2 + offset, 0), 'left_base');
        go.set_position(vmath.vector3(width, ltrb.w / 2 + offset, 0), 'right_base');
        go.set_position(vmath.vector3(width / 2, ltrb.w + offset, 0), 'bottom_base');

        // если захотим поставить под низ надписей left/right
        //go.set_position(vmath.vector3(0, ltrb.w / 2 - offset, 0), 'test_go1');
        //go.set_position(vmath.vector3(width, ltrb.w / 2 - offset, 0), 'test_go2');

        go.set_position(vmath.vector3((ltrb.x + ltrb.z) / 2, 0, 0), 'top_real');
        go.set_position(vmath.vector3((ltrb.x + ltrb.z) / 2, ltrb.w / 2, 0), 'center_real');
        go.set_position(vmath.vector3(ltrb.x, ltrb.w / 2, 0), 'left_real');
        go.set_position(vmath.vector3(ltrb.z, ltrb.w / 2, 0), 'right_real');
        go.set_position(vmath.vector3((ltrb.x + ltrb.z) / 2, ltrb.w, 0), 'bottom_real');


    });
}


export function on_input(this: props, action_id: hash, action: any) {
    if (action_id == ID_MESSAGES.MSG_TOUCH) {
        if (action.pressed) {
            const cp = Camera.screen_to_world(action.x, action.y);
            const gp = go.get_position('click_go');
            const size = 25;
            if (math.abs(cp.x - gp.x) < size && math.abs(cp.y - gp.y) < size) {
                go.set(msg.url(undefined, 'click_go', 'sprite'), "tint", hex2rgba('#f00'));
                timer.delay(0.3, false, () => go.set(msg.url(undefined, 'click_go', 'sprite'), "tint", hex2rgba('#fff')));
            }
        }
    }
}


export function final(this: props): void {
    Manager.final_script();
}