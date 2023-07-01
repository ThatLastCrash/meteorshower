window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                //调用开始函数  10毫秒
                window.setTimeout(callback, 10);
            }
})();

var cvs = document.getElementById("c"); 
ctx = cvs.getContext("2d");
cw = window.innerWidth;
ch = window.innerHeight;
cvs.width = cw;
cvs.height = ch;

firework=[];
firework2=[];
time1=0;
time2=0;
time3=0;
limit1=10;
limit2=30;
limit3=10;
judge1=1;
num1=0;
num2=0;
num3=0;
hue = 200;
control=0;
controlsmall=1;
controlbig=1;
controlbbig=1;
N=0;

function random(min, max) {
    return Math.random() * (max - min) + min;
}


function Firework (sx,sy,tx,ty) {
    this.x=sx;
    this.y=sy;
    this.sx=sx
    this.sy=sy;
    this.tx=tx;
    this.ty=ty;
    this.angle = random(0.2 * Math.PI, 0.1 * Math.PI);
    this.speed = random(60, 80);//随机速度
    this.line=[];
    this.lineCount = 5;
    this.friction = 0.95;//摩擦力
    this.gravity = 5;//重力
    this.hue = random(hue - 20, hue + 20);//生成色彩相近的碎屑
    this.alpha = 1;//初始化透明度
    this.decay = random(0.015, 0.03);//碎屑消失时间
    while (this.lineCount--) {
        this.line.push([this.x, this.y]);
    }
}

Firework.prototype.update = function(index) {
    this.line.pop();
    this.line.unshift([this.x,this.y]);

    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

/*
    if((this.nowdistance - this.distance) < 0 || this.speed > 0.5){
        createTail(this.x, this.y);      //创建焰尾效果
    }*/

    if(this.alpha > this.decay){
        createTail(this.x, this.y, Math.PI+this.angle);
    }

    if(this.alpha <= this.decay){
        //createfirework(this.sx, this.sy);
        createParticles(this.x, this.y);
        firework.splice(index,1);
    }
}

Firework.prototype.drawline = function () {
    ctx.beginPath();
    ctx.moveTo(this.line[this.line.length - 1][0], this.line[this.line.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.lineWidth=2;
    ctx.strokeStyle = 'rgb('+random(0,255)+","+random(0,255)+","+random(0,255)+")";
    ctx.stroke();
}

function createfirework(x, y) {

    var fireworkCount = 300;
    while (fireworkCount--) {
        firework.push(new Firework(x * random(0.1, 2), y * random(0.8, 1.3)));
    }
}






//加特效
//*
//*
//*
//小型爆炸效果
particles=[];

function Particle(x, y) {
    this.x = random(0, cw);
    this.y = random(0, ch);
    this.line = [];
    this.lineCount = 10;
    while (this.lineCount--) {
        this.line.push([this.x, this.y]);
    }
    //生成任意方向的碎屑
    this.friction = 0.95;//摩擦力
    this.gravity = 1;//重力
    this.hue = random(hue - 20, hue + 20);//生成色彩相近的碎屑
    this.alpha = 1;//初始化透明度
    this.decay = random(0.015, 0.03);//碎屑消失时间
}
Particle.prototype.update = function (index) {
    this.line.pop();
    this.line.unshift([this.x, this.y]);
    this.alpha -= this.decay;
    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.line[this.line.length - 1][0], this.line[this.line.length - 1][1]);
    ctx.arc(this.x, this.y, 2, 0,2*Math.PI);
    ctx.lineWidth=1;
    ctx.strokeStyle = 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
    ctx.stroke();
}
function createParticles(x, y) {
    var particleCount = 10;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}


/*

//大型爆炸效果
particlesbig=[];

function Particlebig(x, y) {
    this.x = x;
    this.y = y;
    this.line = [];
    this.lineCount = 10;
    while (this.lineCount--) {
        this.line.push([this.x, this.y]);
    }
    //生成任意方向的碎屑
    this.angle = random(0, 2 * Math.PI);
    this.speed = random(1, 10);//随机速度
    this.friction = 0.965;//摩擦力
    this.gravity = 1;//重力
    this.hue = random(hue - 20, hue + 20);//生成色彩相近的碎屑
    this.brightness = random(50, 80);//随机透明
    this.alpha = 1;//初始化透明度
    this.decay = random(0.01, 0.015);//碎屑消失时间
}
Particlebig.prototype.update = function (index) {
    this.line.pop();
    this.line.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) *this.speed;
    this.y += Math.sin(this.angle) *this.speed + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= this.decay) {
        particlesbig.splice(index, 1);
    }
}
//画碎屑轨迹
Particlebig.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.line[this.line.length - 1][0], this.line[this.line.length - 1][1]);
    
    ctx.lineTo(this.x, this.y);
    ctx.lineWidth=1;
    ctx.strokeStyle = 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
    ctx.stroke();
}
function createParticlesbig(x, y) {
    //生成30个烟花碎屑
    var particlebigCount = 800;
    while (particlebigCount--) {
        particlesbig.push(new Particlebig(x, y));
    }
}



*/

//烟花轨道粒子效果
//
//
//
tail=[];

function Tail(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = random(0.95,1.05)*angle;
    this.line = [];
    this.lineCount = 2;
    while (this.lineCount--) {
        this.line.push([this.x, this.y]);
    }
    //生成任意方向的碎屑
    this.speed = random(1, 10);//随机速度
    this.friction = 0.9;//摩擦力
    this.gravity = 1;//重力
    this.hue = random(hue - 20, hue + 20);//生成色彩相近的碎屑
    this.brightness = random(50, 80);//随机透明
    this.alpha = 1;//初始化透明度
    this.decay = random(0.005, 0.008);//碎屑消失时间
}
Tail.prototype.update = function (index) {
    this.line.pop();
    this.line.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) *this.speed;
    this.y += Math.sin(this.angle) *this.speed;
    this.alpha -= this.decay;
    if (this.alpha <= this.decay) {
        tail.splice(index, 1);
    }
}
//画碎屑轨迹
Tail.prototype.draw = function () {
    ctx.beginPath();
    //ctx.fillStyle='hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
    
    ctx.moveTo(this.line[this.line.length - 1][0], this.line[this.line.length - 1][1]);
    ctx.lineWidth=1;
    //ctx.arc(this.x, this.y, 0.1, 0, 2*Math.PI);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
    //ctx.fill();
    ctx.stroke();
}
function createTail(x, y, angle) {
    //生成焰尾粒子
    var tailCount = 10;
    while (tailCount--) {
        tail.push(new Tail(x, y, angle));
    }
}



