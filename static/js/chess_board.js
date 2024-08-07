
var boardIdRowMapping = {};
const A = 'A'.charCodeAt(0);
for( var i = -5; i < 1; i++ ) {
    boardIdRowMapping[i] = "-";
}
for(var i = 0; i < 26; i++) {
    boardIdRowMapping[ i + 1 ] = String.fromCharCode(A + i);
}


class ChessBoardAttributeKeys {
    static is_board = "is_board"
    static col = "col";
    static row = "row";
    static contains_piece = "contains_piece";
    static allowed_move_into = "allowed_move_into";
    static allowed_to_take = "allowed_to_take";

    static is_chess_piece = "is_chess_piece";
    static color = "color";
    static name = "name";
    static suffix = "suffix";
    static at_origin = "at_origin";

    static white_chess_grave_yard = "white_chess_grave_yard";
    static black_chess_grave_yard = "black_chess_grave_yard";
    static pawn_location = "pawn_location";
    static grave_yeard_piece = "grave_yeard_piece";
}

class Piece {
    element = null;
    style = null;
    parentNode = null;
    classList = null;

    constructor(element) {
        this.element = element;
    }

    init() {
        if( this.element ) {
            this.style = this.element.style;
            this.parentNode = this.element.parentNode;
            this.classList = this.element.classList;
            return true;
        }
        console.log("Piece does not exist")
        return false;
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

    removeAttribute(name) {
        this.element.removeAttribute(name);
    }
}

class ChessPiece extends Piece {
    id = null;

    constructor(id = null, element = null) {
        super( element );
        if(id) {
            this.id = id;
            this.element = document.getElementById(id);
        }
        else {
            this.id = element.id;
        }
        
        if( !this.init() ) {
            console.log("Chess piece not found: " + id);
        }
    }

    remove() {
        this.element.parentNode.removeChild(this.element);
        this.element.style.position = "relative";
        this.element.style.top = "0px";
        this.element.style.left = "0px";
        this.element.style.display = "block";
        this.element.style.marginLeft = "5px";
        this.element.removeAttribute(ChessBoardAttributeKeys.is_chess_piece);
        this.element.setAttribute(ChessBoardAttributeKeys.grave_yeard_piece, "true");
        if( this.isWhitePiece() ) {
            document.getElementById(ChessBoardAttributeKeys.white_chess_grave_yard).appendChild(this.element);
        }
        else {
            document.getElementById(ChessBoardAttributeKeys.black_chess_grave_yard).appendChild(this.element);
        }
        this.element.classList.remove("chess_piece");
        this.element.classList.add("chess_piece_s");

        this.id = null;
        this.element = null;
    }

    isPawn() {
        var name = this.element.getAttribute(ChessBoardAttributeKeys.name);
        return name == "pawn"
    }

    isKnight() {
        var name = this.element.getAttribute(ChessBoardAttributeKeys.name);
        return name == "knight"
    }

    isRook() {
        var name = this.element.getAttribute(ChessBoardAttributeKeys.name);
        return name == "rook"
    }

    isBishop() {
        var name = this.element.getAttribute(ChessBoardAttributeKeys.name);
        return name == "bishop"
    }

    isQueen() {
        var name = this.element.getAttribute(ChessBoardAttributeKeys.name);
        return name == "queen"
    }

    isKing() {
        var name = this.element.getAttribute(ChessBoardAttributeKeys.name);
        return name == "king"
    }

    isWhitePiece() {
        return this.getPieceColor() == "white";
    }
                                                                                                                                        
    getPieceColor() {
        return this.element.getAttribute(ChessBoardAttributeKeys.color);
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
        if(this.isAtOrigin()) {
            this.element.setAttribute(ChessBoardAttributeKeys.at_origin, "false");
            return true;
        }
        return false;
    }

    restoredAtOrigin() {
        this.element.setAttribute(ChessBoardAttributeKeys.at_origin, "true");
    }

