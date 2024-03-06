const cursor = document.querySelector(".cursor");
var timeout;

document.addEventListener("mousemove", (e) => {
    let x = e.pageX;
    let y = e.pageY;

    cursor.style.top = y + "px";
    cursor.style.left = x + "px";
    cursor.style.display = "block";

    function mouseStopped() {
        cursor.style.display = "none";
    }
    clearTimeout(timeout);
    timeout = setTimeout(mouseStopped, 2000);
});

document.addEventListener("mouseout", () => {
    cursor.style.display = "none";
});

var menu = document.getElementById("menu");

function showControl() {
    menu.remove();
    var con = document.createElement("img");
    var scoreLine = document.createElement("img");

    con.src = "img/controls.png";
    con.className = "controls";
    home.appendChild(con);

    scoreLine.src = "img/score.png";
    scoreLine.className = "scoreLine";
    home.appendChild(scoreLine);
    createBackBtn();
}

var backBtn = document.createElement("button");

function createBackBtn() {
    backBtn.className = "button backBtn";
    backBtn.innerHTML = "Back";

    backBtn.onclick = function() {
        window.location = "index.html";
    }
    home.appendChild(backBtn);
}

function showAbout() {
    menu.remove();
    var about = document.createElement("img");
    about.src = "img/about.png";
    about.className = "about";
    home.appendChild(about);
    createBackBtn();
}

//_GAME_
var backImg = document.createElement("div");
var manTag = document.createElement("div");
var scoreTag = document.createElement("h2");
var lifeTag = document.createElement("div");
var powerTag = document.createElement("div");
var ammoTag = document.createElement("div");

var home = document.getElementById("home");

var body = document.getElementById("body");

var manBackPositionX = 0;
var manBackPositionY = 0;
var manIdelAnimationId = 0;

var alienBackPositionX = 0;

var manDeadAnimationState = false;

var lifeWidth = 768;
var lifeState = false;

function newGame() {
    var a = new Audio("sound/GameStart.mp3");
    a.play();

    home.remove();

    body.appendChild(backImg);
    backImg.style.backgroundImage = "url(img/futuristic_city.png)";
    backImg.className = "boxx";

    manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_idle.png)";
    manTag.className = "man";
    backImg.appendChild(manTag);

    manIdelAnimationId = setInterval(manIdelAnimation, 110);

    scoreTag.innerHTML = "0";
    scoreTag.className = "score";
    backImg.appendChild(scoreTag);

    lifeTag.className = "life";
    backImg.appendChild(lifeTag);

    powerTag.className = "power";
    backImg.appendChild(powerTag);

    ammoTag.className = "ammo";
    backImg.appendChild(ammoTag);

    setInterval(function() {
        var gun = document.createElement("div");
        gun.className = "gun";
        gun.style.marginLeft = "1300px";
        backImg.appendChild(gun);

        setInterval(function() {
            var g = parseInt(gun.style.marginLeft) - 10;
            gun.style.marginLeft = g + "px";

            if (g > 250 && g < 400) {
                if (manMarginTop < 62) {
                    gun.remove();
                    ammoBarImgNum = 6;
                    ammoTag.style.backgroundImage = "url(sprite/ammo/ammo_" + ammoBarImgNum + ".png)";
                    var a = new Audio("sound/gun.mp3");
                    a.play();
                }
            }
        }, 100);
    }, 20000);

    //==================--------------------------------------------------------
    makeAlienId = setInterval(function() {
        if (countAlien <= 10) {
            var alienDead = false;

            lifeState = false;
            var alien = document.createElement("div");
            alien.className = "alien";
            alien.style.marginLeft = "1200px";
            backImg.appendChild(alien);
            setInterval(function() {
                alienBackPositionX = alienBackPositionX - 573;
                alien.style.backgroundPositionX = alienBackPositionX + "px";
            }, 150);

            var x = Math.floor(Math.random() * 100);
            if (x == 0) {
                x = Math.floor(Math.random() * 100);
            }
            if (x > 80) {
                x = 80;
            }
            alienFlyAnimationId[countAlien] = setInterval(function() {
                if (alienDead == false) {
                    var n = parseInt(alien.style.marginLeft) - x;
                    alien.style.marginLeft = n + "px";
                }

                if (n < 400) {
                    if (shootAnimationState == true) {
                        alien.remove();
                        alienDead = true;
                    }
                }

                if (-160 <= (manMarginLeft - n) && 0 >= (manMarginLeft - n)) {
                    if (manMarginTop >= 70) {

                        if (lifeState == false) {
                            lifeEndSound();
                            lifeWidth = lifeWidth - 256;
                            if (lifeWidth == 512) {
                                lifeTag.style.marginLeft = 75 + "%";
                            }
                            if (lifeWidth == 256) {
                                lifeTag.style.marginLeft = 80 + "%";
                            }
                            lifeTag.style.width = lifeWidth + "px";
                            lifeState = true;
                        }
                        if (lifeWidth == -256) {
                            clearInterval(backgroundAnimationId);
                            if (manJumpAnimationState == true) {
                                clearInterval(manJumpAnimationId);
                                manJumpAnimationState = false;
                            }
                            manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_die.png)";

                            clearInterval(makeAlienId);
                            clearInterval(powerBarAnimationId);

                            for (var s = 1; s < 11; s++) {
                                clearInterval(alienFlyAnimationId[s]);
                            }

                            setInterval(function() {
                                if (manBackPositionX == -2768) {
                                    clearInterval(manIdelAnimationId);
                                    gameOverPage();
                                }
                                setInterval(flyMotionDown, 50);
                            }, 110);


                        }

                    }
                }
            }, 150);

            countAlien = countAlien + 1;
        } else {
            clearInterval(makeAlienId);
        }
    }, 4000);
    //=======================-----------------------------------------------------
}

