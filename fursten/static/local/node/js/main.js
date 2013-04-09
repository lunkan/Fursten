
var NodeModule = (function () {
	
	var nodeModule = function() {
		
		var that = this;
		
		var currentNodeForm = null;
		var currentNodeFormView = null;
		
		var currentSampleForm = null;
		var currentSampleFormView = null;
		
		//MESSAGES
		fu.msg.newNodes = new signals.Signal();
		fu.msg.deleteNodes = new signals.Signal();
		fu.msg.setNodes = new signals.Signal();
		fu.msg.clearNodes = new signals.Signal();
		fu.msg.nodesChange = new signals.Signal();
		fu.msg.getSamples = new signals.Signal();
		fu.msg.importNodes = new signals.Signal();
	    fu.msg.exportNodes = new signals.Signal();
	    
		this.onJQueryReady = function() {
			//...
		};
		
		this.onInitialized = function() {
			fu.msg.newNodes.add(that.onNewNodes);
			fu.msg.deleteNodes.add(that.onDeleteNodes);
			fu.msg.setNodes.add(that.onSetNodes);
			fu.msg.clearNodes.add(that.onClearNodes);
			fu.msg.getSamples.add(that.onGetSamples);
			fu.msg.importNodes.add(that.onImportNodes);
		    fu.msg.exportNodes.add(that.onExportNodes);
		};
	    
		this.onNewNodes = function() {
			
			currentNodeForm = new NodeForm();
			currentNodeForm.url = "/node/inject";
			currentNodeFormView = new Backbone.Form({
			    model: currentNodeForm
			});
			
			currentNodeFormView.render();
			var controls = [{callback:fu.models['node'].onSaveNodes, label:"Save"}];
			fu.openModal("New Nodes", currentNodeFormView.el, controls);
		};
		
	    this.onDeleteNodes = function() {
	    	
	    	currentNodeForm = new NodeForm();
	    	currentNodeForm.url = "/node/remove";
			currentNodeFormView = new Backbone.Form({
			    model: currentNodeForm
			});
			
			currentNodeFormView.render();
			var controls = [{callback:fu.models['node'].onSaveNodes, label:"Save"}];
			fu.openModal("Delete Nodes", currentNodeFormView.el, controls);
	    };
	    
	    this.onSetNodes = function() {
	    	currentNodeForm = new NodeForm();
	    	currentNodeForm.url = "/node/set";
			currentNodeFormView = new Backbone.Form({
			    model: currentNodeForm
			});
			
			currentNodeFormView.render();
			var controls = [{callback:fu.models['node'].onSaveNodes, label:"Save"}];
			fu.openModal("Set Nodes", currentNodeFormView.el, controls);
	    };
	    
	    this.onClearNodes = function() {
	    	
	    	$.ajax({
    		   url: '/node/',
    		   type: 'DELETE',
    		   success: function() {
    			   fu.msg.nodesChange.dispatch();
    		   },
    		   error: function() {
    			   alert('error');
    		   }
	    	});
	    };
	    
		this.onSaveNodes = function() {
			
			var currForm = currentNodeForm;
			var currFormView = currentNodeFormView;
			var errors = currentNodeFormView.commit();
			
			if(!errors) {
				currentNodeForm.on('error', function() {
					$(currFormView.el).prepend('<div class="alert alert-error">\
						<button type="button" class="close" data-dismiss="alert">&times;</button>\
						<strong>Warning!</strong> Could not save data.\
						</div>\
					');
				});
				currentNodeForm.on('sync', function() {
					fu.models['node'].onNodeSaveComplete();
				});
				currentNodeForm.save();	
			}
		};
		
		this.onNodeSaveComplete = function() {
			currentNodeForm = null;
			currentNodeFormView = null;
			fu.closeModal();
			fu.msg.nodesChange.dispatch();
		};
		
		/**
		 * SAMPLES
		 */
		this.onGetSamples = function() {
			
			currentSampleForm = new SampleForm();
			currentSampleForm.url = "/node/samples";
			currentSampleFormView = new Backbone.Form({
			    model: currentSampleForm
			});
			
			currentSampleFormView.render();
			var controls = [{callback:fu.models['node'].onFetchSamples, label:"Fetch"}];
			fu.openModal("Get samples", currentSampleFormView.el, controls);
		}
		
		this.onFetchSamples = function() {
			
			var currForm = currentSampleForm;
			var currFormView = currentSampleFormView;
			var errors = currentSampleFormView.commit();
			
			if(!errors) {
				currentSampleForm.on('error', function() {
					$(currFormView.el).prepend('<div class="alert alert-error">\
						<button type="button" class="close" data-dismiss="alert">&times;</button>\
						<strong>Warning!</strong> Could not fetch samples.\
						</div>\
					');
				});
				currentSampleForm.on('sync', function() {
					
					//Ugly - this code is not working
					//currentSampleFormView should be updated on render!!!
					var currentSampleFormView = new Backbone.Form({
					    model: currentSampleForm
					});
					
					currentSampleFormView.render();
					
					$('#myModal .modal-body').html("");
					$('#myModal .btn-primary').addClass('disabled ');
					$('#myModal .btn-primary').attr('disabled', 'disabled');
					$('#myModal .modal-body').append(currentSampleFormView.el);
				});
				currentSampleForm.save();
			}
			
		};
		
		this.onImportNodes = function() {
			
			/*currentImportFormView = $('\
				<form id="import-resources-form" action="/resource/import-export/" enctype="multipart/form-data" method="post">\
		    		<label>File</label>\
		    		<input type="file" name="resource-file">\
		    		<span class="help-block">Must be a .proto file!</span>\
				</form>\
			');
			
			var controls = [{callback:fu.models['resource'].onSaveImportResources, label:"Import"}];
			fu.openModal('Import Resources', currentImportFormView, controls);*/
		};
		
		this.onSaveImportNodes = function() {
			
			/*var csrftoken = $.cookie('csrftoken');
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
			}).submit();*/
			
		};
		
		this.onExportNodes = function() {
			
			var d1= moment();
			var dateStr = d1.format('YYYY-MM-DD');
			var defaultValue = "nodes-" + dateStr;
			
			currentExportFormView = $('\
				<form id="import-nodes-form" action="/node/import-export/" method="get">\
		    		<label>Save file as:</label>\
		    		<input class="span3" type="text" name="node-file-name" value="' + defaultValue + '">\
				</form>\
			');
				
			var controls = [{callback:fu.models['node'].onSaveExportNodes, label:"Export"}];
			fu.openModal('Export Nodes', currentExportFormView, controls);
		};
		
		this.onSaveExportNodes = function() {
			
			var filename = $('#import-nodes-form input[name=node-file-name]').val();
			var src = "/node/import-export/" + filename + ".proto";
			
			if($('#file-loader-container').length != 0) {
				$("#file-loader-container").html("");
			}
			else {
				$("body").append('<div id="file-loader-container"></div>');
			}
			
			alert(src);
			$('#file-loader-container').append('<iframe src="' + src + '"></iframe>');
			fu.closeModal();
		};
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.jQueryReady.add(this.onJQueryReady);
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return nodeModule;
})();
fu.models['node'] = new NodeModule();