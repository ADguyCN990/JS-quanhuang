import { Ac_Game_Object } from "../ac_game_object/base.JS";

class Player extends Ac_Game_Object {
    constructor(root, info) {
        super();
        this.root = root;
        this.ctx = this.root.ctx;

        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.vx = 0;
        this.vy = 0;
        this.speedx = 400;
        this.speedy = -1000;
        this.gravity = 50;

        this.status = 3; 
        this.hp = 100;
        this.$hp = this.root.root.$kof.find(`#p${this.id}-hp`);
        this.$hp_inner = this.root.root.$kof.find(`#p${this.id}-hp-inner`);
        /*
        0: 站立不动
        1: 向前
        2: 向后
        3: 跳跃
        4: 攻击
        5: 被打
        6: 死亡
        */
        this.pressed_keys = this.root.controller.pressed_keys; //存放操作
        this.animations = new Map(); //存放状态的动作图
        this.frame_current_cnt = 0; //每当状态转化时，gif图片需要从第0帧开始重新渲染

        
    }

    start() {

    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();
        this.update_move_collision();
        this.render();
    }

    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    is_attacked() {
        if (this.status === 6) {
            return false;
        }
        this.status = 5;
        this.frame_current_cnt = 0;
        this.hp = Math.max(this.hp - 16, 0);
        this.$hp_inner.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 250);
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 600);
        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }


    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 18) { //挥拳瞬间
            let me = this, you = this.root.players[1 - this.id];
            if (me.status === 6 || you.status === 6) {
                return false;
            }
            
            let rectangle1, rectangle2;
            if (this.direction > 0) {
                rectangle1 = {
                    x1: me.x + me.width,
                    x2: me.x + me.width + 100,
                    y1: me.y + 40,
                    y2: me.y + 40 + 20,
                };
            }
            else {
                rectangle1 = {
                    x1: me.x + me.width - me.width - 100,
                    x2: me.x + me.width - me.width,
                    y1: me.y + 40,
                    y2: me.y + 40 + 20,
                };
            }
            rectangle2 = {
                x1: you.x,
                x2: you.x + you.width,
                y1: you.y,
                y2: you.y + you.height
            };

            if (this.is_collision(rectangle1, rectangle2)) {
                you.is_attacked();
            }
        }
    }

    update_direction() {
        if (this.status === 6) {
            return false;
        }
        let players = this.root.players;
        
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    update_move_collision() {

        let players = this.root.players;
        if (players[0].status === 6 || players[1].status === 6) {
            return false;
        }
        let outer = this;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            let a = {
                x1: me.x,
                x2: me.x + me.width,
                y1: me.y,
                y2: me.y + me.height,
            },
            b = {
                x1: you.x,
                x2: you.x + you.width,
                y1: you.y,
                y2: you.y + you.height,
            }
            if (outer.is_collision(a, b) && (me.status === 1 || me.status === 2)) {
                this.x -= this.vx * this.timedelta / 1000 ;
                this.y -= this.vy * this.timedelta / 1000 ;
            }
        }

    }

    update_move() {
        
        this.vy += this.gravity;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if (this.status === 3) {
                this.status = 0;
            }
        }

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.x + this.width > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.width;
        }
    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) { //是自己
            w = this.pressed_keys.has('w') | this.pressed_keys.has('W');
            a = this.pressed_keys.has('a') | this.pressed_keys.has('A');
            d = this.pressed_keys.has('d') | this.pressed_keys.has('D');
            space = this.pressed_keys.has(' ');
        }
        else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }
        if (this.status === 0 || this.status === 1 || this.status === 2) {
            if (w) { //jump
                if (d) { //right
                    this.vx = this.speedx;
                }
                else if (a) { //left
                    this.vx = -this.speedx;
                }
                else { //stay 
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            }
            else if (d) { //right
                this.vx = this.speedx;
                this.status = 1;
            }
            else if (a) {
                this.vx = -this.speedx;
                this.status = 2;
            }
            else if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
            else {
                this.vx = 0;
                this.status = 0;  
            }

        }
    }

    render() {
    
        let status = this.status;
        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            }
            else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.$canvas.width(), 0);
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);   

                this.ctx.restore();
            }
            
        }
        if (status === 4 && parseInt(this.frame_current_cnt / obj.frame_rate) === obj.frame_cnt - 1) {
            this.status = 0;   
        }
        if (status === 5 && parseInt(this.frame_current_cnt / obj.frame_rate) === obj.frame_cnt - 1) {
            this.status = 0;
        }
        if (status === 6 && parseInt(this.frame_current_cnt / obj.frame_rate) === obj.frame_cnt - 1) {
            this.frame_current_cnt--;
        }

        this.frame_current_cnt++;
        
    }

}

export {
    Player
}