var makeAlienId = 0;
var alienFlyAnimationId = [];
var countAlien = 1;

function manIdelAnimation() {

    manBackPositionX = manBackPositionX - 692;
    manTag.style.backgroundPositionX = manBackPositionX + "px";
    if (manBackPositionX == -3460) {
        manBackPositionX = 0;
        manBackPositionY = manBackPositionY - 599;
        manTag.style.backgroundPositionY = manBackPositionY + "px";
    }
    if (powerImgNum == 1) {
        pressDown();
    }
}

var backImgPositionX = 0;
var manRunAnimationId = 0;
var manRunState = false;
var manFlyMoveState = false;
var manJumpState = false;
var manFlyNoMoveState = false;

var manJumpAnimationId = 0;

function keyAnimation(event) {
    var key = event.which;

    if (key == 68) {

        if (manFlyNoMoveState == true) {
            manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_flying.png)";
            manFlyMoveState = true;
            manFlyNoMoveState = false;

            if (backgroundAnimationState == false) {
                backgroundAnimationId = setInterval(backgroundAnimation, 50);
                backgroundAnimationState = true;
            }
        }

        if (manRunState == false && manFlyMoveState == false) {
            manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_run.png)";
            manRunState = true;

            if (backgroundAnimationState == false) {
                backgroundAnimationId = setInterval(backgroundAnimation, 50);
                backgroundAnimationState = true;
            }
        }
    }

    if (key == 65) {
        if (manFlyMoveState == true) {
            manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_flying_no_movement.png)";
            manFlyNoMoveState = true;
            manRunState = false;

            clearInterval(backgroundAnimationId);
            backgroundAnimationState = false;
        }

        if (manRunState == true) {
            clearInterval(backgroundAnimationId);
            backgroundAnimationState = false;

            manRunState = false;
            manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_idle.png)";

            manFlyMoveState = false;
        }
    }

    if (key == 32) {
        if (manFlyMoveState == false && manFlyNoMoveState == false) {
            clearInterval(manIdelAnimationId);
            var a = new Audio("sound/jump.mp3");
            a.play();

            if (manJumpAnimationState == false) {
                manJumpAnimationId = setInterval(manJumpAnimation, 110);
            }
            manJumpAnimationState = true;

            if (backgroundAnimationState == false) {
                backgroundAnimationId = setInterval(backgroundAnimation, 50);
                backgroundAnimationState = true;
            }
        }
    }

    if (key == 87) {
        if (powerImgNum > 1) {
            if (manJumpAnimationState == false && manDeadAnimationState == false) {

                if (manRunState == true) {
                    manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_flying.png)";
                    manFlyMoveState = true;
                    manRunState = false;
                    powerBarAnimationStart();
                    jetFlySound();
                }
                if (manRunState == false && manFlyMoveState == false) {
                    manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_flying_no_movement.png)";
                    manFlyNoMoveState = true;
                    manRunState = false;
                    powerBarAnimationStart();
                    jetFlySound();
                }

                if (flyMotionDownState == false && flyMotionUpState == false) {
                    flyMotionUpId = setInterval(flyMotionUp, 50);
                    flyMotionUpState = true;
                }
            }
        }
    }

    if (key == 83) {
        pressDown();
    }

    if (key == 69) {
        if (shootAnimationState == false) {
            if (manFlyMoveState == false && manFlyNoMoveState == false && (ammoBarImgNum >= 2)) {
                shootAnimationState = true;
                ammoBarAnimation();

                var a = new Audio("sound/shoot.mp3");
                a.play();

                shootAnimationId = setInterval(function() {
                    shootImgNum = shootImgNum + 1;
                    manTag.style.backgroundImage = "url(sprite/shoot/shoot_" + shootImgNum + ".png)";

                    if (shootImgNum == 5) {
                        clearInterval(shootAnimationId);
                        shootAnimationState = false;
                        shootImgNum = 0;
                        if (manRunState == true) {
                            manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_run.png)";
                        } else {
                            manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_idle.png)";
                        }
                    }
                }, 100);
            }
        }
    }
}

