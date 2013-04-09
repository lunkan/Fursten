'''
Created on 8 apr 2013

@author: Jonas
'''
def enum(**enums):
    return type('Enum', (), enums)