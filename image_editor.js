const drop_section = document.querySelector('#drop_section');
const image_editor = document.querySelector('#edit_image');
let image_data;

function calculateAspectRatioFit(srcWidth, srcHeight) {

  const ratio = window.innerWidth * 0.45 / srcWidth;
  if (srcHeight * ratio > window.innerHeight * 0.8) {

    // prevent vertical center that overflow if image size is bigger than window.height;
    const canvas_wrapper = document.querySelector('#canvas_wrapper');
    canvas_wrapper.parentNode.style.display = 'block';
    canvas_wrapper.style.position = 'absolute';
    canvas_wrapper.style.top = '10vh';
    document.body.style.overflow = 'scroll';


  } else {
    canvas_wrapper.parentNode.style.display = 'flex';
    canvas_wrapper.style.position = 'static';
     document.body.style.overflow = 'auto';



  }

  update_position();

  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio
  };
}
document.querySelectorAll('.change_line_button').forEach(button => {
  button.addEventListener('click', function() {

    document.querySelector('.selected').classList.remove('selected');

    button.classList.add('selected');




  })

});

document.querySelector('#cancel_button').addEventListener('click', function() {
  drop_section.parentNode.style.display = 'none';
  document.documentElement.style.setProperty('--opacity', "1");
  document.addEventListener('mousemove', zoom_tool);

})

document.querySelector('.expand_button').addEventListener('click', function() {
  drop_section.parentNode.style.display = 'flex';

  document.documentElement.style.setProperty('--opacity', "0.5");
  setTimeout(() => document.addEventListener('click', close_section));
  document.removeEventListener('mousemove', zoom_tool);
})

document.querySelectorAll('.copy_button').forEach(button => {
  button.addEventListener('click', function() {
    navigator.clipboard.writeText(button.parentNode.querySelector('span:nth-of-type(2)').textContent);
    make_notice("Code copied")


  });
})

function make_notice(text) {

  const notice = document.createElement('div');
  notice.className = 'notice';
  notice.textContent = text;
  document.body.appendChild(notice);
  setTimeout(() => notice.classList.add('first_notice'));

  const all_notice = document.querySelectorAll('.notice');
  let time;
  all_notice.forEach((notice, index) => {
    if (index < all_notice.length - 3) {
      notice.className = 'notice';
      notice.classList.add('further_notice');
      time = 750;
    } else {
      if (index === all_notice.length - 2) notice.className = 'notice second_notice'
      else if (index === all_notice.length - 3) notice.className = 'notice third_notice'
      time = 2000;
    }
    setTimeout(() => {

      notice.style.setProperty('opacity', '0', 'important');
      notice.addEventListener('transitionend', () => notice.remove());
    }, time)

  });
}
document.querySelector('input[type=checkbox]').addEventListener('change', function(event) {
  const rgba_value = document.querySelector('#rgba_value');
  const hex_value = document.querySelector('#hex_value')
  if (event.target.checked) {
    document.querySelector('#small_box .color_box > span:nth-of-type(1)').textContent = 'RGBA:';
    rgba_value.textContent = rgba_value.textContent.toRGBA("#small_box .box");
    hex_value.textContent = rgba_value.textContent.toHex();

  } else {
    document.querySelector('#small_box .color_box > span:nth-of-type(1)').textContent = 'RGB:';
    rgba_value.textContent = rgba_value.textContent.toRGB();
    hex_value.textContent = hex_value.textContent.slice(0, -1);


  }
})


