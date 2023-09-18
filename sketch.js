var PLAY = 1;
var END = 0;
var gameState = PLAY
var box1;
var box2;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {

  createCanvas(600,200);
  
  //crie um sprite de trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //crie sprite ground (solo)
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.velocityX = -4;

  //Criando um gameOver (Fim de jogo)
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);

  //Criando um botão de restart (Recomeçar)
  restart = createSprite(300,140);
  restart.addImage(restartImg);

  gameOver.scale = 2.0;
  restart.scale = 0.5;
  
  //crie um solo invisível
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //Criando grupos de obstáculos e de núvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  console.log("Olá" + 5);

  trex.setCollider("rectangle", 0, 0, 40, trex.height);
  trex.debug = true;

  score = 0;

  box1 = new Box();
  box2 = new Box();
}

function draw() {
  //definir cor do plano de fundo
  background(180);
  
  box1.show();
  box1.set_speed(2);
  
  box2.show();
  box2.set_speed(2);
  
  text("pontuação:" + score, 500, 50);

  console.log("isto é ",gameState);

  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    
    //Movendo o solo
    ground.velocityX = -(4 + 3* score/100);
    //Pontuação
    score = score + Math.round(frameCount/60);

    if(score > 0 && score % 100 === 0){
      checkPointSound.play();
    }

    if(ground.x < 0){
      ground.x = ground.width/2;
    }

    //Pulando se a tecla de espaço for pressionada
    if(keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -10;
      jumpSound.play();
    }

    //Gravidade
    trex.velocityY = trex.velocityY + 0.8;

    //Gerar Nuvens
    spawnClouds();
    
    //Gerando obstáculos no chão
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      trex.velocityY = -12;
      jumpSound.play();
      //gameState = END
      //dieSound.play();
    }
  }
  else if(gameState === END){
    console.log("oi :-)");
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityX = 0;

    //Mudando a animação do trex
    trex.changeAnimation("collided", trex_collided);

    //Definindo o tempo de vida dos objetos pra que eles nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }
  
  console.log(trex.y);
  
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  drawSprites();
}

//Função para gerar as nuvens
function spawnClouds(){
    if(frameCount % 60 === 0){
        cloud = createSprite(600, 100, 40, 10);
        cloud.addImage(cloudImage);
        cloud.y = Math.round(random(10,60));
        cloud.scale = 0.4;
        cloud.velocityX = -3;

        //Ajustando a profundidade
        console.log(trex.depth);
        console.log(cloud.depth);

        //Adicione cada núvem ao grupo
        cloudsGroup.add(cloud);
    }
}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    var obstacles = createSprite(400,165,10,40);
    obstacles.velocityX = -(6 + score/100); 
    //obstacles.velocityX = -6;

    //Gerando obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: 
          obstacles.addImage(obstacle1);
          break;

          case 2: 
          obstacles.addImage(obstacle2);
          break;

          case 3: 
          obstacles.addImage(obstacle3);
          break;

          case 4: 
          obstacles.addImage(obstacle4);
          break;

          case 5: 
          obstacles.addImage(obstacle5);
          break;

          case 6: 
          obstacles.addImage(obstacle6);
          break;

          default: break;
    }

    //Atribuindo dimensão e tempo de vida ao obstáculo
    obstacles.scale = 0.5;
    obstacles.lifetime = 300;

    //Adicionando cada obstáculo ao grupo
    obstaclesGroup.add(obstacles);
  }
}