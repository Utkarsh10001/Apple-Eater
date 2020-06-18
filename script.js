let config={
    type:Phaser.AUTO,
    scale:{
        width: 1200,
        height: 600,
    },
    physics:{
        default:'arcade',
        arcade:{
            gravity:{
                y:1000,
                },
            //debug:true,
            }
        },
    backgroundColor: '#0011FF',
    scene:{
        preload:preload,
        create: create,
        update: update,
    }
};
var game=new Phaser.Game(config);
function preload(){
    this.load.image('ground',"Assets/topground.png");
    this.load.image('sky','Assets/background.png');
    this.load.spritesheet("dude","Assets/dude.png",{frameWidth:32,frameHeight:48});
    this.load.image('apple',"Assets/apple.png");
}
function create(){
    W=game.config.width;
    H=game.config.height;
    //console.log(W,H);
    //sky
    let back = this.add.tileSprite(0,0,W,H,'sky');
    back.setOrigin(0,0);
    back.depth=-100;
    //ground
    this.ground = this.add.tileSprite(0,H-128,W,128,'ground');
    this.ground.setOrigin(0,0);
    this.physics.add.existing(this.ground,true);
    this.ground.body.allowGravity= false;
    //ground.body.immovable =true;
    //player
    this.player= this.physics.add.sprite(100,100,'dude',4);
    this.player.depth=0;
    //creating animation for the player
   this.anims.create({
       key:'left',
        frame: this.anims.generateFrameNumbers('dude',{start:0,end:3}),
        frameRate: 10,
        repeat: -1,
    });
    
    this.anims.create({
       key:'right',
        frame: this.anims.generateFrameNumbers('dude',{start:5,end:8}),
        frameRate: 10,
        repeat: -1,
    });
    
    this.anims.create({
       key: 'stay',
        frame: [{key:'dude',frame:4}],
        repeat: -1,
    });
    //palyer.body.bounce = 100;
    //adding collision detection between player and ground
    //this.physics.add.collider(ground,player);
    //fruits
    this.countfruit=Phaser.Math.Between(8,12);
    this.fruits = this.physics.add.group({
        key:'apple',
        repeat:this.countfruit-1,
        setScale:{x:0.3,y:0.3},
        setXY:{x:10,y:10,stepX:Phaser.Math.Between(100, 102)},
    });
    //this.physics.add.collider(ground,fruits);
    this.player.setBounce(0.5);
    this.fruits.children.iterate(function(f){
      f.setBounce(Phaser.Math.FloatBetween(0.4,0.7));
    })
    //creating plateform
    this.plateforms=this.physics.add.staticGroup();
    this.plateforms.add(this.ground);
    let p1=this.plateforms.create(650,250,'ground').setScale(2,0.5).refreshBody();
    let p2=this.plateforms.create(30,200,'ground').setScale(2,0.5).refreshBody();
    let p3=this.plateforms.create(370,370,'ground').setScale(2,0.5).refreshBody();
    let p4=this.plateforms.create(1000,200,'ground').setScale(2,0.5).refreshBody();
    //let p5=this.plateforms.create(100,370,'ground').setScale(2,0.5).refreshBody();
    this.physics.add.collider(this.plateforms,this.player);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.plateforms,this.fruits);
    //keyboard
    this.cursors =this.input.keyboard.createCursorKeys();
    this.physics.add.overlap(this.player,this.fruits,eatFruit,null,this);
    //cameras
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.5);
    //score
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
    //touch events experiment
    //this.pointer = this.input.activePointer;
//offlicaial git
    //this.pointer=
    //this.input.addPointer();
}
function update(){
    //console.log(this.pointer);
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-150);
        this.player.anims.play('left',true);
    }else if(this.cursors.right.isDown){
        this.player.setVelocityX(+150);
        this.player.anims.play('right',true);
    }else if(this.cursors.up.isDown&&this.player.body.touching.down){
        this.player.setVelocityY(-650);
        this.player.anims.play('stay',true);
    }else if(this.cursors.down.isDown){
        this.player.setVelocityY(650);
        this.player.anims.play('stay',true);
    }else{
        //this.player.setVelocityX(0);
        //this.player.anims.play('stay',true);
        if(this.input.activePointer.isDown){
            let mx=this.input.activePointer.x;
            let my=this.input.activePointer.y;
            let px=this.player.x;
            let py=this.player.y;
            if(my<=py&&this.player.body.touching.down){
                //up
                this.player.setVelocityY(-650);
                this.player.anims.play('stay',true);
            }else if(mx>px){
                //right 
                this.player.setVelocityX(+150);
                this.player.anims.play('right',true);
            }else if(mx<=px){
             //left
                this.player.setVelocityX(-150);
                this.player.anims.play('left',true);
            }else{
                this.player.setVelocityX(0);
                this.player.anims.play('stay',true);
        }
        }else{
            
                this.player.setVelocityX(0);
                this.player.anims.play('stay',true);
        }
    }           
    //console.log(this.input.activePointer.x,this.input.activePointer.y);
//    console.log(this.pointer[0].isDown);
//    if(this.pointer[0].isDown){
  //      console.log('this.pointer.x');
//    }
  //  console.log(this.player.x,this.player.y);
    if(score == this.countfruit){
        alert('Game Complete');
    }
}
score=0;
function eatFruit(player,fruit){
    score++;
    fruit.disableBody(true,true);
    this.scoreText.setText('Score: ' + score);
}