    setLocation(x, y) {
        this.element.style.position = "absolute";
        this.element.style.marginLeft = null; 
        this.element.setAttribute(ChessBoardAttributeKeys.is_chess_piece, "true");
        this.element.removeAttribute(ChessBoardAttributeKeys.grave_yeard_piece);

        var h = this.element.offsetHeight / 2;
        var w = this.element.offsetWidth / 2;
        this.element.style.left = (x - w) + "px";
        this.element.style.top = (y - h) + "px";
    }
}

class ChessBoardSquare extends Piece {
    id = null;
    location = null;

    constructor(id = null, element = null) {
        super(element);
        if( id ) {
            this.id = id;
            this.element = document.getElementById(id);
        }
        else if( element ) {
            this.id = element.id;
        }
        
        if( !this.init() ) {
            console.log("Board square not found: " + id);
        }

        this.location = null;
    }

    isAtTopEdge() {
        return this.element.getAttribute(ChessBoardAttributeKeys.row) == 1;
    }

    isAtBottomEdge() {
        return this.element.getAttribute(ChessBoardAttributeKeys.row) == 8;
    }

    isAtRightEdge() {
        return this.element.getAttribute(ChessBoardAttributeKeys.col) == 8;
    }

    isAtLeftEdge() {
        return this.element.getAttribute(ChessBoardAttributeKeys.col) == 1;
    }

    setPiece(piece) {
        piece.classList.remove("chess_piece_s");
        piece.classList.add("chess_piece");
        this.element.setAttribute(ChessBoardAttributeKeys.contains_piece, piece.id);
        var location = this.getLocation();
        piece.setLocation(location[0], location[1]);
    }

    getPiece() {
        return  this.element.getAttribute(ChessBoardAttributeKeys.contains_piece);
    }

    removePiece() {
        this.element.setAttribute(ChessBoardAttributeKeys.contains_piece, "false");
    }

    isOccupied() {
        return  this.getPiece() != "false";
    }

    isOccupiedBy(piece_color) {
        var piece_id = this.element.getAttribute(ChessBoardAttributeKeys.contains_piece);
        if(piece_id == "false") {
            return false;
        }
        return (new ChessPiece(piece_id).getPieceColor()) == piece_color;
    }

    getLocation() {
        if( this.location ) {
            return this.location;
        }
        var ele = this.element;
        var maxLevel = 20;
        var size = this.getSize();
        this.location = [0 + size[0] / 2, 0 + size[1] / 2];
        while( (ele.nodeName.toLowerCase() != "body") && (maxLevel > 0) ) {
            if( ele.nodeName.toLowerCase() != "tr" && ele.nodeName.toLowerCase() != "table") {
                this.location[0] += parseInt(ele.offsetLeft);
                this.location[1] += parseInt(ele.offsetTop);
            }
            ele = ele.parentNode;
            maxLevel--;
        }
        return this.location;
    }

    getSize() {
        return [this.element.offsetWidth, this.element.offsetHeight];
    }

    setAllowToTake() {
        this.element.setAttribute(ChessBoardAttributeKeys.allowed_to_take, "true");
        this.element.style.border = "solid 1px orange";
    }

    isAllowedToTake() {
        return this.element.getAttribute(ChessBoardAttributeKeys.allowed_to_take);
    }

    setAllowedToMoveInto() {
        this.element.setAttribute(ChessBoardAttributeKeys.allowed_move_into, "true");
        this.element.style.border = "solid 1px orange";
    }

    isAllowedToMoveInto() {
        return this.element.getAttribute(ChessBoardAttributeKeys.allowed_move_into);
    }

    /*
       subtract row by 1
    */
    moveUp() {
        const row_value = this.element.getAttribute(ChessBoardAttributeKeys.row);
        const col_value = this.element.getAttribute(ChessBoardAttributeKeys.col);
        const row_int = parseInt(row_value) - 1;
        const space_id = boardIdRowMapping[row_int] + col_value;
        return new ChessBoardSquare(space_id);
    }

    static moveUp(piece) {
        return piece.moveUp();
    }

