// let nextBtn = document.querySelector('.next-btn');
// let prevBtn = document.querySelector('.prev-btn');
let slider = document.querySelector('.slider');

for (let i = 0; i < 5; i++) {
    slider.innerHTML += `<li class="cursor-pointer glide__slide slide" style="width: 224px; margin-right: 16px;">
    <div class="flex-shrink-0 relative w-full aspect-w-7 aspect-h-5 h-0 rounded-3xl overflow-hidden group">
        <div class="nc-NcImage " data-nc-id="NcImage">
            <img src="./api/flags/${Math.floor(Math.random() * 300)}" class="object-cover w-full h-full rounded-2xl" alt="nc-imgs">
        </div>
        <span class="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
    </div>

</li>`;
}


// let slidePx = 0;
// nextBtn.addEventListener('click', function() {
//     slidePx -= 224 + 16;
//     slider.style.transform = `translateX(${slidePx}px)`;

// });
// prevBtn.addEventListener('click', function() {
//     slidePx += 224 + 16;
//     slider.style.transform = `translateX(${slidePx}px)`;
// });

let uplaodImageBtn = document.querySelector('.upload-btn');
let chooseColorBtn = document.querySelector('.choose-color-btn');
let chooseShapeBtn = document.querySelector('.choose-shape-btn');
let shapeContainer = document.querySelector('.shape-modal-container');
let shapeSVGNum = 9;
chooseShapeBtn.addEventListener('click', function() {
    shapeContainer.parentNode.classList.toggle('active');
});

shapeContainer.querySelectorAll('svg').forEach(function(shape) {
    shape.addEventListener('click', function() {
        chooseShapeBtn.querySelector('svg.shape-modal-item').innerHTML = shape.innerHTML;
        shapeContainer.parentNode.classList.remove('active');
        shapeSVGNum = parseInt(shape.id);
    });
});

let inputColor = document.createElement('input');
inputColor.type = 'color';
inputColor.style.border = 'none';
inputColor.style.outline = 'none';
inputColor.style.backgroundColor = 'transparent';
inputColor.addEventListener('change', function() {});
chooseColorBtn.appendChild(inputColor);
chooseColorBtn.addEventListener('click', function() {
    inputColor.click();
});

let inputUpload = document.createElement('input');
inputUpload.type = 'file';
inputUpload.style.display = 'none';

uplaodImageBtn.addEventListener('click', function() {
    inputUpload.click();
});


let flag = document.querySelector('.flag');
let svg = flag.querySelector('svg');

let pixelIsHere = false;
let flagHeight = flag.offsetHeight;
let flagWidth = flag.offsetWidth;
let pixelWidth = 10;
let pixelHeight = 10;
let eraserWidth = 50;
let eraserHeight = 50;
let uploadedImageWidth = 100;
let eraseMode = false;
let uploadMode = false;
let pixelHistory = [];

svg.setAttribute('width', flagWidth);
svg.setAttribute('height', flagHeight);
svg.setAttribute('viewBox', '0 0 ' + flagWidth + ' ' + flagHeight);

window.addEventListener('resize', function() {
    flagHeight = flag.offsetHeight;
    flagWidth = flag.offsetWidth;
    svg.setAttribute('width', flagWidth);
    svg.setAttribute('height', flagHeight);
    svg.setAttribute('viewBox', '0 0 ' + flagWidth + ' ' + flagHeight);
});

inputUpload.addEventListener('change', function() {
    let file = inputUpload.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        uploadMode = e.target.result;
        svg.addEventListener('wheel', changeUploadedImageSize, false);
        inputUpload.value = '';
    }
    reader.readAsDataURL(file);
});
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    e.stopPropagation();
});
flag.addEventListener('mousemove', function(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    let pixelX = Math.floor(x / pixelWidth);
    let pixelY = Math.floor(y / pixelHeight);
    clearAllPixels();
    if (eraseMode) {
        setEraser(x, y);
    } else if (uploadMode) {
        setUploadedImage(x, y, uploadMode);
    } else {
        setSVGChild(pixelWidth, pixelHeight, pixelX * pixelWidth, pixelY * pixelHeight, inputColor.value, true);
    }
});

flag.addEventListener('mouseleave', function() {
    clearAllPixels();
});

function setEraser(pixelX, pixelY) {
    let eraser = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eraser.setAttribute('cx', pixelX);
    eraser.setAttribute('cy', pixelY);
    eraser.setAttribute('r', eraserWidth / 2);
    eraser.classList.add('active');
    eraser.setAttribute('stroke', '#000');
    eraser.setAttribute('fill', '#fff');
    svg.appendChild(eraser);
}

