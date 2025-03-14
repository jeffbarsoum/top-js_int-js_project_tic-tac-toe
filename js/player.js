const pieces = ['x', 'o'];

const createPlayer = (name, pieceId) => {
    const _name = name;
    const _pieceId = (pieceId) => {
        const pieceIndex = pieces.findIndex((pc) => pc === pieceId);
        return pieceIndex === -1 ? null : pieces.splice(pieceId).pop();
    }

    let _score = 0;

    if (!_pieceId) {
        throw(`Error! Piece '${pieceId}' is already taken`)
    }

    const pieceId = () => {
        return _pieceId;
    }

    const score = () => {
        return _score;
    }

    const addScore = () => {
        return _score++;
    }

    return {
        pieceId,
        score,
        addScore
    }
    
}