    moveDown() {
        const row_value = this.element.getAttribute(ChessBoardAttributeKeys.row);
        const col_value = this.element.getAttribute(ChessBoardAttributeKeys.col);
        const row_int = parseInt(row_value) + 1;
        const space_id = boardIdRowMapping[row_int] + col_value;
        return new ChessBoardSquare(space_id);

    }

    static moveDown(piece) {
        return piece.moveDown();
    }

    moveLeft() {
        const row_value = this.element.getAttribute(ChessBoardAttributeKeys.row);
        const col_value = this.element.getAttribute(ChessBoardAttributeKeys.col);
        const col_int = parseInt(col_value) - 1;
        const space_id = boardIdRowMapping[row_value] + col_int;
        return new ChessBoardSquare(space_id);
    }

    static moveLeft(piece) {
        return piece.moveLeft();
    }

    moveRight() {
        const row_value = this.element.getAttribute(ChessBoardAttributeKeys.row);
        const col_value = this.element.getAttribute(ChessBoardAttributeKeys.col);
        const col_int = parseInt(col_value) + 1;
        const space_id = boardIdRowMapping[row_value] + col_int;
        return new ChessBoardSquare(space_id);
    }

    static moveRight(piece) {
        return piece.moveRight();
    }

    moveNorthEast(){
        const row_value = this.element.getAttribute(ChessBoardAttributeKeys.row);
        const col_value = this.element.getAttribute(ChessBoardAttributeKeys.col);
        const col_int = parseInt(col_value) + 1;
        const row_int = parseInt(row_value) - 1;
        const space_id = boardIdRowMapping [row_int] + col_int;
        return new ChessBoardSquare(space_id);
    }

    static moveNorthEast(piece) {
        return piece.moveNorthEast();
    }

    moveSouthEast(){
        const row_value = this.element.getAttribute(ChessBoardAttributeKeys.row);
        const col_value = this.element.getAttribute(ChessBoardAttributeKeys.col);
        const col_int = parseInt(col_value) + 1;
        const row_int = parseInt(row_value) + 1;
        const space_id = boardIdRowMapping [row_int] + col_int;
        return new ChessBoardSquare(space_id);
    }

    static moveSouthEast(piece) {
        return piece.moveSouthEast();
    }

    moveSouthWest(){
        const row_value = this.element.getAttribute(ChessBoardAttributeKeys.row);
        const col_value = this.element.getAttribute(ChessBoardAttributeKeys.col);
        const col_int = parseInt(col_value) - 1;
        const row_int = parseInt(row_value) + 1;
        const space_id = boardIdRowMapping [row_int] + col_int;
        return new ChessBoardSquare(space_id);
    }

    static moveSouthWest(piece) {
        return piece.moveSouthWest();
    }

    moveNorthWest(){
        const row_value = this.element.getAttribute(ChessBoardAttributeKeys.row);
        const col_value = this.element.getAttribute(ChessBoardAttributeKeys.col);
        const col_int = parseInt(col_value) - 1;
        const row_int = parseInt(row_value) - 1;
        const space_id = boardIdRowMapping [row_int] + col_int;
        return new ChessBoardSquare(space_id);
    }

    static moveNorthWest(piece) {
        return piece.moveNorthWest();
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

    static white_piece_move = true;

    /*
        [
            active_chess_piece.id,
            active_chess_square.id,
            target_board_square.id,
            captured_piece.id,
            moved_from_origin // true/false
        ];
    */
    static chess_moves = [];

    constructor() {
        this.active_chess_piece = null;
        this.target_board_square = null;
        this.target_chess_piece = null;
        this.active_chess_square = null;
        this.mouse_location = new Array(0, 0);
    }

    static undo() {
        var move = ChessBoard.chess_moves.pop();
        if(!move) {
            return;
        }
        const active_chess_piece = new ChessPiece(move[0]);
        const active_chess_square =  new ChessBoardSquare(move[1]);
        const target_board_square = new ChessBoardSquare(move[2]);

        active_chess_square.setPiece(active_chess_piece);
        target_board_square.removePiece();
        
        if( move[3] ) {
            const captured_piece = new ChessPiece(move[3]);
            target_board_square.setPiece(captured_piece);
        }

        if( move[4] ) {
            active_chess_piece.restoredAtOrigin();
        }
        ChessBoard.white_piece_move = ! ChessBoard.white_piece_move;
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

        //console.log("moving chess piece: " + this.active_chess_piece.id);

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

        //console.log(this.active_chess_piece.id + " size (" + h + " x " + w + ")");
        //console.log("move element: " + this.active_chess_piece.id + " to (" + x + ", " + y + ")");
        if (this.target_board_square) {
            //console.log("Chess piece " + this.active_chess_piece.id + " entered: " + this.target_board_square.id )
        }
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
                obj.active_chess_square = new ChessBoardSquare(null, targetElement);

            }
        }