function close_section(e) {
  const [posX, posY] = [e.clientX, e.clientY];


  const {
    left,
    right,
    top: top_pos,
    bottom
  } = drop_section.getBoundingClientRect();

  if (!(posX >= left && right >= posX && posY >= top_pos && bottom >= posY)) {
    drop_section.parentNode.style.display = 'none';
    document.documentElement.style.setProperty('--opacity', "1");
    document.removeEventListener('click', close_section);
    document.addEventListener('mousemove', zoom_tool);


  }

}
const table = document.querySelector('table');
const wrapper = document.querySelector('#wrapper');
for (let i = 0; i < 11; i++) {
  const tr = document.createElement('tr');
  tr.id = `tr${i}`;
  table.querySelector('tbody').appendChild(tr);
  for (let index = 0; index < 11; index++) {
    const td = document.createElement('td');
    td.setAttribute('data-x', index);
    td.setAttribute('data-y', i);
    tr.appendChild(td)

  }
}


let current_image;
const input = document.querySelector('input[type=file]');

function load_image(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = url;
    return img
  })
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const img = new Image();
current_image = img;
img.crossOrigin = "Anonymous";
img.onload = function() {
  context.canvas.width = calculateAspectRatioFit(img.width, img.height).width;
  context.canvas.height = calculateAspectRatioFit(img.width, img.height).height;
  context.drawImage(img, 0, 0, calculateAspectRatioFit(img.width, img.height).width, calculateAspectRatioFit(img.width, img.height).height);
  const data = canvas.toDataURL("image/jpg");

  image_data = data;

}

img.src = "https:media.istockphoto.com/photos/villefranchesurmer-village-in-france-picture-id1248448159?k=20&m=1248448159&s=612x612&w=0&h=leahrG95LcBDfdkPCavNL9W8ZC2OroNZPqO-196HDPU=";


drop_section.ondragover = drop_section.ondragenter = function(evt) {
  evt.preventDefault();
};
drop_section.ondrop = function(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();
  reader.onload = async function(event) {
    const image = await load_image(event.target.result);
    context.canvas.width = calculateAspectRatioFit(image.width, image.height).width;
    context.canvas.height = calculateAspectRatioFit(image.width, image.height).height;
    current_image = image;

    context.drawImage(image, 0, 0, calculateAspectRatioFit(image.width, image.height).width, calculateAspectRatioFit(image.width, image.height).height);
    drop_section.parentNode.style.display = 'none';
    document.documentElement.style.setProperty('--opacity', "1");
    const data = canvas.toDataURL("image/jpg");

    image_data = data;

  }
  reader.readAsDataURL(file);
}

document.querySelectorAll('input[type=file]').forEach(input => {
  input.addEventListener('change', function() {
    document.documentElement.style.setProperty('--opacity', "1");
    drop_section.parentNode.style.display = 'none';
    const file = input.files[0];
    const read_size = input.files[0].size;
    const file_reader = new FileReader();
    file_reader.onload = async function(e) {
      const image = await load_image(e.target.result);
      context.filter = "none";

      context.canvas.width = calculateAspectRatioFit(image.width, image.height).width;
      context.canvas.height = calculateAspectRatioFit(image.width, image.height).height;
      current_image = image;
      context.drawImage(image, 0, 0, calculateAspectRatioFit(image.width, image.height).width, calculateAspectRatioFit(image.width, image.height).height);
      const data = canvas.toDataURL("image/jpg");

      image_data = data;




    }

    file_reader.readAsDataURL(file)


  })
});


function isInCanvas(posX, posY) {
  const coord = canvas.getBoundingClientRect();
  return posX >= coord.left && posX <= coord.right && posY >= coord.top && posY <= coord.bottom;
}

document.addEventListener('mousemove', zoom_tool);
canvas.addEventListener('click', display_color);
/*
function get_color() {
  let color = ;
  display_color(color)

}*/

function display_color(input ){
      console.log(input)
    let color = input || window.getComputedStyle(document.querySelector('td[data-x="5"][data-y="5"]'))['background-color'];

  document.querySelector('#big_box .box').style.backgroundColor = color;
  if (document.querySelector('input[type=checkbox]').checked) {
    console.log(color)
   color = color.toRGBA("#big_box .box");
   document.querySelector('#hex_value').textContent = color.toHex();

  } else {
  document.querySelector('#hex_value').textContent = color.toRGBA("#big_box .box").toHex().slice(0, -1);
   color = color.toRGB();

  }
  document.querySelector('#rgba_value').textContent = color;

}

