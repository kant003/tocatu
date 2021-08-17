# Practica piano

Con este dispositivo podrás practicar tus canciones favoritas en tu piano.
El dispositivo permite cargar una canción de tu disco duro (en formato midi) y enviará las notas a una matriz de leds (neopixel) y las mostrará por pantalla.

La matriz de leds se controla con un microcontrolador (con wifi) como el esp8266 o el esp32

## Configurar la placa de arduino esp8066

- Añadir la tarjeta en las preferencias de arduino https://arduino.esp8266.com/stable/package_esp8266com_index.json


- Configurar el driver para la tarjeta esp8066 (normalmente se instala automáticamente)

- En gestión de tarjetas instalar esp8266   

- Añadir la librería de arduinoWebsockets.zip 
https://github.com/gilmaimon/ArduinoWebsockets/releases




## Para controlar la placa RGB 

https://github.com/adafruit/Adafruit_NeoPixel
https://wiki.dfrobot.com/Gravity__Flexible_8x32_RGB_LED_Matrix_SKU__DFR0462

## Para la comunicación por websockets
https://github.com/gilmaimon/ArduinoWebsockets/releases



## Lectura de midi desde navegador
https://github.com/Tonejs/Midi