        if( obj.active_chess_piece != null ) {
            obj.active_chess_piece.style.zIndex = 999;
            console.log("active_chess_piece.id = " + obj.active_chess_piece.id);
            if( obj.active_chess_piece.isWhitePiece() ) {
                if(!ChessBoard.white_piece_move) {
                    obj.active_chess_piece = null;
                    obj.active_chess_square = null;
                    return;
                }
            }
            else {
                if(ChessBoard.white_piece_move) {
                    obj.active_chess_piece = null;
                    obj.active_chess_square = null;
                    return;
                }
            }
            obj.moveChessPiece();
        }

        if( obj.active_chess_square != null ) {
            console.log("active_chess_square.id = " + obj.active_chess_square.id);
            if( obj.active_chess_piece != null ) {
                obj.showAllowLocation();
            }
        }
    }

    handleMouseUp(obj, evt) {
        console.log("mouse bt up")

        const chessMoves = obj.setOccupiedSquare();
        if( chessMoves ) {
            obj.active_chess_piece.style.zIndex = null;
            obj.replacePawn();
            ChessBoard.chess_moves.push( chessMoves );
        }
        obj.clearAllSquares();
        
        obj.active_chess_piece = null;
        obj.active_chess_square = null;
    }

    setOccupiedSquare() {
        var chessMoves = null;
        if( (this.active_chess_piece != null) && (this.target_board_square != null) && (this.active_chess_square != null) ) {
            if( this.target_board_square.isAllowedToMoveInto() || this.target_board_square.isAllowedToTake() ) {
                chessMoves = [
                    this.active_chess_piece.id,
                    this.active_chess_square.id,
                    this.target_board_square.id
                ];
                var piece_id = "";
                if(this.target_board_square.isAllowedToTake()) {
                    piece_id = this.target_board_square.getPiece();
                    (new ChessPiece(piece_id)).remove();
                }
                chessMoves.push(piece_id);
                this.active_chess_square.removePiece();
                this.target_board_square.setPiece(this.active_chess_piece);
                if( this.setMovedFromOrigin() ) {
                    chessMoves.push(true);
                }
                else {
                    chessMoves.push(false);
                }
                ChessBoard.white_piece_move = ! ChessBoard.white_piece_move;
            }
            else {
                var location = this.active_chess_square.getLocation();
                console.log("moving chess back to: (" + location[0] + ", " + location[1] + ")");
                this.active_chess_piece.setLocation(location[0], location[1]);
            }
        }
        return chessMoves;
    }

    replacePawn() {
        if( !this.active_chess_piece.isPawn() ) {
            return;
        }

        if( this.active_chess_piece.isWhitePiece() ) {
            if( this.target_board_square.isAtTopEdge() ) {
                console.log(this.active_chess_piece.id + " at edge: " + this.target_board_square.id);
                const graveYard = document.getElementById(ChessBoardAttributeKeys.white_chess_grave_yard);
                graveYard.setAttribute(ChessBoardAttributeKeys.pawn_location, this.target_board_square.id);
            }
            return;
        }
        if( this.target_board_square.isAtBottomEdge() ) {
            console.log(this.active_chess_piece.id + " at edge: " + this.target_board_square.id);
            const graveYard = document.getElementById(ChessBoardAttributeKeys.black_chess_grave_yard);
            graveYard.setAttribute(ChessBoardAttributeKeys.pawn_location, this.target_board_square.id);
        }
    }

