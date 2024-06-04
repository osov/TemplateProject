import { StepMode } from "../main/game_config";
import { game_wins, index_to_xy } from "./tic_tac_conf";


export function GameLogic() {
    let game_size = 0;
    let cur_step = StepMode.X;
    let field: StepMode[][] = [];
    let vic_combo: number[][];
    let win_cells: number[] = [];

    function init() {
        EventBus.on('START_GAME', (m) => start_game(m.size));
        EventBus.on('ON_STEP', (m) => on_step(m.is_x, m.x, m.y));
    }

    function start_game(size: number) {
        game_size = size;
        vic_combo = game_wins[game_size];
        cur_step = StepMode.NONE;
        field = [];
        for (let y = 0; y < game_size; y++) {
            const tmp: StepMode[] = [];
            for (let x = 0; x < game_size; x++) {
                tmp.push(StepMode.NONE);
            }
            field.push(tmp);
        }
        EventBus.trigger('INIT_VIEW', { size });
        set_cur_step(StepMode.X);
    }

    function set_cur_step(step: StepMode) {
        cur_step = step;
        EventBus.trigger('CURRENT_STEP', { step });
    }

    function on_step(is_x: boolean, x: number, y: number) {
        if (field[y][x] !== StepMode.NONE)
            return log('field[' + y + '][' + x + '] not free');
        if (cur_step == StepMode.NONE || (cur_step == StepMode.X && !is_x) || (cur_step == StepMode.O && is_x))
            return log('not your turn');
        field[y][x] = is_x ? StepMode.X : StepMode.O;
        EventBus.trigger('DRAW_STEP', { is_x, x, y });
        const [end_game, is_win] = is_game_over();
        if (end_game) {
            set_cur_step(StepMode.NONE);
            EventBus.trigger('END_GAME', { is_win, is_x, win_cells });
            return;
        }
        if (is_x)
            do_ai_step();
        else
            set_cur_step(StepMode.X);
    }

    function do_ai_step() {
        set_cur_step(StepMode.O);
        timer.delay(0.5, false, () => {
            const step = find_ai_step();
            if (step)
                on_step(false, step.x, step.y);
        });
    }

    function find_ai_step() {
        const steps: { x: number, y: number }[] = [];
        for (let y = 0; y < game_size; y++) {
            for (let x = 0; x < game_size; x++) {
                if (field[y][x] == StepMode.NONE) {
                    steps.push({ x, y });
                }
            }
        }
        if (steps.length > 0) {
            const index = math.random(0, steps.length - 1);
            return steps[index];
        }
        return null;
    }

    function is_game_over() {
        const _is_win = is_win();
        if (_is_win != StepMode.NONE) {
            return [true, true];
        }
        for (let y = 0; y < game_size; y++) {
            for (let x = 0; x < game_size; x++) {
                if (field[y][x] == StepMode.NONE) {
                    return [false, false];
                }
            }
        }
        return [true, false];
    }

    function is_win() {
        for (let i = 0; i < vic_combo.length; i++) {
            const list = vic_combo[i];
            let is_ok = true;
            const [x, y] = index_to_xy(list[0], game_size);
            const check_val = field[y][x];
            for (let j = 0; j < list.length; j++) {
                const [x, y] = index_to_xy(list[j], game_size);
                if (check_val != field[y][x]) {
                    is_ok = false;
                    break;
                }
            }
            if (is_ok && check_val != StepMode.NONE) {
                win_cells = list;
                return check_val;
            }
        }
        win_cells = [];
        return StepMode.NONE;

    }

    return { init };
}

export type IGameLogic = ReturnType<typeof GameLogic>;