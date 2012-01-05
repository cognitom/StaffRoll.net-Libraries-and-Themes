StaffRoll.MyTheme = function(){
	var parent = new StaffRoll.Theme();
	parent.constructor.apply(this);
	/* Fields */
	this.id = 'underground';
	this.type = 'fixed';
	this.photo = false;
	this.preloaded = false;
	this.divOuter = null;
	this.divInner = null;
	/* Constructor */
	this.initialize = function(){
		parent.initialize.call();
		var d0 = document.createElement('div');
			d0.setAttribute('id', 'srBox');
			d0.style.display = 'none';
		var d1 = document.createElement('div');
			d1.setAttribute('id', 'srBoxInner');
		var d2 = document.createElement('div');
			d2.setAttribute('id', 'srBoxClose');
			d2.innerHTML = 'CLOSE';
			d2.onclick = function(){ StaffRoll.credit.hide(); };
		d0.appendChild(d1);
		d0.appendChild(d2);
		document.getElementsByTagName('body')[0].appendChild(d0);
		this.divOuter = d0;
		this.divInner = d1;
		return this;
	};
	/* Methods */
	this.show = function(){
		if (!this.preloaded) this.preload();
		this.divOuter.style.display="block";
		var mytheme = this;
		(new StaffRoll.Effect()).initialize(
			0, this.divInner.clientHeight,
			(function(){ return function(p){ mytheme.divOuter.style.height = p+'px'; }})()
		);
		var currentPos = document.body.parentNode.scrollTop || document.body.scrollTop || document.documentElement.scrollTop;
		(new StaffRoll.Effect()).initialize(
			currentPos, currentPos+this.divInner.clientHeight,
			(function(){ return function(p){ scrollTo(0, p); }})()
		);
	};
	this.hide = function(){
		var mytheme = this;
		(new StaffRoll.Effect()).initialize(
			this.divInner.clientHeight, 0,
			(function(){ return function(p){ mytheme.divOuter.style.height = p+'px'; }})(),
			(function(){ return function(){ StaffRoll.theme.divOuter.style.display="none"; }})()
		);
	};
	this.preload = function(){
		var html = '';
		html += '<h2>STAFF</h2>';
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
			html += '<div class="clear">&nbsp;</div>';
		html += '</div>';
		this.divInner.innerHTML = html;
		this.preloaded = true;
	};
};
StaffRoll.credit.loadTheme((new StaffRoll.MyTheme()).initialize());