function setUploadedImage(pixelX, pixelY, image) {
    let imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    imageElement.setAttribute('style', 'width: ' + uploadedImageWidth + 'px; height: auto;');
    imageElement.setAttribute('x', pixelX - uploadedImageWidth / 2);
    imageElement.setAttribute('y', pixelY - uploadedImageWidth / 2);
    imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', image);
    imageElement.classList.add('active');
    svg.appendChild(imageElement);

}

function clearPixelsInCircle(x, y, radius) {
    let pixels = svg.querySelectorAll('rect, circle, path');
    for (let i = 0; i < pixels.length; i++) {
        let pixelX = parseInt(pixels[i].getAttribute('x'));
        let pixelY = parseInt(pixels[i].getAttribute('y'));
        if (Math.sqrt(Math.pow(pixelX - x, 2) + Math.pow(pixelY - y, 2)) <= radius / 2) {
            pixelHistory.push(pixels[i]);
            svg.removeChild(pixels[i]);

        }
    }
}

function drawUploadedImage(x, y, image) {
    let setImage = document.createElement('img');
    setImage.src = image;
    setImage.style.width = uploadedImageWidth + 'px';
    setImage.style.height = "auto";
    document.body.appendChild(setImage);
    let setImageHeight = setImage.clientHeight;
    let setImageWidth = setImage.clientWidth;
    setImage.style.display = "none";

    let setImageCanvas = document.createElement('canvas');
    let setImageContext = setImageCanvas.getContext('2d');
    let resizedImageCanvas = document.createElement('canvas');
    let resizedImageCtx = resizedImageCanvas.getContext('2d');
    setImageCanvas.width = setImageWidth;
    setImageCanvas.height = setImageHeight;
    setImageContext.drawImage(setImage, 0, 0, setImageWidth, setImageHeight);
    resizedImageCanvas.width = setImageCanvas.width;
    resizedImageCanvas.height = setImageCanvas.height;
    resizedImageCtx.drawImage(setImageCanvas, 0, 0, setImageCanvas.width, setImageCanvas.height, 0, 0, setImageCanvas.width / pixelWidth, setImageCanvas.height / pixelHeight);


    for (let i = 0; i < setImageCanvas.width / pixelWidth; i++) {
        for (let j = 0; j < setImageCanvas.height / pixelHeight; j++) {
            let pixel = resizedImageCtx.getImageData(i, j, 1, 1);
            let pixelColor = pixel.data;
            if (pixelColor[3] > 0) {
                setSVGChild(pixelWidth, pixelHeight, x - uploadedImageWidth / 2 + (i * pixelWidth), y - uploadedImageWidth / 2 + (j * pixelHeight), 'rgb(' + pixelColor[0] + ',' + pixelColor[1] + ',' + pixelColor[2] + ')');
            }
        }
    }

    uploadMode = false;
    svg.removeEventListener('wheel', changeUploadedImageSize, false);
    clearAllPixels();
    document.body.removeChild(setImage);

}

function setPixel(e) {
    'use strict';
    let type = e.type;
    let x = e.offsetX;
    let y = e.offsetY;

    if (eraseMode) {
        clearPixelsInCircle(x, y, eraserWidth);
    } else {
        let pixelX = Math.floor(x / pixelWidth);
        let pixelY = Math.floor(y / pixelHeight);
        let pixelExist = svg.querySelector(`rect[x="${pixelX * pixelWidth}"][y="${pixelY * pixelHeight}"]:not(.active)`) || svg.querySelector(`circle[x="${pixelX * pixelWidth}"][y="${pixelY * pixelHeight}"]:not(.active)`) || svg.querySelector(`polygon[x="${pixelX * pixelWidth}"][y="${pixelY * pixelHeight}"]:not(.active)`) || svg.querySelector(`path[x="${pixelX * pixelWidth}"][y="${pixelY * pixelHeight}"]:not(.active)`);

        if (type === 'mousemove') {
            if (pixelIsHere) {
                if (pixelExist) {
                    pixelHistory.push(pixelExist);
                    pixelExist.remove();
                }
            } else {
                if (pixelExist) {
                    if (pixelExist.getAttribute('fill') != inputColor.value) {
                        pixelHistory.push(pixelExist);
                        svg.removeChild(pixelExist);
                        setSVGChild(pixelWidth, pixelHeight, pixelX * pixelWidth, pixelY * pixelHeight, inputColor.value);
                    }
                } else {
                    setSVGChild(pixelWidth, pixelHeight, pixelX * pixelWidth, pixelY * pixelHeight, inputColor.value);
                }
            }
        } else {
            if (pixelExist) {
                pixelHistory.push(pixelExist);
                svg.removeChild(pixelExist);
                pixelIsHere = true;

                if (pixelExist.getAttribute('fill') != inputColor.value) {
                    pixelIsHere = false;
                    setSVGChild(pixelWidth, pixelHeight, pixelX * pixelWidth, pixelY * pixelHeight, inputColor.value);
                }

            } else {
                pixelIsHere = false;
                setSVGChild(pixelWidth, pixelHeight, pixelX * pixelWidth, pixelY * pixelHeight, inputColor.value);
            }
        }
    }

}