function zoom_tool(e) {

  if (!isInCanvas(e.clientX, e.clientY)) {
    document.body.style.cursor = "initial";
    wrapper.style.display = 'none';
    return;
  } else wrapper.style.display = 'block';
  //document.body.style.cursor='crosshair';
  let color = window.getComputedStyle(document.querySelector('td[data-x="5"][data-y="5"]'))['background-color'];
  document.querySelector('#small_box .box').style.backgroundColor = color;
  const posX = e.clientX - canvas.getBoundingClientRect().left;
  const posY = e.clientY - canvas.getBoundingClientRect().top;
  const data = canvas.getContext('2d').getImageData(posX - 5, posY - 5, 11, 11).data;
  const data_array = [];
  for (let i = 0; i < data.length; i += 4) data_array.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
  table.querySelectorAll('td').forEach((td, index) => {
    const rgba = data_array[index]
    td.style.backgroundColor = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
  })
  wrapper.style.left = e.pageX + "px";
  wrapper.style.top = e.pageY + 'px';
}

window.addEventListener('resize', function() {
  const image = current_image;
  context.canvas.width = calculateAspectRatioFit(image.width, image.height).width;
  context.canvas.height = calculateAspectRatioFit(image.width, image.height).height;
  current_image = image;
  context.drawImage(image, 0, 0, calculateAspectRatioFit(image.width, image.height).width, calculateAspectRatioFit(image.width, image.height).height);

})


String.prototype.toHex = function() {
  const [r, g, b, a] = this.substring(this.indexOf("(") + 1, this.indexOf(")") - 1).split(',').map(Number);


  return `#${r.toString(16).padStart(2,0) + g.toString(16).padStart(2,0) + b.toString(16).padStart(2,0) + Math.round(a * 255).toString(16).substring(0,2)}`
};
String.prototype.toRGB = function() {
  if (!this.toUpperCase().startsWith('RGBA')) return this;

  const [r, g, b, a] = this.substring(this.indexOf("(") + 1, this.indexOf(")") - 1).split(',');
  return `rgb(${r}, ${g}, ${b})`
};
String.prototype.toRGBA = function(ele) {
  const color = window.getComputedStyle(document.querySelector(ele)).getPropertyValue('background-color');

  if (color.toUpperCase().startsWith('RGBA')) return color;

  else return `rgba(${color.substring(color.indexOf("(")+1,color.indexOf(")")-1)}, 1)`;

};




window.onload  = function() {
  const canvas_dimension  = canvas.getBoundingClientRect();
  let color = context.getImageData(canvas_dimension.left + Math.random() * canvas_dimension.width, canvas_dimension.top + Math.random() * canvas_dimension.height, 1,1).data;
  console.log(`rgb(${color.join(", ")})`)
  //convert from Uint8ClampedArray to rgb format
  display_color(`rgb(${color.join(", ")})`)
  console.log(color)
  console.log(canvas_dimension.left + Math.random() * canvas_dimension.width, canvas_dimension.top + Math.random() * canvas_dimension.height)
}


document.querySelectorAll('input[type=file]').forEach(input => {
  input.parentNode.addEventListener('click', function() {
    input.parentNode.classList.add('effect')
  })
})

const cropper_list = [];
for (let i = 0; i < 8; i++) {
  const cropper = document.createElement('div');
  cropper.className = `cropper_point cropper_point_${i+1}`;
  document.body.appendChild(cropper);
  cropper_list.push(cropper);
};
const cropper_side = [];
for (let i = 0; i < 4; i++) {
  const side = document.createElement('div');
  side.className = `cropper_side cropper_${(i+1) % 2 === 0 ? "hor" : "ver"}_${i+1}`;
  document.body.appendChild(side);
  cropper_side.push(side);
}


