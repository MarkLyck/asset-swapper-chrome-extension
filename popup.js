var source = $('#source')
var target = $('#target')
var table = $('table')

source.keyup(e => {
	setFileIconClass($(e.target), '.from-source-file-icon')
	localStorage.source = e.target.value
})
target.keyup(e => {
	setFileIconClass($(e.target), '.to-source-file-icon')
	localStorage.target = e.target.value
})

let configuration = JSON.parse(localStorage.configuration)

$('#add_asset').click(() => {
	addEntry()
	localStorage.source = ''
	localStorage.target = ''
	target.val('')
	source.val('')	
})

const setFileIconClass = ($input, selector) => {
	$(selector)
		.removeClass('fas fab far')
		.removeClass('fa-link fa-js fa-css3-alt fa-database')
	if ($input.val().includes('.json')) {
		$(selector).addClass('fas fa-database')
	} else if ($input.val().includes('.js')) {
		$(selector).addClass('fab fa-js')
	} else if ($input.val().includes('.css')) {
		$(selector).addClass('fab fa-css3-alt')
	} else {
		$(selector).addClass('fas fa-link')
	}
}


const removeEntry = (src) => {
	delete configuration[src]
	localStorage.configuration = JSON.stringify(configuration)
}

table.on('click', '.edit-entry', function() {
	const src = $(this).parent().parent().find('a.source').attr('href')
	source.val(src)
	target.val(configuration[src].url)
	removeEntry(src)
	$(this).parent().parent().hide(500).remove()
	source.focus()
})

table.on('click', '.remove-entry', function() {
	const src = $(this).parent().parent().find('a.source').attr('href')
	removeEntry(src)
	$(this).parent().parent().hide(500).remove()
})

table.on('click', '.status-label', function(e) {
	const status = $(e.target).text() === '● Active'
	console.log('status', status)
	console.log('href', $(this).parent().parent().find('a.source').attr('href'))
	$(e.target).text(!status ? '● Active' : '● Disabled')
	$(e.target).toggleClass('label-success label-disabled')

	const src = $(this).parent().parent().find('a.source').attr('href')
	console.log('config before', configuration)
	configuration[src].status = !configuration[src].status
	console.log('config after', configuration)
	localStorage.configuration = JSON.stringify(configuration)
})

const addEntry = function() {
	configuration[source.val()] = {
		url: target.val(),
		status: true
	};
	localStorage.configuration = JSON.stringify(configuration)
	addRow(source.val(), target.val(), true)
}

const addRow = function(source, target, status) {
	var newRow = (
	$('<tr>')
		.append($('<td>', { class: "source-cell" })
			.append($('<a>', {
				'href': source,
				'text': source,
				'class': 'source',
				'target':'_new' })))
		.append($('<td>', { class: 'to-cell' })
			.append($('<a>', {
				'href': target,
				'text': target,
				'target':'_new' })))
		.append($('<td>', { class: 'status-cell' })
			.append($('<span>', {
				'class': 'status-label ' + (status ? 'label-success' : 'label-disabled'),
				'text': status ? '● Active' : '● Disabled' })))
		.append($('<td>', { class: 'actions-cell' })
			.append($('<button>', { class: 'edit-entry' })
				.append($('<i>', { 'class': 'fas fa-edit' })))
			.append($('<button>', { 'class': 'remove-entry' })
				.append($('<i>', { class: 'fas fa-trash-alt' })))
		)
	)
	newRow.find('input[type=checkbox]').prop('checked', status)
	table.find('tbody ').append(newRow)
}

const init = function() {
	$('#source').val(localStorage.source || '')
	$('#target').val(localStorage.target || '')
	setFileIconClass(source, '.from-source-file-icon')
	setFileIconClass(target, '.to-source-file-icon')

	for (const source in configuration) {
		addRow(source, configuration[source].url, configuration[source].status)
	}
}

init()