    setMovedFromOrigin() {
        if( (this.active_chess_piece != null) && (this.target_board_square != null) && (this.active_chess_square != null) ) {
            if(this.active_chess_square.id != this.target_board_square.id) {
                return this.active_chess_piece.movedFromOrigin();
            }
        }
        return false;
    }

    clearAllSquares() {
        if(this.active_chess_piece == null) {
            return;
        }
        for( var i = 1; i < 9; i++ ) {
            var rowLetter = boardIdRowMapping[i];
            for( var k = 1; k < 9; k++ ) {
                var sq = document.getElementById(rowLetter + k);
                if( sq ) {
                    sq.style.border = "solid 1px black";
                    sq.removeAttribute(ChessBoardAttributeKeys.allowed_move_into);
                    sq.removeAttribute(ChessBoardAttributeKeys.allowed_to_take);
                }
                else {
                    console.log("Failed get chess square " + (rowLetter + k));
                }
            }
        }
    }

    /* ==== write some rules here */

    showAllowLocation() {
        /*
            setting the orgin square border to red
        */
        this.active_chess_square.style.border = "solid 1px red";

        /*
            getting the origin square's row and col value
            ex:
                col=1, row=1
        */
        var col = this.active_chess_square.getAttribute(ChessBoardAttributeKeys.col);
        var row = this.active_chess_square.getAttribute(ChessBoardAttributeKeys.row);

        /*
            this is a required JavaScript thing.  By default value in attribute is a string.
            we need to convert a string like "1" to integer like 1
        */
        col = parseInt(col);
        row = parseInt(row);

        if( this.active_chess_piece.isPawn() ) {
            this.pawnRules(row, col);
        }
        else if(this.active_chess_piece.isKnight()) {
            this.knightRules(row, col);
        }
        else if(this.active_chess_piece.isRook()) {
            this.rookRules(row, col);
        }
        else if(this.active_chess_piece.isBishop()) {
            this.bishopRules(row, col);
        }
        else if(this.active_chess_piece.isQueen()) {
            this.queenRules(row, col);
        }
        else if(this.active_chess_piece.isKing()) {
            this.kingRules(row, col)
        }
        
    }

    pawnRules(row, col) {
        /*
           simple rule, only one space

           javascript: define variable
           https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types
        */

        /* console.log("start from : (" + row + ", " + col + ")");  // print on console */

        var move_to_row_list = [];
        var to_take_row_col_list = []

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
            if( !this.active_chess_square.isAtBottomEdge() ) {
                move_to_row_list.push(row + 1);

                if( this.active_chess_piece.isAtOrigin()) {
                    move_to_row_list.push(row + 2);
                }

                if( !this.active_chess_square.isAtRightEdge() ) {
                    to_take_row_col_list.push([row + 1, col + 1]);
                }
                if( !this.active_chess_square.isAtLeftEdge() ) {
                    to_take_row_col_list.push([row + 1, col - 1]);
                }
            }

        }
        else {
            /*
                black piece moves up -- means - y direction
            */
            if( !this.active_chess_square.isAtTopEdge() ) {
                move_to_row_list.push(row - 1);

                if( this.active_chess_piece.isAtOrigin()) {
                    move_to_row_list.push(row - 2);
                }

                if( !this.active_chess_square.isAtRightEdge() ) {
                    to_take_row_col_list.push([row - 1, col + 1]);
                }
                if( !this.active_chess_square.isAtLeftEdge() ) {
                    to_take_row_col_list.push([row - 1, col - 1]);
                }
            }
        }

        /* console.log("move to : (" + row + ", " + col + ")"); // print to console */

