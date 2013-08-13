
var ProjectExportImportResourceModule = (function () {
	
	var projectExportImportResourceModule = function() {
		
		var self = this;
		
		//MESSAGES
		fu.msg.importResources = new signals.Signal();
	    fu.msg.exportResources = new signals.Signal();
		
		this.onInitialized = function() {
			
			fu.msg.importResources.add(self.onImportResources);
		    fu.msg.exportResources.add(self.onExportResources);
		};
		
		this.resourceExportTemplate = _.template('\
			<form id="id_exportresourcesform" action="<%= url %>" method="get"">\
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
		
		this.resourceImportTemplate = _.template('\
				<form id="id_importresourcesform" action="<%= url %>" enctype="multipart/form-data" method="post">\
					<input type="hidden" value="<%= csrftoken %>" name="csrfmiddlewaretoken">\
					<fieldset>\
						<div class="form-group">\
							<label for="id_resourcefile">File</label>\
	    					<input type="file" id="id_resourcefile" name="resourcefile">\
							<span class="help-block">Supported formats ( xml | proto ). Make sure filename ends with mime-type.</span>\
						</div>\
		    		</fieldset>\
				</form>\
			');
			
		this.onImportResources = function() {
			
			var csrftoken = $.cookie('csrftoken');
			var $form = $($.trim(self.resourceImportTemplate({
				url:'/project/import/resource',
				csrftoken: csrftoken
			})));
			
			fu.openModal('Import Resources', $form, [{
					label:"Import",
					callback: function() {
						
						$form.ajaxForm({
							beforeSubmit: function(arr, $form, options) {
								//... validate?
								//... Add loading?
							},
							success: function() {
								fu.closeModal();
								fu.msg.resourceChange.dispatch();
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
		
		this.onExportResources = function() {
			
			var d1= moment();
			var $form = $($.trim(self.resourceExportTemplate({
				url:'/project/export/resource',
				formats: ['xml','protobuf'],
				filename: "resources-" + d1.format('YYYY-MM-DD')
			})));
			
			fu.openModal('Export Resources', $form, [{
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
	
	return projectExportImportResourceModule;
})();
fu.models['projectExportImportResource'] = new ProjectExportImportResourceModule();