Backbone.Form.editors.BootstrapColorpicker = Backbone.Form.editors.Colorpicker.extend(null, {
	template: _.template('\
		<table>\
			<colgroup>\
				<col span="1" style="width:100%;">\
				<col span="1" style="width:1px;">\
			</colgroup>\
			<tbody>\
				<tr>\
					<td>\
						<input type="text" class="form-control" value="<%= value %>"">\
					</td>\
					<td>\
						<button class="add-on btn"><i style="background-color: rgb(255, 146, 180)"></i></button>\
					</td>\
				</tr>\
			</tbody>\
		</table>\
	', null, Backbone.Form.templateSettings),
});