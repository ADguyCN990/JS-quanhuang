import { Ac_Game_Object } from "../ac_game_object/base.js";

class Music extends Ac_Game_Object {
    constructor(root) {
        super();
        this.root = root;
        this.$start_music = $(`<audio src="../audio/Roshan.mp3" class="music" id="start_music" controlsaw>
        
        </audio>`) 
        this.$end_music = $(`<audio src="../audio/Roshanend.mp3" class="music" id="end_music" controls>`);
        this.$END_music = $(`<audio src="../audio/END.mp3" class="music" id="END_music" controls loops>`)
        this.root.$kof.append(this.$start_music);
        this.root.$kof.append(this.$end_music);
        this.root.$kof.append(this.$END_music);
        this.$canvas = this.root.game_map.$canvas;
        this.first = true; //死亡状态只需播放一次死亡音乐
        this.dis_to_end = 0;
    }

    start() {
        
    }

    update_music() {
        let outer = this;
        let $start_music = $(`#start_music`)[0]; //战斗音乐
        let $end_music = $(`#end_music`)[0]; //结束音乐
        let $END_music = $(`#END_music`)[0]; //结束音乐
        let is_alive = outer.root.game_map.is_alive;
        let time_remain = this.root.game_map.timer.time_remain;
        if (time_remain <= 0 || !is_alive) {
            $start_music.pause();
            this.dis_to_end += this.timedelta;
            if (outer.first) {
                $end_music.play();
                this.first = false;
            }
        }
        if (!this.first && this.dis_to_end > 6000) {
            $END_music.play();
        }
        this.$canvas.keydown(function (e) {
            if (is_alive && outer.first)
                $start_music.play();
            else {
                $start_music.pause();
                if (outer.first) {
                    $end_music.play();
                    outer.first = false;
                }
                    
            }
        });
    }

    update() {
        this.update_music();
    }

    
}

export {
    Music
}