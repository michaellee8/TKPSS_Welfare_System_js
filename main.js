// var prev = ["","",""];

var console_command_history = [];
var console_command_history_curentIndex = -1;

var CurrentMode = 0;
// 1 -> edit, 2 -> report, 3 -> sell, 4 -> borrow, 5 -> return
function save_erase(id, mode) {
	// prev[CurrentMode] = documenet.getElementById(id).innerHTML;
	CurrentMode = mode;
	document.getElementById(id).innerHTML = "";
	//erase the previous content of the target div
}

alasql('CREATE DATABASE IF NOT EXISTS SUWD');
// alasql('CREATE localStorage DATABASE IF NOT EXISTS suwd');
// alasql('ATTACH localStorage DATABASE suwd AS SUWD');
var db = alasql.Database('SUWD');

var download = function(content, fileName, mimeType) {
	var a = document.createElement('a');
	mimeType = mimeType || 'application/octet-stream';

	if (navigator.msSaveBlob) {// IE10
		return navigator.msSaveBlob(new Blob([content], {
			type : mimeType
		}), fileName);
	} else if ('download' in a) {//html5 A[download]
		a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
		a.setAttribute('download', fileName);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		return true;
	} else {//do iframe dataURL download (old ch+FF):
		var f = document.createElement('iframe');
		document.body.appendChild(f);
		f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);

		setTimeout(function() {
			document.body.removeChild(f);
		}, 333);
		return true;
	}
};

function lssave(name) {
	localStorage.setItem('SUWDdb.' + name, JSON.stringify(db.tables[name].data));
	return JSON.stringify(db.tables[name].data);
}

function lsload(name) {
	db.tables[name].data = localStorage.getItem('SUWDdb.' + name) != null && localStorage.getItem('SUWDdb.' + name) != "" ? JSON.parse(localStorage.getItem('SUWDdb.' + name)) : [];
	return JSON.parse(localStorage.getItem('SUWDdb.' + name));
}

function _init_() {
	// Below code is for debug test, will be corrected later when edit function is developed
	db.exec("CREATE TABLE IF NOT EXISTS Sell_Items (name STRING, gid STRING, number integer, price FLOAT)");

	lsload('Sell_Items');
	if (db.tables.Sell_Items.data.length == 0) {
		db.tables.Sell_Items.data = [{
			name : 'pen01',
			gid : 'p01',
			number : 10,
			price : 10
		}, {
			name : 'pen02',
			gid : 'p02',
			number : 20,
			price : 20
		}, {
			name : 'pen03',
			gid : 'p03',
			number : 30,
			price : 30
		}, {
			name : 'pen04',
			gid : 'p04',
			number : 40,
			price : 40
		}, {
			name : 'pen05',
			gid : 'p05',
			number : 50,
			price : 50
		}, {
			name : 'pen06',
			gid : 'p06',
			number : 60,
			price : 60
		}, {
			name : 'pen07',
			gid : 'p07',
			number : 70,
			price : 70
		}, {
			name : 'pen08',
			gid : 'p08',
			number : 80,
			price : 80
		}, {
			name : 'pen09',
			gid : 'p09',
			number : 90,
			price : 90
		}, {
			name : 'pen10',
			gid : 'p10',
			number : 100,
			price : 100
		}];
		lssave('Sell_Items');
	}
	db.exec("CREATE TABLE IF NOT EXISTS Student_Helpers (name STRING, hid STRING)");

	lsload('Student_Helpers');
	if (db.tables.Student_Helpers.data.length == 0) {
		db.tables.Student_Helpers.data = [{
			name : 'student01',
			hid : 'stu01'
		}, {
			name : 'student02',
			hid : 'stu02'
		}, {
			name : 'others',
			hid : 'stuo'
		}];
		lssave('Student_Helpers');
	}

	db.exec("CREATE TABLE IF NOT EXISTS Sell_Records (gid STRING, number integer, total_price FLOAT, hid STRING, remark STRING, record_datetime STRING)");
	lsload('Sell_Records');

	// Above code is for debug test, will be corrected later when edit hidfunction is developed
}

