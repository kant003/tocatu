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

const char* ssid = "MiFibra-29A1"; //Enter SSID
const char* password = "7my2L2z5"; //Enter Password

using namespace websockets;

WebsocketsServer server;
void setup() {
   pinMode(LED_BUILTIN, OUTPUT);     // Initialize the LED_BUILTIN pin as an output
    digitalWrite(LED_BUILTIN, HIGH); 
    
  Serial.begin(115200);
  // Connect to wifi
  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  for(int i = 0; i < 15 && WiFi.status() != WL_CONNECTED; i++) {
      Serial.print(".");
      delay(1000);
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());   //You can get IP address assigned to ESP

  server.listen(80);
  Serial.print("Is server live? ");
  Serial.println(server.available());
}


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
}
