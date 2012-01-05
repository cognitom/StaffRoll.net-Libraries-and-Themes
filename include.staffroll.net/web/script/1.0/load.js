var StaffRoll = {};//namespace

/**
 * Settings
 */
StaffRoll.net = 'staffroll.net';

/**
 * Classes
 */
StaffRoll.Credit = function(){
	this.anchors = [];
	/* Fields */
	this.id = '';
	this.base_url = '';
	this.twitter = '';
	this.movie_url = '';
	this.authorized = false;
	this.authorized_date = '';
	this.pages = [];
	this.loading = false;
	this.jsonp_ready = false;
	this.theme_ready = true;
	this.opened = false;
	/* Constructor */
	this.initialize = function(){
		return this;
	};
	this.addAnchor = function(anchor){
		if(anchor.className == 'staffroll'){
			var id = (tmp = anchor.href.match(/^https?:\/\/(beta\.)?staffroll\.(net|site)\/site\/([a-z0-9\-]*)\//)) ? tmp[3] : '';
			if (this.id == '') this.id = id;
			else if (this.id != id) return;
		} else {
			this.url = encodeURIComponent(anchor.href);
		}
		
		this.anchors.push(anchor);
		if (!this.id && !this.url) return this;
		anchor.onclick = function(e){ StaffRoll.credit.showOrHide(); return false; };
		return this;
	};
	/* Methods */
	this.callTheme = function(){
		var script, link;
		var scripts = document.getElementsByTagName("script");
		for (var i=0; i<scripts.length; i++){
			if (scripts[i].src && scripts[i].src.match(/^https?:\/\/include\.staffroll\.(net|site)\/web\/script\/1\.0\/load\.js(\?.*)?$/)){
				script = scripts[i];
			}
		}
		var theme = (tmp = script.src.match(/\?.*theme=([a-z0-9_]*)/)) ? tmp[1] : 'default';
		if (theme != 'default'){
			this.theme_ready = false;
			script = document.createElement('script');
				script.setAttribute('type', 'text/javascript');
				script.setAttribute('src', 'http://include.'+StaffRoll.net.replace('beta.','')+'/web/theme/'+theme+'/1.0/main.js');
			link = document.createElement('link');
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('type', 'text/css');
				link.setAttribute('href', 'http://include.'+StaffRoll.net.replace('beta.','')+'/web/theme/'+theme+'/1.0/main.css');
			document.getElementsByTagName('head')[0].appendChild(script);
			document.getElementsByTagName('head')[0].appendChild(link);
		}
	};
	this.callAPI = function(){
		var script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', 'http://api.'+StaffRoll.net.replace('beta.','')+'/1.0/?'+(this.url ? 'url='+ this.url : 'site='+this.id) );
		document.getElementsByTagName('head')[0].appendChild(script);
	};
	this.loadTheme = function(theme){
		StaffRoll.theme = theme;
		this.theme_ready = true;
		this.showIfReady();
	};
	this.loadJsonp = function(data){
		this.id = data.id;
		this.url = data.url;
		this.twitter = data.twitter;
		this.template = data.template;
		this.movie_url = data.movie_url;
		this.authorized = data.authorized;
		this.authorized_date = data.authorized_date;
		for (var i=0; i<data.pages.length; i++){
			this.pages.push((new StaffRoll.Page()).initialize(data.pages[i]));
		}
		this.jsonp_ready = true;
		this.showIfReady();
	};
	this.showIfReady = function(){
		if (!this.opened && this.jsonp_ready && this.theme_ready){
			this.loading = false;
			this.show();
		}
	};
	this.showOrHide = function(){
		if (!this.opened) this.show();
			else this.hide();
	};
	this.show = function(){
		if (!this.jsonp_ready && !this.loading){
			this.loading = true;
			this.callTheme();
			this.callAPI();
			return;
		}
		this.opened = true;
		StaffRoll.theme.show();
	};
	this.hide = function(){
		this.opened = false;
		StaffRoll.theme.hide();
	};
};

StaffRoll.Page = function(){
	/* Fields */
	this.id = '';
	this.name = '';
	this.photo_url = '';
	this.creators = [];
	/* Constructor */
	this.initialize = function(data){
		this.id = data.id;
		this.name = data.name;
		this.photo_url = data.photo_url;
		for (var i=0; i<data.creators.length; i++)
			this.creators.push((new StaffRoll.Creator()).initialize(data.creators[i]));
		return this;
	};
};

StaffRoll.Creator = function(){
	/* Fields */
	this.id = '';
	this.name = '';
	this.role = '';
	this.company = '';
	this.comment = '';
	this.user_id = '';
	this.authorized = false;
	/* Constructor */
	this.initialize = function(data){
		this.id = data.id;
		this.name = data.name;
		this.role = data.role;
		this.company = data.company;
		this.comment = data.comment;
		this.user_id = data.user_id;
		this.authorized = data.authorized;
		return this;
	};
	/* Methods */
	this.getUrl = function(){
		return 'http://'+StaffRoll.net+'/user/'+this.user_id+'/';
	};
};

StaffRoll.Theme = function(){
	/* Fields */
	this.id = 'default';
	this.type = 'fixed';
	this.photo = false;
	/* Constructor */
	this.initialize = function(){
		return this;
	};
	/* Methods */
	this.show = function(){
		var str = '';
		for (var i=0; i<StaffRoll.credit.pages.length; i++){
			var page = StaffRoll.credit.pages[i];
			for (var j=0; j<page.creators.length; j++){
				var creator = page.creators[j];
				str += '[' + creator.role + ']\n'
					+ creator.name
					+ (creator.company?' ('+creator.company+')':'')
					+ '\n\n';
			}
		}
		alert(str);
	};
	this.hide = function(){};
};

StaffRoll.Effect = function(){
	/* Fileds */
	this.interval = 25;
	this.msMax = 1000;
	this.msStart = 0;
	this.start = 0;
	this.end = 0;
	this.timer = 0;
	this.onUpdate = function(p){};
	this.onEndEffect = function(){};
	/* Constructor */
	this.initialize = function(startVal, endVal, onUpdate, onEndEffect, duration){
		var d = new Date();
		this.msStart = d.getTime();
		this.start = startVal;
		this.end = endVal;
		if (onUpdate) this.onUpdate = onUpdate;
		if (onEndEffect) this.onEndEffect = onEndEffect;
		if (duration) this.msMax = duration;
		var target = this;
		var ef = (function(){ return function(){ target.effect(); } })();
		this.timer = setInterval(ef,this.interval);
		return this
	};
	/* Methods */
	this.effect = function(){
		var d = new Date();
		var ms = d.getTime() - this.msStart;
		var MSm = this.msMax;
		if (ms > MSm) ms = MSm;
		var L = this.end - this.start;
		var x = (1-Math.cos(Math.PI*ms/MSm))*0.5*L;
		this.onUpdate(this.start+x);
		if (ms == MSm) {
			clearInterval(this.timer);
			this.timer = 0;
			this.onEndEffect();
		}
	};
};

/**
 * Setups
 */
(function(){
	var setup = function(){
		StaffRoll.theme = (new StaffRoll.Theme()).initialize();
		StaffRoll.credit = (new StaffRoll.Credit()).initialize();
		var anchors = document.getElementsByTagName("a");
		for (var i=0; i<anchors.length; i++)
			if (anchors[i].className && anchors[i].className == 'staffroll')
				StaffRoll.credit.addAnchor(anchors[i]);
	}
	if (window.attachEvent) window.attachEvent('onload', setup);//IE
		else if (window.addEventListener) window.addEventListener('load', setup, true);//W3C
			else window.onload = setup;
})();