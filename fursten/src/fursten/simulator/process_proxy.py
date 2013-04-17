'''
Created on 15 apr 2013

@author: Jonas
'''
from fursten.simulator.proxy import Proxy

class ProcessProxy(Proxy):
    
    REST_PATH = 'process'
    _instance = None
    _protobuf_instance = None
    
    def __new__(cls, mime_type=None, *args, **kwargs):
        
        if mime_type == Proxy.MimeType.PROTOBUF:
            if not cls._protobuf_instance:
                cls._protobuf_instance = super(ProcessProxy, cls).__new__(cls, mime_type, *args, **kwargs)
            return cls._protobuf_instance
        else:
            if not cls._instance:
                cls._instance = super(ProcessProxy, cls).__new__(cls, mime_type, *args, **kwargs)
            return cls._instance
    
    def __init__(self, mime_type=None):
        super(ProcessProxy, self).__init__(mime_type)
    
    def run(self):
        path = self.REST_PATH + "/run"
        return super(ProcessProxy, self).post(path=path)
    
    def clean(self):
        path = self.REST_PATH + "/clean"
        return super(ProcessProxy, self).post(path=path)

