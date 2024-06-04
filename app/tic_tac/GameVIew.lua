local ____exports = {}
local ____GoManager = require("modules.GoManager")
local GoManager = ____GoManager.GoManager
local ____utils = require("utils.utils")
local hex2rgba = ____utils.hex2rgba
local ____tic_tac_conf = require("tic_tac.tic_tac_conf")
local index_to_xy = ____tic_tac_conf.index_to_xy
function ____exports.GameView()
    local get_cell_position, get_item_by_xy, start_game, make_cell, draw_step, on_clicked, make_line, show_win_line, orig_cell_size, game_size, cell_size, scale_ratio, offset_border, items_offset, cells, gm
    function get_cell_position(x, y, z)
        if z == nil then
            z = 0
        end
        return vmath.vector3(items_offset.x + cell_size * x + cell_size * 0.5, items_offset.y - cell_size * y - cell_size * 0.5, z)
    end
    function get_item_by_xy(x, y)
        do
            local i = 0
            while i < #cells do
                local cell = cells[i + 1]
                if cell.x == x and cell.y == y then
                    return cell
                end
                i = i + 1
            end
        end
        return nil
    end
    function start_game(size)
        game_size = size
        cell_size = (540 - offset_border * 2) / game_size
        if cell_size > 100 then
            cell_size = 100
        end
        scale_ratio = cell_size / orig_cell_size
        items_offset.x = 540 / 2 - game_size / 2 * cell_size
        do
            local y = 0
            while y < game_size do
                do
                    local x = 0
                    while x < game_size do
                        make_cell(x, y)
                        x = x + 1
                    end
                end
                y = y + 1
            end
        end
    end
    function make_cell(x, y)
        local cp = get_cell_position(x, y)
        local _hash = gm.make_go("cell", cp)
        label.set_text(
            msg.url(nil, _hash, "label"),
            ""
        )
        local item = {x = x, y = y, _hash = _hash}
        cells[#cells + 1] = item
        go.set_scale(
            vmath.vector3(scale_ratio, scale_ratio, 1),
            _hash
        )
        gm.add_game_item({_hash = _hash, is_clickable = true, x = x, y = y})
    end
    function draw_step(is_x, x, y)
        local item = get_item_by_xy(x, y)
        if item then
            label.set_text(
                msg.url(nil, item._hash, "label"),
                is_x and "X" or "O"
            )
        end
    end
    function on_clicked(gi)
        local item = get_item_by_xy(gi.item.x, gi.item.y)
        if not item then
            return
        end
        EventBus.trigger("ON_STEP", {x = item.x, y = item.y, is_x = true})
    end
    function make_line(w, h, pos, angle)
        local item = factory.create("/prefabs#line")
        local sprite_url = msg.url(nil, item, "sprite")
        go.set(
            sprite_url,
            "size",
            vmath.vector3(w, h, 1)
        )
        go.set(
            sprite_url,
            "tint",
            hex2rgba("#000")
        )
        pos.z = 0.2
        go.set_position(pos, item)
        go.set_rotation(
            vmath.quat_rotation_z(angle),
            item
        )
        return item
    end
    function show_win_line(nums)
        local p1_x, p1_y = unpack(index_to_xy(nums[1], game_size))
        local p2_x, p2_y = unpack(index_to_xy(nums[#nums], game_size))
        local i1 = get_cell_position(p1_x, p1_y)
        local i2 = get_cell_position(p2_x, p2_y)
        local dv = i2 - i1
        local cp = dv / 2 + i1
        local len = vmath.length(dv) * 1.25
        local a = math.atan2(dv.y, dv.x)
        cp.z = 0.2
        local line = make_line(len, 9, cp, a)
        local sprite_url = msg.url(nil, line, "sprite")
        go.set(
            sprite_url,
            "tint",
            hex2rgba("#ff0000")
        )
    end
    orig_cell_size = 32
    game_size = 2
    cell_size = 32
    scale_ratio = 1
    offset_border = 10
    items_offset = vmath.vector3(offset_border, -150, 0)
    cells = {}
    gm = GoManager()
    local function init()
        EventBus.on(
            "INIT_VIEW",
            function(m) return start_game(m.size) end
        )
        EventBus.on(
            "MSG_ON_UP_ITEM",
            function(e) return on_clicked(e) end
        )
        EventBus.on(
            "DRAW_STEP",
            function(e) return draw_step(e.is_x, e.x, e.y) end
        )
        EventBus.on(
            "END_GAME",
            function(e)
                if e.is_win then
                    show_win_line(e.win_cells)
                end
            end
        )
    end
    local function on_input(action_id, action)
        if action_id == ID_MESSAGES.MSG_TOUCH then
            gm.do_message(action_id, action)
        end
    end
    return {init = init, on_input = on_input}
end
return ____exports