function update_position() {

  let {
    top: canvas_top,
    left: canvas_left,
    right: canvas_right,
    bottom: canvas_bottom,
    width: canvas_width,
    height: canvas_height
  } = document.querySelector('canvas').getBoundingClientRect();

  canvas_left += window.scrollX;
  canvas_top += window.scrollY;
  canvas_bottom += window.scrollY;
  canvas_right += window.scrollX;
  const outline = parseFloat(getComputedStyle(canvas).getPropertyValue('--outline_size'));



  cropper_list[0].style.top = canvas_top + outline / 2 + 'px';
  cropper_list[0].style.left = canvas_left + outline / 2 + 'px';
  cropper_list[1].style.left = canvas_left + canvas_width / 2 + "px"
  cropper_list[1].style.top = canvas_top + outline / 2 + 'px';
  cropper_list[2].style.left = canvas_right + outline / 2 + 'px';
  cropper_list[2].style.top = canvas_top + outline / 2 + 'px';
  cropper_list[3].style.left = canvas_right + outline / 2 + 'px';
  cropper_list[3].style.top = canvas_top + canvas_height / 2 + 'px';
  cropper_list[4].style.left = canvas_right + outline / 2 + 'px';
  cropper_list[4].style.top = canvas_bottom + outline / 2 + 'px';
  cropper_list[5].style.left = canvas_left + canvas_width / 2 + "px";
  cropper_list[5].style.top = canvas_bottom + outline / 2 + "px";
  cropper_list[6].style.left = canvas_left + outline / 2 + 'px';
  cropper_list[6].style.top = canvas_bottom + outline / 2 + "px";
  cropper_list[7].style.left = canvas_left + outline / 2 + 'px';
  cropper_list[7].style.top = canvas_top + canvas_height / 2 + 'px';




  cropper_side[0].style.left = canvas_left + 'px';
  cropper_side[0].style.height = canvas_height + 'px';
  cropper_side[0].style.top = canvas_top + 'px';

  cropper_side[1].style.width = canvas_width + 'px';

  cropper_side[1].style.left = canvas_left + 'px';
  cropper_side[1].style.top = canvas_top + 'px';


  cropper_side[2].style.left = canvas_right + 'px';
  cropper_side[2].style.height = canvas_height + 'px';
  cropper_side[2].style.top = canvas_top + 'px';

  cropper_side[3].style.width = canvas_width + 'px';

  cropper_side[3].style.left = canvas_left + 'px';
  cropper_side[3].style.top = canvas_bottom + 'px';

}
edit_image.addEventListener('click', function() {
  active_stylesheet("stylesheet_two");
  if (document.querySelector('.photo_canvas')) document.querySelector('.photo_canvas').remove();
  preview.style.visibility = 'visible';
  all_text_button[0].click();


})







const all_text_button = document.querySelectorAll('.text');
const all_button = document.querySelectorAll('.button');
all_text_button.forEach((text, index) => {
  text.addEventListener('click', () => all_button[index].click());
  text.addEventListener('mouseenter', () => all_button[index].children[0].classList.add("button_hover"));
  text.addEventListener('mouseleave', () => all_button[index].children[0].classList.remove("button_hover"));

});
let prev_index = null;
all_button.forEach((button, index) => {
  button.children[0].addEventListener('mouseenter', () => all_text_button[index].children[0].classList.add("text_hover"));
  button.addEventListener('mouseleave', () => all_text_button[index].children[0].classList.remove("text_hover"));


  button.addEventListener('click', function() {
    if (prev_index !== null) {
      all_button[prev_index].children[0].style.opacity = 0.45;
      all_text_button[prev_index].children[0].style.color = 'rgba(108, 122, 137)';
    }

    button.children[0].style.setProperty('opacity', "1", "important");
    prev_index = index;

    all_text_button[index].children[0].style.setProperty('color', "black");
  });
  //if(button.id=)
});

