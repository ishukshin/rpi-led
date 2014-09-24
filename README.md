rpi-led
=======

The project helps to connect any electric device like LED to the internet. Connection is performed via Raspberry Pi and node.js.

*Usage*

0. Connect RPi to the internet via ethernet cable.
1. Connect LED to GPIO pins 7 and GRND of Raspberry Pi.
2. Install node.js and npm packet: socket-io.client
3. Install node.js and socket-io at your server
4. Launch ``node rpi.js`` at your server
5. Add header to the layout of your site.
6. Launch ``node led.js`` at RPi.
7. Go to your site and watch led blinking, then close your site, blinking has gone.
