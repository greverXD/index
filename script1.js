$(window).scroll(function(){
	$('dws-menu').toggleClass('scrolled', $(this).scrollTop() > 1);
});