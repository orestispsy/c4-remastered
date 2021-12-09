var body = document.querySelectorAll("body");
var gameBoard = document.querySelectorAll(".gameBoard");
var elem = document.createElement("div");
var dot = document.createElement("div");
var token = document.querySelectorAll(".token");
var user = document.querySelectorAll(".user");
var desc = document.querySelectorAll(".description");
var clear = document.querySelectorAll(".clear");
var mute = document.querySelectorAll(".mute");
var controls = document.querySelectorAll(".controls");
var controlsTop = document.querySelectorAll(".controlsTop");
var headline = document.querySelectorAll(".headline");
var audio = document.querySelectorAll(".audio");
audio[0].volume = 0.6;
var hand = document.querySelectorAll(".hand");

var endGame = false;
var goButton = false;
var player = 0;
var createDotsCounter = 1;
var headlineIntroFXCounter = 0;
var headlineStartGameFXCounter = 0;
var headlineVictoryFXCounter = 0;
var box;
var columns = {};
var count = 0;
var start = false;
var allDots;
var myAudio = new Audio("./assets/throw.mp3");
var myAudioVictory = new Audio("./assets/victory.mp3");
myAudioVictory.volume = 0.4;
var myAudioDraw = new Audio("./assets/draw.mp3");

var letMusicPlay = true;
var firstClick = 0;

////////////////////////////////////Start CREATE BOARD //////////////////////////////

const createDots = () => {
    if (createDotsCounter < 43) {
        dot.className = "dot";
        dot.id = createDotsCounter;

        gameBoard[0].appendChild(dot.cloneNode(true));

        createDotsCounter++;

        setTimeout(() => {
            createDots();
        }, 15);
    }
    box = document.querySelectorAll(".dot");
};

createDots();

const generateColumns = () => {
    for (let col = 1; col <= 7; col++) {
        columns[col] = [];
    }
};

generateColumns();

const fillColumns = (e) => {
    if (count <= 42) {
        columns[e].push(box[count]);
        count = count + 7;
        fillColumns(e);
    }
};

const buildColumns = (e) => {
    for (let i = 1; i <= 7; i++) {
        fillColumns(i);
        count = i;
    }
    delete columns[1][6];
};

setTimeout(() => {
    buildColumns();
    allDots = document.querySelectorAll(".dot");
    controls[0].style = `visibility:visible;animation:fadeInControls 1.8s;`;
}, 1000);

///////////////////////////////////////// End CREATE BOARD /////////////////////////////////

document.addEventListener("mousedown", function (e) {
    if (
        (e.target.className == "token" && !endGame && allDots) ||
        (e.target.className == "dot" && !endGame && allDots)
    ) {
        if (firstClick === 0) {
            gameTimeCount();
            player = 1;
            changeTokenColor();
            firstClick++;
        }
        goButton = true;

        body[0].style = `cursor:none !important;`;
        document.addEventListener("mousemove" || "mouseup", function (ev) {
            if (goButton) {
                for (let j = 1; j <= 7; j++) {
                    for (let jj = 5; jj >= 0; jj--) {
                        if (
                            columns[j][jj].id &&
                            columns[j][jj].id == ev.target.id
                        ) {
                            let filteredSlots = columns[j].filter((obj) => {
                                return obj.className == "dot";
                            });

                            for (let i = 0; i < filteredSlots.length; i++) {
                                filteredSlots[
                                    i
                                ].style = `background-color:white`;
                            }
                            setTimeout(() => {
                                for (let i = 0; i < filteredSlots.length; i++) {
                                    filteredSlots[
                                        i
                                    ].style = `background-color:orange`;
                                }
                            }, 100);
                        }
                    }
                }
                if (e.target.className === "token") {
                    e.target.style = `margin-top:0; position:fixed; top:${
                        ev.pageY + e.screenY * 0.01
                    }px; left:${ev.clientX - e.clientX * 0.02}px`;
                }
            }
        });
    }
});

