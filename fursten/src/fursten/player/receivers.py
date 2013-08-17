from django.dispatch import receiver
from fursten.dashboard.signals import *
from fursten.dashboard.blocks import *

@receiver(initialize)
def handle_post_viewed(sender, **kwargs):
    page = kwargs.get("page")
    user = kwargs.get("user")
    
    if user.groups.filter(name="admin").count():
        print "nodes in group!: "
    
    page['header'].addMainMenuItem('player/select_player/None', 'onClick', 'fu.msg.selectPlayer.dispatch(\'None\')')
    page['header'].addMainMenuItem('player/general/new_player', 'onClick', 'fu.msg.newPlayer.dispatch()')
    page['left_sidebar'].addBlock('player/player_control', 
                                  'blocks/player-control.html', { 'id':'player-control-block', 'title':'Player Control'})
    
    page['head'].addJs('fursten-diagram', 'local/player/js/views.js')
    page['head'].addJs('fursten-player', 'local/player/js/models.js')
    page['head'].addJs('fursten-player', 'local/player/js/main.js')