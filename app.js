//Global selection and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
let initialColors;

//Functions 

//Color Generator
function generateHex(){
/*  //Without Chroma library  
    const letters = '#0123456789ABCDEF';
    let hash = '#';
    for (let i=0; i < 16; i++){
        hash += letters[Math.floor(Math.random() * 16)]
    }
    return hash;
    */
    //Use Chroma library
    const hexColor = chroma.random();
    return hexColor;
}

function randomColors(){
    colorDivs.forEach((div,index) => {
        const hexText = div.children[0]; //in place 0 there is h2 element
        const randomColor = generateHex();

        //Add the color to the bg
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        //Check for contrast
        checkTextContrast(randomColor, hexText);
    })
}

function checkTextContrast(color,text){
    const luminance = chroma(color).luminance(); // how dark it is (0-1)
    if(luminance > 0.5){
        text.style.color = "black";
    } else{
        text.style.color = "white";
    }

}

randomColors();