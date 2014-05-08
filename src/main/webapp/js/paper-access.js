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
	
	if($.cookie(exam+"-lastUpdate")==null || $.cookie(exam+"-lastUpdate") < 1){
		$( "#update-message-1" ).dialog({
	      modal: true,
	      width: '500px',
	      buttons: {
	        Ok: function() {
	          $( this ).dialog( "close" );
	        }
	      }
	    });
	}
	
	$.cookie(exam+"-lastUpdate", '1', { expires: 365 });
	
	ga('create', 'UA-50628663-2', 'auto');

	ga('send', 'pageview', {
		  'page': pageURI,
		  'title': pageTitle
	});

	$("button").on('click', function() {
		ga('send', 'event', 'button', 'click', $(this).children("span").html());
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
	        	$.cookie(exam+"-subjects", $("#subject-selector option:selected").map(function(){ return this.value }).get().join(","), { expires: 365 });
	        	$( this ).dialog( "close" );
	        	location.reload();
	        }
	      }
	    });
		
		$("#edit-subjects").click(function(){
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
	
});

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
		window.open("paper.html","_self");
	else
		window.open("igcse.html","_self");
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
		
		var nonVarientSubjects = [0549];
		var varientValid = $.grep( nonVarientSubjects, function( n, i ) {
			  return subjectCode == n;
		});
		
		if(varientValid && (year > 9 || (year == 9 && session == 'w')))
			paper = getValue("paper")+""+getValue("varient");
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
		$("#doubleIframe").hide();
		$("#singleIframe").show();
		paperFrame.src = url ;
		paperFrame.style.display = 'block';
		paperFrame.scrollIntoView(true);
	}
}

function openDoubleURL(openInNewTab,url1, url2){
	if(openInNewTab){
	    window.open(url1, "window1", "width="+(screen.width/2-10)+",height="+(screen.height-120)+",scrollbars=yes");
	    window.open(url2, "window2", "width="+(screen.width/2-10)+",height="+(screen.height-120)+",scrollbars=yes,left="+(screen.width/2+10));
	}
	else{
		$("#singleIframe").hide();
		$("#doubleIframe").show();
		paperFrame1.src = url1 ;
		paperFrame2.src = url2 ;
		paperFrame1.style.display = 'block';
		paperFrame2.style.display = 'block';
		paperFrame1.scrollIntoView(true);
	}

}

function getValue(id){
	var selectedVal = "";
	var selected = $("input[type='radio'][name='"+id+"']:checked");
	if (selected.length > 0) {
		selectedVal = selected.val();
	}
	return selectedVal;
}