        for(var move_to_row of move_to_row_list) {
            /*
                chess board is id-ed by letter + integer. -- example: A1, H5
                letter is row
                integer is column

                A3 -- row 1 and column 3

                example: 
                row is 5
                then
                boardIdRowMapping[row] will return 'E'

            */
            var rowLetter = boardIdRowMapping[move_to_row];

            /*
                we are concatenate a string and an integer.

                example:
                rowLetter is 'E'
                col is 4

                then allowSquareId is "E4"
            */
            var allowSquareId = rowLetter + col;

            /* console.log("destination id: " + allowSquareId);  // debug to console */

            /*
            we are creating a chess square using 'ChessBoardSquare' class.
            */
            var allowSquare = new ChessBoardSquare(allowSquareId);
            if( allowSquare.isOccupied() ) {
                break;
            }
            else {
                /*
                    setting the border color to orange
                */
                allowSquare.style.border = "solid 1px orange";
                allowSquare.setAllowedToMoveInto();
            }
        }

        /* space the pawn allowed to move into to take a piece */

        for( var to_take_row_col of to_take_row_col_list ) {
            var row_letter = boardIdRowMapping[to_take_row_col[0]];
            var space_id = row_letter + to_take_row_col[1];
            var space = new ChessBoardSquare(space_id);
            if( space.isOccupied() && !space.isOccupiedBy(this.active_chess_piece.getPieceColor()) ) {
                space.style.border = "solid 1px orange";
                space.setAllowToTake();
            }
        }
    }

    knightRules(row, col) {
        const row_col_array = [
            [row - 2, col + 1],
            [row - 1, col + 2],
            [row + 1, col + 2],
            [row + 2, col + 1],
            [row + 2, col - 1],
            [row + 1, col - 2],
            [row - 1, col - 2],
            [row - 2, col - 1]
        ]

        /*
           this is a 'for' loop, because it start with 'for'.
           for some-variable until end

           for all index in row_col_array
           index starts with 0.
        */
        for(const index in row_col_array) {
            const board_id = boardIdRowMapping[row_col_array[index][0]] + row_col_array[index][1]  // array that is "E2:
            const chess_square = new ChessBoardSquare(board_id);
            if( chess_square.exists()) {
                if( !chess_square.isOccupied() ) {
                    chess_square.style.border = "solid 1px orange";
                    chess_square.setAllowedToMoveInto();
                }
                if( chess_square.isOccupied() && !chess_square.isOccupiedBy(this.active_chess_piece.getPieceColor()) ) {
                    chess_square.style.border = "solid 1px orange";
                    chess_square.setAllowToTake();
                }
            }
        }
    }

    rookRules(row, col){
        const directionList = [
            ChessBoardSquare.moveUp, 
            ChessBoardSquare.moveDown,
            ChessBoardSquare.moveLeft,
            ChessBoardSquare.moveRight
        ];
        for( const direction of directionList) {
            var next_square = this.active_chess_square;
            while( next_square.exists() ) {
                next_square = direction(next_square);
                if( next_square.exists() ) {
                    if( next_square.isOccupied() ) {
                        if( !next_square.isOccupiedBy(this.active_chess_piece.getPieceColor())) {
                            next_square.setAllowToTake();
                        }
                        break; // this break is to break the while loop
                    }
                    next_square.setAllowedToMoveInto();
                }
            }
        }           
    }

    bishopRules(row, col){
        const directionList = [
            ChessBoardSquare.moveNorthEast, 
            ChessBoardSquare.moveSouthEast,
            ChessBoardSquare.moveSouthWest,
            ChessBoardSquare.moveNorthWest
        ];
        console.log("moving the bishiop: " + this.active_chess_piece.id);
        for( const direction of directionList) {
            var next_square = this.active_chess_square;
            while( next_square.exists() ) {
                console.log(" ** current square is: " + next_square.id);
                next_square = direction(next_square);
                if( next_square.exists() ) {
                    console.log(next_square.id + " square exists ");
                    if( next_square.isOccupied() ) {
                        console.log("next_square is Occupied" );
                        if( !next_square.isOccupiedBy(this.active_chess_piece.getPieceColor())) {
                            console.log("next square is not occupied by " + this.active_chess_piece.getPieceColor());
                            next_square.setAllowToTake();
                            console.log("piece is allow to take");
                        }
                        break;
                    }
                    next_square.setAllowedToMoveInto();
                    console.log("piece is allowed to move into");
                }
                else {
                    console.log("next square does not exist");
                }
            }
        }
    }

    queenRules(row, col){
        const directionList = [
            ChessBoardSquare.moveNorthEast, 
            ChessBoardSquare.moveSouthEast,
            ChessBoardSquare.moveSouthWest,
            ChessBoardSquare.moveNorthWest,
            ChessBoardSquare.moveUp, 
            ChessBoardSquare.moveDown,
            ChessBoardSquare.moveLeft,
            ChessBoardSquare.moveRight
        ];
        for( const direction of directionList) {
            var next_square = this.active_chess_square;
            while( next_square.exists() ) {
                next_square = direction(next_square);
                if( next_square.exists() ) {
                    if( next_square.isOccupied() ) {
                        if( !next_square.isOccupiedBy(this.active_chess_piece.getPieceColor())) {
                            next_square.setAllowToTake();
                        }
                        break; // this break is to break the while loop
                    }
                    next_square.setAllowedToMoveInto();
                }
            }

        }
    }

    kingRules(row, col){
        const row_col_array = [
            [row - 1, col - 0],
            [row - 1, col + 1],
            [row + 0, col + 1],
            [row + 1, col + 1],
            [row + 1, col + 0],
            [row + 1, col - 1],
            [row - 0, col - 1],
            [row - 1, col - 1]
        ] 


        for(const index in row_col_array) {
            const board_id = boardIdRowMapping[row_col_array[index][0]] + row_col_array[index][1]
            const chess_square = new ChessBoardSquare(board_id);
            if( chess_square.exists()) {
                if( !chess_square.isOccupied() ) {
                    chess_square.style.border = "solid 1px orange";
                    chess_square.setAllowedToMoveInto();
                }
                if( chess_square.isOccupied() && !chess_square.isOccupiedBy(this.active_chess_piece.getPieceColor()) ) {
                    chess_square.style.border = "solid 1px orange";
                    chess_square.setAllowToTake();
                }
            }
        }
    }

}

