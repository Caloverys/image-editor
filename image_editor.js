const drop_section = document.querySelector('#drop_section');
function calculateAspectRatioFit(srcWidth, srcHeight) {

    const ratio = window.innerWidth * 0.45 / srcWidth;
    if(srcHeight > window.innerHeight * 0.8){
    //document.querySelector('#canvas_wrapper').parentNode => .vertical_center

    //prevent vertical center that overflow if image size is bigger than window.height;
    const canvas_wrapper = document.querySelector('#canvas_wrapper');
    canvas_wrapper.parentNode.style.display= 'block';
    canvas_wrapper.style.position = 'absolute';
    canvas_wrapper.style.top = '20vh';


    }else{
    canvas_wrapper.parentNode.style.display= 'flex';
    canvas_wrapper.style.position = 'static';
       

    }

    update_position();

    return {
    width: srcWidth * ratio,
    height: srcHeight * ratio
    };
 }
document.querySelectorAll('.change_line_button').forEach(button =>{
button.addEventListener('click',function(){

document.querySelector('.selected').classList.remove('selected');

button.classList.add('selected');




})

});

document.querySelector('#cancel_button').addEventListener('click',function(){
drop_section.parentNode.style.display = 'none';
document.documentElement.style.setProperty('--opacity',"1");
document.addEventListener('mousemove',zoom_tool);

})

document.querySelector('.expand_button').addEventListener('click',function(){
drop_section.parentNode.style.display = 'flex';

document.documentElement.style.setProperty('--opacity',"outline/2");
setTimeout(()=>document.addEventListener('click',close_section));
document.removeEventListener('mousemove',zoom_tool);
})

document.querySelectorAll('.copy_button').forEach(button =>{
button.addEventListener('click',function(){
navigator.clipboard.writeText(button.parentNode.querySelector('span:nth-of-type(2)').textContent);
const notice = document.createElement('div');
notice.className = 'notice';
notice.textContent = 'Code copied'
document.body.appendChild(notice);
setTimeout(()=>notice.classList.add('first_notice'));

const all_notice = document.querySelectorAll('.notice');
let time;
all_notice.forEach((notice,index) =>{
if(index < all_notice.length - 3){
notice.className = 'notice';
notice.classList.add('further_notice');
time = 750;
}else{
if(index === all_notice.length - 2) notice.className = 'notice second_notice'
else if(index === all_notice.length - 3) notice.className = 'notice third_notice'
          time = 2000;
}
setTimeout(()=>{

notice.style.setProperty('opacity', '0', 'important');
notice.addEventListener('transitionend',()=>notice.remove());
},time)

})
});



});
document.querySelector('input[type=checkbox]').addEventListener('change',function(event){
    const rgba_value = document.querySelector('#rgba_value');
    const hex_value = document.querySelector('#hex_value')
if(event.target.checked){
document.querySelector('#small_box .color_box > span:nth-of-type(1)').textContent = 'RGBA:';
rgba_value.textContent = rgba_value.textContent.toRGBA("#small_box .box");
hex_value.textContent = rgba_value.textContent.toHex();

}else{
document.querySelector('#small_box .color_box > span:nth-of-type(1)').textContent = 'RGB:';
rgba_value.textContent = rgba_value.textContent.toRGB();
 hex_value.textContent = hex_value.textContent.slice(0,-1);


}
})


function close_section(e){
const [posX,posY] = [e.clientX,e.clientY];


const {left,right,top:top_pos,bottom} = drop_section.getBoundingClientRect();
console.log(posX,left,right,top_pos,bottom,posY)
if(!(posX >= left && right >= posX && posY >= top_pos && bottom >= posY)){
drop_section.parentNode.style.display = 'none';
document.documentElement.style.setProperty('--opacity',"1");
document.removeEventListener('click',close_section);
document.addEventListener('mousemove',zoom_tool);


}

}
const table = document.querySelector('table');
const wrapper = document.querySelector('#wrapper');
for(let i =0;i<11;i++){
const tr = document.createElement('tr');
tr.id=`tr${i}`;
table.querySelector('tbody').appendChild(tr);
for(let index=0;index<11;index++){
const td = document.createElement('td');
td.setAttribute('data-x',index);
td.setAttribute('data-y',i);
tr.appendChild(td)

}
}


