var lastGAUpdated = new Date();

var paperFrame;
var paperFrame1;
var paperFrame2;

// Google Analytics

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// End Google Analytics

$(function() {
	
	var paper = {params:{}};
	
	if($.cookie(exam+"-lastUpdate")==null || $.cookie(exam+"-lastUpdate") < 3){
		$( "#update-message" ).dialog({
	      modal: true,
	      width: '500px',
	      buttons: {
	        Ok: function() {
	          $( this ).dialog( "close" );
	        }
	      }
	    });
	}
	
	$.cookie(exam+"-lastUpdate", '3', { expires: 365 });
	
	ga('create', 'UA-50628663-2', 'auto');

	ga('send', 'pageview', {
		  'page': pageURI,
		  'title': pageTitle
	});

	$("button").on('click', function() {
		ga('send', 'event', 'button', 'click', $(this).children("span").html());
	});

	$(".link").on('click', function() {
		ga('send', 'event', 'link', 'click', $(this).html());
	});
	
	lastGAUpdated = new Date();
	
	$.getJSON(exam+'.json', function(data) {
		
		var indexOfHash = location.href.lastIndexOf('?_');
		if(indexOfHash!=-1)
			paper.full = location.href.substring(indexOfHash + 2);
		
		if(paper.full!=null){
			paper.subjectCode = paper.full.substring(0, 4);
			paper.params.session = paper.full.substring(5, 6);
			paper.params.year = paper.full.substring(6, 8);
			paper.params.type = paper.full.substring(9, 11);
			if(paper.full.length>11){
				paper.params.paper = paper.full.substring(12, paper.full.length);
				if(paper.params.paper.length>1){
					paper.params.variant = paper.params.paper.substring(1,2);
					paper.params.paper = paper.params.paper.substring(0,1);
				}else{
					paper.params.variant = 0;
				}
			}
			ga('send', 'event', 'link', 'open', "Used direct link to paper");
		}
		
		// Populate the subjects list
		var options = "";
		$.each(data, function (index, value) {
			var subjectCode = value.substring(value.length-5,value.length-1);
			if(paper.subjectCode == subjectCode)
				paper.params.subject = value;
			options += "<option value='"+value+"'>"+value+"</option>";
		});
		
		$("#subject-selector").append(options);
		
		//Populate subjects radio button
		var subjectsCookie = $.cookie(exam+"-subjects");
		if(subjectsCookie!=null && subjectsCookie!=""){
			var subjects;
			
			var subjects = subjectsCookie.split(";");
			$("#subject-selector").val(subjects);
			var tmpStr="";
			$.each(subjects, function (index, value) {
				tmpStr+="<input type='radio' id='radio_subject_"+value+"' name='subject' value='"+value+"'";
				var subjectCode = value.substring(value.length-5,value.length-1);
				if(index==0)
					tmpStr += " checked='checked' ";
				tmpStr+="><label for='radio_subject_"+value+"'>"+value.replace(/[(].*[)]/,"")+"</label>";
			});
			
			$("#selected-subjects").html(tmpStr);
			
		}
		
		if(paper.full!=null){
			if($("input[type='radio'][name='subject'][value='"+paper.params.subject+"']").length==0)
				$("#selected-subjects").append("<input type='radio' id='radio_subject_"+paper.params.subject+"' name='subject' value='"+paper.params.subject+"'><label for='radio_subject_"+paper.params.subject+"'>"+paper.params.subject.replace(/[(].*[)]/,"")+"</label>");
	
			set(paper.params);
			$('#headerSlideContainer').hide("fast");
			$('#toggle').html("Open  Options &#x25BC;");
			getPaper(false);
		}
		$( ".radio" ).buttonset();
		
		$(".chosen-select").chosen({ width: '350px' });
		
		$( "#subject-selector-div" ).dialog({
	      autoOpen: false,
	      modal: true,
	      width: '500px',
	      buttons: {
	        Save: function() {
	        	var str = $("#subject-selector option:selected").map(function(){ return this.value }).get().join(";");
	        	$.cookie(exam+"-subjects", str, { expires: 365 });
	        	ga('send', 'event', 'subjects', 'save',exam);
	        	$( this ).dialog( "close" );
	        	location.reload();
	        }
	      }
	    });
		
		$(".choose-subjects-button").click(function(){
			if($( "#update-message" ).hasClass('ui-dialog-content') && $( "#update-message" ).dialog("isOpen"))
	       		$( "#update-message" ).dialog( "close" );
			$( "#subject-selector-div" ).dialog( "open" );
		});
		
    });
	
	$( ".radio" ).buttonset();
	$( "input[type=submit], .button, button" ).button();
	paperFrame = document.getElementById("paperFrame");
	paperFrame1 = document.getElementById("paperFrame1");
	paperFrame2 = document.getElementById("paperFrame2");
		
	setInterval(function () {
        if(new Date().getTime()-lastGAUpdated.getTime()>1500000){
			ga('send', 'event', 'page', 'idle');
			lastGAUpdated = new Date();
        }
    }, 180000);
	
	$('body').css('min-height', $('#headerSlideContainer').css('height'));
	
	$('#toggle').click(function(){
		toggleHeader()
	});
	
	$(".loader").fadeOut("slow");
});