//直线型烟火
//*
//*
//*

function Firework2 (sx,sy,tx,ty) {
    this.x=sx;
    this.y=sy;
    this.sx=sx;
    this.sy=sy;
    this.tx=tx;
    this.ty=ty;
    this.angle=Math.atan2(this.ty - this.sy, this.tx - this.sx);
    this.speed=40;
    this.acceleration=1.05;
    this.distance=calculate(this.sx, this.sy, this.tx, this.ty);
    this.nowdistance=0;
    this.line=[];
    this.lineCount = 1;
    while (this.lineCount--) {
        if(controlbig){this.line.push([this.x, this.y]);}
    }
}


Firework2.prototype.updatestright = function(index) {
    this.line.pop();
    this.line.push([this.x,this.y]);

    this.speed /=this.acceleration;

    var vx = 0;
    var vy = -this.speed;
    this.nowdistance=calculate(this.sx, this.sy, this.x + vx, this.y + vy);

    if((this.nowdistance - this.distance) < 0 || this.speed > 0.5){
        createTail(this.x, this.y);      //创建焰尾效果
    }

    if((this.nowdistance - this.distance) > 0 || this.speed < 0.5){
        if(controlbig){createParticlesbig(this.tx, this.ty);}
        firework2.splice(index,1);
    }
    else{
        this.x += vx;
        this.y += vy;
    }


}


Firework2.prototype.drawstrightline = function () {
    p=1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.line[this.line.length - 1][1]);
    //if(p==1){ctx.arc(this.x, this.line[this.line.length - 1][1]-this.speed*this.acceleration/2, this.speed*this.acceleration/2, 0.5*Math.PI, 1.5*Math.PI,true);}
    
    ctx.lineTo(this.x, this.y);
    ctx.lineWidth=5;
    ctx.strokeStyle = "snow";//'rgb('+random(0,255)+","+random(0,255)+","+random(0,255)+")";
    ctx.stroke();
}





