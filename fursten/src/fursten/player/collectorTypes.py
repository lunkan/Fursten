'''
Created on 31 aug 2013

@author: Olof Manbo
'''
import random

collectors = {
              'Granhuggare': {'name': 'Gran'}
              }


names = ['Klas',
         'Anna-Lena',
         'Herbert',
         'Olsson',
         'Katja']

def getName():
    random.seed() # Seems to be needed to make it random
    return random.choice(names)