document.addEventListener("mouseup", function (e) {
    if (goButton && !endGame) {
        if (
            e.target.className == "dot" ||
            e.target.className == "player1" ||
            e.target.className == "player2"
        ) {
            if (letMusicPlay) {
                audio[0].play();
                startGameHeadlineEffect();
            }

            clear[0].innerHTML = "Clear Board";

            for (let j = 1; j <= 7; j++) {
                for (let jj = 5; jj >= 0; jj--) {
                    if (columns[j][jj].id && columns[j][jj].id == e.target.id) {
                        let index = columns[j].findIndex(
                            (x) => x.id === e.target.id
                        );

                        let filteredSlots = columns[j].filter((obj) => {
                            return obj.className === "dot";
                        });

                        if (
                            columns[j][index].className == "player1" ||
                            columns[j][index].className == "player2"
                        ) {
                            return;
                        } else {
                            if (letMusicPlay) {
                                myAudio.play();
                            }

                            setTimeout(() => {
                                for (let i = 0; i < filteredSlots.length; i++) {
                                    if (player == 2) {
                                        filteredSlots[
                                            i
                                        ].style = `background-color:cyan !important; box-shadow: 0 0 15px rgba(255, 255, 255, 0.685);`;
                                    } else if (player == 1) {
                                        filteredSlots[
                                            i
                                        ].style = `background-color:rgb(204, 0, 255) !important; box-shadow: 0 0 15px rgba(255, 255, 255, 0.685);`;
                                    }
                                }
                            }, 150);
                            setTimeout(() => {
                                for (let i = 0; i < filteredSlots.length; i++) {
                                    filteredSlots[
                                        i
                                    ].style = `background-color:orange`;
                                }
                            }, 300);

                            if (player == 1) {
                                filteredSlots.reverse()[0].className =
                                    "player1";

                                victoryCheck();

                                player = 2;
                            } else {
                                filteredSlots.reverse()[0].className =
                                    "player2";

                                victoryCheck();

                                player = 1;
                            }
                        }
                    }
                }
            }
        }
    }
    token[0].style = `position:unset; `;
    changeTokenColor();
    goButton = false;
    body[0].style = `cursor:unset !important;`;
});

const changeTokenColor = (e) => {
    if (!endGame) {
        if (player == 1) {
            token[0].id = `p1`;

            token[0].style = `box-shadow:0 0 25px yellow`;
            setTimeout(() => {
                token[0].style = `animation: backlight2 2s infinite alternate,shake 4s infinite alternate`;
            }, 2000);

            user[0].innerHTML = "PLAYER <span style='color:cyan'>1</span>";
        } else if (player == 2) {
            token[0].id = `p2`;
            token[0].style = `box-shadow:0 0 25px yellow`;
            setTimeout(() => {
                token[0].style = `animation: backlight2 2s infinite alternate,shake 4s infinite alternate`;
            }, 2000);
            user[0].innerHTML =
                "PLAYER <span style='color:rgb(204, 0, 255) !important;'>2</span>";
        } else if (player == 0) {
            token[0].id = `p0`;
            user[0].innerHTML = "WELCOME";
        }
    } else {
        if (player == 1) {
            user[0].innerHTML = "PLAYER 2 WINS";
        } else if (player == 2) {
            user[0].innerHTML = "PLAYER 1 WINS";
        }
    }
};

changeTokenColor();

const drawCheck = () => {
    let emptySlots = 0;
    allDots.forEach((dot) => {
        if (dot.className === "dot") {
            emptySlots++;
        }
    });

    if (emptySlots === 0) {
        noWinner();
    }
};

