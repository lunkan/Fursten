'''
Created on 11 apr 2013

@author: Jonas
'''
from fursten.simulator.proxy import Proxy
from fursten.simulator import resource_pb2, node_pb2
from fursten.utils.Rectangle import Rectangle

class NodeProxy(Proxy):
    
    REST_PATH = 'nodes'
    _instance = None
    _protobuf_instance = None
    
    def __new__(cls, mime_type=None, *args, **kwargs):
        
        if mime_type == Proxy.MimeType.PROTOBUF:
            if not cls._protobuf_instance:
                cls._protobuf_instance = super(NodeProxy, cls).__new__(cls, mime_type, *args, **kwargs)
            return cls._protobuf_instance
        else:
            if not cls._instance:
                cls._instance = super(NodeProxy, cls).__new__(cls, mime_type, *args, **kwargs)
            return cls._instance
    
    def __init__(self, mime_type=None):
        super(NodeProxy, self).__init__(mime_type)
    
    def getNodes(self, rect=None, resource_keys=None, method=None):
        path = self.REST_PATH
        params = {}
        
        if rect is not None:
            if isinstance(rect, Rectangle):
                params['x'] = rect.x
                params['y'] = rect.y
                params['w'] = rect.width
                params['h'] = rect.height
            
        if resource_keys is not None:
            params['r'] = resource_keys
            
            if method is not None:
                params['method'] = method
        
        return super(NodeProxy, self).get(path=path, params=params)
    
    def addNodes(self, data):
        path = self.REST_PATH
        return super(NodeProxy, self).post(path=path, data=data)
    
    def replaceNodes(self, data=None, rect=None, resource_keys=None, method=None):
        path = self.REST_PATH
        params = {}
        
        if rect is not None:
            if isinstance(rect, Rectangle):
                params['x'] = rect.x
                params['y'] = rect.y
                params['w'] = rect.width
                params['h'] = rect.height
            
        if resource_keys is not None:
            params['r'] = resource_keys
            
            if method is not None:
                params['method'] = method
            
        return super(NodeProxy, self).put(path=path, params=params, data=data)
    
    def deleteNodes(self, rect=None, resource_keys=None, method=None):
        path = self.REST_PATH
        params = {}
        
        if rect is not None:
            if isinstance(rect, Rectangle):
                params['x'] = rect.x
                params['y'] = rect.y
                params['w'] = rect.width
                params['h'] = rect.height
            
        if resource_keys is not None:
            params['r'] = resource_keys
            
            if method is not None:
                params['method'] = method
            
        return super(NodeProxy, self).delete(path=path, params=params)
    
    def sendTransaction(self, data=None):
        path = self.REST_PATH + "/transaction"
        return super(NodeProxy, self).post(path=path, data=data)
    
    def parseProtobufData(self, send_data):
        
        #Add data as protobuf class or raw encoded string
        if isinstance(send_data, node_pb2.NodeCollection):
            return send_data.SerializeToString()
        else:
            return send_data
    
    def parseProtobufResponse(self, respons_data):
        nodeCollection = node_pb2.NodeCollection()
        nodeCollection.ParseFromString(respons_data)
        return nodeCollection
