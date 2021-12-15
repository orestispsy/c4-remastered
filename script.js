var body = document.querySelectorAll("body");
var gameBoard = document.querySelectorAll(".gameBoard");
var elem = document.createElement("div");
var dot = document.createElement("div");
var token = document.querySelectorAll(".token");
var user = document.querySelectorAll(".user");
var desc = document.querySelectorAll(".description");
var clear = document.querySelectorAll(".clear");
var play = document.querySelectorAll(".play");
var controls = document.querySelectorAll(".controls");
var controlsTop = document.querySelectorAll(".controlsTop");
var headline = document.querySelectorAll(".headline");
var audio = document.querySelectorAll(".audio");
var hand = document.querySelectorAll(".hand");
var block = document.querySelectorAll(".blockScreen");
var arrow = document.querySelectorAll(".arrow");
var refresh = document.querySelectorAll(".refresh");
var gameMode = document.querySelectorAll(".gameMode");
var p1Total = document.querySelectorAll(".p1Total");
var p2Total = document.querySelectorAll(".p2Total");
var totalWinsHead = document.querySelectorAll(".totalWinsHead");
var gameVersusCPU = false;
var endGame = false;
var goButton = false;
var player = 0;
var createDotsCounter = 1;
var updateDotsCounter = 0;
var headlineIntroFXCounter = 0;
var headlineStartGameFXCounter = 0;
var headlineVictoryFXCounter = 0;
var box;
var columns = {};
var count = 0;

var allDots;
var myAudio = new Audio("./assets/throw.mp3");
var myAudioVictory = new Audio("./assets/victory.mp3");
var myAudioDraw = new Audio("./assets/draw.mp3");
var letMusicPlay = true;
var firstClick = 0;
var warning4Victory = false;
var lastMove;
var lastMoveHelper;
let seconds = 1;
let minutes = 0;
var player1Total = 0;
var player2Total = 0;

audio[0].volume = 0.6;
myAudioVictory.volume = 0.4;

//////////////////////////////////// Start CREATE BOARD //////////////////////////////

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

const updateDots = () => {
    if (updateDotsCounter < 42) {
        allDots[updateDotsCounter].className = "dot";

        updateDotsCounter++;
        setTimeout(() => {
            updateDots();
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
    controls[0].style = `visibility:visible;animation:fadeIn 2s;`;
}, 800);

setTimeout(() => {
    buildColumns();
    allDots = document.querySelectorAll(".dot");
}, 1500);

///////////////////////////////////////// End CREATE BOARD /////////////////////////////////

const setPlayerMove = (e) => {
    if (letMusicPlay) {
        audio[0].play();
        play[0].style = `visibility:visible`;
        startGameHeadlineEffect();
    }

    clear[0].innerHTML = "Clear Board";
    refresh[0].style = `margin:0.5vmax; width:3vmax; height:3vmax;`;
    for (let j = 1; j <= 7; j++) {
        for (let jj = 5; jj >= 0; jj--) {
            if (columns[j][jj].id && columns[j][jj].id == e) {
                let index = columns[j].findIndex((x) => {
                    return x.id == e;
                });

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
                            filteredSlots[i].style = `background-color:orange`;
                        }
                    }, 300);

                    if (player == 1) {
                        filteredSlots.reverse()[0].className = "player1";
                        lastMove = Number(filteredSlots[0].id);
                        victoryCheck();
                        if (gameVersusCPU) {
                            runCPU();
                        }

                        console.log(lastMove);
                        player = 2;
                    } else {
                        filteredSlots.reverse()[0].className = "player2";

                        victoryCheck();

                        player = 1;
                    }
                }
            }
        }
    }
};

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

const setGameMode = () => {
    gameMode[0].innerHTML = "";
    gameMode[0].style = "width:0; height:0; margin:0";
    arrow[0].style = `    width: 3vmax;
    height: 3vmax;`;
    desc[0].innerHTML = `
         TO START CLICK OVER THE SLOTS OF THE BOARD, OR DRAG THE DOT ABOVE
            <span>CONNECT 4 SAME DOTS IN THREE WAYS: VERTICALLY,
                        HORIZONTALLY OR DIAGONALLY</span
                    >
                    <span>ENJOY PLAYING</span>`;
    block[0].style = `width:0; height:0;`;
};

