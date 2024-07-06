
/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements
*/

class MouseEventHandlerObject {
    func = null;
    obj = null;

    constructor(func, obj) {
        this.func = func;
        this.obj = obj;
    }
}

class MouseEventHandler {
    /*
    the current mouse location:
                    evt.clientX
                    evt.clientY
    */

    mouseHandlerList = [];

    handleMouseEvent(evt) {
        if( !this.mouseHandlerList ) {
            console.log("this.mouseHandlerList is empty or undefined");
            return;
        }
        
        for( const handler of this.mouseHandlerList ) {
            this.invokeHandler(handler, evt);
        }
    }

    invokeHandler( handler, evt ) {
        if( !handler ) {
            return;
        }
        try {
            handler.func(handler.obj, evt);
        } catch (error) {
            console.log("mouse handler error: ");
            console.log(handler);
            console.log(error);
        }
    }

    addHandler( handler ) {
        this.mouseHandlerList.push( handler );
    }

}


class KeyboardEventHandler {
    /*

    https://www.w3schools.com/jsref/event_key_keycode.asp
        evt.keyCode
    */
}

/* ================================================ */

class PageMouseEventHandlers {
    static MOUSE_MOVE = new MouseEventHandler();
    static MOUSE_DOWN = new MouseEventHandler();
    static MOUSE_UP = new MouseEventHandler();
}

function setupEventHandlers() {
    if( !document ) {
        setTimeout( setupEventHandlers, 100 );
        return;
    }
    if( !document.body ) {
        setTimeout( setupEventHandlers, 100 );
        return;
    }

    document.body.onmousemove = function(evt) {
        //console.log("mouse move")
        //console.log(evt);
        PageMouseEventHandlers.MOUSE_MOVE.handleMouseEvent(evt);
    }

    document.body.onmousedown = function(evt) {
        //console.log("mouse button down")
        //console.log(evt);
        PageMouseEventHandlers.MOUSE_DOWN.handleMouseEvent(evt);
    }
    document.body.onmouseup = function(evt) {
        //console.log("mouse button up")
        //console.log(evt);
        PageMouseEventHandlers.MOUSE_UP.handleMouseEvent(evt);
    }

    console.log("document mouse event handler configured");
}

setTimeout( setupEventHandlers, 100 );