const victoryCheck = () => {
    drawCheck();
    for (let i = allDots.length - 1; i >= 0; i--) {
        //////////////////////////// START CHECKING FOR VERTICAL VICTORIES///////////////////////////////////////

        if (allDots[i].className == `player${player}`) {
            if (i - 7 < 0 || i - 14 < 0 || i - 21 < 0) {
                return;
            }
            if (
                allDots[i].className == `player${player}` &&
                allDots[i - 7].className == `player${player}` &&
                allDots[i - 14].className == `player${player}` &&
                allDots[i - 21].className == `player${player}`
            ) {
                if (
                    allDots[i - 7].className &&
                    allDots[i - 14].className &&
                    allDots[i - 21].className
                ) {
                }
                allDots[i].className = `winner`;
                allDots[i - 7].className = `winner`;
                allDots[i - 14].className = `winner`;
                allDots[i - 21].className = `winner`;
                runVictoryEffects();
            }
            ///////////////////////////// END CHECKING FOR VERTICAL VICTORIES///////////////////////////////////////////

            ///////////////////////////// START CHECKING FOR HORIZONTAL VICTORIES//////////////////////////////////////

            for (let ii = 3; ii <= allDots.length - 1; ii++) {
                if (
                    allDots[ii].className == `player${player}` &&
                    allDots[ii - 1].className == `player${player}` &&
                    allDots[ii - 2].className == `player${player}` &&
                    allDots[ii - 3].className == `player${player}`
                ) {
                    if (
                        ///////////////////// START BLOCK SIDE COUNT /////////////////////
                        (ii >= 3 && ii <= 6) ||
                        (ii >= 10 && ii <= 13) ||
                        (ii >= 17 && ii <= 20) ||
                        (ii >= 24 && ii <= 27) ||
                        (ii >= 31 && ii <= 34) ||
                        (ii >= 38 && ii <= 41)
                        ///////////////////// END BLOCK SIDE COUNT /////////////////////
                    ) {
                        allDots[ii].className = `winner`;
                        allDots[ii - 1].className = `winner`;
                        allDots[ii - 2].className = `winner`;
                        allDots[ii - 3].className = `winner`;
                        runVictoryEffects();
                    }
                }
            }

            ///////////////////////////////// END CHECKING FOR HORIZONTAL VICTORIES//////////////////////////////////

            ///////////////////////////////// START CHECKING FOR DIAGONAL VICTORIES/////////////////////////////////
            for (let x = allDots.length - 1; x >= 24; x--) {
                if (
                    allDots[x].className == `player${player}` &&
                    allDots[x - 8].className == `player${player}` &&
                    allDots[x - 16].className == `player${player}` &&
                    allDots[x - 24].className == `player${player}`
                ) {
                    if (
                        ///////////////////// START BLOCK SIDE COUNT /////////////////////
                        (x >= 38 && x <= 41) ||
                        (x >= 31 && x <= 34) ||
                        (x >= 24 && x <= 27)
                        ///////////////////// END BLOCK SIDE COUNT /////////////////////
                    ) {
                        allDots[x].className = `winner`;
                        allDots[x - 8].className = `winner`;
                        allDots[x - 16].className = `winner`;
                        allDots[x - 24].className = `winner`;
                        runVictoryEffects();
                    }
                }
            }
            for (let x = allDots.length - 1; x >= 21; x--) {
                if (
                    allDots[x].className == `player${player}` &&
                    allDots[x - 6].className == `player${player}` &&
                    allDots[x - 12].className == `player${player}` &&
                    allDots[x - 18].className == `player${player}`
                ) {
                    if (
                        ///////////////////// START BLOCK SIDE COUNT /////////////////////
                        (x >= 35 && x <= 38) ||
                        (x >= 28 && x <= 31) ||
                        (x >= 21 && x <= 24)
                        ///////////////////// END BLOCK SIDE COUNT /////////////////////
                    ) {
                        allDots[x].className = `winner`;
                        allDots[x - 6].className = `winner`;
                        allDots[x - 12].className = `winner`;
                        allDots[x - 18].className = `winner`;
                        runVictoryEffects();
                    }
                }
            }
            //////////////////////////////// END CHECKING FOR DIAGONAL VICTORIES/////////////////////////////////////
        }
    }
};

document.addEventListener("mouseover", function (e) {
    // console.log(e.clientX, e.clientY);
    // console.log(e)
    // if(endGame){
    //     document.addEventListener("mousemove", function (e) {
    //     if (e.target.id === "p1" || e.target.id === "p2") {
    //       e.target.style = `margin-top:0; position:fixed; top:${
    //           e.clientY - (e.clientY + e.screenY)
    //       }px; left:${e.clientX + 5}px`;
    //     }
    // })}
});

document.addEventListener("click", function (e) {
    if (e.target.className === "mute") {
        e.target.className = "play";
        letMusicPlay = true;
        audio[0].play();
    } else if (e.target.className === "play") {
        e.target.className = "mute";
        letMusicPlay = false;
        audio[0].pause();
    }
    if (e.target.className === "clear") {
        this.location.reload();
    }
});

const introHeadlineEffect = () => {
    if (headlineIntroFXCounter < headline[0].children.length) {
        setTimeout(() => {
            headline[0].children[
                headlineIntroFXCounter
            ].style = `visibility:visible`;
            headlineIntroFXCounter++;
            introHeadlineEffect();
        }, 100);
    }
};

introHeadlineEffect();

const startGameHeadlineEffect = (e) => {
    if (headlineStartGameFXCounter < headline[0].children.length) {
        headline[0].children[
            headlineStartGameFXCounter
        ].style = `    animation: backlight2 1s infinite ease-in-out; visibility:visible;`;
        headlineStartGameFXCounter++;
        setTimeout(() => {
            if (headline[0].children[headlineStartGameFXCounter]) {
                headline[0].children[
                    headlineStartGameFXCounter
                ].style = `animation: backlight2 1s infinite ease-in-out;`;
            }
            startGameHeadlineEffect();
        }, 50);
    }
};