let timeout;
document.querySelector('nav').addEventListener('mouseenter', e => {
  timeout = setTimeout(() => {
    e.target.style.width = '11vw';
    e.target.querySelector('#explanation').style.display = 'block';
  }, 500);
})
document.querySelector('nav').addEventListener('mouseleave', e => {
  e.target.style.width = '5vw';
  e.target.querySelector('#explanation').style.display = 'none';
  if (timeout) window.clearTimeout(timeout)
});


document.querySelector('#crop_button').children[0].addEventListener('click', function() {

  document.querySelectorAll('.cropper_point').forEach(i => i.style.display = 'block');
  document.querySelectorAll('.cropper_side').forEach(i => i.style.display = 'block');
})
/*
document.querySelectorAll(".cropper_point").forEach(i=>{
    

    i.addEventListener('click',e=>{
       
        canvas.style.width = e.clientX + 'px';
        canvas.style.height = e.clientY +'px'


    })
   

})
*/
const all_input_range = document.querySelectorAll('input[type=range]');

function update_input() {
  all_input_range.forEach(input => {
    const text = input.parentNode.querySelector('div').textContent;
    const units = (text !== "Blur" ? (text !== "Hue-rotate" ? "%" : "deg") : "px");
    input.parentNode.querySelector('.range_value').textContent = input.value + units;
  });
};

update_input();

all_input_range.forEach(input => {
  input.oninput = function() {
    const text = input.parentNode.querySelector('div').textContent;
    const units = (text !== "Blur" ? (text !== "Hue-rotate" ? "%" : "deg") : "px");
    input.parentNode.querySelector('.range_value').textContent = input.value + units;
    context.filter = "brightness(100%)";
    all_input_range.forEach(i => {

      const text = i.parentNode.querySelector('div').textContent;
      const units = (text !== "Blur" ? (text !== "Hue-rotate" ? "%" : "deg") : "px");

      context.filter += `${text.toLowerCase()}(${i.value + units}) `;


    });
    context.save();
    context.restore();

    const image = new Image();
    image.onload = function() {
      context.drawImage(image, 0, 0, calculateAspectRatioFit(image.width, image.height).width, calculateAspectRatioFit(image.width, image.height).height);
    }
    image.src = image_data;


  }
});

document.querySelector('.reset_button').addEventListener('click', function() {
  all_input_range.forEach(input => {
    const text = input.parentNode.querySelector('div').textContent;
    if (text === "Brightness" || text === "Saturate" || text === "Contrast") input.value = 100;
    else input.value = 0;
  });
  context.filter = "none";
  context.save();
  context.restore();
  const image = new Image();
  image.onload = function() {
    context.drawImage(image, 0, 0, calculateAspectRatioFit(image.width, image.height).width, calculateAspectRatioFit(image.width, image.height).height);
  }
  canvas.style.opacity = 1;
  image.src = image_data;
  update_input();
})


let track;
const video = document.querySelector('video');
document.querySelector('#take_image').addEventListener('click', function() {
  active_stylesheet("stylesheet_three");
  navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      stream = stream;
      track = stream.getTracks();
    })

})

function active_stylesheet(remain_stylesheet_id) {
  document.querySelectorAll("link[rel=stylesheet]:not(#stylesheet_general").forEach(link => {
    if (link.id != remain_stylesheet_id) link.setAttribute("disabled", true);
    else link.removeAttribute('disabled');

  });


}



