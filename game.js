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
    //ctxBg.drawImage(imgSprite, 420, 420, 25, 25);
    ctxBg.drawImage(imgSprite,0,0,800,600,0,0,800,600);

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
    shooter1.updateAllBullets(1);
    shooter2.updateAllBullets(2);
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
    this.srcX = 4;
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
    this.isKilled = false;
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

Shooter.prototype.updateAllBullets = function (shooterId) {
    if (shooterId == 1) {
        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].isFlying) this.bullets[i].update(1);
        }

    }

    if (shooterId == 2) {
        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].isFlying)  this.bullets[i].update(2);
        }

    }
   
}

Shooter.prototype.drawAllBullets = function () {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].isFlying) this.bullets[i].draw();     
    }
}

Shooter.prototype.fire = function (shooterId) {
    this.bullets[this.currentBullet].fire(this.drawX, this.drawY, shooterId);
    this.currentBullet++;
    if (this.currentBullet >= this.bullets.length) {
        this.currentBullet = 0;
    }

}

Shooter.prototype.update = function (shooterId) {
    if (shooterId == 1)
    {
        if (this.isKilled) { this.srcX = 433; this.srcY = 618; this.drawX = 680; this.width = 97; }
        else { this.srcX = 4; this.srcY = 615; this.drawX = 10; this.width = 97; }
        var pointOfFire = Math.floor((Math.random() * 600) + 1);
        var g = pointOfFire % 4;
        if (g != 0) (pointOfFire = pointOfFire + g);

        if (this.drawY == pointOfFire) {
            this.fire(1);
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
        this.isShooting = false;
        if (this.isKilled) { this.srcX = 433; this.srcY = 618; this.drawX = 680; this.width = 97; }
        else { this.srcX = 139; this.srcY = 609; this.drawX = 680; this.width = 107; }
        

        if (this.isUpKey) this.drawY -= 2;
        if (this.isDownKey) this.drawY += 2;
        if (this.isSpacebar)
        {
            this.fire(2);
            this.isShooting = true;
            this.isSpacebar = false;
            var soundEffect = new Audio('sounds/gunFire.wav');
            soundEffect.play();
        }
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
    this.width = 39;
    this.height = 17;
    this.srcX = 357;
    this.srcY = 636;
    this.drawX = 100;
    this.drawY = 0;
    this.isFlying = false;
    this.xVel = 0;
    this.yVel = 0;
    this.speed = 6;
}

Bullet.prototype.update = function (shooterId) {
    if (shooterId == 1) {
        this.drawX += 10;
        this.checkHitShooter(1);
    }
    if (shooterId == 2) {
        this.drawX -= 10;
        this.checkHitShooter(2);
    }
   
    
}

Bullet.prototype.checkHitShooter = function (shooterId) {

    if (shooterId == 1) {
        if (collision(this, shooter2)) {
            shooter2.isKilled = true;
            var soundEffect = new Audio('sounds/explosion.wav');
            soundEffect.play();
        }
    }

    if (shooterId == 2) {
        if (collision(this, shooter1)) {
            shooter1.isKilled = true;
            var soundEffect = new Audio('sounds/explosion.wav');
            soundEffect.play();
        }
    }

    
}

Bullet.prototype.draw = function () {
    ctxEntities.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
}

Bullet.prototype.fire = function (startX, startY,shotterId) {
    if (shotterId == 1) {
        this.srcX = 357;
        this.srcY = 636;
        this.drawX = startX + 100;
        this.drawY = startY;
        this.isFlying = true;
    }
    
    if (shotterId == 2) {
        this.srcX = 283;
        this.srcY = 635;
        this.drawX = startX - 100;
        this.drawY = startY;
        this.isFlying = true;
    }
    
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
        shooter2.isSpacebar = value;
        e.preventDefault();
    }
}

function collision(a, b) {
    return a.drawX <= b.drawX + b.width &&  
        a.drawX >= b.drawX &&
        a.drawY <= b.drawY + b.height &&
        a.drawY >= b.drawY;
}