const clearBoard = () => {
    endGame = false;
    goButton = false;
    player = 0;
    createDotsCounter = 1;
    updateDotsCounter = 0;
    headlineIntroFXCounter = 0;
    headlineStartGameFXCounter = 0;
    headlineVictoryFXCounter = 0;

    count = 0;
    updateDots();
    introHeadlineEffect();
    audio[0].currentTime = 0;
    seconds = 0;
    minutes = 0;
    hand[0].style = `    background-image: url("./assets/hand.png");

    width: 12vw;
    height: 11vh;`;
    clear[0].innerHTML = "Clear Board";
    clear[0].style = `animation:none`;
    gameBoard[0].style = `background-color:black; animation:none !important`;
    desc[0].style = `height:unset; width: 12vw; text-align:center`;
    desc[0].innerHTML = `CLEANING THE BOARD`;
    setTimeout(() => {
        changeTokenColor();
    }, 200);
    setTimeout(() => {
        player = 1;
        endGame = false;
        gameTimeCount();
        changeTokenColor();
    }, 1500);
};

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
    p1Total[0].style = `width:7vh;height:7vh; border:1px solid yellow`;
    p2Total[0].style = `width:7vh;height:7vh; border:1px solid yellow`;
    if (player === 1) {
        player1Total++;
        p1Total[0].innerHTML = `${player1Total}`;
        p2Total[0].innerHTML = `${player2Total}`;
        totalWinsHead[0].innerHTML = "SCORE";
        totalWinsHead[0].style = "margin:1vmax";
    } else {
        player2Total++;
        p1Total[0].innerHTML = `${player1Total}`;
        p2Total[0].innerHTML = `${player2Total}`;
    }
    endGame = true;
    audio[0].volume = 0.5;
    audio[0].currentTime = 65.5;
    myAudioVictory.play();
    clear[0].innerHTML = `Next Round`;
    clear[0].style = " animation: textDot 2s infinite alternate";
    setTimeout(() => {
        audio[0].volume = 0.6;
    }, 3000);
    // setDotHoverFX();
    victoryHeadlineEffect();
    hand[0].style = ` background-image: url("./assets/handsOpen.png");  width:12vw !important; margin-top:0;  animation: fadeIn 1.5s;  height:22vh !important;`;
    user[0].style = `margin-bottom:2vmax; text-align:center; margin-left:0; `;

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
                if (endGame){
            token[0].style = `animation:shakeHover 6s infinite ease-in-out, backlight2 2.5s infinite ease-in-out; !important`;}
        }, 500);
        setTimeout(() => {
            if (endGame) {
                gameBoard[0].style = `animation: backLight 1s infinite alternate`;
                token[0].style = `animation:shakeHover 4s infinite ease-in-out, backlight2 2.5s infinite ease-in-out; !important`;
            }
        }, 3000);
        setTimeout(() => {
                if (endGame){
            token[0].style = `box-shadow:0 0 50px yellow`;
            gameBoard[0].style = `animation: backLight 0.5s infinite alternate`;}
        }, 6000);
        setTimeout(() => {
            if (endGame) {
                token[0].style = `cursor:none; animation: shake 6s infinite ease-in-out, backlight3 2.5s infinite ease-in-out; !important`;
            }
        }, 7500);
        setTimeout(() => {
            if (endGame) {
                gameBoard[0].style = `animation: backLight 0.2s infinite`;
            }
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

// const setDotHoverFX = () => {
//     document.addEventListener("mouseover", function (e) {
//         let color = e.target.color;
//         if (
//             e.target.className == "dot" ||
//             e.target.className == "player1" ||
//             e.target.className == "player2"
//         ) {
//             allDots[e.target.id - 1].style =
//                 "background-color:unset !important";

//             setTimeout(() => {
//                 allDots[e.target.id - 1].style = `${color} !important`;
//             }, 500);
//         }
//     });
// };

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
    if (minutes >= 1) {
        desc[0].innerHTML = `TIME ELAPSED <div>${minutes} MIN  ${seconds} SEC</div>`;
        desc[0].style = `height:unset; animation: textDot 1s infinite ease-in-out`;
    } else {
        desc[0].innerHTML = `TIME ELAPSED <div>${seconds} SEC</div>`;
        desc[0].style = `height:unset; animation:none !important;`;
    }
};

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
        clearBoard();
        if (clear[0].innerHTML === "Next Round") {
            clear[0].style = `visibility:invisible`;
        }
    }

    if (e.target.className === "modeOption1v1") {
        setGameMode();
    }

    if (e.target.className === "modeOption1vCPU") {
        setGameMode();
        gameVersusCPU = true;
    }

    if (e.target.className === "refresh") {
        this.location.reload();
    }
});