function setSVGChild(width, height, x, y, fill, isPreview = false, isCtrlZ = false) {

    if (shapeSVGNum == 9) {
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        if (isPreview) {
            rect.classList.add('active');
            rect.setAttribute('stroke', inputColor.value);
            rect.setAttribute('fill', '#fff');
        } else {
            rect.setAttribute('fill', fill);
            if (!isCtrlZ) {
                pixelHistory.push(rect);
            }
        }
        svg.appendChild(rect);
    } else if (shapeSVGNum == 10) {
        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x + width / 2);
        circle.setAttribute('cy', y + height / 2);
        circle.setAttribute('r', width / 2);
        circle.setAttribute('x', x);
        circle.setAttribute('y', y);
        if (isPreview) {
            circle.classList.add('active');
            circle.setAttribute('stroke', inputColor.value);
            circle.setAttribute('fill', '#fff');
        } else {
            circle.setAttribute('fill', fill);
            if (!isCtrlZ) {
                pixelHistory.push(circle);
            }
        }
        svg.appendChild(circle);
    } else {
        let path = document.createElementNS('http://www.w3.org/2000/svg', shapeSVGNum <= 4 ? 'polygon' : 'path');

        if (shapeSVGNum <= 4) {

            if (shapeSVGNum == 1) {
                path.setAttribute('points', `${x} ${y},${x+width} ${y+height},${x} ${y+height}`);
            } else if (shapeSVGNum == 2) {
                path.setAttribute('points', `${x} ${y+height}, ${x+width} ${y}, ${x} ${y}`);
            } else if (shapeSVGNum == 3) {
                path.setAttribute('points', `${x} ${y}, ${x+width} ${y+height}, ${x+width} ${y}`);
            } else if (shapeSVGNum == 4) {
                path.setAttribute('points', `${x} ${y+height}, ${x+width} ${y+height}, ${x+width} ${y}`);
            }
        } else {
            if (shapeSVGNum == 5) {
                path.setAttribute('d', `M${x},${y} L${x+width},${y} L${x+width},${y+height} M${x},${y} Q${x},${y+width} ${x+width},${y+width}`);
            } else if (shapeSVGNum == 6) {
                path.setAttribute('d', `M${x},${y} L${x},${y+height} L${x+width},${y+height} M${x},${y} Q${x+width},${y} ${x+width},${y+height}`);
            } else if (shapeSVGNum == 7) {
                path.setAttribute('d', `M${x+width},${y} L${x+width},${y+height} L${x},${y+height} M${x},${y+height} Q${x},${y} ${x+width},${y}`);
            } else if (shapeSVGNum == 8) {
                path.setAttribute('d', `M${x+width},${y} L${x},${y} L${x},${y+height} M${x},${y+height} Q${x+width},${y+height} ${x+width},${y}`);
            }

        }
        path.setAttribute('x', x);
        path.setAttribute('y', y);
        path.setAttribute('height', height);
        path.setAttribute('width', width);
        if (isPreview) {
            path.classList.add('active');
            path.setAttribute('stroke', inputColor.value);
            path.setAttribute('fill', '#fff');
        } else {
            path.setAttribute('fill', fill);
            if (!isCtrlZ) {
                pixelHistory.push(path);
            }
        }
        svg.appendChild(path);
    }

}



flag.addEventListener('mousedown', function(e) {
    if (eraseMode) {
        clearPixelsInCircle(e.offsetX, e.offsetY, eraserWidth);
    } else if (uploadMode) {
        if (e.button == 0) {
            drawUploadedImage(e.offsetX, e.offsetY, uploadMode);
        } else {
            uploadMode = false;
            svg.removeEventListener('wheel', changeUploadedImageSize, false);
        }
    } else {
        setPixel(e);
    }
    flag.addEventListener('mousemove', setPixel, false);
    flag.addEventListener('mouseup', function() {
        flag.removeEventListener('mousemove', setPixel, false);
    }, false);
});


function clearAllPixels(all = false) {
    let pixelsRect = svg.querySelectorAll('rect');
    let pixelsCircle = svg.querySelectorAll('circle');
    let pixelsPath = svg.querySelectorAll('path');
    let pixelsPolygon = svg.querySelectorAll('polygon');
    let pixelsImage = svg.querySelectorAll('image');
    let pixels = [...pixelsRect, ...pixelsCircle, ...pixelsPath, ...pixelsPolygon, ...pixelsImage];

    pixels.forEach(function(pixel) {
        if (all) {
            svg.removeChild(pixel);
        } else if (pixel.classList.contains('active')) {
            svg.removeChild(pixel);
        }

    });
}


