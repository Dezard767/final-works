'use strict';

let elements = [];
let correctOrder = [];
const imageGridGenerator = $('.puzzle-generation'); // Block  for new game
const imageGridSolve = $('.puzzle-solve'); // Block for solving

// First loading and initialization pieces
addPuzzleLogic();
// addSortableLogic();
// updateSortableLogic();

// Add puzzle logic
function addPuzzleLogic() {
    for (let i = 1; i <= 16; i++) {
        const piece = $('<div></div>'),
            outerPiece = $('<div></div>');

        outerPiece.addClass('connectedSortable');
        imageGridSolve.append(outerPiece.clone());

        outerPiece.append(piece);
        piece.addClass('image-piece');
        piece.attr('id', `piece-${i}`);
        imageGridGenerator.append(outerPiece);
        elements.push(piece);
        correctOrder = Array.from(elements);
    }
}

// Add/allow sortable logic
function addSortableLogic() {
    $('.puzzle-generation, .puzzle-solve').children().each(function () {
        $(this).sortable({
            connectWith: '.connectedSortable',
            revert: false,
            stop: updateSortableLogic
        })
    })
}

function declineSortableLogic() {
    $('.puzzle-generation, .puzzle-solve').children().each(function () {
        $(this).sortable('disable')
    })
}

// Update puzzle after randomizing it
function updatePuzzleLogic(arr) {
    for (let i = 0; i <= 16; i++) {
        const piece = arr[i],
            outerPiece = $('<div></div>');

        outerPiece.addClass('connectedSortable');
        imageGridSolve.append(outerPiece.clone());

        outerPiece.append(piece);
        imageGridGenerator.append(outerPiece);
    }
}

// Update sortable blocks logic after interacting with them
function updateSortableLogic() {
    $('.puzzle-generation, .puzzle-solve').children().each(function () {
        let block = $(this);
        let itemCount = block.children().length;
        if (itemCount == 1) {
            block.removeClass('connectedSortable');
        }
        else {
            block.addClass('connectedSortable');
        }
    })
}

// Start game + Timer
let startButton = $('.start-button');
startButton.on('click', timerFunc);
let timer = $('.timer');

function timerFunc() {
    startButton.attr('disabled', true)
    let timerAmount = 60;
    addSortableLogic();
    let timerProcess = setInterval(() => {
        if (timerAmount > 10) {
            timer.text(`0:${--timerAmount}`);
        }
        else {
            timer.text(`0:0${--timerAmount}`);
        }

        if (timerAmount == 0) {
            clearInterval(timerProcess);
            declineSortableLogic();
            timeOut();
        }
    }, 1000)


    let checkResultButton = $('.checkres-button');
    checkResultButton.removeAttr('disabled');
    checkResultButton.on('click', () => {
        let modalInterval = setInterval(() => {
            if (timerAmount > 10) {
                $('.modal-text').text(`Are you sure? 0:${timerAmount}`);
            }
            else {
                $('.modal-text').text(`Are you sure? 0:0${timerAmount}`);
            }
        },  10)
        const modalWindow = $('.modal');
        modalWindow.fadeIn();

        $('.close-button').on('click', () => {
            modalWindow.fadeOut();
            clearInterval(modalInterval);
            $('.close-button').off();
            $('.check-button').off();
        })

        $('.check-button').css('display', 'block');
        $('.check-button').on('click', () => {
            clearInterval(modalInterval);
            clearInterval(timerProcess);
            let check;
            correctOrder.forEach((element, index) => {
                let puzzleElementID = $($('.image-piece')[index]).attr('id');
                let arrayElementID = element.attr('id');
                if(arrayElementID == puzzleElementID) {
                    check = true;
                }
                else {
                    $('.modal-text').text(`It's a pity, but you lost`);
                    $('.check-button').css('display', 'none');
                    checkResultButton.attr('disabled', true);
                    declineSortableLogic()
                    check = false;
                    return false;
                }
            });
            if (check == true) {
                $('.modal-text').text(`Woohoo, well done, you did it!`);
                $('.check-button').css('display', 'none');
                checkResultButton.attr('disabled', true);
                declineSortableLogic()
            }
        })
    })

    // When timer is on
    newgameButton.on('click', () => {
        timer.text(`1:00`);
        startButton.removeAttr('disabled');
        checkResultButton.attr('disabled', true);
        clearInterval(timerProcess);
        shuffle(elements);
    })
}

function timeOut() {
    const modalWindow = $('.modal');
    modalWindow.fadeIn();
    $('.modal-text').text('Too slow!');
    $('.check-button').css('display', 'none');
    $('.close-button').on('click', () => {
        modalWindow.fadeOut();
        $('.close-button').off();
    })
}

let newgameButton = $('.restart-button')

newgameButton.on('click', () => {
    timer.text(`1:00`);
    startButton.removeAttr('disabled');
    $('checkres-button').attr('disabled', true);
    shuffle(elements);
})

// Fisher-Yates Shuffle
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    imageGridGenerator.empty();
    imageGridSolve.empty();
    for (let i = 0; i < arr.length; i++) {
        arr[i].css({
            left: '0px',
            top: '0px'
        })
    }

    updatePuzzleLogic(arr);
}