var ammoBarImgNum = 1;

function ammoBarAnimation() {
    ammoBarImgNum = ammoBarImgNum - 1;
    ammoTag.style.backgroundImage = "url(sprite/ammo/ammo_" + ammoBarImgNum + ".png)";
}

var shootImgNum = 0;
var shootAnimationId = 0;
var shootAnimationState = false;

function jetFlySound() {
    var a = new Audio("sound/JetFly.mp3");
    a.play();
}

function pressDown() {
    if (flyMotionDownState == false && flyMotionUpState == false) {
        flyMotionDownId = setInterval(flyMotionDown, 50);
        flyMotionDownState = true;

        if (manFlyMoveState == true) {
            manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_run.png)";
            manFlyMoveState = false;
            manRunState = true;
            powerBarAnimationStart();
        }

        if (manFlyNoMoveState == true) {
            manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_idle.png)";
            manFlyNoMoveState = false;
            manRunState = false;
            powerBarAnimationStart();
        }
    }
}

//power bar animation...

var powerImgNum = 10;
var powerBarAnimationId = 0;
var powerbarState = false;

function powerBarAnimationStart() {
    if (powerbarState == false) {
        powerBarAnimationId = setInterval(powerBarAnimation, 2000);
        powerbarState = true;
    }
}

function powerBarAnimation() {
    if (manFlyMoveState == true || manFlyNoMoveState == true) {
        if (powerImgNum >= 2) {
            powerImgNum = powerImgNum - 1;
            powerTag.style.backgroundImage = "url(sprite/power/powerbar_" + powerImgNum + ".png)";
        }
        if (powerImgNum == 1) {
            clearInterval(powerBarAnimationId);
            powerbarState = false;
            pressDown();
            var a = new Audio("sound/EnergyOver.mp3");
            a.play();
        }
    } else {

        if (powerImgNum <= 9) {
            powerImgNum = powerImgNum + 1;
            powerTag.style.backgroundImage = "url(sprite/power/powerbar_" + powerImgNum + ".png)";
        }

        if (powerImgNum == 10) {
            clearInterval(powerBarAnimationId);
            powerbarState = false;
        }
    }
}

var imgNum = -1;
var manMarginTop = 212;
var manMarginLeft = 0;

var manJumpAnimationState = false;

function manJumpAnimation() {

    imgNum = imgNum + 1;

    manTag.style.backgroundImage = "url(sprite/jump/jump" + imgNum + ".png)";

    if (imgNum <= 4) {
        manMarginTop = manMarginTop - 50;
    } else {
        manMarginTop = manMarginTop + 50;
    }
    manTag.style.marginTop = manMarginTop + "px";

    manMarginLeft = manMarginLeft + 20;
    manTag.style.marginLeft = manMarginLeft + "px";

    if (imgNum == 9) {
        clearInterval(manJumpAnimationId);
        imgNum = -1;
        manIdelAnimationId = setInterval(manIdelAnimation, 110);
        manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_run.png)";
        manRunState = true;
        manJumpAnimationState = false;
        manTag.style.marginTop = "220px";

        if (manAfterJumpState == false) {
            manAfterJumpAnimationId = setInterval(function() {
                manAfterJumpState = true;
                if (manMarginLeft == 0) {
                    clearInterval(manAfterJumpAnimationId);
                    manAfterJumpState = false;
                }
                manMarginLeft = manMarginLeft - 20;
                manTag.style.marginLeft = manMarginLeft + "px";
            }, 120);
        }
    }
}