function setTemplate(src) {
    clearAllPixels(true);
    let image = new Image();
    image.src = src;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let resizedImageCanvas = document.createElement('canvas');
    let resizedImageCtx = resizedImageCanvas.getContext('2d');

    let width = image.width;
    let height = image.height;
    canvas.width = width;
    canvas.height = height;
    let ratio_16_9 = width * 9 / 16;
    let cropHeightDiff = height - ratio_16_9;
    image.onload = function() {
        ctx.drawImage(image, 0, cropHeightDiff / 2, width, ratio_16_9, 0, 0, width, ratio_16_9);

        resizedImageCanvas.width = flagWidth / pixelWidth;
        resizedImageCanvas.height = flagHeight / pixelHeight;
        resizedImageCtx.drawImage(canvas, 0, 0, width, ratio_16_9, 0, 0, flagWidth / pixelWidth, flagHeight / pixelHeight);

        for (let x = 0; x < flagWidth / pixelWidth; x++) {
            for (let y = 0; y < flagHeight / pixelHeight; y++) {
                let pixel = resizedImageCtx.getImageData(x, y, 1, 1).data;
                let fill = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
                let pixelRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                pixelRect.setAttribute('x', x * pixelWidth);
                pixelRect.setAttribute('y', y * pixelHeight);
                pixelRect.setAttribute('width', pixelWidth);
                pixelRect.setAttribute('height', pixelHeight);
                pixelRect.setAttribute('fill', fill);
                svg.appendChild(pixelRect);

            }
        }
    }
}

let slides = document.querySelectorAll('.slide');
slides.forEach(function(slide) {
    slide.addEventListener('click', function() {
        let url = slide.querySelector('img').getAttribute('src');
        setTemplate(url);
    });
});

let dlTool = document.querySelector('.dl-tool');
let shareTool = document.querySelector('.share-tool');
let eraseTool = document.querySelector('.erase-tool');
let deleteTool = document.querySelector('.delete-tool');

deleteTool.addEventListener('click', function() {
    clearAllPixels(true);
});

dlTool.addEventListener('click', function() {
    let svgData = svg.outerHTML;
    let svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8'
    });
    let svgUrl = URL.createObjectURL(svgBlob);
    let dlLink = document.createElement('a');
    dlLink.href = svgUrl;
    dlLink.download = 'flag.svg';
    dlLink.click();
});

function changeEraserSize(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY > 0) {
        if (eraserWidth > 5) {
            eraserWidth -= 5;
            eraserHeight -= 5;
        }
    } else {
        if (eraserWidth < 150) {
            eraserWidth += 5;
            eraserHeight += 5;
        }
    }
    document.querySelector('circle').setAttribute('r', eraserWidth / 2);
}

function changeUploadedImageSize(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY > 0) {
        if (uploadedImageWidth > 5) {
            uploadedImageWidth -= 5;
        }

    } else {
        if (uploadedImageWidth < 300) {
            uploadedImageWidth += 5;
        }
    }

}
eraseTool.addEventListener('click', function() {
    eraseMode = !eraseMode;
    if (eraseMode) {
        svg.addEventListener('wheel', changeEraserSize, false);
    } else if (uploadMode) {
        svg.addEventListener('wheel', changeUploadedImageSize, false);
    } else {
        svg.removeEventListener('wheel', changeEraserSize, false);
    }
    eraseTool.style.backgroundColor = eraseMode ? 'lightgray' : 'transparent';
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.keyCode == 90) {
        let lastPixel = pixelHistory[pixelHistory.length - 1];
        if (lastPixel) {
            let pixelExist = document.querySelector('rect[x="' + lastPixel.getAttribute('x') + '"][y="' + lastPixel.getAttribute('y') + '"]') || document.querySelector('circle[cx="' + lastPixel.getAttribute('x') + '"][cy="' + lastPixel.getAttribute('y') + '"]') || document.querySelector('path[x="' + lastPixel.getAttribute('x') + '"][y="' + lastPixel.getAttribute('y') + '"]') || document.querySelector('polygon[points="' + lastPixel.getAttribute('x') + ',' + lastPixel.getAttribute('y') + '"]');
            if (pixelExist) {
                svg.removeChild(pixelExist);
            } else {
                setSVGChild(lastPixel.getAttribute('width'), lastPixel.getAttribute('height'), lastPixel.getAttribute('x'), lastPixel.getAttribute('y'), lastPixel.getAttribute('fill'), false, true);
            }
            pixelHistory.pop();
        }
    }
});