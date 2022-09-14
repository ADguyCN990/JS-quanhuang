import {Ac_Game_Object} from "../ac_game_object/base.js"
import {Controller} from "../controller/base.js"
import {CaoTiJing} from "../player/caotijing.js"
import { Timer } from "./timer/base.js";

class GameMap extends Ac_Game_Object {
    constructor(root) {
        super();
        this.$canvas = $(`<canvas id="tutorial" tabindex=0 width="1280" height="720"></canvas>`);
        this.root = root;
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();
        this.controller = new Controller(this.$canvas);
        this.root.$kof.append($(`
        <div class="kof-head">
            <div class="kof-head-hp-0">
                <div class="kof-head-hp-0-control-length" id="p0-hp">
                    <div class="kof-head-hp-0-control-length-inner" id="p0-hp-inner">
                
                    </div>
                </div>
                
            </div>
            <div class="kof-head-timer" id="timer"></div>
            <div class="kof-head-hp-1">
                <div class="kof-head-hp-1-control-length" id="p1-hp">
                    <div class="kof-head-hp-1-control-length-inner" id="p1-hp-inner">
                    
                    </div>
                </div>
                
            </div>
        </div>`));
        this.timer = new Timer(this);
        this.players = [
            new CaoTiJing(this, {
                "id": 0,
                "x": 200,
                "y": 0,
                "width": 120,
                "height": 200,
                "color": "blue",
            }),
            new CaoTiJing(this, {
                "id": 1,
                "x": 900,
                "y": 0,
                "width": 120,
                "height": 200,
                "color": "red",
            })
        ];
        this.is_alive = true;
        
    }

    start() {
        
    }

    update_isalive() {
        let players = this.players;
        if (players[0].status === 6 || players[1].status === 6) {
            this.is_alive = false;
        }
        else {
            this.is_alive = true;
        }
    }

    update() {
        this.update_isalive();
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.ctx.fillStyle = "black";
        // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}

export {
    GameMap
}