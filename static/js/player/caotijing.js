import { Player } from "./base.js";
import {GIF} from "../../third_party/gif.js";

class CaoTiJing extends Player{
    constructor(root, info) {
        super(root, info);

        this.init_animations();
    }

    init_animations() {
        let outer = this;
        let off_sets = [0, -22, -22, -130, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/image/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0, //gif总帧数
                frame_rate: 5, //每frame_cnt渲染一次
                offset_y: off_sets[i], //偏移量
                loaded: false, //是否加载完成
                scale: 2,
            });
            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;

                if (i === 3) {
                    obj.frame_rate = 4;
                }
            }
        }
        
    }
}

export {
    CaoTiJing
}