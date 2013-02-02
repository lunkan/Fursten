from django.template import Context, loader, RequestContext

class Block:
    data = ''
    template_file =''
    
    def __init__(self, template, request):
      self.data = {}
      self.template = template
      self.request = request
    
    def toHtml(self):
        #print self.data
        self.template_file = loader.get_template(self.template)
        context = RequestContext(self.request, self.data)
        return self.template_file.render(context)
      
class Head(Block):
    
    def __init__(self, template, request):
        Block.__init__(self, template, request)
        self.data['js_includes'] = []
        self.data['css_includes'] = {}
        
    def addJs(self, key, path):
        #index = len(self.data['js_includes'])
        self.data['js_includes'].append({'path':path})
        #self.data['js_includes'][index] = {'index':index, 'path':path}
    
    def addCss(self, key, path):
        self.data['css_includes'][key] = path
    
class Header(Block):
    
    def __init__(self, template, request):
        Block.__init__(self, template, request)
        self.data['main_menu'] = {}
        self.data['user_menu'] = {}
        
    def addMainMenuItem(self, path, type, arg):
        current_item = self.data['main_menu']
        
        for item in path.split('/'):
            if(item not in current_item):
                current_item[item] = {}
            current_item = current_item[item]
            
        current_item['action'] = type + '="' + arg + '"'
        
    def addUserMenuItem(self, path, type, arg):
        current_item = self.data['user_menu']
        
        for item in path.split('/'):
            if(item not in current_item):
                current_item[item] = {}
            current_item = current_item[item]
        
        current_item['action'] = type + '="' + arg + '"'
            
        
class Sidebar(Block):
    
    def __init__(self, template, request):
        Block.__init__(self, template, request)
        self.data['blocks'] = {}
        self.data['widgets'] = {}
        
    #def addBlock(self, path, src, id):
    #    current_item = self.data['blocks']
        
    #    for item in path.split('/'):
    #        if(item not in current_item):
    #            current_item[item] = {}
    #        current_item = current_item[item]
            
    #    current_item['id'] = id
    #    current_item['src'] = src
        
    def addBlock(self, path, template, data):
        current_item = self.data['blocks']
        
        for item in path.split('/'):
            if(item not in current_item):
                current_item[item] = {}
            current_item = current_item[item]
            
        block = Block(template, self.request)
        block.data = data;
        block.data['classes'] = 'sidebar-block'
        current_item['blocks'] = block