function sold(gid, number, hid, remark, db, id) {
	number = parseInt(number);
	if (gid == "nothing") {
		alert('Nothing cost nothing, never buy nothing');
	} else if (hid == "nobody") {
		alert('Stop singing, this computer is going to break because of your "wonderful" voice');
	} else {
		lsload('Sell_Items');
		lsload('Sell_Records');
		var number_left = db.exec('SELECT number FROM Sell_Items WHERE gid = "' + gid +'"')[0].number;
		if (number > number_left) {
			alert('Only ' + number_left.toString() + ' in stock, not enough goods in stock, buy less');
		} else if (number <= 0) {
			alert('Are you kidding me? Buy more than 0 goods please');
		} else {
			var really_buy = confirm('Are you realy going to buy ' + number + ' of ' + gid + ' with $' + ((db.exec('SELECT price FROM Sell_Items WHERE gid = "' + gid +'"')[0].price) * number).toString() + ' ?');
			if (really_buy) {
				db.exec('UPDATE Sell_Items SET number = ' + (number_left - number).toString() + ' WHERE gid = "' + gid + '"');
				lssave('Sell_Items');
				db.tables.Sell_Records.data.push({
					gid : gid,
					number : number,
					total_price : ((db.exec('SELECT price FROM Sell_Items WHERE gid = "' + gid +'"')[0].price) * number),
					hid : hid,
					remark : remark,
					record_datetime : Date().toString()
				});
				lssave('Sell_Records');
				alert('Transaction success, ' + number.toString() + ' of ' + name + ' sold ,' + db.exec('SELECT number FROM Sell_Items WHERE gid = "' + gid +'"')[0].number.toString() + ' left');
				switch_sell(id);
			} else {
				alert('Select item again then');
			}
		}
	}
}

function getListText(gid, name, price, number) {
	return gid + '    ' + name + '    Price: $' + price + '    Number left: ' + number;
}

function switch_sell(id) {

	save_erase(id, 3);

	var form = $('<form></form>', {
		id : "sell_item_selection_form"
	});
	$(form).append('What do you want to buy? ');
	var sell_select_item = $('<select></select>', {
		id : "sell_item_selector"
	});
	$(sell_select_item).append($('<option></option>', {
		id : 'sell_item_selector_option_' + 'nothing',
		value : 'nothing',
		text : 'Nothing'
	}));
	for (i in db.tables.Sell_Items.data) {
		$(sell_select_item).append($('<option></option>', {
			id : 'sell_item_selector_option_' + db.tables.Sell_Items.data[i].gid,
			value : db.tables.Sell_Items.data[i].gid,
			text : getListText(db.tables.Sell_Items.data[i].gid, db.tables.Sell_Items.data[i].name, db.tables.Sell_Items.data[i].price, db.tables.Sell_Items.data[i].number)
		}));
	}
	$(form).append(sell_select_item);
	$(form).append('<br/><br/>\nHow many do you want? ');
	$(form).append($('<input id="sell_number" type="number" value="0"/>'));
	$(form).append('<br/><br/>');
	$(form).append('Who are you? ');
	var student_helper_select = $('<select></select>', {
		id : "student_helper_selector"
	});
	$(student_helper_select).append($('<option></option>', {
		id : 'stduent_helper_selector_option_' + 'nothing',
		value : 'nobody',
		text : 'Nobody nobody ♫'
	}));
	for (i in db.tables.Student_Helpers.data) {
		$(student_helper_select).append($('<option></option>', {
			id : 'student_helper_selector_option_' + db.tables.Student_Helpers.data[i].hid,
			value : db.tables.Student_Helpers.data[i].hid,
			text : db.tables.Student_Helpers.data[i].hid + ' ' + db.tables.Student_Helpers.data[i].name
		}));
	}
	$(form).append(student_helper_select);
	$(form).append('<br/><br/>Any remarks?  ');
	$(form).append($('<input/>', {
		id : 'remark_text',
		value : "",
		type : "text"
	}));
	$(form).append('<br/><br/>');
	$(form).append($('<button></button>', {
		id : "sell_confirm",
		text : "confirm",
		type : "button",
		onclick : "sold(document.getElementById('sell_item_selector').value,document.getElementById('sell_number').value,document.getElementById('student_helper_selector').value,document.getElementById('remark_text').value,db,'" + id.toString() + "')"
	}));

	$('#' + id).append(form);
}

