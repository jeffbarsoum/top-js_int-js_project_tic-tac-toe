const pieces = ['x', 'o'];

const createPlayer = (name, pieceId) => {
    const _name = name;
    const _pieceId = setPieceId(pieceId);
    console.log(pieces)
    console.log(_pieceId)

    let _score = 0;

    if (!_pieceId) {
        throw(`Error! Piece '${pieceId}' is already taken`)
    }

    const getPieceId = () => { return _pieceId; }

    function setPieceId(pieceId) {
        const pieceIndex = pieces.findIndex((pc) => pc === pieceId);
        // console.log(pieceIndex)
        // console.log(pieces)

        return pieceIndex === -1 ? null : pieces.splice(pieceIndex, 1).pop();
    }

    const getScore = () => {
        return _score;
    }

    const addScore = () => {
        return _score++;
    }

    const getName = () => { return _name };


    return {
        getPieceId,
        getScore,
        getName,
        addScore
    }   
}


export { createPlayer }