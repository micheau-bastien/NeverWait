# -*- coding: utf-8 -*-
import serial, requests, sys, datetime
from array import array

ser = serial.Serial('/dev/serial0',9600)
#On vide la memoire
ser.flushInput()
ser.flushOutput()

#Initialisation des variables
#init permet de choisir sur combien de trames on se base pour l'echantillonage
#delay permet de choisr combien de trames on stocke et on moyenne avant envoi à la BD
init = 4
delay = 2
compteur_init = 0
compteur_delay= 0
echantillonage = []
captors_array = []



while True:
    #Lecture des données arrivant en entree
    print "En ecoute..."
    incoming = ser.readline().strip()
    text = incoming.split(' ')
    print text
    nb_elements = len(text)
    
    #Trame correcte 'r nbCaptures C1 C2 C3....'
    if (nb_elements>2 and text[0]=='r'):
        #Phase d'echantillonage
        if (compteur_init<init):
            print "init "
            #On stocke dans un tableau la valeur minimum par capteurs correspondant à l'absence de personne
            for x in range (0, (nb_elements-2)):
                if (compteur_init==0):
                    echantillonage.append(text[x+2])
                else:
                    echantillonage[x] = min(echantillonage[x],text[x+2])
            compteur_init = compteur_init + 1
            print echantillonage
        #Phase d'envoi
        else:
            nb_ecoutes = text[1] #Cette ligne n'est plus utile 
            for x in range (0, (nb_elements-2)):
                if (compteur_delay==0):
                    captors_array.append(text[x+2])
                else:
                     valeur = int(captors_array[x]) + int(text[x+2])
                     captors_array[x] = str(valeur)
            compteur_delay = compteur_delay +1
            #Envoi des donees a la DB
            if (compteur_delay==delay):
                #On moyenne en fonction du nombre de trames stockees
                for x in range (0, (nb_elements-2)):
                    valeur=int(captors_array[x])/delay
                    captors_array[x]=str(valeur)
                #On echantillone
                for x in range (0, (nb_elements-2)):
                    #
                    if(int(captors_array[x])>=int(echantillonage[x])):
                       captors_array[x]='0' #faire un tableau
                    #
                    elif(int(captors_array[x])<=int(echantillonage[x])/2):
                       captors_array[x]='2' #faire un tableau
                    #
                    else:
                        captors_array[x]='1'
                print 'envoi de la requete avec    ....   '
                print captors_array
                #envoi de la requete vers le serveur
                today=datetime.datetime.now()
                print today.month
                requests.post("https://neverwait-95157.app.xervo.io/_action/adddatas", data = {
                    "name" : "RU INSA Toulouse",
                    "sensors" : captors_array,
                    "year" : today.year,
                    "month" : today.month,
                    "day" : today.day,
                    "hour" : today.hour,
                    "min" : today.minute
                    
                })
                captors_array = []
                compteur_delay = 0
                
            #faire un tableau pour l'echantillonage car c'est pas propre en dur 
            
    
            

        
