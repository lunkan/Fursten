'''
Created on 11 apr 2013

@author: Jonas
'''
class Rectangle:
    def __init__(self, x=0, y=0, width=0, height=0):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        
    def setX(self, x):
        self.x = x
    def getX(self):
        return self.x
    def setY(self, y):
        self.y = y
    def getY(self):
        return self.y
    def setWidth(self, width):
        self.width = width
    def getWidth(self):
        return self.width
    def setHeight(self, height):
        self.height = height
    def getHeight(self):
        return self.height
    def setSize(self, size):
        self.width, self.height = size
    def getSize(self):
        return self.width, self.height
    def setPosition(self, x=0, y=0):
        self.x = x
        self.y = y
    def getPosition(self):
        return self.x, self.y