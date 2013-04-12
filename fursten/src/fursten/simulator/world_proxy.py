'''
Created on 12 apr 2013

@author: Jonas
'''
from fursten.simulator.proxy import Proxy
from fursten.utils.Rectangle import Rectangle

class WorldProxy(Proxy):
    
    REST_PATH = 'world'
    _instance = None
    _protobuf_instance = None
    
    def __new__(cls, mime_type=None, *args, **kwargs):
        
        if mime_type == Proxy.MimeType.PROTOBUF:
            if not cls._protobuf_instance:
                cls._protobuf_instance = super(WorldProxy, cls).__new__(cls, mime_type, *args, **kwargs)
            return cls._protobuf_instance
        else:
            if not cls._instance:
                cls._instance = super(WorldProxy, cls).__new__(cls, mime_type, *args, **kwargs)
            return cls._instance
    
    def __init__(self, mime_type=None):
        super(WorldProxy, self).__init__(mime_type)
    
    def getWorld(self):
        path = self.REST_PATH
        
        return super(WorldProxy, self).get(path=path)
    
    def newWorld(self, data=None):
        path = self.REST_PATH
        
        return super(WorldProxy, self).put(path=path, data=data)