/* ================================================ */

class GraveYard {

    constructor() {

    }
    
    handleMouseClick(obj, evt) {
        var active_chess_piece = null;
        const all_target_element = document.elementsFromPoint(evt.clientX, evt.clientY);
        for( const targetElement of all_target_element) {
            if( targetElement.getAttribute(ChessBoardAttributeKeys.grave_yeard_piece) ) {
                active_chess_piece = new ChessPiece(null, targetElement);
                console.log("Gray yard piece clicked: " + active_chess_piece.id);
                break;
            }
        }

        if( !active_chess_piece ) {
            return;
        }

        const pawn_location_id = active_chess_piece.parentNode.getAttribute(ChessBoardAttributeKeys.pawn_location);
        if( !pawn_location_id ) {
            return;
        }

        active_chess_piece.parentNode.removeAttribute(ChessBoardAttributeKeys.pawn_location);
        const pawn_location = new ChessBoardSquare(pawn_location_id);
        const pawn_id = pawn_location.getPiece();
        pawn_location.setPiece(active_chess_piece);

        const pawn = new ChessPiece(pawn_id);
        pawn.remove();
    }
}


/* ================================================ */

const chessBoard = new ChessBoard();
const graveYard = new GraveYard();

PageMouseEventHandlers.MOUSE_MOVE.addHandler(new MouseEventHandlerObject(chessBoard.handleMouseMove, chessBoard));
PageMouseEventHandlers.MOUSE_DOWN.addHandler(new MouseEventHandlerObject(chessBoard.handleMouseDown, chessBoard));
PageMouseEventHandlers.MOUSE_UP.addHandler(new MouseEventHandlerObject(chessBoard.handleMouseUp, chessBoard));
PageMouseEventHandlers.MOUSE_UP.addHandler(new MouseEventHandlerObject(graveYard.handleMouseClick, graveYard));