var manAfterJumpAnimationId = 0;
var manAfterJumpState = false;

var backgroundAnimationId = 0;
var backgroundAnimationState = false;

var score = 0;

function backgroundAnimation() {
    backImgPositionX = backImgPositionX - 8;
    backImg.style.backgroundPositionX = backImgPositionX + "px";
    score = score + 1;
    scoreTag.innerHTML = score;

    if (score > 1000 && score < 2000) {
        backImg.style.backgroundImage = "url(img/japan.png)";


        if (makeNinjaId == 0) {
            ninjaBackPositionX = 0;
            makeNinjaId = setInterval(function() {
                if (countNinja <= 9) {
                    var ninjaDead = false;

                    lifeState = false;
                    var ninja = document.createElement("div");
                    ninja.className = "ninja";
                    ninja.style.marginLeft = "1200px";
                    backImg.appendChild(ninja);
                    setInterval(function() {
                        ninjaBackPositionX = ninjaBackPositionX - 363;
                        ninja.style.backgroundPositionX = ninjaBackPositionX + "px";
                    }, 150);

                    var x = Math.floor(Math.random() * 100);
                    if (x == 0 && x < 10) {
                        x = Math.floor(Math.random() * 100);
                    }
                    if (x > 80) {
                        x = 80;
                    }
                    ninjaRunAnimationId[countNinja] = setInterval(function() {
                        if (ninjaDead == false) {
                            var n = parseInt(ninja.style.marginLeft) - x;
                            ninja.style.marginLeft = n + "px";
                        }
                        if (n < 400) {
                            if (shootAnimationState == true) {
                                ninja.remove();
                                ninjaDead = true;
                            }
                        }

                        if (-200 <= (manMarginLeft - n) && 0 >= (manMarginLeft - n)) {
                            if (manMarginTop >= 70) {

                                ninja.style.backgroundImage = "url(sprite/ninjaAttack.png)";

                                if (lifeState == false) {
                                    lifeEndSound();
                                    lifeWidth = lifeWidth - 256;
                                    if (lifeWidth == 512) {
                                        lifeTag.style.marginLeft = 75 + "%";
                                    }
                                    if (lifeWidth == 256) {
                                        lifeTag.style.marginLeft = 80 + "%";
                                    }
                                    lifeTag.style.width = lifeWidth + "px";
                                    lifeState = true;
                                }

                                if (lifeWidth == -256) {

                                    clearInterval(backgroundAnimationId);
                                    if (manJumpAnimationState == true) {
                                        clearInterval(manJumpAnimationId);
                                        manJumpAnimationState = false;
                                    }
                                    manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_die.png)";

                                    clearInterval(makeNinjaId);
                                    clearInterval(powerBarAnimationId);

                                    for (var s = 1; s < 10; s++) {
                                        clearInterval(ninjaRunAnimationId[s]);
                                    }

                                    setInterval(function() {
                                        if (manBackPositionX == -2768) {
                                            clearInterval(manIdelAnimationId);
                                            gameOverPage();
                                        }
                                        setInterval(flyMotionDown, 50);
                                    }, 110);
                                }
                            }
                        }
                    }, 150);

                    countNinja = countNinja + 1;
                } else {
                    clearInterval(makeNinjaId);
                }
            }, 4000);
        }
    }


    if (score > 2000) {
        backImg.style.backgroundImage = "url(img/horror.png)";

        if (makeZombieId == 0) {
            zombieBackPositionX = 0;
            makeZombieId = setInterval(function() {
                if (countZombie <= 9) {
                    var zombieDead = false;

                    lifeState = false;
                    var zombie = document.createElement("div");
                    zombie.className = "zombie";
                    zombie.style.marginLeft = "1200px";
                    backImg.appendChild(zombie);
                    setInterval(function() {
                        zombieBackPositionX = zombieBackPositionX - 430;
                        zombie.style.backgroundPositionX = zombieBackPositionX + "px";
                    }, 150);

                    var x = Math.floor(Math.random() * 100);
                    if (x == 0) {
                        x = Math.floor(Math.random() * 100);
                    }
                    if (x > 80) {
                        x = 80;
                    }
                    zombieRunAnimationId[countZombie] = setInterval(function() {
                        if (zombieDead == false) {
                            var n = parseInt(zombie.style.marginLeft) - x;
                            zombie.style.marginLeft = n + "px";
                        }
                        if (n < 400) {
                            if (shootAnimationState == true) {
                                zombie.remove();
                                zombieDead = true;
                            }
                        }

                        if (-250 <= (manMarginLeft - n) && 0 >= (manMarginLeft - n)) {
                            if (manMarginTop >= 70) {

                                zombie.style.backgroundImage = "url(sprite/zombieAttack.png)";

                                if (lifeState == false) {
                                    lifeEndSound();
                                    lifeWidth = lifeWidth - 256;
                                    if (lifeWidth == 512) {
                                        lifeTag.style.marginLeft = 75 + "%";
                                    }
                                    if (lifeWidth == 256) {
                                        lifeTag.style.marginLeft = 80 + "%";
                                    }
                                    lifeTag.style.width = lifeWidth + "px";
                                    lifeState = true;
                                }
                                if (lifeWidth == -256) {
                                    clearInterval(backgroundAnimationId);
                                    if (manJumpAnimationState == true) {
                                        clearInterval(manJumpAnimationId);
                                        manJumpAnimationState = false;
                                    }
                                    manTag.style.backgroundImage = "url(sprite/man_no_weapon_white_helmet_standing_die.png)";

                                    clearInterval(makeZombieId);
                                    clearInterval(powerBarAnimationId);

                                    for (var s = 1; s < 10; s++) {
                                        clearInterval(zombieRunAnimationId[s]);
                                    }

                                    setInterval(function() {
                                        if (manBackPositionX == -2768) {
                                            clearInterval(manIdelAnimationId);
                                            gameOverPage();
                                        }
                                        setInterval(flyMotionDown, 50);
                                    }, 110);
                                }
                            }
                        }
                    }, 150);

                    countZombie = countZombie + 1;
                } else {
                    clearInterval(makeZombieId);
                }
            }, 4000);
        }
    }
    if (score > 3000) {
        gameWin();
    }
}

