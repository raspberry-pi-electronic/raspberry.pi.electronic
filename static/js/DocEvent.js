
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

class ChessBoard {

    active_chess_piece = null;
    target_board_square = null;
    target_chess_piece = null;
    mouse_location = null;

    constructor() {
        this.active_chess_piece = null;
        this.target_board_square = null;
        this.target_chess_piece = null;
        this.mouse_location = new Array(0, 0);
    }
    
    handleMouseMove(obj, evt) {
        obj.mouse_location = new Array(evt.clientX, evt.clientY);
        obj.setBoardPiecesOnMouseLocation();
        obj.moveChessPiece(evt);
    }

    setBoardPiecesOnMouseLocation() {
    /*
         https://developer.mozilla.org/en-US/docs/Web/API/Document/elementsFromPoint
    */
        const all_target_element = document.elementsFromPoint(this.mouse_location[0], this.mouse_location[1]);
        for( const targetElement of all_target_element) {
            if( targetElement.getAttribute("isChessPiece") ) {
                if((this.active_chess_piece == null) || (this.active_chess_piece.id != targetElement.id)) {
                    this.target_chess_piece = targetElement;
                }
            }
            else if( targetElement.getAttribute("isBoard") ) {
                this.target_board_square = targetElement;
            }
            // target_chess_piece
        }
    }

    moveChessPiece(evt) {
        if( this.active_chess_piece == null ) {
            return;
        }

        console.log("moving chess piece: " + this.active_chess_piece.id);

        /*
            setting the HTML object to absolute position
        */
        this.active_chess_piece.style.position = "absolute";

        /*
            get the HTML object's height -- it contains a unit, such as 200 px
            'parseInt' is to parse (extract or read) the integer value

            https://www.w3schools.com/jsref/prop_element_offsettop.asp
        */
        const h = parseInt(this.active_chess_piece.offsetHeight);
        const w = parseInt(this.active_chess_piece.offsetWidth);

        /*
            the current mouse location:
            evt.clientX
            evt.clientY

            the x coordinate, subtract (move to the left) by half of the width length
            the y coordinate, subtract (move to the top) by half of the height length

            pawn.style.left = parseInt(pawn.offsetLeft) - 16 + "px"
            
        */
        const x = this.mouse_location[0] - w/2;
        const y = this.mouse_location[1] - h/2;

        /*
            setting the HTML object's location
        */
        this.active_chess_piece.style.left = x + "px";
        this.active_chess_piece.style.top = y + "px";

        console.log(this.active_chess_piece.id + " size (" + h + " x " + w + ")");

        console.log("move element: " + this.active_chess_piece.id + " to (" + x + ", " + y + ")");
        if (this.target_board_square) {
            console.log("Chess piece " + this.active_chess_piece.id + " entered: " + this.target_board_square.id )
        }
    }

    /* ================================================ */

    handleMouseDown(obj, evt) {
        console.log("mouse bt down")
        console.log(evt);
        const all_target_element = document.elementsFromPoint(evt.clientX, evt.clientY);
        for( const targetElement of all_target_element) {
            if( targetElement.getAttribute("isChessPiece") ) {
                obj.active_chess_piece = targetElement;
                console.log("targetElement.id = " + targetElement.id);
                obj.moveChessPiece(evt);
                break;
            }
        }
    }

    handleMouseUp(obj, evt) {
        console.log("mouse bt up")
        obj.active_chess_piece = null;
    }
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

const chessBoard = new ChessBoard();
PageMouseEventHandlers.MOUSE_MOVE.addHandler(new MouseEventHandlerObject(chessBoard.handleMouseMove, chessBoard));
PageMouseEventHandlers.MOUSE_DOWN.addHandler(new MouseEventHandlerObject(chessBoard.handleMouseDown, chessBoard));
PageMouseEventHandlers.MOUSE_UP.addHandler(new MouseEventHandlerObject(chessBoard.handleMouseUp, chessBoard));


