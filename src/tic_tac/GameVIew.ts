/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoManager } from '../modules/GoManager';
import { IGameItem } from '../modules/modules_const';
import { hex2rgba } from '../utils/utils';
import { index_to_xy } from './tic_tac_conf';

interface CellData {
    x: number;
    y: number;
    _hash: hash;
}

type ExtIGameItem = IGameItem & {
    item: {
        x: number;
        y: number;
    }
};

export function GameView() {
    const orig_cell_size = 32;
    let game_size = 2;
    let cell_size = 32;
    let scale_ratio = 1;
    const offset_border = 10;
    const items_offset = vmath.vector3(offset_border, -150, 0);
    const cells: CellData[] = [];
    const gm = GoManager();

    function init() {
        EventBus.on('INIT_VIEW', (m) => start_game(m.size));
        EventBus.on<any>('MSG_ON_UP_ITEM', (e: ExtIGameItem) => on_clicked(e));
        EventBus.on('DRAW_STEP', (e) => draw_step(e.is_x, e.x, e.y));
        EventBus.on('END_GAME', (e) => {
            if (e.is_win)
                show_win_line(e.win_cells);
        });
    }


    function get_cell_position(x: number, y: number, z = 0) {
        return vmath.vector3(items_offset.x + cell_size * x + cell_size * 0.5, items_offset.y - cell_size * y - cell_size * 0.5, z);
    }

    function get_item_by_xy(x: number, y: number) {
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.x == x && cell.y == y)
                return cell;
        }
        return null;
    }

    function start_game(size: number) {
        game_size = size;
        cell_size = (540 - offset_border * 2) / game_size;
        if (cell_size > 100)
            cell_size = 100;
        scale_ratio = cell_size / orig_cell_size;
        items_offset.x = 540 / 2 - (game_size / 2 * cell_size);

        for (let y = 0; y < game_size; y++) {
            for (let x = 0; x < game_size; x++) {
                make_cell(x, y);
            }
        }
    }

    function make_cell(x: number, y: number) {
        const cp = get_cell_position(x, y);
        const _hash = gm.make_go('cell', cp);
        label.set_text(msg.url(undefined, _hash, 'label'), '');
        const item = { x, y, _hash };
        cells.push(item);
        go.set_scale(vmath.vector3(scale_ratio, scale_ratio, 1), _hash);
        gm.add_game_item({ _hash, is_clickable: true, x, y });
    }

    function draw_step(is_x: boolean, x: number, y: number) {
        const item = get_item_by_xy(x, y);
        if (item)
            label.set_text(msg.url(undefined, item._hash, 'label'), is_x ? 'X' : 'O');
    }

    function on_clicked(gi: ExtIGameItem) {
        const item = get_item_by_xy(gi.item.x, gi.item.y);
        if (!item)
            return;
        EventBus.trigger('ON_STEP', { x: item.x, y: item.y, is_x: true });
    }

    function make_line(w: number, h: number, pos: vmath.vector3, angle: number) {
        const item = factory.create("/prefabs#line");
        const sprite_url = msg.url(undefined, item, "sprite");
        go.set(sprite_url, 'size', vmath.vector3(w, h, 1));
        go.set(sprite_url, 'tint', hex2rgba('#000'));
        pos.z = 0.2;
        go.set_position(pos, item);
        go.set_rotation(vmath.quat_rotation_z(angle), item);
        return item;
    }

    function show_win_line(nums: number[]) {
        const [p1_x, p1_y] = index_to_xy(nums[0], game_size);
        const [p2_x, p2_y] = index_to_xy(nums[nums.length - 1], game_size);
        const i1 = get_cell_position(p1_x, p1_y);
        const i2 = get_cell_position(p2_x, p2_y);
        const dv = (i2 - i1) as vmath.vector3;
        const cp = (dv / 2 + i1) as vmath.vector3;
        const len = vmath.length(dv) * 1.25;
        const a = math.atan2(dv.y, dv.x);
        cp.z = 0.2;
        const line = make_line(len, 9, cp, a);
        const sprite_url = msg.url(undefined, line, "sprite");
        go.set(sprite_url, 'tint', hex2rgba('#ff0000'));
    }

    function on_input(action_id: string | hash, action: any) {
        if (action_id == ID_MESSAGES.MSG_TOUCH)
            gm.do_message(action_id, action);
    }

    return { init, on_input };
}

export type IGameView = ReturnType<typeof GameView>;