function toggleHeader(){
	if($('#headerSlideContainer').css('display') == 'none')
		openHeader();
	else
		closeHeader();
	
}

function openHeader(){
	$('#headerSlideContainer').show("fast");
	$('#toggle').html("Close Options &#x25B2;");
}

function closeHeader(){
	$('#headerSlideContainer').hide("fast");
	$('#toggle').html("Open  Options &#x25BC;");
}

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURIComponent(results[1]) || 0;
    }
}

var baseXP;
if(exam=="IGCSE")
	baseXP = "http://papers.xtremepapers.com/CIE/Cambridge IGCSE/";
else if(exam=="OLevel")
	baseXP = "http://papers.xtremepapers.com/CIE/Cambridge International O Level/";
else
	baseXP = "http://papers.xtremepapers.com/CIE/Cambridge International A and AS Level/";

function getSubjectPage(){
	var subject = getValue("subject");
	ga('send', 'event', 'subject-page', 'open', subject);
	lastGAUpdated = new Date();
	openSingleURL(false,baseXP+subject);
}

function changeBoard(board){
	if(board=="IGCSE")
		window.window.top.location.href = "http://gopapers.net/igcse.html";
	else if(board=="OLevel")
		window.window.top.location.href = "http://gopapers.net/olevel.html";
	else
		window.window.top.location.href = "http://gopapers.net/alevel.html";
}

function getPaper(openInNewTab){
	var year = getValue("year");
	var session = getValue("session");
	var subject = getValue("subject");
	var type = getValue("type");
	var subjectCode = subject.substring(subject.length-5,subject.length-1);
	
	ga('send', 'event', 'subject', 'find', subject);
	ga('send', 'event', 'type', 'find', type);
	
	lastGAUpdated = new Date();
	
	var	baseURL;
	var fileName;
	URL = baseXP+subject+"/"+subjectCode+"_"+session+year+"_";
	if(type == "er" || type == "gt"){
		URL += type+".pdf";
		openSingleURL(openInNewTab, URL);
	}
	else{
		var paper = getValue("paper");
		var variant = getValue("variant");
		
		if(variant!=0 && ((exam=="OLevel" && year>9) || (exam!="OLevel" && (year > 9 || (year == 9 && session == 'w')))))
			paper += ""+variant;
		
		var endPos = document.URL.indexOf("?");
		if(endPos==-1)
			endPos = document.URL.length;
		var pageUrl = document.URL.substring(document.URL.lastIndexOf("/"),endPos);
		top.postMessage({updateUri: pageUrl+"?_"+subjectCode+"_"+session+year+"_"+type+"_"+paper}, "*");
		
		if(type == "qm"){
			openDoubleURL(openInNewTab, URL+"qp_"+paper+".pdf", URL+"ms_"+paper+".pdf");
		}
		else{
			openSingleURL(openInNewTab, URL+type+"_"+paper+".pdf");
		}
	}
}

function openSingleURL(openInNewTab,url){
	if(openInNewTab){
		window.open(url , '_blank');
	}
	else{
		closeHeader()
		$("#doubleIframe").hide();
		$("#singleIframe").show();
		paperFrame.src = url ;
		paperFrame.style.display = 'block';
		paperFrame.scrollIntoView(true);
	}
}

function openDoubleURL(openInNewTab,url1, url2){
	if(openInNewTab){
	   var win1 = window.open(url1, "window1", "width="+(screen.width/2-10)+",height="+(screen.height-120)+",scrollbars=yes");
	   var win2 = window.open(url2, "window2", "width="+(screen.width/2-10)+",height="+(screen.height-120)+",scrollbars=yes,left="+(screen.width/2+10));
	   if(!win1 || win1.closed || !win2 || win2.closed){
		alert("Please allow pop-up blocker to use this feature.");
		win1.close();
		win2.close();
	   }
	   else{
		win1.focus();
		win2.focus();
	   }
	}
	else{
		closeHeader()
		$("#singleIframe").hide();
		$("#doubleIframe").show();
		paperFrame1.src = url1 ;
		paperFrame2.src = url2 ;
		paperFrame1.scrollIntoView(true);
	}

}

function popOpen(url){
	window.open(url, "popwindow", "width=780,height=580,scrollbars=yes");
}

function getValue(inputName){
	var selectedVal = "";
	var selected = $("input[type='radio'][name='"+inputName+"']:checked");
	if (selected.length > 0) {
		selectedVal = selected.val();
	}
	return selectedVal;
}

function setValue(inputName, value) {
	$("input[type='radio'][name='"+inputName+"'][value='"+value+"']").click();
}

function set(fields){
	$.map(fields, function(value, key){
		setValue(key, value);
	});
}
