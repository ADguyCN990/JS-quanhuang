import { Ac_Game_Object } from "../../ac_game_object/base.js";

class Timer extends Ac_Game_Object {
    constructor(root) {
        super();
        this.root = root;
        this.time_remain = 45000;
        this.$timer = this.root.root.$kof.find(`#timer`);
        this.$canvas = this.root.$canvas;
        this.start_time = false;

    }


    start() {

    }

    update_time() {
        if (!this.start_time)
            return false;
        
        let players = this.root.players;
        if (players[0].status === 6 || players[1].status === 6) 
            return false;
            
        this.time_remain = this.time_remain - this.timedelta;
        if (this.time_remain < 0) { //超时，玩家共同死亡
            this.time_remain = 0;
            players[0].status = 6, players[1].status = 6;
            players[0].frame_current_cnt = 0;
            players[1].frame_current_cnt = 0;
            players[0].vx = 0, players[1].vx = 0;
            this.root.is_alive = false;
        }
        this.$timer.text(parseInt(this.time_remain / 1000));
        if (this.time_remain >= 30 * 1000) {
            this.$timer.css("color", "lightgreen");
        }
        else if (this.time_remain >= 15 * 1000) {
            this.$timer.css("color", "lightyellow");
        }
        if (this.time_remain < 15 * 1000) {
            this.$timer.css("color", "red");
        }
        
    }

    update_start_time() {
        let outer = this;
        this.$canvas.keydown(function (e) {
            outer.start_time = true;
        });
    }

    update() {
        this.update_time();
        this.update_start_time();
    }
}


export {
    Timer
}