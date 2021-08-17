/*
  Minimal Esp8266 Websockets Server
  This sketch:
        1. Connects to a WiFi network
        2. Starts a websocket server on port 80
        3. Waits for connections
        4. Once a client connects, it wait for a message from the client
        5. Sends an "echo" message to the client
        6. closes the connection and goes back to step 3
  Hardware:
        For this sketch you only need an ESP8266 board.
  Created 15/02/2019
  By Gil Maimon
  https://github.com/gilmaimon/ArduinoWebsockets
*/

#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <Adafruit_NeoPixel.h>
#include <Adafruit_NeoMatrix.h>

#ifdef __AVR__
#include <avr/power.h>
#endif

#define PIN 0
#define NUM_PIXELS 256*4 // 8*23 * 4 # filas * columnas * dispositivos

const char *ssid = "MiFibra-29A1"; //Enter SSID
const char *password = "7my2L2z5"; //Enter Password
const byte maxClients = 1;
// websockets server port.
const uint16_t port = 80;

using namespace websockets;

WebsocketsClient clients[maxClients];
WebsocketsServer server;

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)

//Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_PIXELS, PIN, NEO_GRB + NEO_KHZ800);

Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(32, 8, 2,2, PIN,
    NEO_MATRIX_BOTTOM    + NEO_MATRIX_RIGHT + NEO_MATRIX_ROWS + NEO_MATRIX_ZIGZAG,
    NEO_GRB            + NEO_KHZ800);
  
// IMPORTANT: To reduce NeoPixel burnout risk, add 1000 uF capacitor across
// pixel power leads, add 300 - 500 Ohm resistor on first pixel's data input
// and minimize distance between Arduino and first pixel.  Avoid connecting
// on a live circuit...if you must, connect GND first.


void setup()
{

  
  
    pinMode(LED_BUILTIN, OUTPUT); // Initialize the LED_BUILTIN pin as an output
    digitalWrite(LED_BUILTIN, HIGH);

    Serial.begin(115200);
    // Connect to wifi
    WiFi.begin(ssid, password);

    // Wait some time to connect to wifi
    for (int i = 0; i < 15 && WiFi.status() != WL_CONNECTED; i++)
    {
        Serial.print(".");
        delay(1000);
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP()); //You can get IP address assigned to ESP

    // Neopixel init
    // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
#if defined(__AVR_ATtiny85__)
    if (F_CPU == 16000000)
        clock_prescale_set(clock_div_1);
#endif
    // End of trinket special code

  matrix.begin();
  matrix.setTextWrap(false);
  matrix.setBrightness(5);
  matrix.show();


   // strip.begin();
   // strip.setBrightness(10);
  //  strip.show(); // Initialize all pixels to 'off'

    // Start websockets server.
    server.listen(port);
    if (server.available())
    {
        Serial.print("Server available at ws://");
        Serial.print(WiFi.localIP());
        // Also log any non default port.
        if (port != 80)
            Serial.printf(":%d", port);
        Serial.println();

          matrix.fillScreen(0);    //Turn off all the LEDs
          matrix.setCursor(0, 0);
          matrix.print(F("OK"));
          matrix.show();

  
    }
    else
    {
        Serial.println("Server not available!");
    }
}

/*
void handleMessage(WebsocketsClient &client, WebsocketsMessage message) {
  auto data = message.data();

  // Log message
  Serial.print("Got Message: ");
  Serial.println(data);

  // Echo message
  client.send("Echo2: " + data);
}

void handleEvent(WebsocketsClient &client, WebsocketsEvent event, String data) {
  if (event == WebsocketsEvent::ConnectionClosed) {
    Serial.println("Connection closed");
        digitalWrite(LED_BUILTIN, HIGH); 
  }
}

*/

void readString(WebsocketsClient &client, WebsocketsMessage msg)
{
    auto data = msg.data();
    Serial.print("Got Message: ");
    Serial.println(data);
    // Echo message
    client.send("Echo: " + data);
}

void readBinary(WebsocketsMessage msg)
{
    matrix.clear();
    const std::string binaryData = msg.rawData();

    //Serial.println(binaryData);
  //Serial.println(msg.rawData().length());
 
  for (int i = 0; i < msg.rawData().length(); i=i+5){

      if(binaryData[i] == 255) matrix.setBrightness(binaryData[i+1]);
      else{
      //uint32_t c = matrix.Color(255, 0, 0);
      // pixelNumber + 255 * dispositiveNumber
      matrix.setPixelColor(binaryData[i+1]+256*binaryData[i], binaryData[i+2],binaryData[i+3],binaryData[i+4]);
      }
    }
    
    matrix.show();
}



void handleMessage(WebsocketsClient &client, WebsocketsMessage msg)
{

    if (msg.isBinary())
    {
        readBinary(msg);
    }
    else
    {
        Serial.printf("Message T%d B%d Pi%d Po%d C%d stream%d length: %u\n", msg.isText(), msg.isBinary(), msg.isPing(), msg.isPong(), msg.isClose(), msg.isPartial(), msg.data().length());

        readString(client, msg);
    }
    // const char* binaryData= msg.c_str();
    // Log message
}

void handleEvent(WebsocketsClient &client, WebsocketsEvent event, String data)
{
    if (event == WebsocketsEvent::ConnectionClosed)
    {
        digitalWrite(LED_BUILTIN, HIGH);
        Serial.println("Connection closed");
    }
}

int8_t getFreeClientIndex()
{
    // If a client in our list is not available, it's connection is closed and we
    // can use it for a new client.
    for (byte i = 0; i < maxClients; i++)
    {
        if (!clients[i].available())
            return i;
    }
    return -1;
}

void listenForClients()
{
    if (server.poll())
    {
        int8_t freeIndex = getFreeClientIndex();
        if (freeIndex >= 0)
        {
            WebsocketsClient newClient = server.accept();
            digitalWrite(LED_BUILTIN, LOW);

            Serial.printf("Accepted new websockets client at index %d\n", freeIndex);
            newClient.onMessage(handleMessage);
            newClient.onEvent(handleEvent);
            newClient.send("Hello from Teensy");
            clients[freeIndex] = newClient;
        }
    }
}

void pollClients()
{
    for (byte i = 0; i < maxClients; i++)
    {
        clients[i].poll();
    }
}

// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait)
{
    for (uint16_t i = 0; i < matrix.numPixels(); i++)
    {
        matrix.setPixelColor(i, c);
        matrix.show();
        delay(wait);
    }
}

void loop()
{


    // colorWipe(strip.Color(255, 0, 0), 10); // Red
    listenForClients();
    pollClients();
    
}
/*
void loop() {
  WebsocketsClient client = server.accept();
  
  if(client.available()) {
         digitalWrite(LED_BUILTIN, LOW);

  //  WebsocketsMessage msg = client.readBlocking();

    // log
  //  Serial.print("Got Message: ");
  //  Serial.println(msg.data());

    // return echo
  //  client.send("Echo: " + msg.data());

    // close the connection
   // client.close();

    client.onMessage(handleMessage);
    client.onEvent(handleEvent);
  }
  
  delay(1000);
}*/
