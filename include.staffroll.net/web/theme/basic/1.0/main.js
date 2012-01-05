StaffRoll.MyTheme = function(){
	var parent = new StaffRoll.Theme();
	parent.constructor.apply(this);
	/* Fields */
	this.id = 'basic';
	this.type = 'fixed';
	this.photo = false;
	this.preloaded = false;
	this.div = null;
	/* Constructor */
	this.initialize = function(){
		parent.initialize.call();
		var div = document.createElement('div');
			div.setAttribute('id', 'srBox');
			div.style.display = 'none';
			div.onclick = function(){ StaffRoll.credit.hide(); };
		document.getElementsByTagName('body')[0].appendChild(div);
		this.div = div;
		return this;
	};
	/* Methods */
	this.show = function(){
		if (!this.preloaded) this.preload();
		_setOpacity(this.div, 0);
		this.div.style.display="block";
		var mytheme = this;
		(new StaffRoll.Effect()).initialize(
			0, 1,
			(function(){ return function(p){ _setOpacity(mytheme.div, p); }})()
		);
	};
	this.hide = function(){
		var mytheme = this;
		(new StaffRoll.Effect()).initialize(
			1, 0,
			(function(){ return function(p){ _setOpacity(mytheme.div, p); }})(),
			(function(){ return function(){ StaffRoll.theme.div.style.display="none"; }})()
		);
	};
	this.preload = function(){
		var html = '<h2>STAFF</h2>';
		html += '<div style="width:'+(200*StaffRoll.credit.pages.length)+'px">';
		for (var i=0; i<StaffRoll.credit.pages.length; i++){
			var page = StaffRoll.credit.pages[i];
			html += '<div class="page">';
			html += '<h3>'+page.name+'</h3>';
			html += '<dl>';
			for (var j=0; j<page.creators.length; j++){
				var creator = page.creators[j];
				html += '<dt>'+creator.role+'</dt>'
					+ '<dd>'
					+ (creator.user_id?'<a href="'+creator.getUrl()+'" target="'+creator.user_id+'">'+creator.name+'</a>': creator.name)
					+ (creator.company?'<span>('+creator.company+')</span>':'')
					+ '</dd>';
			}
			html += '</dl>';
			html += '</div>';
		}
		html += '<div>'
		this.div.innerHTML = html;
		this.preloaded = true;
	}
};
StaffRoll.credit.loadTheme((new StaffRoll.MyTheme()).initialize());

_setOpacity = function(elm, p){
	elm.style.filter = 'alpha(opacity=' + (p*100) + ')';
	elm.style.MozOpacity = p;
	elm.style.opacity = p;
};