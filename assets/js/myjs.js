let Config = {
    CellWidth: 50,
    CellHeight: 50,
    Row: 10,
    Col: 10
};

let Players = [0,0,0,0];
let $Stage = $('#stage');
let $Dice = $('#dice');
let BoardArray = [];
let counter = 0;
$(document).ready(function () {
    $Stage.html(GenerateBoard(GenerateBoardArray(Config.Col, Config.Row)));
});

/**
 * @return {string}
 */
function GenerateBoard(data){
    updateHtml();
    let CellStyle = 'width: '+Config.CellWidth+'px;height: '+Config.CellHeight+'px';
    let HTML = '<div class="board" style="width:'+(Config.CellWidth * Config.Row)+'px;height: '+(Config.CellHeight * Config.Col)+'px;">';
    $.each(data, function (index, element) {
        HTML += '<span class="cell" style="'+CellStyle+'">'
            + element.cell + GenerateSnakeAndLadders(element)+
            '</span>';
    });
    HTML += '</div>';
    return HTML;
}

function GenerateBoardArray(Col,Row) {
    let Counter = 100;
    for(let i = Col; i >= 1;i--){
        let row = [];
        for(let j = 1; j <= Row;j++){
            row.push({
                cell: Counter,
                snake: SetSnake(Counter),
                ladders: SetLadders(Counter)
            });
            Counter--;
        }
        if(i % 2){
            row.reverse();
        }
        BoardArray = BoardArray.concat(row);
    }
    return BoardArray;
}
function SetSnake(cell) {
    let Map = {
        11: 2,
        22: 15,
        34: 23,
        45: 33,
        60: 48,
        84: 70,
        90: 85,
        8: 2,
    };
    return Map[cell]
}

function SetLadders(cell) {
    let Map = {
        12: 25,
        24: 36,
        82: 99
    };
    return Map[cell]
}

/**
 * @return {string}
 */
function GenerateSnakeAndLadders(element) {
    if(element.snake) return '<i class="fa fa-times text-danger">'+element.snake+'</i>';
    if(element.ladders) return '<i class="fa fa-gift text-success">'+element.ladders+'</i>';
    return '';
}

/**
 * @return {number}
 */
function Dice() {
    return Math.ceil(Math.random() * 6);
}

/**
 * @return {boolean}
 */
function CanMove(current, dice) {
    console.log('player ' + (GetCurrentPlayer()+1) + 'Can Move: ' + ((current + dice) <= 100 ? 'YES' : 'NO'));
    return (current + dice) <= 100
}

/**
 * @return {number}
 */
function GetIndexFromCell(cell) {
    return BoardArray.findIndex(function (element) {
        return element.cell === cell
    })}

function GoToCell(index, current_player) {
    let $Cells = $Stage.find('.board span.cell');
    $Cells.removeClass('player-'+ current_player);
    $Cells.eq(index).addClass('player-'+ current_player);
}

function Win() {
    $Dice.find('button').attr('disabled', true);
    alert('Player '+(GetCurrentPlayer()+1) + ' Wins!!!!');
}

/**
 * @return {number}
 */
function GetCurrentPlayer(){
    return counter%4;
}

function SetCurrentPlayer() {
    counter++;
}
function UpdatePlayers() {
    let C = GetCurrentPlayer();
    let CurrentPlayerCell = Players[C];
    if(CurrentPlayerCell !== 0){
        let Index = GetIndexFromCell(CurrentPlayerCell);
        if(BoardArray[Index].snake){
            console.log('---- SNAKE ----');
            GoToCell(GetIndexFromCell(BoardArray[Index].snake), C);
        }
        else if(BoardArray[Index].ladders){
            console.log('---- LADDERS ----');
            GoToCell(GetIndexFromCell(BoardArray[Index].ladders), C);
        }else GoToCell(Index, C);
    }
}

$Dice.find('button').on('click', function () {
    let D = Dice();
    let P = GetCurrentPlayer();
    $Dice.find('small').addClass('pl'+ P);
    $Dice.find('small').html(D);
    if(Players[P] === 0 && D === 6){
        console.log('Player '+ (GetCurrentPlayer()+1)+ ' Game Start');
        Players[P] = 1;
        UpdatePlayers();
    }else if(Players[P] !== 0 && CanMove(Players[P], D)){
        console.log('Next: ' + (Players[P] + D) + ' Dice: ' + D);
        Players[P] = (Players[P] + D);
        UpdatePlayers();
        if(Players[P] === 100) Win();
    }
    SetCurrentPlayer();
    updateHtml();

});

function updateHtml(){
    // console.log('counter' + GetCurrentPlayer());
    let tmp = GetCurrentPlayer() +1;
    $('#pl').html(tmp);
    $('.all').removeClass('bg-danger');
    $('.p' + GetCurrentPlayer()).addClass('bg-danger');
}