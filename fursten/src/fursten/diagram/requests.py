# -*- coding:utf-8 -*-
"""
Created on 1 okt 2011

@author: Olof Manbo
"""
import httplib
import urllib
import test_pb2
import xml.parsers.expat
import logging

logger = logging.getLogger('console')


def sendNodeRequest(address = "sveanas.appspot.com"):
    header = {"Content-Type": "application/x-www-form-urlencoded"}

    conn = httplib.HTTPConnection(address)

    nodeRequest = test_pb2.NodeRequest()
    
    mNodes = nodeRequest.getNodes.add()
    
    mNodes.x = -50000
    mNodes.y = -50000
    mNodes.width = 100000
    mNodes.height = 100000
    
    params = nodeRequest.SerializeToString() 
    
    
    conn.request("POST", "/simulatorwebservice/api/proto/node", params , header)
    
    r1 = conn.getresponse()
    #print r1.status, r1.reason
    data1 = r1.read()
    conn.close()
#    print "sendNodeRequest data1 "
    #print data1
    
    nodeResponse = test_pb2.NodeResponse()
    
    nodeResponse.ParseFromString(data1)
 #   print nodeResponse.success
    return nodeResponse

def hex2slong(value):
    return int(value, 16) - 0x100000000*(int(value, 16) > 0x7fffffff)

# 3 handler functions
def start_element(name, attrs):
    global stuff
    #print 'Start element:', name, attrs
    if name == 'resource':
        stuff[hex2slong(attrs["key"])] = attrs['name']
def end_element(name):
    pass
    #print 'End element:', name
def char_data(data):
    pass
    #print 'Character data:', repr(data)

stuff = {}

def sendResourceXmlRequest(address):
    global stuff
    conn = httplib.HTTPConnection(address)


    conn.request("GET", "/simulatorwebservice/api/resources.xml")
    r1 = conn.getresponse()
#    print r1.status, r1.reason
    xmldata = r1.read()
    conn.close()
#    print xmldata
    
    stuff = {}
    
    
    p = xml.parsers.expat.ParserCreate()
    
    p.StartElementHandler = start_element
    p.EndElementHandler = end_element
    p.CharacterDataHandler = char_data
    
    p.Parse(xmldata, 1)
#    print stuff
    return stuff

def sendProcessRequest(address):
    header = {"Content-Type": "application/x-www-form-urlencoded"}
    conn = httplib.HTTPConnection(address)
    processRequest = test_pb2.ProcessRequest()
    processRequest.command = test_pb2.ProcessRequest.RUN
    processRequest.argument = "Run"
    
    
    
    params = processRequest.SerializeToString()
    conn.request("POST", "/simulatorwebservice/api/proto/process", params , header)
    r1 = conn.getresponse()
    data1 = r1.read()
    conn.close()
    
    processResponse = test_pb2.ProcessResponse()
    
    processResponse.ParseFromString(data1)

def sendFurstenCssRequest(address):
    conn = httplib.HTTPConnection(address)
    conn.request("GET", "/simulatorwebservice/api/resource.css")
    r1 = conn.getresponse()
    cssdata = r1.read()
    conn.close()
    cssdata = cssdata.replace("}", "}\n")
    return cssdata

def getNodes(address):
    stuff = sendResourceXmlRequest(address)
    nodeResponse = sendNodeRequest(address)
    nodes = {}
    for node in nodeResponse.node:
        key = stuff[node.resource_key]
        if nodes.has_key(key):
            nodes[key].append([node.x, node.y])
        else:
            nodes[key] = [[node.x, node.y]]
    return nodes

