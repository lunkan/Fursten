
var ResourceModule = (function () {
	
	var resourceModule = function() {
		var that = this;
		var resourceList = null;
		var resourceListView = null;
		//new ResourceCollection();
		
		var currentResourceForm = null;
		var currentResourceFormView = null;
		
		var currentResourceStyleForm = null;
		var currentResourceStyleFormView = null;
		
		var currentImportFormView = null;
		
		var selectedResources = [];
		
		//MESSAGES
		fu.msg.newResource = new signals.Signal();
		fu.msg.extendResource = new signals.Signal();
		fu.msg.editResource = new signals.Signal();
	    fu.msg.deleteResource = new signals.Signal();
		fu.msg.resourceChange = new signals.Signal();
		fu.msg.resourceSelectChange = new signals.Signal();
		fu.msg.updateResourceFilters = new signals.Signal();
		fu.msg.updateResourceFiltersComplete = new signals.Signal();
		fu.msg.editResourceStyle = new signals.Signal();
		fu.msg.importResources = new signals.Signal();
	    fu.msg.exportResources = new signals.Signal();
		
		this.onJQueryReady = function() {
			
			
		};
		
		this.onInitialized = function() {
			
			fu.msg.newResource.add(that.onNewResource);
			fu.msg.extendResource.add(that.onExtendResource);
			fu.msg.editResource.add(that.onEditResource);
			fu.msg.deleteResource.add(that.onDeleteResource);
			fu.msg.resourceChange.add(that.onResourceChange);
			fu.msg.worldChanged.add(that.onResourceChange);
			fu.msg.resourceSelectChange.add(that.onResourceSelectChange);
			fu.msg.updateResourceFilters.add(that.onUpdateResourceFilters);
			fu.msg.editResourceStyle.add(that.onEditResourceStyle);
			fu.msg.importResources.add(that.onImportResources);
		    fu.msg.exportResources.add(that.onExportResources);
		    
			resourceList = new ResourceListForm();
			resourceListView = new Backbone.Form({
			    model: resourceList
			});
			
			resourceList.on('sync', function() {
				$(resourceListView.el).html("");
				resourceListView.render();
				$('#resource-list-block .block__body').append(resourceListView.el);
				
				var t = setTimeout(function(){
					$('#resource-list-block').selectableTable();
					$('#resource-list-block').on('selectChanged', function() {
						fu.msg.resourceSelectChange.dispatch();
					});
					fu.msg.resourceSelectChange.dispatch();
					fu.msg.updateResourceFiltersComplete.dispatch();
				},1000);
				
			}, this);
			resourceList.on('error', function() {
				alert("resourceList save error");
			});
			
			resourceList.fetch();
		};
	    
		this.hasSelectedResource = function() {
			
			if(selectedResources.length < 1)
				return false;
			
			return true;
		};
		
		this.getSelectedResource = function() {
			
			if(selectedResources.length < 1)
				return null;
			
			return selectedResources[0];
		};
		
		this.onNewResource = function() {
			
			currentResourceForm = new ResourceForm();
			currentResourceFormView = new Backbone.Form({
			    model: currentResourceForm
			});
			
			currentResourceFormView.render();
			var controls = [{callback:fu.models['resource'].onSaveResource, label:"Save"}];
			fu.openModal("New resource", currentResourceFormView.el, controls);
		};
		
		this.onExtendResource = function() {
			
			if(!that.hasSelectedResource())
				return;
				
			currentResourceForm = new ResourceForm();
			currentResourceForm.url = "/resource/" + that.getSelectedResource() +"/";
			currentResourceFormView = new Backbone.Form({
			    model: currentResourceForm
			});
			
			currentResourceForm.on('sync', function() {
				$(currentResourceFormView.el).html("");
				currentResourceFormView.render();
				var controls = [{callback:fu.models['resource'].onSaveResource, label:"Save"}];
				fu.openModal("Extend resource", currentResourceFormView.el, controls);
			}, this);
			currentResourceForm.fetch();
		};
		
		this.onEditResource = function() {
			
			if(!that.hasSelectedResource())
				return;
			
			currentResourceForm = new ResourceForm();
			currentResourceForm.url = "/resource/" + that.getSelectedResource() +"/";
			currentResourceForm.id = that.getSelectedResource();//by seetting id we force a put action
			currResourceId = that.getSelectedResource();
			
			currentResourceFormView = new Backbone.Form({
			    model: currentResourceForm
			});
			
			currentResourceForm.on('sync', function() {
				$(currentResourceFormView.el).html("");
				currentResourceFormView.render();
				var controls = [{callback:fu.models['resource'].onSaveResource, label:"Save"}];
				fu.openModal('<img src="/resource/'+currResourceId+'/thumbnail/"/> Edit resource', currentResourceFormView.el, controls);
			}, this);
			currentResourceForm.fetch();
		};
		
	    this.onDeleteResource = function() {
	    	
	    	if(selectedResources.length < 1)
				return;
	    	
	    	var filters = '';
	    	_.each(selectedResources, function(element, index) {
	    		if(index > 0)
	    			filters += '&';
	    		
	    		hexString = element.toString(16);
	    		filters += 'filter=' + hexString;
	    	});
	    	
	    	$.ajax({
    		   url: '/resource/?'+filters,
    		   type: 'DELETE',
    		   success: function() {
    			   resourceList.fetch();
    		   },
    		   error: function() {
    			   alert('error');
    		   }
	    	});
	    };
	    
		this.onSaveResource = function() {
			
			var currForm = currentResourceForm;
			var currFormView = currentResourceFormView;
			var errors = currentResourceFormView.commit();
			
			if(!errors) {
				currentResourceForm.on('error', function() {
					$(currFormView.el).prepend('<div class="alert alert-error">\
						<button type="button" class="close" data-dismiss="alert">&times;</button>\
						<strong>Warning!</strong> Could not save data.\
						</div>\
					');
				});
				currentResourceForm.on('sync', function() {
					fu.models['resource'].onResourceSaveComplete();
				});
				currentResourceForm.save();	
			}
		}
		
		this.onResourceSaveComplete = function() {
			currentResourceForm = null;
			currentResourceFormView = null;
			fu.closeModal();
			fu.msg.resourceChange.dispatch();
		}
		
		this.onResourceChange = function() {
			resourceList.fetch();
		}
		
		this.onResourceSelectChange = function() {
			
			selectedResources = [];
			$('#resource-list-block .selected').each(function() {
				selectedResources.push($(this).attr('id'));
			});
			
			if(selectedResources.length < 1) {
				$('#main_menu_item_delete_resource').addClass("disabled");
				$('#main_menu_item_extend_resource').addClass("disabled");
				$('#main_menu_item_edit_resource').addClass("disabled");
				$('#main_menu_item_edit_resource_style').addClass("disabled");
			}
			else {
				$('#main_menu_item_delete_resource').removeClass("disabled");
				$('#main_menu_item_extend_resource').removeClass("disabled");
				$('#main_menu_item_edit_resource').removeClass("disabled");
				$('#main_menu_item_edit_resource_style').removeClass("disabled");
			}
		}
		
		this.onUpdateResourceFilters = function() {
			
			var errors = resourceListView.commit();
			
			if(!errors) {
				resourceList.save();
			}
			
		}
		
		this.onEditResourceStyle = function() {
			
			if(!that.hasSelectedResource())
				return;
			
			currentResourceStyleForm = new ResourceStyleForm();
			currentResourceStyleForm.url = "/resource/" + that.getSelectedResource() +"/style/";
			currentResourceStyleForm.id = that.getSelectedResource();//by setting id we force a put action
			currResourceId = that.getSelectedResource();
			
			currentResourceStyleFormView = new Backbone.Form({
			    model: currentResourceStyleForm
			});
			
			currentResourceStyleForm.on('sync', function() {
				$(currentResourceStyleFormView.el).html("");
				currentResourceStyleFormView.render();
				var controls = [{callback:fu.models['resource'].onSaveResourceStyle, label:"Save"}];
				fu.openModal('<img src="/resource/'+currResourceId+'/thumbnail/"/> Edit resource style', currentResourceStyleFormView.el, controls);
			}, this);
			currentResourceStyleForm.fetch();
		};
		
		this.onSaveResourceStyle = function() {
			
			var currForm = currentResourceStyleForm;
			var currFormView = currentResourceStyleFormView;
			var errors = currentResourceStyleFormView.commit();
			
			if(!errors) {
				currentResourceStyleForm.on('error', function() {
					$(currFormView.el).prepend('<div class="alert alert-error">\
						<button type="button" class="close" data-dismiss="alert">&times;</button>\
						<strong>Warning!</strong> Could not save data.\
						</div>\
					');
				});
				currentResourceStyleForm.on('sync', function() {
					fu.models['resource'].onResourceStyleSaveComplete();
				});
				currentResourceStyleForm.save();
			}
		}
		
		this.onResourceStyleSaveComplete = function() {
			currentResourceStyleForm = null;
			currentResourceStyleFormView = null;
			fu.closeModal();
			fu.msg.resourceChange.dispatch();
		}
		
		this.onImportResources = function() {
			
			currentImportFormView = $('\
				<form id="import-resources-form" action="/resource/import-export/" enctype="multipart/form-data" method="post">\
		    		<label>File</label>\
		    		<input type="file" name="resource-file">\
		    		<span class="help-block">Must be a .proto file!</span>\
				</form>\
			');
			
			var controls = [{callback:fu.models['resource'].onSaveImportResources, label:"Import"}];
			fu.openModal('Import Resources', currentImportFormView, controls);
		}
		
		this.onSaveImportResources = function() {
			
			var csrftoken = $.cookie('csrftoken');
			$('#import-resources-form').ajaxForm({
				beforeSend: function(xhr, settings) {
			    	if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
			        	xhr.setRequestHeader("X-CSRFToken", csrftoken);
			        }
			    },
				beforeSubmit: function(arr, $form, options) {
					//... validate?
				},
				success: function() {
					fu.closeModal();
					fu.msg.resourceChange.dispatch();
				},
				error: function() {
					$(currFormView.el).prepend('\
						<div class="alert alert-error">\
							<button type="button" class="close" data-dismiss="alert">&times;</button>\
							<strong>Warning!</strong> Could not save data.\
						</div>\
					');
				}
			}).submit();
			
		}
		
		this.onExportResources = function() {
			
			var d1= moment();
			var dateStr = d1.format('YYYY-MM-DD');
			var defaultValue = "resources-" + dateStr;
			
			currentExportFormView = $('\
				<form id="import-resources-form" action="/resource/import-export/" method="get">\
		    		<label>Save file as:</label>\
		    		<input class="span3" type="text" name="resource-file-name" value="' + defaultValue + '">\
				</form>\
			');
				
			var controls = [{callback:fu.models['resource'].onSaveExportResources, label:"Export"}];
			fu.openModal('Export Resources', currentExportFormView, controls);
		}
		
		this.onSaveExportResources = function() {
			
			var filename = $('#import-resources-form input[name=resource-file-name]').val();
			var src = "/resource/import-export/" + filename + ".proto";
			
			if($('#file-loader-container').length != 0) {
				$("#file-loader-container").html("");
			}
			else {
				$("body").append('<div id="file-loader-container"></div>');
			}
				
			$('#file-loader-container').append('<iframe src="' + src + '"></iframe>');
			fu.closeModal();
		}
	    
		//SUBSCRIBE TO MESSAGES
		fu.msg.jQueryReady.add(this.onJQueryReady);
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return resourceModule;
})();
fu.models['resource'] = new ResourceModule();