function console_run(command) {
    
  console_command_history.push(command);
  console_command_history_currentIndex = console_command_history.length - 1;
	$('#output').append('<<<  ' + command + '\n');
	var output = ">>>  ";
	if (command.toLowerCase() == 'clear') {
		$('#output').html("");
		$('#output').append('Tin Ka Pin Secondary School Student Union Welfare Department Managemant System Console written by Lee Chun Kok Michael in 2016\n');
		output += 'Console cleared';
	} else if (command.toLowerCase() == 'localstorage clear') {
		if (confirm("Are you really going to clear all database data stored in this system?\nThis action is dangerous and cannot be inversed.") && prompt('Type in the full name of this school with all capital letters and no space') == 'TINKAPINSECONDARYSCHOOL' && CryptoJS.SHA256(prompt('Give me the admin password, note that this is the last chance to stop this inreversible process thaat could break everything in the database')).toString() == '9806e133d2a4aef6d63a7db583976144399618849f95de2317545e04e869241f') {
			localStorage.clear();
			output += 'localStorage cleared!!! Well, you have just destoryed everything';
		} else {
			output += 'Saved from destory! localStorage is not cleared';
		}
	} else if (command.split(' ')[0].toLowerCase() == 'lssave') {
		try {
			output += lssave(command.split(' ')[1]);
		} catch(err) {
			output += 'Save to Local Storage Error: ' + err.message;
		}
	} else if (command.split(' ')[0].toLowerCase() == 'lsload') {
		try {
			output += JSON.stringify(lsload(command.split(' ')[1]));
		} catch(err) {
			output += 'Load from Local Storage Error: ' + err.message;
		}
	} else if (command.split(' ')[0].toLowerCase() == 'export') {
		try {
			var source_table = db.tables[command.split(' ')[1]].data;
			download(Papa.unparse(source_table, {
				dynamicTyping : true,
				quotes : (function(table) {
					var boolArray = [];
					for (key in table[0]) {
						boolArray.push(( typeof table[0][key]) == "string");
					}
					return boolArray;
				})(source_table)
			}), (command.split(' ')[2] != undefined ? command.split(' ')[2] : ('SUWDdb-' + command.split(' ')[1])) + '.csv', 'text/csv');
			output += 'Export Data of table ' + command.split(' ')[1] + ' Success';
		} catch(err) {
			output += 'Export Data Error: ' + err.message;
		}
	} else if (command.split(' ')[0].toLowerCase() == 'import') {
		output += 'import (not yet implemented)';
	} else if (command.split(' ')[0].toLowerCase() == 'backup') {
		output += 'backup (not yet implemented)';
	} else if (command.split(' ')[0].toLowerCase() == 'restore') {
		output += 'restore (not yet implemented)';
	} else if (command.toLowerCase() == 'history') {
		output += "\n" + JSON.stringify(console_command_history, null, ' ');
	} else {
	  if ((['create','drop']).indexOf(command.split(' ')[0].toLowerCase()) != -1){
	    if (!(confirm("You are doing a dangerous SQL operation, confirm?") && prompt('Type in the full name of this school with all capital letters and no space') == 'TINKAPINSECONDARYSCHOOL' && CryptoJS.SHA256(prompt('Give me the admin password, note that this is the last chance to stop this inreversible process thaat could break everything in the database')).toString() == '9806e133d2a4aef6d63a7db583976144399618849f95de2317545e04e869241f')) {
    		command = "";
				$('#output').append('>>> Command droped for dangerous operation\n');
				return ;
		}
	    }
		try {
			output += "\n" + JSON.stringify(db.exec(command), null, "  ");
		} catch(err) {
			output += 'SQL Error: ' + err.message;
		}
	}
	output += "\n";

	$('#output').append(output);
	$('#output').scrollTop($('#output')[0].scrollHeight);

}

function switch_console(id) {
	save_erase(id, 1);
	$('#' + id).append('Output: <br/>');
	$('#' + id).append($('<textarea></textarea>', {
		id : "output",
		readonly : "readonly"
	}).css({
		"margin" : "0px",
		"width" : "100%",
		"height" : "300px"
	}).html("Tin Ka Pin Secondary School Student Union Welfare Department Managemant System Console written by Lee Chun Kok Michael in 2016\n"));
	$('#' + id).append('<br/><br/>');
	$('#' + id).append('Command input: <br/>');
	$('#' + id).append($('<input></input>', {
		id : "input",
		type : "text"
	}).css({
		"margin" : "0px",
		"width" : "100%",
		"font-family" : "monospace"
	}).keyup(function(e) {
		if (e.keyCode === 13) {
			var command = $('#input').val();
			$('#input').val("");
			console_run(command);
		}
	}).keydown(function(e){
	    if (e.keyCode == 38) { // pressing upArrow
			console_command_history_currentIndex = console_command_history_currentIndex > 0 ? console_command_history_currentIndex - 1 : 0;
			if ((typeof console_command_history[console_command_history_currentIndex]) == 'string'){
			    $('#input').val(console_command_history[console_command_history_currentIndex]);
			}
		} else if (e.keyCode == 40) { // pressing downArrow
            console_command_history_currentIndex = (console_command_history_currentIndex + 1) < console_command_history.length ? console_command_history_currentIndex + 1 : console_command_history.length - 1;
			if ((typeof console_command_history[console_command_history_currentIndex]) == 'string'){
			    $('#input').val(console_command_history[console_command_history_currentIndex]);
			}
		}
	}));
	$('#' + id).append('<br/><br/>');

}
