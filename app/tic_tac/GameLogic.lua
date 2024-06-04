local ____exports = {}
local ____game_config = require("main.game_config")
local StepMode = ____game_config.StepMode
local ____tic_tac_conf = require("tic_tac.tic_tac_conf")
local game_wins = ____tic_tac_conf.game_wins
local index_to_xy = ____tic_tac_conf.index_to_xy
function ____exports.GameLogic()
    local start_game, set_cur_step, on_step, do_ai_step, find_ai_step, is_game_over, is_win, game_size, cur_step, field, vic_combo, win_cells
    function start_game(size)
        game_size = size
        vic_combo = game_wins[game_size]
        cur_step = StepMode.NONE
        field = {}
        do
            local y = 0
            while y < game_size do
                local tmp = {}
                do
                    local x = 0
                    while x < game_size do
                        tmp[#tmp + 1] = StepMode.NONE
                        x = x + 1
                    end
                end
                field[#field + 1] = tmp
                y = y + 1
            end
        end
        EventBus.trigger("INIT_VIEW", {size = size})
        set_cur_step(StepMode.X)
    end
    function set_cur_step(step)
        cur_step = step
        EventBus.trigger("CURRENT_STEP", {step = step})
    end
    function on_step(is_x, x, y)
        if field[y + 1][x + 1] ~= StepMode.NONE then
            return log(((("field[" .. tostring(y)) .. "][") .. tostring(x)) .. "] not free")
        end
        if cur_step == StepMode.NONE or cur_step == StepMode.X and not is_x or cur_step == StepMode.O and is_x then
            return log("not your turn")
        end
        field[y + 1][x + 1] = is_x and StepMode.X or StepMode.O
        EventBus.trigger("DRAW_STEP", {is_x = is_x, x = x, y = y})
        local end_game, is_win = unpack(is_game_over())
        if end_game then
            set_cur_step(StepMode.NONE)
            EventBus.trigger("END_GAME", {is_win = is_win, is_x = is_x, win_cells = win_cells})
            return
        end
        if is_x then
            do_ai_step()
        else
            set_cur_step(StepMode.X)
        end
    end
    function do_ai_step()
        set_cur_step(StepMode.O)
        timer.delay(
            0.5,
            false,
            function()
                local step = find_ai_step()
                if step then
                    on_step(false, step.x, step.y)
                end
            end
        )
    end
    function find_ai_step()
        local steps = {}
        do
            local y = 0
            while y < game_size do
                do
                    local x = 0
                    while x < game_size do
                        if field[y + 1][x + 1] == StepMode.NONE then
                            steps[#steps + 1] = {x = x, y = y}
                        end
                        x = x + 1
                    end
                end
                y = y + 1
            end
        end
        if #steps > 0 then
            local index = math.random(0, #steps - 1)
            return steps[index + 1]
        end
        return nil
    end
    function is_game_over()
        local _is_win = is_win()
        if _is_win ~= StepMode.NONE then
            return {true, true}
        end
        do
            local y = 0
            while y < game_size do
                do
                    local x = 0
                    while x < game_size do
                        if field[y + 1][x + 1] == StepMode.NONE then
                            return {false, false}
                        end
                        x = x + 1
                    end
                end
                y = y + 1
            end
        end
        return {true, false}
    end
    function is_win()
        do
            local i = 0
            while i < #vic_combo do
                local list = vic_combo[i + 1]
                local is_ok = true
                local x, y = unpack(index_to_xy(list[1], game_size))
                local check_val = field[y + 1][x + 1]
                do
                    local j = 0
                    while j < #list do
                        local x, y = unpack(index_to_xy(list[j + 1], game_size))
                        if check_val ~= field[y + 1][x + 1] then
                            is_ok = false
                            break
                        end
                        j = j + 1
                    end
                end
                if is_ok and check_val ~= StepMode.NONE then
                    win_cells = list
                    return check_val
                end
                i = i + 1
            end
        end
        win_cells = {}
        return StepMode.NONE
    end
    game_size = 0
    cur_step = StepMode.X
    field = {}
    win_cells = {}
    local function init()
        EventBus.on(
            "START_GAME",
            function(m) return start_game(m.size) end
        )
        EventBus.on(
            "ON_STEP",
            function(m) return on_step(m.is_x, m.x, m.y) end
        )
    end
    return {init = init}
end
return ____exports
