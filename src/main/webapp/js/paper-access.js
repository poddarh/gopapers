var lastGAUpdated = new Date();

var paperFrame;
var paperFrame1;
var paperFrame2;
var initTop;

// Google Analytics

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// End Google Analytics

$(function() {
	if($.cookie(exam+"-lastUpdate")==null || $.cookie(exam+"-lastUpdate") < 2){
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
	
	$.cookie(exam+"-lastUpdate", '2', { expires: 365 });
	
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
		
		// Populate the subjects list
		var options = "";
		$.each(data, function (index, value) {
			options += "<option value='"+value+"'>"+value+"</option>";
	    });
		$("#subject-selector").append(options);
		
		//Populate subjects radio button
		var subjectsCookie = $.cookie(exam+"-subjects");
		if(subjectsCookie!=null && subjectsCookie!=""){
			var subjects = subjectsCookie.split(",");
			$("#subject-selector").val(subjects);
			var tmpStr="";
			$.each(subjects, function (index, value) {
				tmpStr+="<input type='radio' id='radio_subject_"+value+"' name='subject' value='"+value+"'";
				if(index==0)
					tmpStr += " checked='checked' ";
				tmpStr+="><label for='radio_subject_"+value+"'>"+value.replace(/[(].*[)]/,"")+"</label>";
			});
			$("#selected-subjects").html(tmpStr);
			$( ".radio" ).buttonset();
		}
		
		$(".chosen-select").chosen({ width: '350px' });
		
		$( "#subject-selector-div" ).dialog({
	      autoOpen: false,
	      modal: true,
	      width: '500px',
	      buttons: {
	        Save: function() {
	        	var str = $("#subject-selector option:selected").map(function(){ return this.value }).get().join(",");
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
	
	initTop = (0-$("#headerSlideContent").height())+40;
	$('#headerSlideContainer').css( "top", initTop);
	$('#headerSlideContainer').stop().animate({'top' : '0px'}, 0);
	
	$('#toggle').click(function(){
		toggleHeader()
	});
	
	$(".loader").fadeOut("slow");
});

function toggleHeader(){
	if($('#headerSlideContainer').css('top') != '0px')
		openHeader();
	else
		closeHeader();
	
}

function openHeader(){
	$('#headerSlideContainer').stop().animate({'top' : '0px'}, 300);
	$('#toggle').html("&#x25B2;");
}

function closeHeader(){
	$('#headerSlideContainer').stop().animate({'top' : initTop}, 300);
	$('#toggle').html("&#x25BC;");
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
else{
	baseXP = "http://papers.xtremepapers.com/CIE/Cambridge International A and AS Level/";
}

function getSubjectPage(){
	var subject = getValue("subject");
	ga('send', 'event', 'subject-page', 'open', subject);
	lastGAUpdated = new Date();
	openSingleURL(false,baseXP+subject);
}

function changeBoard(){
	
	if(exam=="IGCSE")
		window.window.top.location.href = "http://gopapers.net/alevel.html";
	else
		window.window.top.location.href = "http://gopapers.net/igcse.html";
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
		var paper;
		
		var nonvariantSubjects = [9679,8779,8679,9704,9631,9011,9687,8687,8058,9014,8281,9688,8688,9693,9703,8780,9718,8672,9689,8689,9690,8690,9676,8686,9686,0512,0549];
		var variantValid = true;
		$.each(nonvariantSubjects, function(index, value) {
			if(subjectCode==value){
				variantValid = false;
				return false;
			}
		});
		if(variantValid && (year > 9 || (year == 9 && session == 'w')))
			paper = getValue("paper")+""+getValue("variant");
		else
			paper = getValue("paper");
		
		if(type == "qp-ms"){
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

function getValue(id){
	var selectedVal = "";
	var selected = $("input[type='radio'][name='"+id+"']:checked");
	if (selected.length > 0) {
		selectedVal = selected.val();
	}
	return selectedVal;
}