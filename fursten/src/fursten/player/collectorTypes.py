'''
Created on 31 aug 2013

@author: Olof Manbo
'''
import random

collectors = {
              'Activities_1b2a_Reevetax': {'collects': 'Animals_1a_Humans', 'game_name': 'REEVE', 'max_items': 10},
              'Infrastructure_1b_mannor': {'collects': 'NONE', 'game_name': 'MANNOR', 'max_items': 1},
              'Infrastructure_1a_communication': {'collects': 'NONE', 'game_name': 'ROAD', 'max_items': 100},
              }


names = ['Klas',
         'Anna-Lena',
         'Herbert',
         'Olsson',
         'Katja']

def getName():
    random.seed() # Seems to be needed to make it random
    return random.choice(names)