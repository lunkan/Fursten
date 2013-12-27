'''
Created on 6 aug 2013

@author: Jonas
'''
from PIL import Image, ImageDraw
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from fursten.utils.graphics import hex_to_rgb

import xml.etree.ElementTree as ET
import os
import glob
import fnmatch
import ntpath
from fursten.resourcestyles.models import ResourceStyle

thumb_size = (64,64)
icon_size = (14, 14)

def resource_styles_to_xml():
    
    styles = ET.Element("resourceStyles")
    
    for style_item in ResourceStyle.objects.all():
        style = ET.SubElement(styles, "style")
        style.set('ref', str(style_item.resource))
        
        shape = ET.SubElement(style, "shape")
        shape.text = str(style_item.shape)
        
        symbol = ET.SubElement(style, "symbol")
        symbol.text = str(style_item.symbol)
        
        background = ET.SubElement(style, "background")
        background.text = str(style_item.background)
        
        #COLORS
        first_color = ET.SubElement(style, "color")
        first_color.text = str(style_item.first_color)
        
        second_color = ET.SubElement(style, "color")
        second_color.text = str(style_item.second_color)
        
        third_color = ET.SubElement(style, "color")
        third_color.text = str(style_item.third_color)
        
        fourth_color = ET.SubElement(style, "color")
        fourth_color.text = str(style_item.fourth_color)
        
    #style_xml = ET.tostring(svg, encoding="utf-8")
    
    return styles

def xml_to_resource_styles(resource_styles_root):
    
    #We replace all styles
    ResourceStyle.objects.all().delete()
    
    for style in resource_styles_root:
        
        #Not working with findAll()
        #for style in resource_styles_root.findAll('.//style'):
       
        resource_reference = int(style.attrib['ref'])
        resource_style = ResourceStyle(resource=resource_reference)
        
        style_params = {
          'form': 'circle',
          'color': '#000000',
          'border_color': '#000000',
          'shape': style.findtext('shape'),
          'symbol' : style.findtext('symbol'),
          'background' : style.findtext('background'),
          'first_color' : style.findtext('.//color[1]'),
          'second_color' : style.findtext('.//color[2]'),
          'third_color' : style.findtext('.//color[3]'),
          'fourth_color' : style.findtext('.//color[4]')
        }
        
        apply_styles(resource_style, style_params)
    

def apply_styles(resource_style, params):
    
    #Create resource style icon
    thumb_image = Image.new('RGBA', thumb_size)
    draw = ImageDraw.Draw(thumb_image)
    
    color_rgb = hex_to_rgb(params['color'])
    border_color_rgb = hex_to_rgb(params['border_color'])    
    
    if params['form'] == "circle":
        draw.ellipse((2, 2, 62, 62), fill=border_color_rgb)
        draw.ellipse((10, 10, 54, 54), fill=color_rgb)
    elif params['form'] == "cube":
        draw.rectangle((2, 2, 62, 62), fill=border_color_rgb)
        draw.rectangle((10, 10, 54, 54), fill=color_rgb)
    elif params['form'] == "diamond":
        draw.polygon([(32, 2), (2, 32), (32, 62), (62, 32)], fill=border_color_rgb)
        draw.polygon([(32, 10), (10, 32), (32, 54), (54, 32)], fill=color_rgb)
    elif params['form'] == "triangle":
        draw.polygon([(32, 2), (2, 64), (64, 64)], fill=border_color_rgb)
        draw.polygon([(32, 22), (14, 53), (50, 53)], fill=color_rgb)
    
    # I'm done drawing so I don't need this anymore
    del draw
    
    icon_image = thumb_image.copy()
    icon_image.thumbnail(icon_size, Image.ANTIALIAS)
    
    icon_image_io = StringIO.StringIO()
    icon_image.save(icon_image_io, format='PNG')
    icon_image_file_name = "icon_" + str(resource_style.resource) + ".png";
    icon_image_file = InMemoryUploadedFile(icon_image_io, None, icon_image_file_name, 'image/png', icon_image_io.len, None)
    
    thumb_image_io = StringIO.StringIO()
    thumb_image.save(thumb_image_io, format='PNG')
    thumb_image_file_name = "thumbnail_" + str(resource_style.resource) + ".png";
    thumb_image_file = InMemoryUploadedFile(thumb_image_io, None, thumb_image_file_name, 'image/png', thumb_image_io.len, None)
    
    #Apply data
    resource_style.version = resource_style.version +1;
    resource_style.thumbnail.save(thumb_image_file_name, thumb_image_file, save=True)
    resource_style.icon.save(icon_image_file_name, icon_image_file, save=True)
    resource_style.form = params['form']
    resource_style.color = params['color']
    resource_style.border_color = params['border_color']
    
    resource_style.shape = params['shape']
    resource_style.symbol = params['symbol']
    resource_style.background = params['background']
    
    resource_style.first_color = params['first_color']
    resource_style.second_color = params['second_color']
    resource_style.third_color = params['third_color']
    resource_style.fourth_color = params['fourth_color']
    
    resource_style.save()
    
    return resource_style
    