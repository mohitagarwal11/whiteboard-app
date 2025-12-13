const canvas = document.getElementById("board");
const cntxt = canvas.getContext("2d");
const pen_btn = document.getElementById("penBtn");
const eraser_btn = document.getElementById("eraserBtn");
const clear_btn = document.getElementById("clearBtn");
const penMenu = document.getElementById("penMenu");

var penSlider = document.getElementById("penSlider");

let w = window.innerWidth;
let h = window.innerHeight;
let penSelect = false;
let eraserSelect = false;
let isDrawing = false;
let posX = 0;
let posY = 0;
let coordinates = []; //to store pointer x y
let penSize = 2; //using a slider for this
let eraserSize = 20; 
let penColor = "#ffffff";
let eraserColor = "#1e1e1e";


penSlider.oninput = function(){
    penSize = this.value;
}

function resizeCanvas() {
    const imageData = cntxt.getImageData(0, 0, canvas.width, canvas.height);

    w = window.innerWidth;
    h = window.innerHeight;
    cntxt.canvas.width = w;
    cntxt.canvas.height = h;

    cntxt.putImageData(imageData, 0, 0);
    // ok so this is working but not the way i want.
    //it removes anything that scales outside the new width and height
    //it should just keep the drawing where it was relative to actual screen
    // will fix this later
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

//the color showcase was done with the help of ai, i couldnt figure this out 
const colorOptions = document.querySelectorAll('.color-option');
colorOptions.forEach(option => {
    const color = option.getAttribute('data-color');
    option.style.backgroundColor = color;
    option.addEventListener('click', () => {
        penColor = color;
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});
const initialColor = '#ffffff';
penColor = initialColor;
colorOptions.forEach(option => {
    if (option.getAttribute('data-color') === initialColor) {
        option.classList.add('selected');
    }
});

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    posX = e.clientX - rect.left;
    posY = e.clientY - rect.top;
    coordinates.push({ x: posX, y: posY }); //add the pointer click coords
    cntxt.beginPath(); //begin the stroke now 
    cntxt.moveTo(posX, posY); //move stroke start point to the pointer click coords
    if (eraserSelect) {
        cntxt.lineWidth = eraserSize;
        cntxt.strokeStyle = eraserColor;
    } else {
        cntxt.lineWidth = penSize;
        cntxt.strokeStyle = penColor;
    }
    cntxt.lineCap = "round";
    cntxt.lineJoin = "round";
}
function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect(); //get max range of client window
    const currentX = e.clientX - rect.left; 
    const currentY = e.clientY - rect.top; 
    coordinates.push({ x: currentX, y: currentY }); //push new coords on mouse movements
    //console.log(coordinates);
    cntxt.lineTo(currentX, currentY);//keep moving to new coords until mouserelease
    cntxt.stroke();
}
function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
}

function enablePointer() {
    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    window.addEventListener('pointerup', stopDrawing);
}

function disablePointer() {
    canvas.removeEventListener('pointerdown', startDrawing);
    canvas.removeEventListener('pointermove', draw);
    window.removeEventListener('pointerup', stopDrawing);
}

pen_btn.addEventListener('click', (e) => {
    penSelect = true;
    eraserSelect = false;
    document.getElementById("penMenu").classList.toggle("show");
    if (penSelect) enablePointer();
    else disablePointer();
});

eraser_btn.addEventListener('click', () => {
    penSelect = false;
    eraserSelect = !eraserSelect;
    penSelect = false;
    if (eraserSelect) enablePointer();
    else disablePointer();
});

clear_btn.addEventListener('click', () => {
    disablePointer();
    cntxt.clearRect(0, 0, w, h);
});

document.addEventListener('click', (e) => {
    if (!penMenu.contains(e.target) && !pen_btn.contains(e.target)) {
        penMenu.classList.remove('show');
    }
});