/*
//超大型爆炸效果
particlesbbig=[];

function Particlebbig(x, y) {
    this.x = x;
    this.y = y;
    this.line = [];
    this.lineCount = 10;
    while (this.lineCount--) {
        this.line.push([this.x, this.y]);
    }
    //生成任意方向的碎屑
    this.angle = random(0, 2 * Math.PI);
    this.speed = random(1, 10);//随机速度
    this.friction = 0.985;//摩擦力
    this.gravity = 1.25;//重力
    this.hue = random(hue - 20, hue + 20);//生成色彩相近的碎屑
    this.brightness = random(50, 80);//随机透明
    this.alpha = 1;//初始化透明度
    this.decay = random(0.006, 0.01);//碎屑消失时间
}
Particlebbig.prototype.update = function (index) {
    this.line.pop();
    this.line.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) *this.speed;
    this.y += Math.sin(this.angle) *this.speed + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= this.decay) {
        particlesbbig.splice(index, 1);
    }
}
//画碎屑轨迹
Particlebbig.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.line[this.line.length - 1][0], this.line[this.line.length - 1][1]);
    
    ctx.lineTo(this.x, this.y);
    ctx.lineWidth=1;
    ctx.strokeStyle = 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
    ctx.stroke();
}
function createParticlesbbig(x, y) {
    //生成30个烟花碎屑
    var particlebbigCount = 1200;
    while (particlebbigCount--) {
        particlesbbig.push(new Particlebbig(x, y));
    }
}


//超大型直线型烟火
//*
//*
//*
firework3=[];

function Firework3 (sx,sy,tx,ty) {
    this.x=sx;
    this.y=sy;
    this.sx=sx;
    this.sy=sy;
    this.tx=tx;
    this.ty=ty;
    this.angle=Math.atan2(this.ty - this.sy, this.tx - this.sx);
    this.speed=40;
    this.acceleration=1.025;
    this.distance=calculate(this.sx, this.sy, this.tx, this.ty);
    this.nowdistance=0;
    this.line=[];
    this.lineCount = 1;
    while (this.lineCount--) {
        if(controlbbig){this.line.push([this.x, this.y]);}
    }
}


Firework3.prototype.updateone = function(index) {
    this.line.pop();
    this.line.push([this.x,this.y]);

    this.speed /=this.acceleration;

    var vx = 0;
    var vy = -this.speed;
    this.nowdistance=calculate(this.sx, this.sy, this.x + vx, this.y + vy);

    if((this.nowdistance - this.distance) < 0 || this.speed > 0.5){
        createTail(this.x, this.y);      //创建焰尾效果
    }

    if((this.nowdistance - this.distance) > 0 || this.speed < 0.5){
        if(controlbbig){createParticlesbbig(this.tx, this.ty);}
        firework3.splice(index,1);
    }
    else{
        this.x += vx;
        this.y += vy;
    }


}


Firework3.prototype.drawone = function () {
    p=1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.line[this.line.length - 1][1]);
    //if(p==1){ctx.arc(this.x, this.line[this.line.length - 1][1]-this.speed*this.acceleration/2, this.speed*this.acceleration/2, 0.5*Math.PI, 1.5*Math.PI,true);}
    
    ctx.lineTo(this.x, this.y);
    ctx.lineWidth=5;
    ctx.strokeStyle = "snow";//'rgb('+random(0,255)+","+random(0,255)+","+random(0,255)+")";
    ctx.stroke();
}


*/

//开始生成
//*
//*
//*
function loop() {
    requestAnimationFrame(loop);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = 'lighter';
    num1=5;
    hue += 0.5;

    





    //控制变换发射密集程度
    /*if(num1%2000>1700){
        limit1=20;
        controlsmall=1;
    }
    else{
        controlsmall=0;
    }

    if(num2%2000<1700 && num2%2000>1000){
        limit2=170;
        controlbig=1;
    }
    else{
        controlbig=0;
    }

    if(num3%2000<1000){
        limit3=300;
        controlbbig=1;
    }
    else{
        controlbbig=0;
    }*/



    var i = firework.length;
    /*var k = firework2.length;
    var m = firework3.length;*/

    var j = particles.length;
    /*var l = particlesbig.length;
    var o = particlesbbig.length;*/

    var p = tail.length;
    while (j--) {
        particles[j].draw();
        particles[j].update(j);
    }

/*
    while (l--) {
        particlesbig[l].draw();
        particlesbig[l].update(l);
    }

    while (o--) {
        particlesbbig[o].draw();
        particlesbbig[o].update(o);
    }
*/
    while (p--){
        tail[p].draw();
        tail[p].update(p);
    }


    while (i--) {
        b=firework[i];
        b.drawline();
        b.update(i);
    }

/*
    while (k--) {
        a=firework2[k];
        a.drawstrightline();
        a.updatestright(k);
    }

    while (m--) {
        a=firework3[m];
        a.drawone();
        a.updateone(m);
    }*/


    if (time1 >= 20) {
     
        a=random(cw/8*1.1, cw/8*4);
        b=random(0, ch / 2);
        firework.push(new Firework(0, b));
        firework.push(new Firework(a, 0));
        time1 = 0;
    }
    else {
        time1++;
    }



}
window.onload = loop();

    //文字淡出效果
//
//
//


function appear1() {
    d=document.getElementById("detail");
    var opacity=0;
    var timer = setInterval(function () {
        if (opacity>=10){
            clearInterval(timer);
        }
        opacity += 1;
        d.style.opacity=opacity/10;
    },100);
}
function appear2() {
    d=document.getElementById("bg");
    var opacity=0;
    var timer = setInterval(function () {
        if (opacity>=10){
            clearInterval(timer);
        }
        opacity += 1;
        d.style.opacity=opacity/10;
    },100);
}
function appear3() {
    d=document.getElementById("ex");
    var opacity=0;
    var timer = setInterval(function () {
        if (opacity>=10){
            clearInterval(timer);
        }
        opacity += 1;
        d.style.opacity=opacity/10;
    },100);
}
function appear4() {
    d=document.getElementById("sk");
    var opacity=0;
    var timer = setInterval(function () {
        if (opacity>=10){
            clearInterval(timer);
        }
        opacity += 1;
        d.style.opacity=opacity/10;
    },100);
}
function appear5() {
    d=document.getElementById("ev");
    var opacity=0;
    var timer = setInterval(function () {
        if (opacity>=10){
            clearInterval(timer);
        }
        opacity += 1;
        d.style.opacity=opacity/10;
    },100);
}
