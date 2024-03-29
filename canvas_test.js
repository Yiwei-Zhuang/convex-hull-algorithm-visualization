// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    let canvas = document.getElementById("viewport");
    let context = canvas.getContext("2d");

    // Define the image dimensions
    let width = canvas.width;
    let height = canvas.height;

    // Create an ImageData object
    let imagedata = context.createImageData(width, height);

    // Create the image
    function createImage(offset) {
        // Loop over all of the pixels
        for (let x=0; x<width; x++) {
            for (let y=0; y<height; y++) {
                // Get the pixel index
                let pixelindex = (y * width + x) * 4;

                // Generate a xor pattern with some random noise
                let red = ((x+offset) % 256) ^ ((y+offset) % 256);
                let green = ((2*x+offset) % 256) ^ ((2*y+offset) % 256);
                let blue = 50 + Math.floor(Math.random()*100);

                // Rotate the colors
                blue = (blue + offset) % 256;

                // Set the pixel data
                imagedata.data[pixelindex] = red;     // Red
                imagedata.data[pixelindex+1] = green; // Green
                imagedata.data[pixelindex+2] = blue;  // Blue
                imagedata.data[pixelindex+3] = 255;   // Alpha
            }
        }
    }

    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);

        // Create the image
        createImage(Math.floor(tframe / 10));

        // Draw the image data to the canvas
        context.putImageData(imagedata, 0, 0);
    }

    // Call the main loop
    main(0);
};