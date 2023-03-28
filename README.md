# image-editor
[Demos](https://cdpn.io/pen/debug/gOeyxMm?authentication_hash=xnrabBnqYJEA) 

Tested minimum computer width: 900px. 

After the width of the computer become smaller than 900px, the elements will overlap with each other which require a redeisgn of the UI. 

Tested broswer: Chrome and Safari
Works perfect in Chrome, but the input range slider does not able to trigger Javascript event based on this [post](https://stackoverflow.com/questions/33343854/input-range-slider-not-working-on-ios-safari-when-clicking-on-track) which need to use css a div elemenmt and js event to simulatea slider. 

Some possible implementations that I don't make: 
Use html2canvas to create html element on canvas to add text with style to image
Find the proper js event that could make user crop the image

The project uses lot of flex structure which makes the website more responsive for different resolution.

