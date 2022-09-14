import {GameMap} from "../game_map/base.js";
import {Music} from "../music/base.js";

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.id = id;
        this.$kof.append(this);
        this.game_map = new GameMap(this);
        this.music = new Music(this);
        
    }


}

export {
    KOF
}