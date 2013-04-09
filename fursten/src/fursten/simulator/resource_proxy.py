'''
Created on 8 apr 2013

@author: Jonas
'''
from fursten.simulator.proxy import Proxy

class ResourceProxy(Proxy):
    
    REST_PATH = 'resources'
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ResourceProxy, cls).__new__(cls, *args, **kwargs)
        return cls._instance
    
    def __init__(self, mime_type=None):
        super(ResourceProxy, self).__init__(mime_type)

    def getResource(self, key):
        path = self.REST_PATH + "/" + key
        return super(ResourceProxy, self).get(path=path)
    
    def addResource(self, data, parentKey=None):
        
        #post to root for new root resource
        if parentKey is None:
            path = self.REST_PATH
        else:
            path = self.REST_PATH + "/" + str(parentKey)
            
        return super(ResourceProxy, self).post(path=path, dict_data=data)
    
    def replaceResource(self, data, key):
        path = self.REST_PATH + "/" + key
        return super(ResourceProxy, self).put(path=path, dict_data=data)
    
    def deleteResource(self, key):
        path = self.REST_PATH + "/" + key
        return super(ResourceProxy, self).delete(path=path)
    
    def getResources(self, details=False, resource_keys=None, method=None):
        path = self.REST_PATH
        params = {}
        
        if details is not None:
            params['details'] = details
            
        if resource_keys is not None:
            params['r'] = resource_keys
            
            if method is not None:
                params['method'] = method
        
        return super(ResourceProxy, self).get(path=path, params=params)
    
    def replaceResources(self, data):
        path = self.REST_PATH
        return super(ResourceProxy, self).put(path=path, data=data)
    
    def deleteResources(self, resource_keys=None, method=None):
        path = self.REST_PATH
        params = {}
        
        if resource_keys is not None:
            params['r'] = resource_keys
            
            if method is not None:
                params['method'] = method
            
        return super(ResourceProxy, self).delete(path=path, params=params)