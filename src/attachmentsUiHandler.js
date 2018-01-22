/**
*  @description Responsible forthe UI part of the attachments handler.
*  @author ypa
*  @copyright PARX Werk AG
*/
var attachmentsUiHandler = new function()
{
	var self = this;

	/*
	*   @description US282. if it's the communication inteface.
	*/
	self._resizePublisher = function()
	{
		if (Sfdc && Sfdc.canvas && Sfdc.canvas.publisher)
		{
			Sfdc.canvas.publisher.resize( { height : (document.body.scrollHeight) + 'px' } );
		}
	}

	/*
	*   @description US282. Creates and pushes rows with attachments related info.
	*/
	self._drawAttachments = function(handler)
	{
		var tbody = jQuery(".attachemnts-handler-tbody-selector");
		handler.attachments.forEach(function(attachmentWrapper)
		{
			//To be able to maintain the same order of line items after rerendering.
			attachmentWrapper.counter = self.counter++;

			var row = self._buildRow(attachmentWrapper, false);

			tbody.append(row);
		});
	}

	/*
	*   @description US282. Creates and pushes a row with an attachment related info.
	*/
	self._buildRow = function(attachmentWrapper, isUploading, handler)
	{
		var row = self._buildTableRow();
		if (drawCheckboxes() && !isUploading)
		{
			if (attachmentWrapper.isChecked)
			{
				handler.selectedAttachmentsIds.push(attachmentWrapper.att.Id);
			}
			var checkbox = self._buildTableColumnCheckbox(attachmentWrapper, handler);
			row.append(checkbox);
		}

		var fileNameColumn = self._buildTableColumnFileName(!isUploading, attachmentWrapper, isUploading);
		if (drawCheckboxes() && isUploading)
		{
			fileNameColumn.attr("colspan", "2");
		}
		row.append(fileNameColumn);

		//To maintain the same order of line items after rerendering.
		if (isUploading)
		{
			row.attr("data-counter", handler.counter++);
		}

		return row;
	}

	/*
	*   @description US282. Creates html tr element.
	*/
	self._buildTableRow = function()
	{
		return jQuery("<tr></tr>");
	}

	/*
	*   @description US282. Creates html td element with a nested checkbox.
	*/
	self._buildTableColumnCheckbox = function(attachmentWrapper, isUploading, handler)
	{
		var innerHtml = "<td class='slds-cell-shrink'>" +
							"<label class='slds-checkbox'>" +
								"<input type='checkbox' name='options' id='checkbox-1' value='on'>" + 
								"<span class='slds-checkbox--faux'></span>" +
							"</label>" +
						"</td>";
		var td = jQuery(innerHtml);

		td.find("input").prop("checked", attachmentWrapper.isChecked);
		td.find("input").attr("data-id", attachmentWrapper.att.Id);
		td.find("input").bind("change", handler._handleLineItemSelection);

		return td;
	}

	/*
	*   @description US282. Creates html td element with a download link or a plain text file name(if the file is uploading).
	*/
	self._buildTableColumnFileName = function(asLink, attachmentWrapper, isUploading)
	{
		var attachment = attachmentWrapper.att ? attachmentWrapper.att : attachmentWrapper;
		var fileNameMarkup = undefined;
		if (asLink)
		{
			var url = getRelatedAttachDownloadBaseUrl() + attachment.Id;
			fileNameMarkup = jQuery("<a href='" + url + "' target='_blank'></a>");
		} else 
		{
			fileNameMarkup = jQuery("<span></span>");
		}
		
		fileNameMarkup.text(attachment.Name);
		var innerHtml = "<td class='attachemnts-handler-file-name-container' scope='row' data-label='" + getAttachmentFileLabel() + "'>" +
							"<div class='slds-truncate' title='" + getAttachmentFileLabel() + "'>" +
							"</div>" +
						"</td>";
		var container = jQuery(innerHtml);
		container.append(fileNameMarkup);

		if (isUploading)
		{
			var spinner = self._buildSpinner();
			container.append(spinner);
			container.addClass("attachemnts-handler-item-is-uploading");
		}

		return container;
	}

	/*
	*   @description US282. Creates a spinner to be able to indicate that an attachments is uploading.
	*/
	self._buildSpinner = function()
	{
		var innerHtml = "<div class='slds-spinner-custom_container slds-float--right attachemnts-handler-item-spinner'>" +
							"<div role='status' class='slds-spinner slds-spinner--small'>" +
								"<span class='slds-assistive-text'>Loading</span>" + 
								"<div class='slds-spinner__dot-a'></div>" +
								"<div class='slds-spinner__dot-b'></div>" + 
							"</div>" +
						"</div>";
		return jQuery(innerHtml);
	}

	self._showErrorMsg = function(message)
	{
		jQuery(".attachemnts-handler-error-msg-container").find("h2").text(message);
		jQuery(".attachemnts-handler-error-msg-container").toggleClass("slds-hide");
	}

	self._hideErrorMessage = function()
	{
		jQuery(".attachemnts-handler-error-msg-container").addClass("slds-hide");
	}
}

module.exports = attachmentsUiHandler;