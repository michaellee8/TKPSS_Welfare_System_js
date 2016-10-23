// var prev = ["","",""];

var CurrentMode = 0;
// 1 -> edit, 2 -> report, 3 -> sell, 4 -> borrow, 5 -> return

alasql('CREATE DATABASE IF NOT EXISTS SUWD');
// alasql('CREATE localStorage DATABASE IF NOT EXISTS suwd');
// alasql('ATTACH localStorage DATABASE suwd AS SUWD');
var db = alasql.Database('SUWD');

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
	db.exec("CREATE TABLE IF NOT EXISTS Sell_Items (name STRING, gid STRING, number INT, price FLOAT)");

	// deprecated since this approach cannot watch the change via sql statements
	/*var Sell_Items_proxy_handler = new Proxy(db.tables.Sell_Items, {
	 set : function(target, property, value, receiver) {
	 if (property == 'data') {
	 localStorage.setItem('SUWD_Sell_Items_data', JSON.stringify(db.tables.Sell_Items.data));
	 }
	 target[property] = value;
	 return true;
	 },
	 get : function(target, property, receiver) {
	 if (property == 'data') {
	 db.tables.Sell_Items.data = JSON.parse(localStorage.getItem('SUWD_Sell_Items_data'));
	 }
	 return target[property];
	 }
	 });*/

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
	db.exec("CREATE TABLE IF NOT EXISTS Student_Helpers (name STRING, sid STRING)");

	// deprecated since this approach cannot watch the change via sql statements
	/*var Student_Helpers_proxy_handler = new Proxy(db.tables.Student_Helpers, {
	 set : function(target, property, value, receiver) {
	 if (property == 'data') {
	 localStorage.setItem('SUWD_Student_Helpers_data', JSON.stringify(db.tables.Student_Helpers.data));
	 }
	 target[property] = value;
	 return true;
	 },
	 get : function(target, property, receiver) {
	 if (property == 'data') {
	 db.tables.Student_Helpers.data = JSON.parse(localStorage.getItem('SUWD_Student_Helpers_data'));
	 }
	 return target[property];
	 }
	 });*/

	lsload('Student_Helpers');
	if (db.tables.Student_Helpers.data.length == 0) {
		db.tables.Student_Helpers.data = [{
			name : 'student01',
			sid : 'stu01'
		}, {
			name : 'student02',
			sid : 'stu02'
		}, {
			name : 'others',
			sid : 'stuo'
		}];
		lssave('Student_Helpers');
	}
	// Above code is for debug test, will be corrected later when edit function is developed
}

function save_erase(id, mode) {
	// prev[CurrentMode] = documenet.getElementById(id).innerHTML;
	CurrentMode = mode;
	document.getElementById(id).innerHTML = "";
	//erase the previous content of the target div
}

function sold(gid, number, sid, remark, db, id) {
	if (gid == "nothing") {
		alert('Nothing cost nothing, never buy nothing');
	} else {
		lsload('Sell_Items');
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
			id : 'student_helper_selector_option_' + db.tables.Student_Helpers.data[i].sid,
			value : db.tables.Student_Helpers.data[i].sid,
			text : db.tables.Student_Helpers.data[i].sid + ' ' + db.tables.Student_Helpers.data[i].name
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