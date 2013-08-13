
var ProjectExportImportNodeModule = (function () {
	
	var projectExportImportNodeModule = function() {
		
		var self = this;
		
		//MESSAGES
		fu.msg.importNodes = new signals.Signal();
	    fu.msg.exportNodes = new signals.Signal();
	    fu.msg.nodesChange = new signals.Signal();
	    fu.msg.clearNodes = new signals.Signal();
	    
		this.onInitialized = function() {
			
			fu.msg.importNodes.add(self.onImportNodes);
		    fu.msg.exportNodes.add(self.onExportNodes);
		};
		
		this.nodeExportTemplate = _.template('\
			<form id="id_exportnodesform" action="<%= url %>" method="get"">\
				<fieldset>\
					<div class="form-group">\
						<label for="id_exportformat">Export format</label>\
						<select id="id_exportformat" name="exportformat" class="form-control">\
						<% _.each(formats, function(format, index) { %>\
							<option value="<%= format %>"><%= format %></option>\
		    	  		<% }); %>\
						</select>\
					</div>\
					<div class="form-group">\
						<label for="id_filename">Filename</label>\
						<input type="text" id="id_filename" name="filename" value="<%= filename %>" class="form-control">\
					</div>\
	    		</fieldset>\
			</form>\
		');
		
		this.nodeImportTemplate = _.template('\
				<form id="id_importnodesform" action="<%= url %>" enctype="multipart/form-data" method="post">\
					<input type="hidden" value="<%= csrftoken %>" name="csrfmiddlewaretoken">\
					<fieldset>\
						<div class="form-group">\
							<label for="id_resourcefile">File</label>\
	    					<input type="file" id="id_nodefile" name="nodefile">\
							<span class="help-block">Supported formats ( xml | proto ). Make sure filename ends with mime-type.</span>\
						</div>\
		    		</fieldset>\
				</form>\
			');
			
		this.onImportNodes = function() {
			
			var csrftoken = $.cookie('csrftoken');
			var $form = $($.trim(self.nodeImportTemplate({
				url:'/project/import/node',
				csrftoken: csrftoken
			})));
			
			fu.openModal('Import Nodes', $form, [{
					label:"Import",
					callback: function() {
						
						$form.ajaxForm({
							beforeSubmit: function(arr, $form, options) {
								//... validate?
								//... Add loading?
							},
							success: function() {
								fu.closeModal();
								fu.msg.nodesChange.dispatch();
							},
							error: function() {
								alert("faild import data");
							}
						}).submit();
						
					}
				}] ,{
				small:true
			});
		}
		
		this.onExportNodes = function() {
			
			var d1= moment();
			var $form = $($.trim(self.nodeExportTemplate({
				url:'/project/export/node',
				formats: ['xml','protobuf'],
				filename: "nodes-" + d1.format('YYYY-MM-DD')
			})));
			
			fu.openModal('Export Nodes', $form, [{
					label:"Export",
					callback: function() {
						$form.submit();
						fu.closeModal();
					}
				}] ,{
				small:true
			});
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return projectExportImportNodeModule;
})();
fu.models['projectExportImportNode'] = new ProjectExportImportNodeModule();