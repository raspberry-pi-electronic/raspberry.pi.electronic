
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

class ChessBoardAttributeKeys {
    static col = "col";
    static row = "row";
    static is_chess_piece = "is_chess_piece"
    static at_origin = "at_origin"
    static is_board = "is_board"
}

class Piece {
    element = null;
    style = null;

    constructor(element) {
        this.element = element;
        
    }

    init() {
        if( this.element ) {
            this.style = this.element.style;
        }
        else {
            console.log("Piece does not exist")
        }
    }

    exists() {
        return this.element != null;
    }

    getAttribute(name) {
        return this.element.getAttribute(name);
    }

    setAttribute(name, value) {
        this.element.setAttribute(name, value);
    }
}

class ChessPiece extends Piece {
    id = null;

    constructor(id = null, element = null) {
        super( element );
        if(id) {
            this.id = id;
            this.elemenet = document.getElementById(id);
        }
        else {
            this.id = element.id;
        }
        this.init();
    }

    isPawn() {
        var pieceId = this.element.id;
        return pieceId.indexOf("_pawn_") > -1
    }

    isWhitePiece() {
        var pieceId = this.element.id;
        console.log("piece id: " + pieceId);
        return pieceId.indexOf("white_") > -1
    }

    offsetHeight() {
        return this.element.offsetHeight;
    }
    
    offsetWidth() {
        return this.element.offsetWidth;
    }

    isAtOrigin() {
        return this.element.getAttribute(ChessBoardAttributeKeys.at_origin) == "true";
    }

    movedFromOrigin() {
        this.element.setAttribute(ChessBoardAttributeKeys.at_origin, "false");
    }
}

class ChessBoardSquare extends Piece {
    id = null;

    constructor(id = null, element = null) {
        super(element);
        if( id ) {
            this.id = id;
            this.element = document.getElementById(id);
        }
        else if( element ) {
            this.id = element.id;
        }
        this.init();
    }

    isAtTopEdge() {
        return this.element.getAttribute(ChessBoardAttributeKeys.row) == 1;
    }

    isAtBottomEdge() {
        return this.element.getAttribute(ChessBoardAttributeKeys.row) == 8;
    }
}

/* ================================================ */

class ChessBoard {

    /*
       the 'active_chess_piece' is the one that the user has clicked on
       this will be the piece that gets moved
    */
    active_chess_piece = null;

    /*
        the square the active chess is originated
    */
    active_chess_square = null;

    /*
        this is the square on the board the mouse is moving into
    */
    target_board_square = null;

    /*
        When the user is moving an piece (active_chess_piece), and
        when this the 'active_chess_piece' moved into a square already occupied.  
        the occupied piece is 'target_chess_piece'
    */
    target_chess_piece = null;

    /*
        this saves the mouse location.  This is an Array.

        Array is a list of data -- ex: [2, 3, 5, 6, 8]

        Array data is read by the index and index starts with 0 (zero) -- ex: index 3 will give you the value 6.

         mouse_location[0] will give you the x
         mouse_location[1] will give you the y

    */
    mouse_location = null;

    boardIdRowMapping = ["", "A", "B", "C", "D", "E", "F", "G", "H"]

    constructor() {
        this.active_chess_piece = null;
        this.target_board_square = null;
        this.target_chess_piece = null;
        this.active_chess_square = null;
        this.mouse_location = new Array(0, 0);
    }
    
    handleMouseMove(obj, evt) {
        obj.mouse_location = new Array(evt.clientX, evt.clientY);
        obj.setBoardPiecesOnMouseLocation();
        obj.moveChessPiece();
    }

    setBoardPiecesOnMouseLocation() {
        /*
            https://developer.mozilla.org/en-US/docs/Web/API/Document/elementsFromPoint
        */
        const all_target_element = document.elementsFromPoint(this.mouse_location[0], this.mouse_location[1]);
        for( const targetElement of all_target_element) {
            if( targetElement.getAttribute(ChessBoardAttributeKeys.is_chess_piece) ) {
                if((this.active_chess_piece == null) || (this.active_chess_piece.id != targetElement.id)) {
                    this.target_chess_piece = new ChessPiece(null, targetElement);
                }
            }
            else if( targetElement.getAttribute(ChessBoardAttributeKeys.is_board) ) {
                this.target_board_square = new ChessBoardSquare(null, targetElement);
            }
        }
    }