document.querySelector('#take_photo_button').addEventListener('click', function() {
  const canvas = document.createElement('canvas');
  const preview = document.querySelector('#preview');
  canvas.className = 'photo_canvas';
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');
  context.canvas.width = preview.offsetWidth;
  context.canvas.height = preview.offsetHeight;


  context.drawImage(video, 0, 0, preview.offsetWidth, preview.offsetHeight);
  const data = canvas.toDataURL('image/png');
  canvas.src = data;
  canvas.style.position = 'absolute';

  canvas.style.left = preview.getBoundingClientRect().left + window.scrollX + "px";
  canvas.style.top = preview.getBoundingClientRect().top + window.scrollY + "px";
  const correct_button = document.querySelector('.correct_mark');
  const delete_button = document.querySelector('.delete_button');
  correct_button.style.display = 'revert';
  delete_button.style.display = 'revert';
  preview.style.visibility = 'hidden';
  delete_button.addEventListener('click', function() {
    preview.style.visibility = 'visible';
    canvas.remove();
    correct_button.style.display = 'none';
    delete_button.style.display = 'none';

  })
  correct_button.addEventListener('click', function() {
    track.forEach(track => {
      track.stop();
    });

    image_data = canvas.toDataURL('image/png');


    const general_canvas = canvas_wrapper.querySelector('canvas')
    const image = new Image();
    current_image = image;
    image.onload = function() {
        console.log(image.width,image.height)
     // general_canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

  general_canvas.getContext('2d').canvas.width = calculateAspectRatioFit(image.width, image.height).width;
  general_canvas.getContext('2d').canvas.height = calculateAspectRatioFit(image.width, image.height).height;
  current_image = image;
  general_canvas.getContext('2d').drawImage(image, 0, 0, calculateAspectRatioFit(image.width, image.height).width, calculateAspectRatioFit(image.width, image.height).height);
    }
    image.src = image_data;
    correct_button.style.display = 'none';
    delete_button.style.display = 'none';
 console.log(image.width)

//setTimeout(()=>window.dispatchEvent(new Event('resize')),0);
    edit_image.click();
  })

})

document.querySelector('#pick_color').addEventListener('click', function() {
  active_stylesheet('stylesheet_one');
  if (document.querySelector('.photo_canvas')) document.querySelector('.photo_canvas').remove();
  preview.style.visibility = 'visible';
});

document.querySelector('#download_image_button').addEventListener('click', function() {
  if (!document.querySelector('.selected_format_button')) {
    make_notice("Please select a format first!");
    return;
  }
  const link = document.createElement('a');
  link.download = document.querySelector('#file_input').value;

  link.href = canvas.toDataURL(`image/${document.querySelector('.selected_format_button').textContent.toLowerCase()}`);
  link.click();
  link.remove();
 // debugger
});

document.querySelectorAll('.format_button').forEach(button => {
  button.addEventListener('click', function() {
    if (document.querySelector('.selected_format_button')) document.querySelector('.selected_format_button').classList.remove('selected_format_button');
    button.classList.add("selected_format_button");

  })
});
document.querySelector('#download_button').addEventListener('click', function() {
  document.querySelector('#download_section').style.display = 'revert';
  document.querySelector('#filter_section').style.display = 'none';
  const size = window.atob(canvas.toDataURL(`image/${document.querySelector('.selected_format_button') ? document.querySelector('.selected_format_button').textContent.toLowerCase() : "png"}`).split(",")[1]).length + " bytes";
  document.querySelector("#file_size").textContent = size;
  if (document.querySelector('.alert')) document.querySelector('.alert').remove()


});
document.querySelector('#filter_button').addEventListener('click', function() {
  document.querySelector('#download_section').style.display = 'none';
  document.querySelector('#filter_section').style.display = 'revert';


})

function unfinished_message() {
  if (document.querySelector('.alert')) document.querySelector('.alert').remove();
  document.querySelector('#download_section').style.display = 'none';
  document.querySelector('#filter_section').style.display = 'none';
  const div = document.createElement('div');
  div.className = 'alert'
  div.style.fontSize = "1.5em";
  div.textContent = "Hi, thanks for exploring my project. This is designed for Hack the 6ix 2022 hackathon. Unforunately, this functionality is unfinished due to the lack of time. Check back later and explore more :) ";
  document.querySelector('#setting_section').appendChild(div);


}

document.querySelector('#text_button').addEventListener('click', unfinished_message);
document.querySelector('#crop_button').addEventListener('click', () => {
  unfinished_message();
  update_position();
});
document.querySelector('#art_button').addEventListener('click', unfinished_message)