var makeNinjaId = 0;
var countNinja = 1;
var ninjaBackPositionX = 0;
var ninjaRunAnimationId = [];

var makeZombieId = 0;
var countZombie = 1;
var zombieBackPositionX = 0;
var zombieRunAnimationId = [];

var flyMotionUpId = 0;
var flyMotionDownId = 0;
var flyMotionUpState = false;
var flyMotionDownState = false;

function flyMotionUp() {

    if (manMarginTop >= -50) {
        manMarginTop = manMarginTop - 15;
        manTag.style.marginTop = manMarginTop + "px";
    } else {
        clearInterval(flyMotionUpId);
        flyMotionUpState = false;
    }
}

function flyMotionDown() {

    if (manMarginTop <= 212) {
        manMarginTop = manMarginTop + 15;
        manTag.style.marginTop = manMarginTop + "px";
    } else {
        manTag.style.marginTop = "220px";
        clearInterval(flyMotionDownId);
        flyMotionDownState = false;
    }
}

var gameOverState = false;

function gameOverPage() {
    if (gameOverState == false) {
        backImg.remove();
        body.appendChild(home);
        menu.remove();
        var p = document.createElement("p");
        p.innerHTML = "Game Over <br/> Score: " + score;
        p.className = "gameOverText";
        home.appendChild(p);
        createBackBtn();
        backBtn.style.marginTop = "370px";

        var a = new Audio("sound/GameOver.mp3");
        a.play();

        gameOverState = true;
    }
}

var gameWinState = false;

function gameWin() {
    if (gameWinState == false) {
        backImg.remove();
        body.appendChild(home);
        menu.remove();
        var h = document.createElement("h2");
        h.innerHTML = "You Win";
        h.className = "gameOverText";
        home.appendChild(h);
        createBackBtn();
        backBtn.style.marginTop = "370px";

        gameWinState = true;

        var a = new Audio("sound/GameWin.mp3");
        a.play();

        clearInterval(manIdelAnimationId);
        clearInterval(alienFlyAnimationId);
        clearInterval(backgroundAnimationId);
    }
}

function lifeEndSound() {
    var a = new Audio("sound/LifeEnd.mp3");
    a.play();
}