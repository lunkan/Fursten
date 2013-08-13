'''
Created on 6 aug 2013

@author: Jonas
'''
from PIL import Image, ImageDraw
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from fursten.utils.graphics import hex_to_rgb

thumb_size = (64,64)
icon_size = (14, 14)
    
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
    resource_style.save()
    
    return resource_style
    