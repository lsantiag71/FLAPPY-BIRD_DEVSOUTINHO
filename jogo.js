console.log('[DevSoutinho] Flappy Bird');
const som_HIT = new Audio();

let frames = 0;


som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [planoDeFundo]
const planoDeFundo = {
    spriteX: 390,
    SpriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.SpriteY, // Sprite X, Sprite Y
            planoDeFundo.largura, planoDeFundo.altura, // Tamanho do recorte na sprite
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.SpriteY, // Sprite X, Sprite Y
            planoDeFundo.largura, planoDeFundo.altura, // Tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
}

// [Chao]
function criaChao() {
    const chao = {
        spriteX: 0,
        SpriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;
            chao.x = movimentacao % repeteEm;
        },

        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.SpriteY, // Sprite X, Sprite Y
                chao.largura, chao.altura, // Tamanho do recorte na sprite
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
    
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.SpriteY, // Sprite X, Sprite Y
                chao.largura, chao.altura, // Tamanho do recorte na sprite
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        },
    }
    return chao;
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true;        
    }
    return false;
}






function criarFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            console.log('Devo pular');
            console.log('[antes]', flappyBird.velocidade);
            flappyBird.velocidade = - flappyBird.pulo;
            console.log('[depois]', flappyBird.velocidade); 
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if(fazColisao(flappyBird, globais.chao)) {
                console.log('Fez colisao');
                som_HIT.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                },500);
                return;
            }   
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },    
        movimentos: [
            { spriteX: 0, spriteY:0, }, // asa pra cima
            { spriteX: 0, spriteY:26, }, // asa no meio
            { spriteX: 0, spriteY:52, }, // asa pra baixo
            { spriteX: 0, spriteY:26, }, // asa no meio
        ],
        frameAtual: 0,
        atualizaOFrameAtual() {
            const intervaloDeFrames = 10;  
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            // console.log('Passou o intervalo', passouOIntervalo);
        
            if(passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
      
        },

        desenha() {
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(
                sprites,
                spriteX, spriteY, // Sprite X, Sprite Y
                flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}


// [mensagemGetReady]
const mensagemGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.spriteX, mensagemGetReady.spriteY, // Sprite X, Sprite Y
            mensagemGetReady.largura, mensagemGetReady.altura, // Tamanho do recorte na sprite
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura,
        );
    }
};

//
// [Telas]
//

const globais = {};

let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }   
};

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha(){
            const canoCeuX = 220;
            const canoCeuY = 0;
            // [Cano do Céu]
            contexto.drawImage(
                sprites,
                canos.ceu.spriteX, canos.ceu.spriteY, // Sprite X, Sprite Y
                canos.largura, canos.altura, // Tamanho do recorte na sprite
                canoCeuX, canoCeuY,
                canos.largura, canos.altura,
            );
        },
    }
    return canos;
}

const Telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criarFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            globais.canos.desenha();
            // mensagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click() {
        globais.flappyBird.pula();
    },  
    atualiza() {
        globais.flappyBird.atualiza();   
    }
};

function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
};

window.addEventListener('click', () => {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
 loop();