///////////////////////////////////////// Start THROW / DRAG TOKEN EFFECTS /////////////////////////////////

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
            arrow[0].style = "height:0; width:0;";
        }
        goButton = true;

        body[0].style = `cursor:none !important;`;
        document.addEventListener("mousemove" || "mouseup", function (ev) {
            if (goButton) {
                ///////////////////// COLUMN HOVER LIGHT FX/////////////////////
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
                ///////////////////// COLUMN HOVER LIGHT FX/////////////////////

                ///////////////////// TOKEN DRAG FX/////////////////////
                if (e.target.className === "token") {
                    e.target.style = `margin-top:0; position:fixed; top:${
                        ev.pageY + e.screenY * 0.01
                    }px; left:${ev.clientX - e.clientX * 0.02}px`;
                }

                ///////////////////// TOKEN DRAG FX/////////////////////
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
            ///////////////////////////////////////// Start CHECK EMPTY SLOTS & PLAY  ////////////////////////////////

            setPlayerMove(e.target.id);
        }
    }
    token[0].style = `position:unset; `;
    changeTokenColor();
    goButton = false;
    body[0].style = `cursor:unset !important;`;

    ///////////////////////////////////////// End CHECK EMPTY SLOTS & PLAY  ////////////////////////////////
});

///////////////////// RESPONSIVE DRAG FX/////////////////////
document.addEventListener("touchmove", function (e) {
    if (e.target.className === "token" && e.target.id !== "p0") {
        e.target.style = `margin-top:0; position:fixed; top:${
            e.touches[0].clientY - 25
        }px; left:${e.touches[0].clientX - 25}px`;
    }
});

document.addEventListener("touchstart", function (e) {
    if (firstClick && e.target.className === "token") {
        goButton = true;
    }
});
///////////////////////////////////////// Start CHECK EMPTY SLOTS & PLAY  ////////////////////////////////
document.addEventListener("touchend", function (e) {
    if (firstClick && goButton) {
        console.log(allDots[6].offsetTop, allDots[6].offsetLeft);
        for (let ii = allDots.length - 1; ii >= 0; ii--) {
            console.log(ii);

            if (
                allDots[ii].offsetLeft + 2 * e.target.clientWidth + 30 >
                    e.target.offsetLeft + e.target.clientWidth + 30 &&
                e.target.offsetLeft + e.target.clientWidth + 30 >
                    allDots[ii].offsetLeft + 2 * e.target.clientWidth - 30 &&
                allDots[ii].offsetTop + 35 > e.target.offsetTop &&
                e.target.offsetTop > allDots[ii].offsetTop - 35
            ) {
                setPlayerMove(Number(allDots[ii].id));
            }

            setTimeout(() => {
                changeTokenColor();
                goButton = false;
                body[0].style = `cursor:unset !important;`;
                token[0].style = `position:unset; `;
            }, 100);
        }
        if (e.target.className === "token") {
        }
        goButton = false;
    }
});
///////////////////////////////////////// End CHECK EMPTY SLOTS & PLAY  ////////////////////////////////
///////////////////// RESPONSIVE DRAG FX/////////////////////