const victoryHeadlineEffect = (e) => {
    setTimeout(() => {
        if (headline[0].children[headlineVictoryFXCounter]) {
            headline[0].children[
                headlineVictoryFXCounter
            ].style = `animation:textDot 1s infinite ; visibility:visible;`;
            headlineVictoryFXCounter++;
        }
        victoryHeadlineEffect();
    }, 50);
};

const runVictoryEffects = () => {
    endGame = true;
    audio[0].volume = 0.5;
    audio[0].currentTime = 65.5;
    myAudioVictory.play();
    clear[0].style = "margin-top:2vmax";
    setTimeout(() => {
        audio[0].volume = 0.6;
    }, 3000);
    setDotHoverFX();
    victoryHeadlineEffect();
    hand[0].style = ` background-image: url("./assets/handsOpen.png");  width:12vw !important; margin-top:0; margin-bottom:1vmax;   animation: fadeIn 1.5s;  height:22vh !important;`;
    user[0].style = `margin-bottom:2vmax; text-align:center; margin-left:0;`;

    ///////////////////////////////////////////////////////////// START MUSIC ANIMATION FX////////////////////////////////////////////////
    gameBoard[0].style = `animation: backLight 2s infinite alternate`;

    if (!letMusicPlay) {
        gameBoard[0].style = `animation: backLight 0.5s infinite alternate`;
        token[0].style = `animation:shake 6s infinite ease-in-out !important, backlight2 2.5s infinite ease-in-out; !important`;
    } else {
        setTimeout(() => {
            token[0].style = `box-shadow:0 0 50px  rgba(255, 255, 255)!important;`;
        }, 100);
        setTimeout(() => {
            token[0].style = `animation:shakeHover 6s infinite ease-in-out, backlight2 2.5s infinite ease-in-out; !important`;
        }, 500);
        setTimeout(() => {
            gameBoard[0].style = `animation: backLight 1s infinite alternate`;
            token[0].style = `animation:shakeHover 4s infinite ease-in-out, backlight2 2.5s infinite ease-in-out; !important`;
        }, 3000);
        setTimeout(() => {
            token[0].style = `box-shadow:0 0 50px yellow`;
            gameBoard[0].style = `animation: backLight 0.5s infinite alternate`;
        }, 6000);
        setTimeout(() => {
            token[0].style = `cursor:none; animation: shake 6s infinite ease-in-out, backlight3 2.5s infinite ease-in-out; !important`;
        }, 7500);
        setTimeout(() => {
            gameBoard[0].style = `animation: backLight 0.2s infinite`;
        }, 27000);
    }

    /////////////////////////////////////////////////////////////END MUSIC ANIMATION FX////////////////////////////////////////////////
};

const noWinner = () => {
    clear[0].style = "margin-top:0vmax";
    endGame = true;
    gameBoard[0].style = `animation: backLight 4s infinite`;
    victoryHeadlineEffect();
    user[0].remove();
    hand[0].remove();
    token[0].id = "draw";
    controlsTop[0].style = `min-height:unset;`;
    controls[0].style = `justify-content:center; visibility:visible; `;
    elem.className = "draw";
    elem.innerHTML = "DRAW";
    controlsTop[0].prepend(elem);
    myAudioDraw.play();
};

const setDotHoverFX = () => {
    document.addEventListener("mouseover", function (e) {
        let color = e.target.color;
        if (
            e.target.className == "dot" ||
            e.target.className == "player1" ||
            e.target.className == "player2"
        ) {
            allDots[e.target.id - 1].style =
                "background-color:unset !important";

            setTimeout(() => {
                allDots[e.target.id - 1].style = `${color} !important`;
            }, 500);
        }
    });
};

let seconds = 1;
let minutes = 0;
const gameTimeCount = () => {
    if (endGame) {
        return;
    }
    setTimeout(() => {
        if (seconds >= 59) {
            minutes++;
        }
        seconds++;
        gameTimeCount();
    }, 1000);
    if (seconds >= 60) {
        seconds = 0;
    }
    if (minutes >= 0) {
        desc[0].innerHTML = `TIME ELAPSED <div>${minutes} MIN  ${seconds} SEC</div>`;
          desc[0].style = `height:unset; animation:none !important;`;
    } else {
        desc[0].innerHTML = `TIME ELAPSED <div> SEC ${seconds}</div>`;
      
    }
    if (minutes >= 1) {
           desc[0].style = `height:unset; animation: textDot 1s infinite ease-in-out`;
    }
};