    moveChessPiece() {
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
        const h = parseInt(this.active_chess_piece.offsetHeight());
        const w = parseInt(this.active_chess_piece.offsetWidth());

        /*
            the current mouse location:
            evt.clientX
            evt.clientY

            the x coordinate, subtract (move to the left) by half of the width length
            the y coordinate, subtract (move to the top) by half of the height length

            pawn.style.left = parseInt(pawn.offsetLeft) - 16 + "px"
            
        */
        const x = this.mouse_location[0] - w/2 + window.scrollX;
        const y = this.mouse_location[1] - h/2 + window.scrollY;

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

        this.active_chess_piece.movedFromOrigin();
    }

    /* ================================================ */

    handleMouseDown(obj, evt) {
        console.log("mouse bt down")
        console.log(evt);
        const all_target_element = document.elementsFromPoint(evt.clientX, evt.clientY);
        for( const targetElement of all_target_element) {
            if( targetElement.getAttribute(ChessBoardAttributeKeys.is_chess_piece) ) {
                obj.active_chess_piece = new ChessPiece(null, targetElement);
            }
            else if( targetElement.getAttribute(ChessBoardAttributeKeys.is_board) ) {
                obj.active_chess_square = targetElement;
            }
        }

        console.log("active_chess_piece.id = " + obj.active_chess_piece.id);
        console.log("active_chess_square.id = " + obj.active_chess_square.id);
        obj.moveChessPiece();
        obj.showAllowLocation()
    }

    handleMouseUp(obj, evt) {
        console.log("mouse bt up")
        obj.active_chess_piece = null;
        obj.active_chess_square = null;
        obj.clearAllSquares();
    }

    clearAllSquares() {
        for( var i = 1; i < 9; i++ ) {
            var rowLetter = this.boardIdRowMapping[i];
            for( var k = 1; k < 9; k++ ) {
                var sq = document.getElementById(rowLetter + k);
                if( sq ) {
                    sq.style.border = "solid 1px black";
                }
                else {
                    console.log("Failed get chess square " + (rowLetter + k));
                }
            }
        }
    }

    /* ==== write some rules here */

    showAllowLocation() {
        if( this.active_chess_piece.isPawn() ) {
            this.pawnRules();
        }
        else {
            this.knightRules();
        }
    }

    pawnRules() {
        /*
           simple rule, only one space

           javascript: define variable
           https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types
        */

        /*
            setting the orgin square border to red
        */
        this.target_board_square.style.border = "solid 1px red";

        /*
            getting the origin square's row and col value
            ex:
              col=1, row=1
        */
        var col = this.target_board_square.getAttribute(ChessBoardAttributeKeys.col);
        var row = this.target_board_square.getAttribute(ChessBoardAttributeKeys.row);

        /*
            this is a required JavaScript thing.  By default value in attribute is a string.
            we need to convert a string like "1" to integer like 1
        */
        col = parseInt(col);
        row = parseInt(row);

        console.log("start from : (" + row + ", " + col + ")");  // print on console

        /*
           ! -- means not
           == means is equals to
           = means assignment, equals to: ex: a = "some value"
        */
        if( !this.active_chess_piece.isWhitePiece() ) {
            /*
               white piece moves down -- means + y direction

               for other pices, you will need to take a look at around line 154
                try to copy and change the value for
                'isAtBottomEdge' method and
                'isAtTopEdge' method to check
                these:
                   -- isAtLeftEdge
                   -- isAtRightEdge
            */
            if( !this.target_board_square.isAtBottomEdge()) {
                row = row + 1;
            }

        }
        else {
            /*
                black piece moves up -- means - y direction
            */
            if( !this.target_board_square.isAtTopEdge() ) {
                row = row - 1;
            }
        }

        console.log("move to : (" + row + ", " + col + ")"); // print to console

        /*
            chess board is id-ed by letter + integer. -- example: A1, H5
            letter is row
            integer is column

            A3 -- row 1 and column 3

            example: 
               row is 5
               then
               this.boardIdRowMapping[row] will return 'E'

        */
        var rowLetter = this.boardIdRowMapping[row];

        /*
            we are concatenate a string and an integer.

            example:
               rowLetter is 'E'
               col is 4

               then allowSquareId is "E4"
        */
        var allowSquareId = rowLetter + col;

        console.log("destination id: " + allowSquareId);  // debug to console

        /*
           we are creating a chess square using 'ChessBoardSquare' class.
        */
        var allowSquare = new ChessBoardSquare(allowSquareId);

        /*
            setting the border color to orange
        */
        allowSquare.style.border = "solid 1px orange";
    }

