'''
Created on 8 apr 2013

@author: Jonas
'''
from fursten.utils.enum import enum
import urllib
from fursten import settings
import urllib2
from fursten.utils.requests import RequestWithMethod
import httplib
from django.utils import simplejson

class Proxy(object):
    
    FilterMethod = enum(CHILDREN='children', PARENTS='parents')
    HTTPMethod = enum(GET='GET', POST='POST', PUT='PUT', DELETE='DELETE')
    MimeType = enum(JSON='application/json', PROTOBUF='application/x-protobuf')
    PROXY_URL = "rest/"
    
    def __init__(self, mime_type=None):
        if mime_type is not None:
            self.mime_type = mime_type
        else:
            self.mime_type = self.MimeType.JSON
    
    #GET
    def get(self, path, params=None):
        headers = { 'Content-Type' : self.mime_type, 'Accept' : self.mime_type }
        return self.sendRequest(http_method=self.HTTPMethod.GET, path=path, params=params, headers=headers)
    
    #POST
    def post(self, path, dict_data, params=None):
        data = simplejson.dumps(dict_data)
        headers = { 'Content-Type' : self.mime_type, 'Accept' : self.mime_type }
        return self.sendRequest(http_method=self.HTTPMethod.POST, path=path, params=params, data=data, headers=headers)
    
    #PUT
    def put(self, path, dict_data, params=None):
        data = simplejson.dumps(dict_data)
        headers = { 'Content-Type' : self.mime_type, 'Accept' : self.mime_type }
        return self.sendRequest(http_method=self.HTTPMethod.PUT, path=path, params=params, data=data, headers=headers)
    
    #DELETE
    def delete(self, path, params=None):
        headers = { 'Content-Type' : self.MimeType.JSON, 'Accept' : self.MimeType.JSON }
        return self.sendRequest(http_method=self.HTTPMethod.DELETE, path=path, params=params, headers=headers)
    
    def sendRequest(self, http_method, headers, path, params=None, data=None):
        
        url = settings.SIMULATOR_URL + self.PROXY_URL + path
        
        #Parameters
        if params is not None:
            try:
                print params
                params_str = urllib.urlencode(params)
                url += '?'+params_str
            except Exception, e:
                print 'Unable to urlencode: ' + str(params)
                return 500
        
        #HTTPMethod (GET|POST|PUT|DELETE)
        #Use RequestWithMethod to allow httpMethod DELETE
        req = RequestWithMethod(url, http_method)
        
        #Send data
        if data is not None:
            print data
            req.add_data(data)
        
        #Headers
        if headers is not None:
            for header in headers:
                req.add_header(header, headers[header])
        
        try:
            f = urllib2.urlopen(req)
        except urllib2.HTTPError, e:
            print 'HTTPError: status(' + str(e.code) + ') ' + str(e.reason)
            return e.code
        except urllib2.URLError, e:
            print 'URLError: status(' + str(e.code) + ') ' + str(e.reason)
            return e.code
        except httplib.HTTPException, e:
            print 'HTTPException: status(' + str(e.code) + ') ' + str(e.reason)
            return e.code
        except Exception, e:
            print 'HTTPException:: status(' + str(e.code) + ') ' + str(e.reason)
            return e.code
        
        respons_data = f.read()
        f.close()
        if respons_data is None:
            return 200
        
        if self.mime_type == self.MimeType.JSON:
            parsed_respons = self.parseJSONResponse(respons_data)
            return 200, parsed_respons
        elif self.mime_type == self.MimeType.PROTOBUF:
            parsed_respons = self.parseProtobufResponse(respons_data)
            return 200, parsed_respons
        else:
            return 200, respons_data
        
    def parseJSONResponse(self, respons_data):
        try:
            return simplejson.loads(respons_data)
        except Exception, e:
            return None
    
    def parseProtobufResponse(self, respons_data):
        #override this in sub-classes
        return respons_data
        