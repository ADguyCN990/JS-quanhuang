let AC_GAME_OBJECT = [];

class Ac_Game_Object {
    constructor() {
        AC_GAME_OBJECT.push(this);
        this.timedelta = 0;
        this.has_called_start = false;
    }

    start() {

    }

    update() {

    }

}

let last_timestamp;

requestAnimationFrame(AC_GAME_OBJECTS_FRAME)
function AC_GAME_OBJECTS_FRAME(timestamp) {
    for (let obj of AC_GAME_OBJECT) {
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECTS_FRAME);
}



export {
    Ac_Game_Object
}