    knightRules() {
        this.target_board_square.style.border = "solid 1px red";

        const col = parseInt(this.target_board_square.getAttribute(ChessBoardAttributeKeys.col));
        const row = parseInt(this.target_board_square.getAttribute(ChessBoardAttributeKeys.row));

        var one_o_clock = [row - 2, col + 1];
        var two_o_clock = [row - 1, col + 2];
        var four_o_clock = [row + 1, col + 2];
        var five_o_clock = [row + 2, col + 1];
        var seven_o_clock = [row + 2, col - 1];
        var eight_o_clock = [row + 1, col - 2];
        var ten_o_clock = [row - 1, col - 2];
        var eleven_o_clock = [row - 2, col - 1];

        
        var one_o_clock_id = this.boardIdRowMapping[one_o_clock[0]] + one_o_clock[1];
        var two_o_clock_id = this.boardIdRowMapping[two_o_clock[0]] + two_o_clock[1];
        var four_o_clock_id = this.boardIdRowMapping[four_o_clock[0]] + four_o_clock[1];
        var five_o_clock_id = this.boardIdRowMapping[five_o_clock[0]] + five_o_clock[1];
        var seven_o_clock_id = this.boardIdRowMapping[seven_o_clock[0]] + seven_o_clock[1];
        var eight_o_clock_id = this.boardIdRowMapping[eight_o_clock[0]] + eight_o_clock[1];
        var ten_o_clock_id = this.boardIdRowMapping[ten_o_clock[0]] + ten_o_clock[1];
        var eleven_o_clock_id = this.boardIdRowMapping[eleven_o_clock[0]] + eleven_o_clock[1];
        

        var one_o_clock_square = new ChessBoardSquare(one_o_clock_id);
        var two_o_clock_square = new ChessBoardSquare(two_o_clock_id);
        var four_o_clock_square = new ChessBoardSquare(four_o_clock_id);
        var five_o_clock_square = new ChessBoardSquare(five_o_clock_id);
        var seven_o_clock_square = new ChessBoardSquare(seven_o_clock_id);
        var eight_o_clock_square = new ChessBoardSquare(eight_o_clock_id);
        var ten_o_clock_square = new ChessBoardSquare(ten_o_clock_id);
        var eleven_o_clock_square = new ChessBoardSquare(eleven_o_clock_id);
        

        if( one_o_clock_square.exists()) {
            one_o_clock_square.style.border = "solid 1px orange";
        }

        if( two_o_clock_square.exists()) {
            two_o_clock_square.style.border = "solid 1px orange";
        }

        if( four_o_clock_square.exists()){
            four_o_clock_square.style.border = "solid 1px orange";
        }

        if( five_o_clock_square.exists()) {
            five_o_clock_square.style.border = "solid 1px orange";
        }

        if( seven_o_clock_square.exists()) {
            seven_o_clock_square.style.border = "solid 1px orange";
        }

        if( eight_o_clock_square.exists()) {
            eight_o_clock_square.style.border = "solid 1px orange";
        }
        
        if( ten_o_clock_square.exists()) {
            ten_o_clock_square.style.border = "solid 1px orange";
        }

        if( eleven_o_clock_square.exists()) {
            eleven_o_clock_square.style.border = "solid 1px orange";
        }

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


