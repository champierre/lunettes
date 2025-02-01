let canvas;
let pixelSize = 16; // 表示サイズを大きくするための倍率
let gridSize = 8;  // アイコンの実際のサイズ
let drawing = false;
let pixels = [];

let currentColor;

function setup() {
    // キャンバスを作成し、指定された要素内に配置
    canvas = createCanvas(gridSize * pixelSize, gridSize * pixelSize);
    canvas.parent('editor');
    
    // ピクセル配列の初期化(透明で初期化)
    for (let i = 0; i < gridSize; i++) {
        pixels[i] = [];
        for (let j = 0; j < gridSize; j++) {
            pixels[i][j] = color(255, 255, 255, 0);
        }
    }

    // イベントリスナーの設定
    document.getElementById('clearButton').addEventListener('click', clearCanvas);
    document.getElementById('saveButton').addEventListener('click', saveIcon);
    
    // カラーパレットのボタンにイベントリスナーを設定
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 以前の選択を解除
            document.querySelector('.color-btn.selected')?.classList.remove('selected');
            // 新しい選択を設定
            button.classList.add('selected');
            currentColor = color(button.dataset.color);
        });
    });
    
    // 初期カラーを設定
    const firstColorBtn = document.querySelector('.color-btn');
    firstColorBtn.classList.add('selected');
    currentColor = color(firstColorBtn.dataset.color);
    
    // 描画設定
    noSmooth();
}

function draw() {
    background(255);
    drawGrid();
    drawPixels();
    
    if (drawing && mouseIsPressed) {
        const x = floor(mouseX / pixelSize);
        const y = floor(mouseY / pixelSize);
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
            pixels[x][y] = currentColor;
        }
    }
}

function drawGrid() {
    stroke(200);
    strokeWeight(1);
    for (let i = 0; i <= gridSize; i++) {
        line(i * pixelSize, 0, i * pixelSize, height);
        line(0, i * pixelSize, width, i * pixelSize);
    }
}

function drawPixels() {
    noStroke();
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const c = pixels[i][j];
            fill(c);
            rect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
        }
    }
}

function mousePressed() {
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        drawing = true;
    }
}

function mouseReleased() {
    drawing = false;
}

function clearCanvas() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            pixels[i][j] = color(255, 255, 255, 0);
        }
    }
}

function saveIcon() {
    // 実際のサイズ(32x32)のキャンバスを一時的に作成
    let tempCanvas = createGraphics(gridSize, gridSize);
    tempCanvas.noSmooth();
    
    // ピクセルを描画
    tempCanvas.loadPixels();
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            tempCanvas.set(i, j, pixels[i][j]);
        }
    }
    tempCanvas.updatePixels();
    
    // PNG形式で保存
    save(tempCanvas, 'icon.png');
}
