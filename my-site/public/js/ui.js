$(function () {

	$('.dismiss-alert').click(function () {
		$('#app-alert').hide();
		$.cookie('dismissAppBanner', true);
	});

	if (!$.cookie('dismissAppBanner')) {
		$('#app-alert').removeClass('hidden-md hidden-lg');
	}

	// Nav
	// ------------------------------
	$('#site-nav-toggle').click(function () {
		$(this).toggleClass('open');
		$('#site-nav').toggleClass('open');
		$('body').toggleClass('no-touch-scrolling');

		// Disable hardware scrolling on mobile
		if ($('body').is('.no-touch-scrolling')) {
			document.ontouchmove = function (e) {
				e.preventDefault();
			}
		} else {
			document.ontouchmove = function (e) {
				return true;
			}
		};
	});

	// Generic confirms
	// ------------------------------

	$('.js-confirm').click(function (e) {
		if (!confirm($(this).data('confirm') || 'Are you sure? This cannot be undone.'))
			return e.preventDefault();
	});

	// UI Reveal
	// ------------------------------

	$('.ui-reveal__trigger').click(function () {
		container = $(this).closest('.ui-reveal');

		container.addClass('is-revealed');

		//- click ensures browse is envoked on file fields
		container.find('input[type!=hidden],textarea').eq(0).click().focus();
	});

	$('.ui-reveal__hide').click(function () {
		container = $(this).closest('.ui-reveal');

		container.removeClass('is-revealed');
	});

	// Signin / Join Modal
	// ------------------------------

	// init
	var $authmodal = $('#modal-auth');
	var authmodalPanes = $authmodal.find('.auth-box');

	// start on the right pane
	// defaults to "join"
	// options "signin" | "join" | "password"

	// MAKESHIFT WAY TO EXPOSE JQUERY AUTH LOGIC TO REACT
	window.signinModalTrigger = function signinModalTrigger (e) {

		e.preventDefault();

		var initial = $(this).data("initial") || 'join';
		var initialPane = $authmodal.find('.modal-pane-' + initial);
		var from = $(this).data("from");

		$authmodal.modal('show');

		authmodalPanes.addClass('hidden');
		initialPane.removeClass('hidden');

		// only focus the first field on large devices where showing
		// the keyboard isn't a jarring experience
		if ($(window).width() >= 768) {
			initialPane.find('input[type!=hidden],textarea').eq(0).click().focus();
		}

		if (from) {
			$authmodal.find('[name="from"]').val(from);
		}
	}

	$("[href='#modal-auth'], [data-modal='auth'], .js-auth-trigger").on('click', signinModalTrigger);

	// move between panes
	$("[rel='modal-pane']").click(function () {

		var switchTo = $authmodal.find('.modal-pane-' + $(this).data("modal-pane"));

		authmodalPanes.addClass('hidden');
		switchTo.removeClass('hidden');


		// only focus the first field on large devices where showing
		// the keyboard isn't a jarring experience
		if ($(window).width() >= 768) {
			switchTo.find('input[type!=hidden],textarea').eq(0).click().focus();
		}

	});

	// Dynamic window targetting
	$("[rel='external']").attr("target", "_blank");

});
