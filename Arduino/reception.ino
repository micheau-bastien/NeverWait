#include <LowPower.h>
#include <IRremote.h>

#define RECEIVERS 4
#define max_ecoute 20

IRrecv *irrecvs[RECEIVERS];
decode_results results;

int nb_ecoute = 0 ;
int tableau_ecoute[RECEIVERS] ;
int initial = 0 ;

String nomcomplet = "" ;
String capt = "" ;

void setup()  {
  Serial.begin(9600);

  
  pinMode(LED_BUILTIN,OUTPUT);
  digitalWrite(LED_BUILTIN,LOW);

  irrecvs[0] = new IRrecv(2); // Receiver #0: pin 2
  irrecvs[1] = new IRrecv(12); // Receiver #0: pin 12ftr
  irrecvs[2] = new IRrecv(7); // Receiver #0: pin 7
  irrecvs[3] = new IRrecv(11); // Receiver #0: pin 11

  //vide le tableau d'écoute & active la réception pour les récepteurs
  for (int i = 0; i < RECEIVERS; i++) {
    irrecvs[i]->enableIRIn();
    tableau_ecoute[i] = 0 ;
  }
}

void loop() {

  if (nb_ecoute == max_ecoute) {
    nb_ecoute = 0 ; // Reset du nb d'écoutes

    for (int i = 0; i < RECEIVERS ; i++)
    {
      capt = capt + " " + tableau_ecoute[i] ;
    }

   // ENVOI ZIGBEE
    nomcomplet = max_ecoute + capt ;
    Serial.println("r " + nomcomplet);

    nomcomplet = "";
    capt = "";

    // Reset tableau
    for (int i = 0; i < RECEIVERS; i++)
      tableau_ecoute[i] = 0;

    Serial.flush();
    digitalWrite(LED_BUILTIN,HIGH); // 8s sleep
    LowPower.powerDown(SLEEP_8S, ADC_OFF, BOD_OFF);
    digitalWrite(LED_BUILTIN,LOW); 
  }


  // LECTURE
  for (int i = 0; i < RECEIVERS; i++)
  {
    if (irrecvs[i]->decode(&results))
    {
      if (results.value == 120)
      {
        tableau_ecoute[i] = tableau_ecoute[i] + 1 ;
      }
      irrecvs[i]->resume();
    }
  }

  delay(50);
  nb_ecoute = nb_ecoute + 1;

}

