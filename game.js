var canvasBg = document.getElementById("canvasBg"),
    ctxBg = canvasBg.getContext("2d"),
    canvasEntities = document.getElementById("canvasEntities"),
    ctxEntities = canvasEntities.getContext("2d"),
    canvasWidth = canvasBg.width,
    canvasHeight = canvasBg.height,
    shooter1 = new Shooter(),
    shooter2 = new Shooter(),
    bullet = new Bullet(),
    isPlaying = false,
    requestAnimFrame = window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function (callback) {
                            window.setTimeout(callback, 1000 / 60);
                        },

imgSprite = new Image();
imgSprite.src = "images/sprite.png";
imgSprite.addEventListener("load", init, false);




function init() {
    document.addEventListener("keydown", function (e) { checkKey(e, true); }, false);
    document.addEventListener("keyup", function (e) { checkKey(e, false); }, false);
    //defineObstacles();
    //initEnemies();
    begin();
}

function begin() {
    //ctxBg.drawImage(imgSprite,0,0,800,600);
    //ctxBg.drawImage(imgSprite,420,420,25,25);

   

    isPlaying = true;
    requestAnimFrame(loop);
}

function loop() {
    if (isPlaying) {
        update();
        draw();
        requestAnimFrame(loop);
    }
}

function update() {
    clearCtx(ctxEntities);
    //updateAllEnemies();
    shooter1.updateAllBullets();
    shooter1.update(1);
    shooter2.update(2);

   
}

function draw() {
    //drawAllEnemies();
    shooter1.draw();
    shooter2.draw();
   
}

/***Shooter***/

function Shooter() {
    this.srcX = 8;
    this.srcY = 625;
    this.width = 220;
    this.height = 128;
    this.drawX = 95;
    this.drawY = 0;
    this.centerX = this.drawX + (this.width / 2);
    this.centerY = this.drawY + (this.height / 2);
    this.speed = 2;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpacebar = false;
    this.isShooting = false;
    this.direction = "down";
    this.hasFired = false;
    this.shootingCounter = 0;
    var numBullets = 10;
    this.bullets = [];
    this.currentBullet = 0;
    for (var i = 0; i < numBullets; i++) {
        this.bullets[this.bullets.length] = new Bullet();
    }
}

Shooter.prototype.updateAllBullets = function () {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].isFlying) this.bullets[i].update();
    }
}

Shooter.prototype.drawAllBullets = function () {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].isFlying) this.bullets[i].draw();     
    }
}

Shooter.prototype.fire = function () {
    this.bullets[this.currentBullet].fire(this.drawX, this.drawY);
    this.currentBullet++;
    if (this.currentBullet >= this.bullets.length) {
        this.currentBullet = 0;
    }

}

Shooter.prototype.update = function (shooterId) {
    if (shooterId == 1)
    {
        this.srcX = 12; this.srcY = 559; this.drawX = 95;
        var pointOfFire = Math.floor((Math.random() * 600) + 1);
        var g = pointOfFire % 4;
        if (g != 0) (pointOfFire = pointOfFire + g);

        if (this.drawY == pointOfFire) {
            this.fire();
            var soundEffect = new Audio('sounds/gunFire.wav');
            soundEffect.play();
        }

        if (this.direction == "down") {
            this.drawY += 2;
            if (this.drawY > 550) this.direction = "up"

        }
        if (this.direction == "up") {
            this.drawY -= 2;
            if (this.drawY <= 0) this.direction = "down"
        }
    }
    if (shooterId == 2)
    {
        this.srcX = 109; this.srcY = 623; this.drawX = 595;
        if (this.isUpKey) this.drawY -= 2;
        if (this.isDownKey) this.drawY += 2;
    }

};

Shooter.prototype.draw = function () {

    this.drawAllBullets();
    ctxEntities.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);



    //ctxEntities.drawImage(imgSprite, 100, this.drawY, 50, 50);
};

/***Bullet***/

function Bullet() {
    this.radius = 2;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.drawX = 100;
    this.drawY = 0;
    this.isFlying = false;
    this.xVel = 0;
    this.yVel = 0;
    this.speed = 6;
}

Bullet.prototype.update = function () {
    this.drawX += 3;
    this.checkHitShooter();
    
}

Bullet.prototype.checkHitShooter = function () {
    if (collision(this,shooter2 )){
        shooter2.drawY = 150;
    }
}

Bullet.prototype.draw = function () {
    ctxEntities.drawImage(imgSprite2, this.drawX, this.drawY, 20, 20);
}

Bullet.prototype.fire = function (startX, startY) {
    this.drawX = startX+100;
    this.drawY = startY;
    this.isFlying = true;
}


/***private methods***/

function clearCtx(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function checkKey(e, value) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38) { // Up arrow
        shooter2.isUpKey = value;
        e.preventDefault();
    }
    if (keyID === 39) { // Right arrow
        shooter1.isRightKey = value;
        e.preventDefault();
    }
    if (keyID === 40) { // Down arrow
        shooter2.isDownKey = value;
        e.preventDefault();
    }
    if (keyID === 37) { // Left arrow
        shooter1.isLeftKey = value;
        e.preventDefault();
    }
    if (keyID === 32) { // Spacebar
        shooter1.isSpacebar = value;
        e.preventDefault();
    }
}

function collision(a, b) {
    return a.drawX <= b.drawX + b.width &&
        a.drawX >= b.drawX &&
        a.drawY <= b.drawY + b.height &&
        a.drawY >= b.drawY;
}