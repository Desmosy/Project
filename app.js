let isGameStarted = false; 

let config={
    renderer: Phaser.AUTO,
    width: 800,
    height: 600,
    physics:{
        default: 'arcade',
        arcade: {
            gravity:{
                y:300
            },
            debug: false
        },
    },
    scene:{
        preload: preload,
        create: create,
        update: update
    },
};

let game = new Phaser.Game(config);



function preload(){
this.load.image('background','assets/background.png');
this.load.image('road','assets/road.png');
this.load.image('column','assets/column.png');
this.load.spritesheet('bird','assets/bird.png',{
    frameWidth: 64, 
    frameHeight: 96
});
}


var bird;
let haslanded= false;
let cursors;
let hasBumped=false;
let message;

function create(){
    
    const background=this.add.image(0,0,'background').setOrigin(0,0);
    const roads = this.physics.add.staticGroup();// this.physics is making a call to the arcade physics system
    const topColumns= this.physics.add.staticGroup({
        key: 'column',
        repeat: 1,
        setXY:{
            x:200,
            y:0,
            stepX: 300
        },
    });

    const bottomColumns= this.physics.add.staticGroup({
        key:'column',
        repeat:1,
        setXY:{
            x:350,
            y:400,
            stepX:300

        },
    });
    const road = roads.create(400,568,"road").setScale(2).refreshBody();

    bird=this.physics.add.sprite(0,50,"bird").setScale(2);
    bird.setBounce(0.2);
    
    bird.setCollideWorldBounds(true);

    this.physics.add.overlap(bird,road, ()=>haslanded=true,null,this);
    this.physics.add.collider(bird,road);

    this.physics.add.overlap(bird,road, ()=>hasBumped=true,null,this);
    this.physics.add.overlap(bird,road, ()=>hasBumped=true,null,this);
    this.physics.add.collider(bird,topColumns);
    this.physics.add.collider(bird,bottomColumns);

    cursors= this.input.keyboard.createCursorKeys();
    message=this.add.text(0,0, `Instructions: Press space bar to start`,{
        fontFamily:  '"Helvetica",Arial, sans-serif',
        fontSize: "20px",
        color:"white",
        backgroundColor: "black"

    });
    Phaser.Display.Align.In.BottomCenter(message,background,0,50);

}
function update(){
   
    
    if (cursors.space.isDown && !isGameStarted){
        isGameStarted=true;
        message.text="Instructions: Press the UP key to stay upright \nand do not hit the ground or the columns";
    }

    if (!isGameStarted){
        bird.setVelocityY(-160);
    }
    
    /*if(cursors.space.isDown && !isGameStarted){
        isGameStarted=true;
    }*/
 


    if(cursors.up.isDown && !haslanded && !hasBumped){
        bird.setVelocityY(-160);
        
    }
    if(isGameStarted && (!haslanded || !hasBumped)){
        bird.body.velocity.x=50;
    }else{
        bird.body.velocity.x=0;
    }

    if(hasBumped || haslanded){
        message.text=`You crashed!!!!`;
    }

    if(bird.x>750){
        bird.setVelocityY(40);
        message.text=`Congrats`;
    }
    

  


}

