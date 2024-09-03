/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { hex2rgba } from "../utils/utils";

interface props {
}


export function init(this: props): void {
    Manager.init_script();
    msg.post('.', ID_MESSAGES.MSG_INPUT_FOCUS);
    EventBus.on('SYS_ON_RESIZED', update_ui);
    update_ui();
    Camera.set_dynamic_orientation(true);
}

function update_ui() {
    const [window_x, window_y] = window.get_size();
    const is_portrait = window_x < window_y || !Camera.is_dynamic_orientation();
    go.set_position(vmath.vector3(!is_portrait ? 0 : 10000, -540, 0), 'pivots_landscape');
    go.set_position(vmath.vector3(is_portrait ? 0 : 10000, -480, 0), 'pivots_portrait');
    go.set_position(vmath.vector3(is_portrait ? 540 : 960, -175, 0), 'test_go2');


    const ltrb = Camera.get_ltrb();
    go.set_position(vmath.vector3((ltrb.x + ltrb.z) / 2, 0, 0), 'top_real');
    go.set_position(vmath.vector3((ltrb.x + ltrb.z) / 2, ltrb.w / 2, 0), 'center_real');
    go.set_position(vmath.vector3(ltrb.x, ltrb.w / 2, 0), 'left_real');
    go.set_position(vmath.vector3(ltrb.z, ltrb.w / 2, 0), 'right_real');
    go.set_position(vmath.vector3((ltrb.x + ltrb.z) / 2, ltrb.w, 0), 'bottom_real');
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