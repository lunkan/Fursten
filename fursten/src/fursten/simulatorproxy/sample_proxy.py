'''
Created on 11 apr 2013

@author: Jonas
'''
from fursten.simulatorproxy.proxy import Proxy
from fursten.utils.Rectangle import Rectangle

class SampleProxy(Proxy):
    
    REST_PATH = 'samples'
    _instance = None
    _protobuf_instance = None
    
    def __new__(cls, mime_type=None, *args, **kwargs):
        
        if mime_type == Proxy.MimeType.PROTOBUF:
            if not cls._protobuf_instance:
                cls._protobuf_instance = super(SampleProxy, cls).__new__(cls, mime_type, *args, **kwargs)
            return cls._protobuf_instance
        else:
            if not cls._instance:
                cls._instance = super(SampleProxy, cls).__new__(cls, mime_type, *args, **kwargs)
            return cls._instance
    
    def __init__(self, mime_type=None):
        super(SampleProxy, self).__init__(mime_type)
    
    def getSamples(self, data=None, snap=1):
        path = self.REST_PATH
        params = {}
        params['snap'] = snap
        
        return super(SampleProxy, self).post(path=path, params=params, data=data)

