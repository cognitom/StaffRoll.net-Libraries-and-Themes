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
		html += '<h2><strong>'+StaffRoll.credit.repo+'</strong> / contributors</h2>';
		html += '<div>';
		html += '<ul>';
		for (var j=0; j<StaffRoll.credit.creators.length; j++){
			var creator = StaffRoll.credit.creators[j];
			html += '<li style="background-image:url('+creator.avatar_url+')"><a href="https://github.com/'+creator.login+'" target="'+creator.login+'">'+creator.login+'</a></li>';
		}
		html += '</ul>';
		html += '</div>';
		this.divInner.innerHTML = html;
		this.preloaded = true;
	};
};
StaffRoll.credit.loadTheme((new StaffRoll.MyTheme()).initialize());