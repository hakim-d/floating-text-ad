/*!
 * Floating Text Ad 0.1
 * http://hakim.ma
 * MIT licensed
 * 
 * Copyright (C) 2014 Hakim DAHOUNE (http://hakim.ma, @7akim_d)
 */

var floatingTextAd = (function (){

	var Width,
		Height,
		Title,
		Text,
		textLength,
		Label,
		imgUrl,
		CTA,
		clickUrl,
		clickTarget,
		Color,
		cookieBirth,
		FTAwrap,
		FTAclose,
		FTAtext,
		FTAtitle,
		FTAdesc,
		FTAimg,
		FTAplay,
		FTAhot,
		FTAclickArea;

	function init(a,d) {
		
		// Capping - If cookie not expired: Don't show Ad
		if (document.cookie.indexOf("FTASleep") > -1) return;
		
		writeHtml();
	 	
	 	FTAwrap = document.getElementById('FTA-wrap');
		FTAclose = document.getElementById('FTA-close');
		FTAtitle = document.getElementById('FTA-title');
		FTAtext = document.getElementById('FTA-text');
		FTAimgHolder = document.getElementById('FTA-img-holder');
		FTAimg = document.getElementById('FTA-img');
		FTAplay = document.getElementById('FTA-play');
		FTAdesc = document.getElementById("FTA-description");
		FTAhot = document.getElementById("FTA-hot");
		FTAclickArea = document.getElementById("FTA-a");

		// Styles
		FTAwrap.style.bottom = - ( Height + 60 ) + 'px';
		FTAimg.style.width = Width + 'px';
		FTAimg.style.height = Height + 'px';
		FTAtext.style.width = ( Width + 20 ) + 'px';
		FTAplay.style.lineHeight = Height + 'px';
		FTAimgHolder.style.backgroundColor = Color;
		FTAplay.style.color = Color;

		// Data
		FTAimg.src = imgUrl;
		FTAtitle.innerHTML = Title;
		FTAdesc.innerHTML = Text;
		FTAclickArea.href = clickUrl;
		FTAclickArea.target = clickTarget;
		FTAplay.innerHTML = typeof CTA === "undefined" ? "Play Now" : CTA;
		FTAhot.innerHTML = typeof Label === "undefined" ? "HOT!" : Label;

		// Close button click handler
		document.body.attachEvent ? FTAclose.attachEvent('onclick', FTACloseIt) : FTAclose.addEventListener('click', FTACloseIt , false);
		
		// Ad appearance delay
		var delay = parseInt(d) > 0 ? parseInt(d) : 1000;
	 	var FTAshow = self.setInterval( function() {
	 		FTAwrap.style.bottom = '0px';
	 		window.clearInterval(FTAshow);
	 	}, delay);

	}

	function setImage(w, h, url) {
		Width = w;
		Height = h;
		imgUrl = url;
	}

	function setText (t, tx, l) {
		if (t == "" || tx == "") return;
		Title = t;
		Text = tx.split(" ").splice( 0 , (parseInt(l) > 0 ? l : tx.split(" ").length) ).join(" ");
		parseInt(l) > 0 ? Text += "&hellip;" : Text;
	}

	function setLabel (l) {
		Label = l.substring(0,4);
	}

	function setColor (c) {
		c.match(/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/) ? Color = c : Color = "#FFA500";
		Color = c;
	}

	function setClickUrl (url, t) {
		clickUrl = url;
		clickTarget = t;
	}

	function setCTA (cta) {
		CTA = cta;
	}

	function setCapping (h) {
		if (document.cookie.indexOf("FTASleep") > -1) return;
		cookieBirth = parseInt(h);
	}

	var FTACloseIt = function() {
		if (document.cookie.indexOf("FTASleep") > -1) return;
		FTAwrap.style.bottom = - ( Height + 60 ) + 'px';
		FTAtext.style.height = '40px';
		if (cookieBirth > 0) {
			var FTAexpire = new Date();
			var FTAtoday = new Date();
			FTAexpire.setTime(FTAtoday.getTime() + (cookieBirth * 60 * 60 * 1000));
			var FTASleep = FTAexpire.toGMTString();
			document.cookie = "FTASleep=1; expires="+ FTASleep +"; path=/";
		}
	}

	function writeHtml(){
		document.write("<style>"
					 + ".FTA-wrap{z-index:9999999;font-family:arial;position:fixed;right:20px;padding-left:44px;}"
					 + ".FTA-hot{font-size:11px;font-weight:bold;padding:2px 7px 2px 2px;color:#fff;font-style:italic;position:absolute;height:15px;width:35px;line-height:15px;display:block;text-align:center;top:12px;left:0px;background:#ED143D;box-shadow:-7px 5px 0px 0px rgba(0,0,0,0.5);}"
					 + ".FTA-close{padding:9px 11px;background:#8B0000;font-size:15px;font-weight:bold;color:#fff;cursor:pointer;line-height:14px;position: absolute;text-align: center;width:10px;height:14px;top:10px;box-shadow:-7px 5px 0px 0px rgba(0,0,0,0.5);}"
					 + ".FTA-close:hover{background:#FF4500;}"
					 + ".FTA-text{overflow:hidden;height:40px;bottom:155px;box-shadow:-7px 5px 0px 0px rgba(0,0,0,0.5);}"
					 + ".FTA-title{height:30px;padding:5px 10px;background-color:#222;overflow:hidden;}"
					 + ".FTA-title h1{margin:0;padding:0;color:#DDD;line-height:30px;font-size:18px;white-space:nowrap;font-weight:bold;}"
					 + ".FTA-desc{height:60px;padding:10px;background-color:#fff;box-shadow:inset 0 10px 10px -3px rgba(0,0,0,0.5);}"
					 + ".FTA-desc p{margin:0;padding:0;font-size:14px;line-height:18px;}"
					 + ".FTA-img{position:relative;padding:10px;background-color:#FFA500;bottom:0px;box-shadow:-7px 5px 0px 0px rgba(0,0,0,0.5);}"
					 + ".FTA-img img{display:block;position:relative;}"
					 + ".FTA-play{display:none;position:absolute;font-size:30px;font-style:italic;font-weight:bold;text-align:center;text-shadow:3px 3px 0px #000;color:#FFA500;background-color:rgba(0,0,0,0);top:10px;right:10px;left:10px;bottom:10px;}"
					 + "#FTA-a{text-decoration:none;display:block;position:relative;}"
					 + ".FTA-img:hover > .FTA-play{display:block;background-color:rgba(0,0,0,.7);}"
					 + ".FTA-wrap:hover > .FTA-text{height:120px;}"
					 + "#FTAimage{position:relative;}"
					 + ".FTA-wrap:hover > #FTAimage > #FTA-close{margin-left:-32px;}"
					 + ".FTA-easing{-moz-transition:all 0.2s ease-out;-o-transition:all 0.2s ease-out;-webkit-transition:all 0.2s ease-out;-ms-transition:all 0.2s ease-out;transition:all 0.2s ease-out;}"
					 + "</style>"
					 + "<div class='FTA-wrap FTA-easing' id='FTA-wrap'>"
						 + "<span class='FTA-hot' id='FTA-hot'>HOT!</span>"
						 + "<div class='FTA-text FTA-easing' id='FTA-text'>"
							 + "<div class='FTA-title'>"
								 + "<h1 id='FTA-title'></h1>"
							 + "</div>"
							 + "<div class='FTA-desc'>"
								 + "<p id='FTA-description'></p>"
							 + "</div>"
						 + "</div>"
						 + "<div id='FTAimage'>"
						 + "<div class='FTA-close FTA-easing' id='FTA-close'>X</div>"
						 + "<a href='' target='' id='FTA-a'>"
							 + "<div class='FTA-img' id='FTA-img-holder'>"
								+ "<img src='' id='FTA-img'/>"
								+ "<div class='FTA-play' id='FTA-play'>Play Now</div>"
							 + "</div>"
						 + "</a>"
						 + "</div>"
					 + "</div>");
	}

	return {
		init: init,
		setImage: setImage,
		setText: setText,
		setLabel: setLabel,
		setColor: setColor,
		setCTA: setCTA,
		setClickUrl: setClickUrl,
		setCapping: setCapping
	};

})();