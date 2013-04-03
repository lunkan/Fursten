# -*- coding:utf-8 -*-
"""
Created on 22 sep 2012

@author: Olof Manbo
Version: 1.0.0
"""


import time
import logging
import createPath

LT = {((0,0),
       (1,0)):
      [[0.0 ,0.5],
       [0.5 ,1.0]],
      
      ((0,0),
       (0,1)):
      [[0.5 ,1.0],
       [1.0 ,0.5]],
      
      ((0,0),
       (1,1)):
      [[0.0 ,0.5],
       [1.0 ,0.5]],     
       
      ((0,1),
       (0,0)):
      [[1.0 ,0.5],
       [0.5 ,0.0],
       ],
            
      ((0,1),
       (0,1)):
      [[0.5 ,1.0],
       [0.5 ,0.0]],
      ((0,1),
       (1,1)):
      [[0.0 ,0.5],
       [0.5 ,0.0]],
      
      ((1,0),
       (0,0)):
      [[0.5 ,0.0],
       [0.0 ,0.5]],
      
      ((1,0),
       (1,0)):
      [[0.5 ,0.0],
       [0.5 ,1.0]],
      
      ((1,0),
       (1,1)):
      [[0.5 ,0.0],
       [1.0 ,0.5]],
      
      ((1,1),
       (0,0)):
      [[1.0 ,0.5],
       [0.0 ,0.5]],
      
      ((1,1),
       (1,0)):
      [[1.0 ,.5],
       [0.5 ,1.0]],
      
      ((1,1),
       (0,1)):
      [[0.5 ,1.0],
       [0.0 ,0.5]],                  
      }

LT_2 = {((0,1),
         (1,0)):
      [[[0.0 ,0.5],
        [0.5 ,0.0]],
       [[1.0 ,0.5],
       [0.5 ,1.0]]],
        ((1,0),
         (0,1)):
      [[[0.5 ,0.0],
        [1.0 ,0.5]],
       [[0.5 ,1.0],
       [0.0 ,0.5]]],                  
      }

def contour_newer(data, X, Y, number_of_types):
    lines = [[] for dummy in xrange(number_of_types + 1)]
    for y_l in Y[:-1]:
        for x_l in X[:-1]:
            y = y_l - Y[0]
            x = x_l - X[0]
            for colornumber in xrange(1,number_of_types + 1):
                T = ((int(data[x][y] == colornumber), int(data[x+1][y]) == colornumber),
                     (int(data[x][y+1] == colornumber), int(data[x+1][y+1] == colornumber)))
                if LT.has_key(T):
                    lines[colornumber].append([[x_l + LT[T][0][0], y_l  + LT[T][0][1]],
                                        [x_l + LT[T][1][0], y_l + LT[T][1][1]]])
                elif LT_2.has_key(T):
                    lines[colornumber].append([[x_l + LT_2[T][0][0][0], y_l  + LT_2[T][0][0][1]],
                                        [x_l + LT_2[T][0][1][0], y_l + LT_2[T][0][1][1]]])
                    lines[colornumber].append([[x_l + LT_2[T][1][0][0], y_l  + LT_2[T][1][0][1]],
                                        [x_l + LT_2[T][1][1][0], y_l + LT_2[T][1][1][1]]])
    return lines

def lineify(lines):
    retval = []
    retX = [lines[0][0][0], lines[0][1][0]]
    retY = [lines[0][0][1], lines[0][1][1]]
    current_line = lines[0]
    lines.remove(current_line)
    while (current_line is not None):
        line_found = False
        for l in lines:
            if (current_line[1] == l[0]):
                retX += [l[0][0], l[1][0]]
                retY += [l[0][1], l[1][1]]
                current_line = l
                line_found = True
                break
        if line_found:
            lines.remove(current_line)
        elif not lines == []:
            retval.append([retX, retY])
            retX = [lines[0][0][0], lines[0][1][0]]
            retY = [lines[0][0][1], lines[0][1][1]]
            current_line = lines[0]
            lines.remove(current_line)
        else:
            retval.append([retX, retY])
            current_line = None
    return retval

def getSvg(scale, nodes, node_names, X, Y):
    
    paths, real_data = getPaths(scale, nodes, node_names, X, Y)
    retval = ""
    for d in paths:
        retval += createPath.path(d[0], "node_%s\n"%d[1])
    return retval, real_data
    
def getPaths(scale, nodes_dict, X, Y):
    node_names = nodes_dict.keys()
    nodes = []
    for node_name in node_names:
        nodes.append(nodes_dict[node_name])
    scale = float(scale)
    t0 = time.time()
    R = 1000/scale
    R_2 = R*R
    
    N = 10
    
    split_x = [(-10000 + 20000/N*n)/scale for n in xrange(0, N + 2)]
    split_y = [(-10000 + 20000/N*n)/scale for n in xrange(0, N + 2)]
    
    real_data = []
    
    boxes = [ [ [[] for dummy in split_y[:-1]] for dummy in split_x[:-1]]  for dummy in nodes]
    
    for box_n,node_list in enumerate(nodes):
        for node in node_list:
            for n in xrange(len(split_x) - 1):
                if split_x[n] < node[0]/scale <= split_x[n + 1]:
                    box_x = n
            for n in xrange(len(split_y) - 1):
                if split_y[n] < node[1]/scale <= split_y[n + 1]:
                    box_y = n
            boxes[box_n][box_x][box_y].append([node[0]/scale, node[1]/scale])
    for x in X:
        real_data.append([])
        
        for y in Y:
            if x == X[0] or x == X[-1] or y == Y[0] or y == Y[-1]:
                real_data[-1].append(0)
            else:
                min_distance = R_2
                colornumber = 0
                for box_n, box_list in enumerate(boxes):
                    box_x_s = []
                    box_y_s = []
                    for n in xrange(len(split_x) - 1):
                        if (split_x[n] - R) < x <= (split_x[n + 1] + R):
                            box_x_s.append(n)
                    for n in xrange(len(split_y) - 1):
                        if (split_y[n] - R) < y <= (split_y[n + 1] + R):
                            box_y_s.append(n)
                    node_list = []
                    for box_x in box_x_s:
                        for box_y in box_y_s:
                            node_list += box_list[box_x][box_y]
                    
                    
                    for node in node_list:
                        delta_x = x - node[0]
                        delta_y = y - node[1]
                        distance = (delta_x*delta_x + delta_y*delta_y)
                        if distance < min_distance:
                            min_distance = distance
                            colornumber = box_n + 1
                real_data[-1].append(colornumber)
    logging.info("getSvg()::before contour time:%f"%(time.time() - t0))
    lines = contour_newer(real_data, X, Y, len(node_names))
    
    retval = ''
    paths = []
    for line_list, node_name in zip(lines[1:], node_names):
        full_lines = lineify(line_list)
        d = ""
        for line in full_lines:
            x = [l*scale for l in line[0]]
            y = [l*scale for l in line[1]]
            d += createPath.d(x,y)
        paths.append([d, node_name])
    return paths, real_data
        
