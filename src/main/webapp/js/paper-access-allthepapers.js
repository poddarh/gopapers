var lastGAUpdated = new Date();

var paperFrame;
var paperFrame1;
var paperFrame2;
var paperURL = "";
var paperURI = "";
var RHPaperURI = "";
var LHPaperURI = "";

// Google Analytics

//<![CDATA[
	$(window).load(function() { // makes sure the whole site is loaded
		$('#status').fadeOut(); // will first fade out the loading animation
		$('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
		$('body').delay(350).css({'overflow':'visible'});
	});
//]]>

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// End Google Analytics

$(function() {
	
	var paper = {params:{}};
	var paper2 = {params:{}};
	
	if($.cookie(exam+"-lastUpdate")==null || $.cookie(exam+"-lastUpdate") < 5){
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
	
	$.cookie(exam+"-lastUpdate", '5', { expires: 365 });
	
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
		var indexOfHash2 = location.href.lastIndexOf('__');
		if(indexOfHash!=-1){
			if(indexOfHash2!=-1)
				paper.full = location.href.substring(indexOfHash + 2, indexOfHash2);
			else
				paper.full = location.href.substring(indexOfHash + 2);
		}
		if(paper.full!=null){
			paper.subjectCode = paper.full.substring(0, 4);
			if(paper.full.length>4){
				
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
				
			}
			else{
				paper.params.type = "sp";
			}
			ga('send', 'event', 'link', 'open', "Used direct link to paper");
		}
		
		
		if(indexOfHash2!=-1)
			paper2.full = location.href.substring(indexOfHash2 + 2);
		
		if(paper2.full!=null){
			paper2.subjectCode = paper2.full.substring(0, 4);
			if(paper2.full.length>4){
				
				paper2.params.session = paper2.full.substring(5, 6);
				paper2.params.year = paper2.full.substring(6, 8);
				paper2.params.type = paper2.full.substring(9, 11);
				if(paper2.full.length>11){
					paper2.params.paper = paper2.full.substring(12, paper2.full.length);
					if(paper2.params.paper.length>1){
						paper2.params.variant = paper2.params.paper.substring(1,2);
						paper2.params.paper = paper2.params.paper.substring(0,1);
					}else{
						paper2.params.variant = 0;
					}
				}
			}
			else{
				paper2.params.type = "sp";
			}
		}
		
		
		// Populate the subjects list
		var options = "";
		$.each(data, function (index, value) {
			var subjectCode = value.substring(value.length-5,value.length-1);
			if(paper.subjectCode == subjectCode)
				paper.params.subject = value;
			if(paper2.subjectCode == subjectCode)
				paper2.params.subject = value;
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
			evalPaperURL();
			
			if(paper2.full==null){
				openBelow();
			}else{
				openInLH();				
				if($("input[type='radio'][name='subject'][value='"+paper2.params.subject+"']").length==0)
					$("#selected-subjects").append("<input type='radio' id='radio_subject_"+paper2.params.subject+"' name='subject' value='"+paper2.params.subject+"'><label for='radio_subject_"+paper2.params.subject+"'>"+paper2.params.subject.replace(/[(].*[)]/,"")+"</label>");
		
				set(paper2.params);
				evalPaperURL();
				openInRH();
			}
			
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
	baseXP = "http://theallpapers.com/papers/CIE/IGCSE/";
else if(exam=="OLevel")
	baseXP = "http://theallpapers.com/papers/CIE/OLevels/";
else
	baseXP = "http://theallpapers.com/papers/CIE/AS_and_ALevel/";

function changeBoard(board){
	if(board=="IGCSE")
		window.window.top.location.href = "http://gopapers.net/igcse.html";
	else if(board=="OLevel")
		window.window.top.location.href = "http://gopapers.net/olevel.html";
	else
		window.window.top.location.href = "http://gopapers.net/alevel.html";
}

function evalPaperURL(){
	var subject = getValue("subject");
	var type = getValue("type");
	
	ga('send', 'event', 'subject', 'find', subject);
	ga('send', 'event', 'type', 'find', type);
	
	lastGAUpdated = new Date();
	
	if(type=="sp"){
		paperURI = subject+"/";
		paperURL = baseXP + paperURI;
	}else{
		
		var year = getValue("year");
		var session = getValue("session");
		var subjectCode = subject.substring(subject.length-5,subject.length-1)
		
		paperURI = subject+"/"+subjectCode+"_"+session+year+"_"+type;
		
		if(type != "er" && type != "gt"){
			var paper = getValue("paper");
			var variant = getValue("variant");
			
			if(variant!=0 && ((exam=="OLevel" && year>9) || (exam!="OLevel" && (year > 9 || (year == 9 && session == 'w')))))
				paper += ""+variant;
			
			paperURI += "_"+paper;
		}
		
		paperURL = baseXP + paperURI + ".pdf";
	}
}

function updateURL(){
	var endPos = document.URL.indexOf("?");
	if(endPos==-1)
		endPos = document.URL.length;
	var pageUrl = document.URL.substring(document.URL.lastIndexOf("/"),endPos);
	
	if(LHPaperURI != "" && RHPaperURI != ""){
		top.postMessage({updateUri: pageUrl+"?_"+extractPaperCode(LHPaperURI)+"__"+extractPaperCode(RHPaperURI)}, "*");
	}else
		top.postMessage({updateUri: pageUrl+"?_"+extractPaperCode(paperURI)}, "*");
}
	
function extractPaperCode(paperURI){
	var index = paperURI.lastIndexOf('/')+1;
	
	var paperCode;
	if(paperURI.length == index){
		paperCode = paperURI.substr(paperURI.lastIndexOf('(')+1,4);
	}
	else{
		paperCode = paperURI.substr(index);
	}
	
	return paperCode;
}

function openBelow(){
	closeHeader();
	clearBothHalfs();
	evalPaperURL();
	LHPaperURI = RHPaperURI = "";
	updateURL();
	$("#doubleIframe").hide();
	$("#singleIframe").show();
	paperFrame.src = paperURL ;
	paperFrame.style.display = 'block';
	paperFrame.scrollIntoView(true);
}

function openInLH(){
	closeHeader();
	evalPaperURL();
	LHPaperURI = paperURI;
	updateURL();
	$("#singleIframe").hide();
	$("#doubleIframe").show();
	paperFrame1.src = paperURL ;
	paperFrame1.style.display = 'block';
	paperFrame1.scrollIntoView(true);
}

function openInRH(){
	closeHeader();
	evalPaperURL();
	RHPaperURI = paperURI;
	updateURL();
	$("#singleIframe").hide();
	$("#doubleIframe").show();
	paperFrame2.src = paperURL ;
	paperFrame2.style.display = 'block';
	paperFrame2.scrollIntoView(true);
}

function clearBothHalfs(){
	paperFrame1.src = "" ;
	
	paperFrame2.src = "" ;
}

function openInNewTab(){
	evalPaperURL();
	window.open(paperURL);
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
