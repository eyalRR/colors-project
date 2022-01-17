//Global selection and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
let initialColors;

//Add event listeners
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div,index) => {
    div.addEventListener("change", () =>{
        updateTextUI(index);
    });
});
currentHexes.forEach(hex=>{
    hex.addEventListener("click", () =>{
        copyToClipboard(hex);
    })
})
popup.addEventListener('transitionend', () =>{
    const popupBox = popup.children[0];
    popup.classList.remove('active');
    popupBox.classList.remove('active');
})


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
    //Initial colorizeSliders
    initialColors=[];
    colorDivs.forEach((div,index) => {
        const hexText = div.children[0]; //in place 0 there is h2 element
        const randomColor = generateHex();
        //Add it to the array
        initialColors.push(chroma(randomColor).hex());
        //console.log(initialColors[index]);
        
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
    });
    //Reset Inputs
    resetInputs();
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

function hslControls(e){
    const index = 
        e.target.getAttribute('data-hue') || 
        e.target.getAttribute('data-bright') || 
        e.target.getAttribute('data-sat')
    
    let sliders = e.target.parentElement.querySelectorAll('input');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = initialColors[index];
    let color = chroma(bgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);
    colorDivs[index].style.backgroundColor = color;

    //COlorize Sliders Inputs
    colorizeSliders(color, hue, brightness, saturation);
}
function updateTextUI(index){
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button');
    textHex.innerText = color.hex();
    //Check contrast
    checkTextContrast(color, textHex);
    icons.forEach(icon =>{
        checkTextContrast(color, icon);
    })
}
function resetInputs(){
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach(slider =>{
        //console.log(slider.name)
        if(slider.name === 'hue'){
            const hueColor = initialColors[slider.getAttribute('data-hue')];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if(slider.name === 'brightness'){
            const brightColor = initialColors[slider.getAttribute('data-bright')];
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100;
        }
        if(slider.name === 'saturation'){
            const satColor = initialColors[slider.getAttribute('data-sat')];
            const satValue = chroma(satColor).hsl()[1];
            slider.value = Math.floor(satValue * 100)/100;
        }
    })
}
function copyToClipboard(hex){
    const el = document.createElement('textarea');
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    //Pop up animation
    const popupBox = popup.children[0];
    console.log(popupBox);
    popup.classList.add('active');
    popupBox.classList.add('active');
}

randomColors();
