/*
$(document).ready(function() {
	$('.hamburger_menu').click(function(event) {
		$('body').addClass('open');
	});
});

$(document).ready(function() {
	$('.Mobile_close').click(function(event) {
		$('body').removeClass('open');
	});
});
*/

$(document).ready(function() {
	$('.hamburger_menu').click(function(event) {
		$('body').toggleClass('open');
	});
});