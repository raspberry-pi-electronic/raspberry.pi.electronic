
/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements
*/

class MouseEventHandler {
    /*
    the current mouse location:
                    evt.clientX
                    evt.clientY
    */

    mouseHandlerList = [];

    constructor() {
        this.mouseHandlerList = [];
    }

    handleMouseEvent(evt) {

        for( var i in this.mouseHandlerList) {
            this.invokeHandler(this.mouseHandlerList[i], evt);
        }
        
        /*
        for( const handler of this.mouseHandlerList ) {
            this.invokeHandler(handler, evt);
        }
        */
    }

    async invokeHandler( handler, evt ) {
        if( !handler ) {
            return;
        }
        try {
            handler(evt);
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

    target_chess_piece = null;
    target_board_square = null;
    mouse_location = [0, 0];
    
    handleMouseMove(evt) {
        this.mouse_location = [evt.clientX, evt.clientY];
        target_board_square = getBoardSquareOnMouseLocation();
        this.mouseChessPiece();
    }

    setBoardPiecesOnMouseLocation() {
    /*
         https://developer.mozilla.org/en-US/docs/Web/API/Document/elementsFromPoint
    */
        const all_target_element = document.elementsFromPoint(mouse_location[0], mouse_location[1]);
        for( const targetElement of all_target_element) {
            if( targetElement.getAttribute("isBoard") ) {
                target_board_square = targetElement;
            }
            else if((this.target_chess_piece == null) || (this.target_chess_piece.id != targetElement.id)) {
                this.target_board_square = targetElement;
            }
        }
    }

    mouseChessPiece() {
        if( this.target_chess_piece == null ) {
            return;
        }

        /*
            setting the HTML object to absolute position
        */
        target_chess_piece.style.position = "absolute";

        /*
            get the HTML object's height -- it contains a unit, such as 200 px
            'parseInt' is to parse (extract or read) the integer value

            https://www.w3schools.com/jsref/prop_element_offsettop.asp
        */
        h = parseInt(this.target_chess_piece.offsetHeight);
        w = parseInt(this.target_chess_piece.offsetWidth);

        /*
            the current mouse location:
            evt.clientX
            evt.clientY

            the x coordinate, subtract (move to the left) by half of the width length
            the y coordinate, subtract (move to the top) by half of the height length


        */
        x = mouse_location[0] - w/2;
        y = mouse_location[1] - h/2;

        /*
            setting the HTML object's location
        */
        this.target_chess_piece.style.left = x + "px";
        this.target_chess_piece.style.top = y + "px";

        console.log(this.target_chess_piece.id + " size (" + h + " x " + w + ")");
        console.log("mouse location: (" + mouse_location[0] + ", " + mouse_location[1] + ")");

        console.log("move element: " + this.target_chess_piece.id + " to (" + x + ", " + y + ")");
        if (this.target_board_square) {
            console.log("Chess piece " + this.target_chess_piece.id + " entered: " + this.target_board_square.id )
        }
    }

    /* ================================================ */

    handleMouseDown(evt) {
        console.log("mouse bt down")
        this.target_chess_piece = document.elementFromPoint(mouse_location[0], mouse_location[1]);
    }

    handleMouseUp(evt) {
        console.log("mouse bt up")
        this.target_chess_piece = null;
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

    document.body.onmousemove =  PageMouseEventHandlers.MOUSE_MOVE.handleMouseEvent;
    document.body.onmousedown =  PageMouseEventHandlers.MOUSE_DOWN.handleMouseEvent;
    document.body.onmouseup =  PageMouseEventHandlers.MOUSE_UP.handleMouseEvent;

    console.log("document mouse event handler configured");
}


setTimeout( setupEventHandlers, 100 );
PageMouseEventHandlers.MOUSE_MOVE.addHandler(new ChessBoard().handleMouseMove)
PageMouseEventHandlers.MOUSE_DOWN.addHandler(new ChessBoard().handleMouseDown)
PageMouseEventHandlers.MOUSE_UP.addHandler(new ChessBoard().handleMouseUp)