let current_image;
const input = document.querySelector('input');
function load_image(url){
return new Promise(resolve=>{
const img = new Image();
img.onload = ()=>resolve(img);
img.src = url;
return img
})
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const img = new Image();
current_image = img;
img.crossOrigin = "Anonymous";
img.onload = function(){
context.canvas.width  = calculateAspectRatioFit(img.width,img.height).width;
context.canvas.height = calculateAspectRatioFit(img.width,img.height).height;
context.drawImage(img,0,0,calculateAspectRatioFit(img.width,img.height).width,calculateAspectRatioFit(img.width,img.height).height);


}

img.src = "https://media.istockphoto.com/photos/villefranchesurmer-village-in-france-picture-id1248448159?k=20&m=1248448159&s=612x612&w=0&h=leahrG95LcBDfdkPCavNL9W8ZC2OroNZPqO-196HDPU=";

//img.crossOrigin = "none";

var newWin
//var newWin = window.open();;            
//check if user block pop-up window
if(!newWin || newWin.closed || typeof newWin.closed=='undefined')
{

}
drop_section.ondragover = drop_section.ondragenter = function(evt) {
  evt.preventDefault();
};
drop_section.ondrop = function(e){
e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = async function(event){
     const image = await load_image(event.target.result);
       context.canvas.width  = calculateAspectRatioFit(image.width,image.height).width;
context.canvas.height = calculateAspectRatioFit(image.width,image.height).height;
current_image = image;
context.drawImage(image,0,0,calculateAspectRatioFit(image.width,image.height).width,calculateAspectRatioFit(image.width,image.height).height);
       drop_section.parentNode.style.display = 'none';
       document.documentElement.style.setProperty('--opacity',"1");

    }
    reader.readAsDataURL(file);
}

document.querySelectorAll('input[type=file]').forEach(input =>{
input.addEventListener('change',function(){
document.documentElement.style.setProperty('--opacity',"1");
drop_section.parentNode.style.display = 'none';
const file = input.files[0];
const read_size = input.files[0].size;
console.log(read_size)
const file_reader = new FileReader();
file_reader.onload = async function(e){
const image = await load_image(e.target.result);
console.log(image);
context.filter = "saturate(8)";    
context.drawImage(image,0,0);
const data = canvas.toDataURL("image/jpg");
context.filter = "none";  
context.canvas.width  = calculateAspectRatioFit(image.width,image.height).width;
context.canvas.height = calculateAspectRatioFit(image.width,image.height).height;
current_image = image;
context.drawImage(image,0,0,calculateAspectRatioFit(image.width,image.height).width,calculateAspectRatioFit(image.width,image.height).height);


                const imae = document.createElement('img');

    imae.src = data;
     document.body.appendChild(imae);
      const blob = new Blob([data])
      console.log(blob.size)

}

file_reader.readAsDataURL(file)


        })
});


        function isInCanvas(posX,posY){
        const coord = canvas.getBoundingClientRect();
        return posX >= coord.left && posX <= coord.right && posY >= coord.top && posY <= coord.bottom;
        }

document.addEventListener('mousemove',zoom_tool);
           canvas.addEventListener('click',get_color);

           function get_color(){
            let color = window.getComputedStyle(document.querySelector('td[data-x="5"][data-y="5"]'))['background-color'];
            document.querySelector('#big_box .box').style.backgroundColor = color;
            console.log(document.querySelector('#big_box .box'))
            if(document.querySelector('input[type=checkbox]').checked){
            color = color.toRGBA("#big_box .box");
            document.querySelector('#hex_value').textContent = color.toHex();

            }else{
            document.querySelector('#hex_value').textContent = color.toRGBA("#big_box .box").toHex().slice(0,-1);
            color = color.toRGB();

            }
   document.querySelector('#rgba_value').textContent = color;


           }
function zoom_tool(e){
if(!isInCanvas(e.clientX,e.clientY)){
document.body.style.cursor = "initial";
                wrapper.style.display = 'none';
                return;
}else wrapper.style.display = 'block';
document.body.style.cursor='crosshair';
let color = window.getComputedStyle(document.querySelector('td[data-x="5"][data-y="5"]'))['background-color'];
   document.querySelector('#small_box .box').style.backgroundColor = color;
const posX = e.clientX - canvas.getBoundingClientRect().left;
const posY = e.clientY - canvas.getBoundingClientRect().top;
const data = canvas.getContext('2d').getImageData(posX-5,posY-5,11,11).data;
const data_array = [];
for(let i=0;i<data.length;i+=4) data_array.push([data[i],data[i+1],data[i+2],data[i+3]]);
table.querySelectorAll('td').forEach((td,index)=>{
const rgba = data_array[index]
td.style.backgroundColor = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
})
wrapper.style.left = e.pageX + "px";
wrapper.style.top = e.pageY+'px';
}

window.addEventListener('resize',function(){
                const image = current_image;  
context.canvas.width  = calculateAspectRatioFit(image.width,image.height).width;
context.canvas.height = calculateAspectRatioFit(image.width,image.height).height;
current_image = image;
context.drawImage(image,0,0,calculateAspectRatioFit(image.width,image.height).width,calculateAspectRatioFit(image.width,image.height).height);

})


String.prototype.toHex = function(){
const [r,g,b,a] = this.substring(this.indexOf("(")+1,this.indexOf(")")-1).split(',').map(Number);
console.log(r,g,b,a)
console.log(r.toString(16).padStart(2,0),g.toString(16).padStart(2,0),b.toString(16).padStart(2,0), Math.round(a * 255).toString(16).substring(0,2))

return `#${r.toString(16).padStart(2,0) + g.toString(16).padStart(2,0) + b.toString(16).padStart(2,0) + Math.round(a * 255).toString(16).substring(0,2)}`
};
String.prototype.toRGB = function() {
if(!this.toUpperCase().startsWith('RGBA')) return this;
console.log(this,this.substring(this.indexOf("(")+1,this.indexOf(")")-1))
const [r,g,b,a] = this.substring(this.indexOf("(")+1,this.indexOf(")")-1).split(',');
return `rgb(${r}, ${g}, ${b})`
};
String.prototype.toRGBA = function(ele) {
const color = window.getComputedStyle(document.querySelector(ele)).getPropertyValue('background-color');
console.log(color.substring(color.indexOf("(")+1,color.indexOf(")")-1))
if(color.toUpperCase().startsWith('RGBA')) return color;

else return `rgba(${color.substring(color.indexOf("(")+1,color.indexOf(")")-1)}, 1)`;

};



window.onload = function(){
//document.elementFromPoint(400, 500).click();
}


document.querySelectorAll('input[type=file]').forEach(input =>{
input.parentNode.addEventListener('click',function(){
input.parentNode.classList.add('effect')
})
})

        const cropper_list = [];
for(let i = 0;i< 8;i++){
const cropper = document.createElement('div');
cropper.className = `cropper_point cropper_point_${i+1}`;
document.body.appendChild(cropper);
cropper_list.push(cropper);
};
const cropper_side = [];
for(let i = 0;i< 4;i++){
const side = document.createElement('div');
side.className = `cropper_side cropper_${(i+1) % 2 === 0 ? "hor" : "ver"}_${i+1}`;
document.body.appendChild(side);
cropper_side.push(side);
}
 

function update_position(){

   let {top:canvas_top,left:canvas_left,right:canvas_right,bottom: canvas_bottom,width:canvas_width,height:canvas_height} = document.querySelector('canvas').getBoundingClientRect();
   
   canvas_left +=  window.scrollX;
   canvas_top += window.scrollY;
   canvas_bottom +=window.scrollY;
   canvas_right += window.scrollX;

   let outline =window.getComputedStyle(canvas).getPropertyValue('outline');
   console.log(typeof outline)
   outline = parseFloat(outline.substring(outline.length- 3));



console.log(window.getComputedStyle(canvas).getPropertyValue('outline'))
console.log(canvas_top-outline/2, canvas_top)
   
cropper_list[0].style.top = canvas_top  - outline/2 + 'px';
cropper_list[0].style.left =  canvas_left - outline/2 +'px';
cropper_list[1].style.left = canvas_left + canvas_width/2 +"px"
cropper_list[1].style.top = canvas_top  - outline/2  +'px';
cropper_list[2].style.left = canvas_right +outline/2 + 'px';
   cropper_list[2].style.top = canvas_top - outline/2  +'px';
   cropper_list[3].style.left = canvas_right +outline/2 +'px';
   cropper_list[3].style.top = canvas_top + canvas_height/2 + 'px';
   cropper_list[4].style.left = canvas_right +outline/2 +'px';
   cropper_list[4].style.top = canvas_bottom + outline/2 + 'px';
   cropper_list[5].style.left = canvas_left +canvas_width/2 + "px";
   cropper_list[5].style.top = canvas_bottom +outline/2 + "px";
   cropper_list[6].style.left = canvas_left + 'px';
    cropper_list[6].style.top = canvas_bottom + outline/2 + "px";
    cropper_list[7].style.left = canvas_left  -outline/2 + 'px';
    cropper_list[7].style.top = canvas_top + canvas_height/2  + 'px';
   



    cropper_side[0].style.left = canvas_left -0.5 + 'px';
    cropper_side[0].style.height  = canvas_height + 'px';
    cropper_side[0].style.top = canvas_top  + 'px';

    cropper_side[1].style.width= canvas_width + 'px';

    cropper_side[1].style.left = canvas_left + 'px';
    cropper_side[1].style.top = canvas_top + 'px';


    cropper_side[2].style.left = canvas_right + 'px';
     cropper_side[2].style.height  = canvas_height + 'px';
    cropper_side[2].style.top = canvas_top  + 'px';

  cropper_side[3].style.width = canvas_width + 'px';
         
    cropper_side[3].style.left = canvas_left + 'px';
    cropper_side[3].style.top = canvas_bottom  + 'px';
   

}
