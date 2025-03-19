
const createPlayers = (
    () => {
        const freePlayers = ['x', 'o'];
        const activePlayers = [];
        let currentPlayer;

        const addActivePlayer = (player) => {
            const pieceId = player.getPieceId()
            if (!pieceId) {
                throw(`Error! No pieceId!`)
            }

            const pieceIndex = freePlayers.findIndex((pc) => pc === pieceId);
            if (pieceIndex === -1) {
                throw(`Error! Piece '${pieceId}' is already taken`)
            }

            freePlayers.splice(pieceIndex, 1).pop();
            activePlayers.push(player); 

            if (!currentPlayer) currentPlayer = activePlayers[0];
        }

        const nextPlayer = () => {
            activePlayers.unshift(activePlayers.pop())   
            currentPlayer = activePlayers[0]   
        }

        function createPlayer(name, pieceId) {
            const _name = name;
            const _pieceId = pieceId;
            let score = 0;



        
            const getPieceId = () => { return _pieceId; }
        
            const getScore = () => {
                return score;
            }
        
            const addScore = () => {
                return score++;
            }
        
            const getName = () => { return _name };
        
            const getPlayer = () => { return { name: getName(), pieceId: getPieceId(), score: getScore()  }}
        
        
            const self = {
                getPlayer,
                addScore,
                getPieceId,
                getScore,
                getName,
            }

            console.log(self)
            addActivePlayer(self);
            
            return self;
        }

        const getFreePlayers = () => { return freePlayers; }

        const getActivePlayers = (includeAddScore = false) => { 
            const _activePlayers = [];
            for (const player of activePlayers) {
                if (includeAddScore) {
                    _activePlayers.push({ ...player.getPlayer(), addScore: player.addScore });
                }
                else {
                    _activePlayers.push(player.getPlayer());
                }
            }
            return _activePlayers;
        }

        const getCurrentPlayer = (includeAddScore = false) => { 
            const _currentPlayer = includeAddScore ? 
                { ...currentPlayer.getPlayer(), addScore: currentPlayer.addScore } 
                : currentPlayer.getPlayer();
            return _currentPlayer; 
        }

        return {
            createPlayer,
            nextPlayer,
            getFreePlayers,
            getActivePlayers,
            getCurrentPlayer
        }
    }
)();



export { createPlayers }