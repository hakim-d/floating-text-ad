/*!
 * Ad4Game HTML5 Advertising SDK 0.1
 * http://ad4game.com
 * MIT licensed
 * 
 * Copyright (C) Ad4Game
 */

var ad4game_html5_sdk = (function (){

	var _4canvases,
		_4targetCanvas,
		_4Width = "",
		_4Height = "",
		_4zoneid,
		_4testZoneid,
		_4adOutput,
		_4waitCount = 0,
		_4timeIndex,
		_4waitInterval,
		_4waitMsg,
		_4waitText = "",
		_4autoSkip = true,
		_4manualCanvas,
		_4Mobile,
		_4adSize,
		_4adWidth,
		_4adHeight,
		_4adMw,
		_4adMh,
		_4bgColor = "",
		_4CTA = "",
		_4cookieBirth,
		_4manualSize,
		_4iFrameTag,
		_4Brand,
		_4BrandLogoURL,
		_4BrandLink,
		_4BrandText,
		_4BrandSrc = "",
		A4Glayer,
		A4Gwrap,
		A4Gclose,
		A4Gads,
		A4Gplay,
		A4GiFrame,
		A4GiLevelClose,
		A4Gbrand,
		_4Max = 0,
		_4MaxI = 0,
		_4MaxW = 0,
		_4MaxH = 0;

	if (!Array.prototype.indexOf){
	  Array.prototype.indexOf = function(elt /*, from*/){
	    var len = this.length >>> 0;
	    var from = Number(arguments[1]) || 0;
	    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	    if (from < 0) from += len;
	    for (; from < len; from++) {
	      if (from in this && this[from] === elt) return from;
	    }
	    return -1;
	  };
	}	

	var A4GSleep = document.cookie.indexOf("A4GSleep");

	function init() {
		
		// Capping - If cookie not expired: Don't show Ad
		if (A4GSleep > -1) return;
		
		if (!_4Mobile) {
			if (!_4manualCanvas) {
				_4canvases = document.getElementsByTagName('canvas');
				if (_4canvases.length == 0) {
					_4targetCanvas = document.body;
					if (_4targetCanvas == document.body) {
						_4MaxW = "100%";
						_4MaxH = "100%";
					}
				} else {
					for (var i = 0; i < _4canvases.length; i++) {
						var width = _4canvases[i].width;
						var height = _4canvases[i].height;
						if ( (width=="" || height=="") || (width*height==300*150) || (width.toString().indexOf("%") > -1 || height.toString().indexOf("%") > -1) ) {
							width = _4getComputedWidth(_4canvases[i]);
							height = _4getComputedHeight(_4canvases[i]);
						}
						if ( width*height > _4Max ) {
							_4Max = width*height;
							_4MaxW = width;
							_4MaxH = height;
							_4MaxI = i;
						}
					}
					_4targetCanvas = _4canvases[_4MaxI];
				}
				_4Width = _4MaxW.toString().indexOf('px') > -1 ? _4MaxW : (_4MaxW.toString().indexOf('%') > -1 ? _4MaxW : _4MaxW + 'px');
				_4Height = _4MaxH.toString().indexOf('px') > -1 ? _4MaxH : (_4MaxH.toString().indexOf('%') > -1 ? _4MaxH : _4MaxH + 'px');
			}
		} else {
			var page_metas = document.getElementsByTagName("viewport");
			if (page_metas.length == 0) {
				var viewport_meta = document.createElement('meta');
			    viewport_meta.id = "viewport";
				viewport_meta.name = "viewport";
				viewport_meta.content = "width=device-width";
			    document.getElementsByTagName('head')[0].appendChild(viewport_meta);
			}
			_4Width = window.innerWidth + "px";
			_4Height = window.innerHeight + "px";
			window.addEventListener("resize",function(){a4gADResize()},!1);
		}

		_4adMw = -_4adWidth / 2;
		_4adMh = !_4Brand ? -_4adHeight / 2 : (-(_4adHeight / 2)-60);

		writeHtml();

		A4Glayer = document.getElementById("ad4game_ad_layer");
	 	A4Gwrap = document.getElementById("a4gAdWrapper");
		A4Gclose = document.getElementById("a4gClose");
		A4Gads = document.getElementById("a4gAdvertising");
		A4Gplay = document.getElementById("a4gCTA");
		A4GiFrame = document.getElementById("a4giFrame");
		A4GiLevelClose = document.getElementById("a4gInterLevelClose");
		A4Gbrand = document.getElementById("a4gBrand");

		// Styles
		console.log("INIT: STYLES");
		if (_4bgColor == "") _4bgColor = "#333333";
		A4Glayer.style.backgroundColor = _4bgColor;
		A4Gclose.style.color = a4gInvertColor(_4bgColor);
		A4Gads.style.color = a4gInvertColor(_4bgColor);
		A4GiLevelClose.style.backgroundColor = a4gInvertColor(_4bgColor);
		A4GiLevelClose.style.color = _4bgColor;
		if (_4Brand) A4Gbrand.style.display = "block";

		// Data
		if (_4waitCount == 0) _4waitCount = _4timeIndex = 10;
		if (_4waitText == "") _4waitText = "Ad will skip in";
		_4waitMsg = (_4autoSkip && _4waitText != "") ? _4waitText : "Wait while loading";
		_4CTA = _4CTA == "" ? "Play Now" : _4CTA;
		if (!_4autoSkip) {
			A4Gplay.style.color = _4bgColor;
			A4Gplay.style.backgroundColor = a4gInvertColor(_4bgColor);
			A4Gplay.innerHTML = _4CTA;
			document.body.attachEvent ? A4Gplay.attachEvent('onclick', a4gCloseAd) : A4Gplay.addEventListener('click', a4gCloseAd , false);
		}
		
		showAd(_4waitCount);

	}

	function setTargetCanvas(id) {
		console.log("SELECT CANVAS");
		_4manualCanvas = true;
		if (typeof id !== 'undefined') { 
			_4targetCanvas = document.getElementById(id) == null ? document.body : document.getElementById(id);
		} else {
			_4targetCanvas = document.body;
		}
		// Don't get the "_4targetCanvas" width and height when they're already set using "setOverlaySize"
		if (!_4manualSize) {
			_4Width = _4targetCanvas.width;
			_4Height = _4targetCanvas.height;
			if (_4targetCanvas == document.body) {
				_4Width = "100%";
				_4Height = "100%";
			}
			// Still no width and height values? Get the computed ones:
			if (_4Width == "" && _4Height == "") {
				_4Width = _4getComputedWidth(_4targetCanvas);
				_4Height = _4getComputedHeight(_4targetCanvas);
			}
			_4Width = _4Width.toString().indexOf('px') > -1 ? _4Width : (_4Width.toString().indexOf('%') > -1 ? _4Width : _4Width + 'px');
			_4Height = _4Height.toString().indexOf('px') > -1 ? _4Height : (_4Height.toString().indexOf('%') > -1 ? _4Height : _4Height + 'px');
		}
	}

	function setAdBanner(zoneid, size) {
		console.log("AD SIZE");
		_4adSize = typeof size !== 'undefined' ? size : 1;
		switch(_4adSize) {
		  case 1: _4adWidth = 300; _4adHeight = 250; _4testZoneid = "10249"; break;
		  case 2: _4adWidth = 728; _4adHeight = 90; _4testZoneid = "20514"; break;
		  case 3: _4adWidth = 468; _4adHeight = 60; _4testZoneid = "29648"; break;
		}
		// The zoneid is a unique id assigned to the publisher ad spot on Ad4Game's panel
		_4zoneid = typeof zoneid !== 'undefined' ? zoneid : _4testZoneid;
	}

	function setCountDownTime(ms) {
		console.log("WAIT COUNT");
		_4waitCount = _4timeIndex = typeof ms !== 'undefined' ? ( parseInt(ms) > -1 ? parseInt(ms) : 10 ) : 10;
	}

	function setOverlaySize(w,h) {
		_4Width = w.toString().indexOf('px') > -1 ? w : (w.toString().indexOf('%') > -1 ? w : w + 'px');
		_4Height = h.toString().indexOf('px') > -1 ? h : (h.toString().indexOf('%') > -1 ? h : h + 'px');
		_4manualSize = true;
	}

	function setBrand(logourl,link,txt) {
		_4BrandLogoURL = typeof logourl !== 'undefined' ? logourl : "http://ad4game.com/gamify/imgs/your-brand.png";
		_4BrandLink = typeof link !== 'undefined' ? link : "#";
		_4BrandText = typeof txt !== 'undefined' ? txt : "Find more games by: Brand Name";
		_4Brand = true;
	}

	function setWaitText (tx) {
		_4waitText = typeof tx !== 'undefined' ? tx.substring(0,25) : "Ad will skip in";
	}

	function setBGColor (c) {
		c.match(/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/) ? _4bgColor = c : _4bgColor = "#333333";
	}

	function setCTA (cta) {
		_4CTA = cta;
	}

	function autoSkip(bol) {
		_4autoSkip = typeof bol !== 'undefined' ? bol : true;
	}

	function setCapping (h) {
		if (A4GSleep > -1) return;
		_4cookieBirth = parseInt(h);
	}

	function isMobile (bol) {
		_4Mobile = true;
	} 
	
	function writeHtml(){
		console.log("WRITE AD HTML");

		_4iFrameTag = "<iframe id='a5e472f1' name='a5e472f1' src='http://ads.ad4game.com/www/delivery/afr.php?zoneid="+_4zoneid+"&amp;cb=INSERT_RANDOM_NUMBER_HERE' framespacing='0' frameborder='no' scrolling='no' width='"+_4adWidth+"' height='"+_4adHeight+"'><a href='http://ads.ad4game.com/www/delivery/dck.php?n=af9dac08&amp;cb=INSERT_RANDOM_NUMBER_HERE' target='_blank'><img src='http://ads.ad4game.com/www/delivery/avw.php?zoneid="+_4zoneid+"&amp;cb=INSERT_RANDOM_NUMBER_HERE&amp;n=af9dac08' border='0' alt='' /></a></iframe>";
		if (_4Brand) _4BrandSrc = "<div id='a4gBrand'><a href='"+_4BrandLink+"'><span id='a4gBrandText'>"+_4BrandText+"</span><img src='"+_4BrandLogoURL+"'></a></div>";
		_4adOutput = ("<style>#ad4game_ad_layer{overflow:hidden;width:100%;height:100%;font-family:arial;position:absolute;}#a4gBrand{display:none;margin:15px auto 0;background:#ddd;box-shadow:0px 0px 5px rgba(0,0,0,.5);}#a4gBrandText{overflow:hidden;white-space:nowrap;color:#000;font-size:11px;line-height:20px;height:22px;display:block;background:#fff;box-shadow:0px 0px 10px rgba(0,0,0,.15);}#a4gBrand a{text-decoration:none;}#a4gBrand img{max-height:60px;border:0;margin:5px 0;}#a4gClose{cursor:pointer;position:absolute;font-size:15px;top:-25px;right:0;height:17px;color:#fff;width:180px;text-align:right;}#a4gAdvertising{position:absolute;font-size:11px;top:-23px;left:0px;height:17px;width:90px;text-align:left;}#a4gCTA{display:none;height:30px;line-height:30px;text-align:center;font-size:17px;margin-top:10px;font-weight:bold;box-shadow:0px 5px 5px rgba(0,0,0,.2);cursor:pointer;text-shadow:1px 1px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.7);}#a4gInterLevelClose{display:none;font-weight:bold;font-size:17px;width:30px;height:30px;line-height:30px;text-align:center;border-radius:100%;position:absolute;right:-15px;top:-17px;border:3px solid #fff;box-shadow:-4px 3px rgba(0,0,0,.6);}#a4gAdWrapper{transform-origin:0px 0px 0px; width:"+_4adWidth+"px; height:"+_4adHeight+"px;left:50%;top:0%;margin-left:"+_4adMw+"px;margin-top:"+_4adMh+"px;position:absolute; background-color:transparent; box-shadow:0 0 30px 0px rgba(0,0,0,.7);-webkit-transition:all 0.6s ease;-moz-transition:all 0.6s ease;-o-transition:all 0.6s ease;}</style>");
		_4adOutput += ('<div id="ad4game_ad_layer"><center><div id="a4gAdWrapper"><span id="a4gAdvertising">Advertisement</span><span id="a4gClose"></span><span id="a4gInterLevelClose"></span>');
		_4adOutput += ("<div id='a4giFrame'>"+ _4iFrameTag +"</div>");
		_4adOutput += ("<div id='a4gCTA'></div>"+_4BrandSrc+"</div></center></div>");

		var a4g_overlay_ad_holder = document.createElement("div");
		a4g_overlay_ad_holder.id = "a4g_overlay_ad_holder";
		a4g_overlay_ad_holder.style.position = "relative";
		a4g_overlay_ad_holder.style.width = _4Width;
		a4g_overlay_ad_holder.style.height = _4Height;
		a4g_overlay_ad_holder.innerHTML = _4adOutput;
		a4g_overlay_ad_holder.style.display = "none";
		if (_4targetCanvas !== document.body && !_4Mobile) {
			_4targetCanvas.style.display = "none";
			_4targetCanvas.parentNode.appendChild(a4g_overlay_ad_holder);
		} else {
			a4g_overlay_ad_holder.style.position = "absolute";
			a4g_overlay_ad_holder.style.top = a4g_overlay_ad_holder.style.left = "0px";
			a4g_overlay_ad_holder.style.zIndex = "999999";
			document.body.appendChild(a4g_overlay_ad_holder);
		}
	}

	function a4gADResize() {
		if (window.innerHeight < 300) {
		 	A4Gwrap.style.zoom = 0.8;
			A4Gwrap.style.MozTransform = 'scale(0.95)';
			A4Gwrap.style.MozTransformOrigin = "0px 0px 0px";
			A4Gwrap.style.WebkitTransform = 'scale(0.95)';
			A4Gwrap.style.webkitTransformOrigin = "0px 0px 0px";
		} else {
			A4Gwrap.style.zoom = 1;
			A4Gwrap.style.MozTransform = 'scale(1)';
			A4Gwrap.style.MozTransformOrigin = "0px 0px 0px";
			A4Gwrap.style.WebkitTransform = 'scale(1)';
			A4Gwrap.style.webkitTransformOrigin = "0px 0px 0px";
		}
		a4g_overlay_ad_holder.style.width = window.innerWidth + "px";
		a4g_overlay_ad_holder.style.height = window.innerHeight + "px";
	}

	function a4gInvertColor(hex) {
	    var color = hex;
	    color = color.substring(1);
	    color = parseInt(color, 16);
	    color = 0xFFFFFF ^ color;
	    color = color.toString(16);
	    color = ('000000' + color).slice(-6);
	    color = '#' + color;
	    return color;
	}

	function convertHex(hex,opacity){
	    hex = hex.replace('#','');
	    r = parseInt(hex.substring(0,2), 16);
	    g = parseInt(hex.substring(2,4), 16);
	    b = parseInt(hex.substring(4,6), 16);

	    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
	    return result;
	}

	function _4getComputedWidth(o) {
		if (document.documentElement.currentStyle) {
			return parseInt(o.getBoundingClientRect().right - o.getBoundingClientRect().left);
		} else {
			return parseInt(window.getComputedStyle(o).getPropertyValue('width'));
		}
	}

	function _4getComputedHeight(o) {
		if (document.documentElement.currentStyle) {
			return parseInt(o.getBoundingClientRect().bottom - o.getBoundingClientRect().top);
		} else {
			return parseInt(window.getComputedStyle(o).getPropertyValue('height'));
		}
	}

	function a4gCloseAd () {
		console.log("CLOSE AD");
		_4timeIndex = _4waitCount;
		A4Gclose.innerHTML = "";
		A4Gwrap.style.top = "-50%";
		a4g_overlay_ad_holder.style.display = "none";
		if (!_4Mobile) _4targetCanvas.style.display = "block";
		// capping cookie
		if (A4GSleep > -1) return;
		if (_4cookieBirth > 0) {
			var A4Gexpire = new Date();
			var A4Gtoday = new Date();
			A4Gexpire.setTime(A4Gtoday.getTime() + (_4cookieBirth * 60 * 60 * 1000));
			var A4GSleep = A4Gexpire.toGMTString();
			document.cookie = "A4GSleep=1; expires="+ A4GSleep +"; path=/";
		}
	}

	function a4gCountDown() {
		A4Gclose.innerHTML = _4waitMsg + " <strong>" + _4timeIndex + "</strong>";
		if(_4timeIndex-- == 0) {
			window.clearInterval(_4waitInterval);
			if (_4autoSkip) {
				a4gCloseAd();
			} else {
				A4Gclose.innerHTML = "";
				A4Gplay.style.display = "block";
			}
		}
	}

	function showAd(wait) {
		console.log("SHOW AD");
		window.clearInterval(_4waitInterval);
		A4Gclose.innerHTML = _4waitMsg + " <strong>" + wait + "</strong>";
		_4waitInterval = self.setInterval(function(){ a4gCountDown() },1000);
		a4g_overlay_ad_holder.style.display = "block";
		A4Gwrap.style.top = "50%";
	}

	function interLevelShowAd(s, alpha) {
		if (A4GSleep > -1) return;
		console.log("INTER-LEVEL: SHOW AD");
		window.clearInterval(_4waitInterval);
		A4Gplay.style.display = "none";
		if (_4Brand) A4Gbrand.style.display = "none";
		if (_4targetCanvas != document.body && !_4Mobile) _4targetCanvas.style.display = "none";
		A4GiLevelClose.style.display = "block";
		a4g_overlay_ad_holder.style.display = "block";
		A4Gclose.innerHTML = "";
		A4GiFrame.innerHTML = _4iFrameTag;
		if (typeof alpha !== 'undefined') {
			alpha ? A4Glayer.style.backgroundColor = convertHex(_4bgColor,80) : A4Glayer.style.backgroundColor = _4bgColor;
		}
		var _4showDelayInterval = self.setInterval(function(){
			window.clearInterval(_4showDelayInterval);
			A4Gwrap.style.top = "50%";
		},250);
		_4timeIndex = typeof s !== 'undefined' ? ( parseInt(s) > -1 ? parseInt(s) : 5 ) : 5;
		A4GiLevelClose.innerHTML = _4timeIndex;
		_4waitInterval = self.setInterval(function(){
			A4GiLevelClose.innerHTML = _4timeIndex;
			if(_4timeIndex-- == 0) {
				window.clearInterval(_4waitInterval);
				a4gCloseAd();
			}
		},1000);
	}

	return {
		init: init,
		setTargetCanvas: setTargetCanvas,
		setAdBanner: setAdBanner,
		setCountDownTime: setCountDownTime,
		setOverlaySize: setOverlaySize,
		setBrand: setBrand,
		setWaitText: setWaitText,
		setBGColor: setBGColor,
		setCTA: setCTA,
		autoSkip: autoSkip,
		interLevelShowAd: interLevelShowAd,
		setCapping: setCapping,
		isMobile: isMobile 
	};

})();