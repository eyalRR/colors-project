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
        //Initial Colorize sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        colorizeSliders(color, hue, brightness, saturation);
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

function colorizeSliders(color, hue, brightness, saturation){
    //Scale Saturation
    const noSat = color.set('hsl.s', 0); //reduce saturation to minimum 
    const fullSat = color.set('hsl.s', 1); //increase saturation to minimum 
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    //Scale Brightness
    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);

    //Update Input colors
    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)}
    , ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)}
    , ${scaleBright(0.5)}, ${scaleBright(1)})`;
    hue.style.backgroundImage = 'linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))';
}


randomColors();