///////////////////////////////////////// End THROW / DRAG TOKEN EFFECTS ////////////////////////////////

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
                        ///////////////////// BLOCK SIDE COUNT /////////////////////
                        (ii >= 3 && ii <= 6) ||
                        (ii >= 10 && ii <= 13) ||
                        (ii >= 17 && ii <= 20) ||
                        (ii >= 24 && ii <= 27) ||
                        (ii >= 31 && ii <= 34) ||
                        (ii >= 38 && ii <= 41)
                        ///////////////////// BLOCK SIDE COUNT /////////////////////
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
                    allDots[x - 7].className == `player${player}` &&
                    allDots[x - 14].className == `player${player}`
                ) {
                    console.log("WARNING", x - 14);
                    warning4Victory = Number(allDots[x - 14].id);
                    lastMoveHelper = Number(allDots[x - 21].id);
                }
                if (
                    allDots[x].className == `player${player}` &&
                    allDots[x - 8].className == `player${player}` &&
                    allDots[x - 16].className == `player${player}` &&
                    allDots[x - 24].className == `player${player}`
                ) {
                    if (
                        ///////////////////// BLOCK SIDE COUNT /////////////////////
                        (x >= 38 && x <= 41) ||
                        (x >= 31 && x <= 34) ||
                        (x >= 24 && x <= 27)
                        ///////////////////// BLOCK SIDE COUNT /////////////////////
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
                    allDots[x - 1].className == `player${player}` &&
                    allDots[x - 2].className == `player${player}`
                ) {
                    console.log("WARNING", x - 2);
                    warning4Victory = Number(allDots[x - 2].id);
                    lastMoveHelper = Number(allDots[x - 3].id);
                }
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

const runCPU = () => {
    if (!endGame) {
        block[0].style = `width:100vw; height:100vh;`;
        let countCC = 1;

        setTimeout(() => {
            let random = -Math.floor(Math.random() * 7 - 2);
            if (random === 0) {
                random = -Math.floor(Math.random() * 7 - 2);
            }

            let helper = [];
            console.log(lastMove);

            if (lastMove - 3 < 0) {
                allDots.forEach((dot) => {
                    if (dot.className === "dot") {
                        helper.push(dot);
                    }
                });
                helper[helper.length - 1].className = "player2";
            } else if (
                allDots[lastMove - 2] &&
                allDots[lastMove - 2].className === "dot"
            ) {
                allDots.forEach((dot) => {
                    if (dot.className === "dot") {
                        helper.push(dot);
                    }
                });
                console.log("warn", warning4Victory, "lst", lastMove);
                if (warning4Victory === lastMove) {
                    if (warning4Victory + 2 === lastMove + 2) {
                        console.log("HELPER", lastMoveHelper);
                        if (
                            allDots[lastMoveHelper + 6] &&
                            allDots[lastMoveHelper + 6].className === "dot"
                        ) {
                            allDots[lastMoveHelper + 6].className = "player2";
                        } else {
                            allDots[lastMoveHelper - 1].className = "player2";
                        }
                    } else if (
                        allDots[lastMove - 2].className &&
                        allDots[lastMove - 2].className === "dot"
                    ) {
                        if (warning4Victory + 3 === lastMove + 3) {
                            allDots[lastMove + 2].className = "player2";
                        }
                        if (allDots[lastMoveHelper + 7].className === "dot") {
                            allDots[lastMoveHelper + 7].className = "player2";
                        } else {
                            allDots[lastMoveHelper - 1].className = "player2";
                        }
                    } else if (allDots[lastMove - 8].className === "dot") {
                        allDots[lastMove - 8].className = "player2";
                    }
                } else if (
                    lastMove <= 33 &&
                    allDots[lastMove + 8].className === "dot"
                ) {
                    helper[helper.length - 1].className = "player2";
                } else if (
                    allDots[lastMove - 8] &&
                    allDots[lastMove - 8].className === "dot"
                ) {
                    helper[helper.length - 1].className = "player2";
                } else {
                    allDots[lastMove - 2].className = "player2";
                }
            } else if (allDots[lastMove - 1].className === "dot") {
                allDots[lastMove - 1].className = "player2";
            } else if (
                allDots[lastMove - 8] &&
                allDots[lastMove - 8].className === "dot"
            ) {
                allDots[lastMove - 8].className = "player2";
            } else {
                allDots.forEach((dot) => {
                    if (dot.className === "dot") {
                        helper.push(dot);
                    }
                });
                console.log("helper", helper);
                helper[helper.length - 1].className === "dot";
            }
            if (letMusicPlay) {
                myAudio.play();
            }
            victoryCheck();
            player = 1;

            changeTokenColor();
            block[0].style = `width:0; height:0;`;
        }, 2000);
    }
};
