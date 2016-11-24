/*globals alasql */
/*eslint-env jquery, browser*/

/*
 * Copyright 2016 Lee Chun Kok Michael
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

var console_command_history = [];
var console_command_history_currentIndex = -1;
var SUWD_div_id = "";
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

function download(content, fileName, mimeType) {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) { // IE10
        return navigator.msSaveBlob(new Blob([content], {
            type: mimeType
        }), fileName);
    } else if ('download' in a) { //html5 A[download]
        a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return true;
    } else { //do iframe dataURL download (old ch+FF):
        var f = document.createElement('iframe');
        document.body.appendChild(f);
        f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);

        setTimeout(function() {
            document.body.removeChild(f);
        }, 333);
        return true;
    }
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    };
}

function lssave(name) {
    localStorage.setItem('SUWDdb.' + name, JSON.stringify(db.tables[name].data));
    return JSON.stringify(db.tables[name].data);
}

function lsload(name) {
    db.tables[name].data = localStorage.getItem('SUWDdb.' + name) ? JSON.parse(localStorage.getItem('SUWDdb.' + name)) : [];
    return JSON.parse(localStorage.getItem('SUWDdb.' + name));
}

function reset_all_data() {
    db.tables.Sell_Items.data = [{
        "name": "通識答題紙",
        "gid": "b01",
        "number": 5,
        "price": 9.6
    }, {
        "name": "藍單行簿",
        "gid": "b02",
        "number": 32,
        "price": 1
    }, {
        "name": "中文作文封面",
        "gid": "b03",
        "number": 10,
        "price": 5.5
    }, {
        "name": "灰色File",
        "gid": "b04",
        "number": 9,
        "price": 2.2
    }, {
        "name": "紅色File",
        "gid": "b05",
        "number": 10,
        "price": 2.2
    }, {
        "name": "橙色File",
        "gid": "b06",
        "number": 3,
        "price": 2.2
    }, {
        "name": "黃色File",
        "gid": "b07",
        "number": 6,
        "price": 2.2
    }, {
        "name": "白襪",
        "gid": "b08",
        "number": 14,
        "price": 5
    }, {
        "name": "灰襪",
        "gid": "b09",
        "number": 25,
        "price": 5
    }, {
        "name": "暖包",
        "gid": "b10",
        "number": 69,
        "price": 2
    }, {
        "name": "綠色螢光筆",
        "gid": "b11",
        "number": 10,
        "price": 4.5
    }, {
        "name": "橙色螢光筆",
        "gid": "b12",
        "number": 10,
        "price": 4.5
    }, {
        "name": "藍色螢光筆",
        "gid": "b13",
        "number": 10,
        "price": 4.5
    }, {
        "name": "黃色螢光筆",
        "gid": "b14",
        "number": 6,
        "price": 4.5
    }, {
        "name": "紫色螢光筆",
        "gid": "b15",
        "number": 10,
        "price": 4.5
    }, {
        "name": "紅色螢光筆",
        "gid": "b16",
        "number": 10,
        "price": 4.5
    }, {
        "name": "藍筆",
        "gid": "b17",
        "number": 14,
        "price": 4.5
    }, {
        "name": "黑筆",
        "gid": "b18",
        "number": 17,
        "price": 4.5
    }, {
        "name": "sarasa黑色芯",
        "gid": "b19",
        "number": 5,
        "price": 4
    }, {
        "name": "sarasa藍色芯",
        "gid": "b20",
        "number": 20,
        "price": 4
    }, {
        "name": "uni?喱黑色筆",
        "gid": "b21",
        "number": 5,
        "price": 7
    }, {
        "name": "uni?喱藍色筆",
        "gid": "b22",
        "number": 10,
        "price": 7
    }, {
        "name": "塗改液",
        "gid": "b23",
        "number": 10,
        "price": 16
    }, {
        "name": "白筆袋",
        "gid": "b24",
        "number": 1,
        "price": 5
    }, {
        "name": "義工紀錄冊",
        "gid": "b25",
        "number": 3,
        "price": 5
    }];

    db.tables.Student_Helpers.data = [{
        name: 'member 1',
        hid: 'm01'
    }, {
        name: 'member 2',
        hid: 'm02'
    }, {
        name: 'helper 11',
        hid: 'h11'
    }, {
        name: 'helper 12',
        hid: 'h12'
    }, {
        name: 'helper 21',
        hid: 'h21'
    }, {
        name: 'helper 22',
        hid: 'h22'
    }, {
        name: 'helper 31',
        hid: 'h31'
    }, {
        name: 'helper 32',
        hid: 'h32'
    }, {
        name: 'helper 41',
        hid: 'h41'
    }, {
        name: 'helper 42',
        hid: 'h42'
    }, {
        name: 'helper 51',
        hid: 'h51'
    }, {
        name: 'helper 52',
        hid: 'h52'
    }];

    db.tables.Borrow_Items.data = [{
        "name": "康樂棋",
        "bid": "a1",
        "number": 7,
        "total": 7
    }, {
        "name": "波子棋",
        "bid": "a2",
        "number": 4,
        "total": 4
    }, {
        "name": "鬥獸棋",
        "bid": "a3",
        "number": 2,
        "total": 2
    }, {
        "name": "飛行棋",
        "bid": "a4",
        "number": 1,
        "total": 1
    }, {
        "name": "象棋",
        "bid": "a5",
        "number": 5,
        "total": 5
    }, {
        "name": "UNO",
        "bid": "a6",
        "number": 1,
        "total": 1
    }, {
        "name": "Deal",
        "bid": "a7",
        "number": 1,
        "total": 1
    }, {
        "name": "Pictionary",
        "bid": "a8",
        "number": 1,
        "total": 1
    }, {
        "name": "狼人",
        "bid": "a9",
        "number": 1,
        "total": 1
    }, {
        "name": "妙探尋兇",
        "bid": "a10",
        "number": 1,
        "total": 1
    }, {
        "name": "雨傘",
        "bid": "a11",
        "number": 4,
        "total": 4
    }];


}

function _init_() {
    // Below code is for debug test, will be corrected later when edit function is developed
    db.exec("CREATE TABLE IF NOT EXISTS Sell_Items (name STRING, gid STRING, number integer, price FLOAT)");

    lsload('Sell_Items');

    db.exec("CREATE TABLE IF NOT EXISTS Student_Helpers (name STRING, hid STRING)");
    lsload('Student_Helpers');


    db.exec("CREATE TABLE IF NOT EXISTS Sell_Records (gid STRING, number integer, total_price FLOAT, hid STRING, remark STRING, record_datetime STRING)");
    lsload('Sell_Records');

    db.exec("CREATE TABLE IF NOT EXISTS Borrow_Items (name STRING, bid STRING, number integer, total integer)");
    lsload('Borrow_Items');

    db.exec("CREATE TABLE IF NOT EXISTS Borrow_Records (bid STRING, bhid STRING, rhid STRING, sid STRING, remarkb STRING, remarkr STRING, borrow_datetime STRING, return_datetime STRING, returned boolean)");
    lsload('Borrow_Records');

    // Above code is for debug test, will be corrected later when edit function is developed
}

function return_(sid, rhid, remarkr) {
    sid = sid.toLowerCase();

    if (!db.exec('SELECT * FROM Borrow_Records WHERE returned = false AND sid = "' + sid + '"')) {
        alert("We don't have your Borrow record");
    } else if (rhid == "nobody") {
        alert("Who is the handler?");
    } else {
        var bid = db.exec('SELECT bid FROM Borrow_Records WHERE sid = "{sid}" AND returned = false'.format({
            sid: sid
        }))[0].bid;
        if (confirm('Are you realy going to return a ' + db.exec('SELECT name FROM Borrow_Items WHERE bid="' + bid + '"')[0].name + ' ?')) {
            lsload('Borrow_Items');
            lssave('Borrow_Records');
            var number_left = db.exec('SELECT number FROM Borrow_Items WHERE bid = "' + bid + '"')[0].number;
            db.exec('UPDATE Borrow_Items SET number = ' + (number_left + 1).toString() + ' WHERE bid = "' + bid + '"');
            lssave('Borrow_Items');
            db.exec('UPDATE Borrow_Records SET returned = true, remarkr="{remarkr}", rhid="{rhid}", return_datetime="{return_datetime}" WHERE sid="{sid}" AND returned = false'.format({
                remarkr: remarkr,
                rhid: rhid,
                return_datetime: Date().toString(),
                sid: sid
            }));
            lssave('Borrow_Records');
            alert('Transaction success, a ' + db.exec('SELECT name FROM Borrow_Items WHERE bid="' + bid + '"')[0].name + ' was returned ,' + db.exec('SELECT number FROM Borrow_Items WHERE bid = "' + bid + '"')[0].number.toString() + ' left');
            return true;
        } else {
            alert('Select item again then');
        }
    }
    return false;
}

function borrow(bid, bhid, sid, remarkb, db) {
    sid = sid.toLowerCase();
    if (bid === "nothing") {
        alert('Borrow Nothing!?');
    } else if (!/[1-6][a-d][0-3][0-9]/.test(sid)) {
        alert("Incorrect format of sid, it should be in form of e.g. 5c08");
    } else if (db.exec("SELECT * FROM Borrow_Records WHERE returned = false AND sid = '" + sid + "'").length > 0) {
        alert('You cannot borrow more than one items, pls return it first');
    } else if (bhid == "nobody") {
        alert("Who is the handler?");
    } else {
        lsload('Borrow_Items');
        lsload('Borrow_Records');
        console.log('SELECT number FROM Borrow_Items WHERE bid = "' + bid + '"');
        var number_left = db.exec('SELECT number FROM Borrow_Items WHERE bid = "' + bid + '"')[0].number;
        if (number_left < 1) {
            alert('Only ' + number_left.toString() + ' in stock, not enough goods in stock, buy less');
        } else {
            if (confirm('Are you realy going to borrow a ' + db.exec('SELECT name FROM Borrow_Items WHERE bid="' + bid + '"')[0].name + ' ?')) {
                db.exec('UPDATE Borrow_Items SET number = ' + (number_left - 1).toString() + ' WHERE bid = "' + bid + '"');
                lssave('Borrow_Items');
                db.tables.Borrow_Records.data.push({
                    bid: bid,
                    bhid: bhid,
                    rhid: "Not returned",
                    sid: sid,
                    remarkb: remarkb,
                    remarkr: "Not returned",
                    borrow_datatime: Date().toString(),
                    return_datetime: "Not returned",
                    returned: false
                });
                lssave('Borrow_Records');
                alert('Transaction success, a ' + db.exec('SELECT name FROM Borrow_Items WHERE bid="' + bid + '"')[0].name + ' was borrowed ,' + db.exec('SELECT number FROM Borrow_Items WHERE bid = "' + bid + '"')[0].number.toString() + ' left');
                return true;
            } else {
                alert('Select item again then');
            }
        }
    }
    return false;
}

function sold(gid, number, hid, remark, db) {
    number = parseInt(number);
    if (gid == "nothing") {
        alert('Nothing cost nothing, never buy nothing');
    } else if (hid == "nobody") {
        alert('Stop singing, this computer is going to break because of your "wonderful" voice');
    } else {
        lsload('Sell_Items');
        lsload('Sell_Records');
        var number_left = db.exec('SELECT number FROM Sell_Items WHERE gid = "' + gid + '"')[0].number;
        if (number > number_left) {
            alert('Only ' + number_left.toString() + ' in stock, not enough goods in stock, buy less');
        } else if (number <= 0) {
            alert('Are you kidding me? Buy more than 0 goods please');
        } else {
            var really_buy = confirm('Are you realy going to buy ' + number + ' of ' + db.exec('SELECT name FROM Borrow_Items WHERE gid="' + gid + '"')[0].name + ' with $' + (db.exec('SELECT price FROM Sell_Items WHERE gid = "' + gid + '"')[0].price * number).toString() + ' ?');
            if (really_buy) {
                db.exec('UPDATE Sell_Items SET number = ' + (number_left - number).toString() + ' WHERE gid = "' + gid + '"');
                lssave('Sell_Items');
                db.tables.Sell_Records.data.push({
                    gid: gid,
                    number: number,
                    total_price: db.exec('SELECT price FROM Sell_Items WHERE gid = "' + gid + '"')[0].price * number,
                    hid: hid,
                    remark: remark,
                    record_datetime: Date().toString()
                });
                lssave('Sell_Records');
                alert('Transaction success, ' + number.toString() + ' of ' + db.exec('SELECT name FROM Borrow_Items WHERE gid=' + gid)[0].name + ' sold ,' + db.exec('SELECT number FROM Sell_Items WHERE gid = "' + gid + '"')[0].number.toString() + ' left');
                return true;
            } else {
                alert('Select item again then');
            }
        }
    }
    return false;
}

function switch_sell(id) {
    window.SUWD_div_id = id;

    function getListText(gid, name, price, number) {
        return gid + '    ' + name + '    Price: $' + price + '    Number left: ' + number;
    }

    save_erase(id, 3);

    var form = $('<form></form>', {
        id: "sell_item_selection_form"
    });
    $(form).append('What do you want to buy? ');
    var sell_select_item = $('<select></select>', {
        id: "sell_item_selector"
    });
    $(sell_select_item).append($('<option></option>', {
        id: 'sell_item_selector_option_' + 'nothing',
        value: 'nothing',
        text: 'Nothing'
    }));
    for (i in db.tables.Sell_Items.data) {
        $(sell_select_item).append($('<option></option>', {
            id: 'sell_item_selector_option_' + db.tables.Sell_Items.data[i].gid,
            value: db.tables.Sell_Items.data[i].gid,
            text: getListText(db.tables.Sell_Items.data[i].gid, db.tables.Sell_Items.data[i].name, db.tables.Sell_Items.data[i].price, db.tables.Sell_Items.data[i].number)
        }));
    }
    $(form).append(sell_select_item);
    $(form).append('<br/><br/>\nHow many do you want? ');
    $(form).append($('<input id="sell_number" type="number" value="0"/>'));
    $(form).append('<br/><br/>');
    $(form).append('Who are you? ');
    var student_helper_select = $('<select></select>', {
        id: "student_helper_selector"
    });
    $(student_helper_select).append($('<option></option>', {
        id: 'stduent_helper_selector_option_' + 'nothing',
        value: 'nobody',
        text: 'Nobody nobody ♫'
    }));
    for (i in db.tables.Student_Helpers.data) {
        $(student_helper_select).append($('<option></option>', {
            id: 'student_helper_selector_option_' + db.tables.Student_Helpers.data[i].hid,
            value: db.tables.Student_Helpers.data[i].hid,
            text: db.tables.Student_Helpers.data[i].hid + ' ' + db.tables.Student_Helpers.data[i].name
        }));
    }
    $(form).append(student_helper_select);
    $(form).append('<br/><br/>Any remarks?  ');
    $(form).append($('<input/>', {
        id: 'remark_text',
        value: "",
        type: "text"
    }));
    $(form).append('<br/><br/>');
    $(form).append($('<button></button>', {
        id: "sell_confirm",
        text: "confirm",
        type: "button"
    }));
    $('#' + id).append(form);
    $('#sell_confirm').click(function() {
        if (sold($('#sell_item_selector').val(), $('#sell_number').val(), $('#student_helper_selector').val(), $('#remark_text').val(), db)) {
            switch_sell(window.SUWD_div_id);
        }
    });
}

function console_run(command) {

    console_command_history.push(command);
    console_command_history_currentIndex = console_command_history.length - 1;
    $('#output').append('<<<  ' + command + '\n');
    var output = ">>>  ";
    if (command.toLowerCase() == 'clear') {
        $('#output').html("");
        $('#output').append('Tin Ka Ping Secondary School Student Union Welfare Department Managemant System Console written by Lee Chun Kok Michael in 2016\n');
        output += 'Console cleared';
    } else if (command.toLowerCase() == 'localstorage clear') {
        if (confirm("Are you really going to clear all database data stored in this system?\nThis action is dangerous and cannot be inversed.") && prompt('Type in the full name of this school with all capital letters and no space') == 'TINKAPINGSECONDARYSCHOOL' && CryptoJS.SHA256(prompt('Give me the admin password, note that this is the last chance to stop this inreversible process that could break everything in the database')).toString() == '9806e133d2a4aef6d63a7db583976144399618849f95de2317545e04e869241f') {
            localStorage.clear();
            output += 'localStorage cleared!!! Well, you have just destoryed everything';
        } else {
            output += 'Saved from destory! localStorage is not cleared';
        }
    } else if (command.split(' ')[0].toLowerCase() == 'lssave') {
        try {
            output += lssave(command.split(' ')[1]);
        } catch (err) {
            output += 'Save to Local Storage Error: ' + err.message;
        }
    } else if (command.split(' ')[0].toLowerCase() == 'lsload') {
        try {
            output += JSON.stringify(lsload(command.split(' ')[1]));
        } catch (err) {
            output += 'Load from Local Storage Error: ' + err.message;
        }
    } else if (command.split(' ')[0].toLowerCase() == 'export') {
        try {
            var source_table = db.tables[command.split(' ')[1]].data;
            download(Papa.unparse(source_table, {
                dynamicTyping: true,
                quotes: (function(table) {
                    var boolArray = [];
                    for (key in table[0]) {
                        boolArray.push(typeof table[0][key] == "string");
                    }
                    return boolArray;
                })(source_table)
            }), (command.split(' ')[2] != undefined ? command.split(' ')[2] : 'SUWDdb-' + command.split(' ')[1]) + '.csv', 'text/csv');
            output += 'Export Data of table ' + command.split(' ')[1] + ' Success';
        } catch (err) {
            output += 'Export Data Error: ' + err.message;
        }
    } else if (command.split(' ')[0].toLowerCase() == 'import') {
        output += 'import (deprecated)';

    } else if (command.split(' ')[0].toLowerCase() == 'backup') {
        export_data();
        output += 'backup data downloaded';
    } else if (command.split(' ')[0].toLowerCase() == 'restore') {
        if (!document.getElementById('fileselector')) {
            $('body').append($('<input></input>', {
                type: "file",
                id: "fileselector",
                accept: 'text/plain'
            }));
        }
        $('#fileselector').css("display", "none");
        $('#fileselector').click();
        $('#fileselector').change(function(e) {
            var input = e.target;
            var reader = new FileReader();
            reader.onload = function() {
                var text = reader.result;
                alert(text);
                import_data(text);
                $('#output').append('>>> Data Imported\n');
            };
            reader.readAsText(input.files[0]);
        });
        for (i in db.tables) {
            lsload(i);
        }
    } else if (command.toLowerCase() == 'history') {
        output += "\n" + JSON.stringify(console_command_history, null, ' ');
    } else {
        if (['create', 'drop', 'delete'].indexOf(command.split(' ')[0].toLowerCase()) != -1) {
            if (!(confirm("You are doing a dangerous SQL operation, confirm?") && prompt('Type in the full name of this school with all capital letters and no space') == 'TINKAPINGSECONDARYSCHOOL' && CryptoJS.SHA256(prompt('Give me the admin password, note that this is the last chance to stop this inreversible process that could break everything in the database')).toString() == '9806e133d2a4aef6d63a7db583976144399618849f95de2317545e04e869241f')) {
                command = "";
                $('#output').append('>>> Command droped for dangerous operation\n');
                return;
            }
        }
        try {
            output += "\n" + JSON.stringify(db.exec(command), null, "  ");
        } catch (err) {
            output += 'SQL Error: ' + err.message;
        }
    }
    output += "\n";

    $('#output').append(output);
    $('#output').scrollTop($('#output')[0].scrollHeight);

}

function run(command) {
    if (command.toLowerCase() == 'localstorage clear') {
        if (confirm("Are you really going to clear all database data stored in this system?\nThis action is dangerous and cannot be inversed.") && prompt('Type in the full name of this school with all capital letters and no space') == 'TINKAPINGSECONDARYSCHOOL' && CryptoJS.SHA256(prompt('Give me the admin password, note that this is the last chance to stop this inreversible process thaat could break everything in the database')).toString() == '9806e133d2a4aef6d63a7db583976144399618849f95de2317545e04e869241f') {
            localStorage.clear();
        }
    } else if (command.split(' ')[0].toLowerCase() == 'lssave') {
        try {
            lssave(command.split(' ')[1]);
        } catch (err) {
            console.log('Save to Local Storage Error: ' + err.message);
        }
    } else if (command.split(' ')[0].toLowerCase() == 'lsload') {
        try {
            lsload(command.split(' ')[1]);
        } catch (err) {
            console.log('Load from Local Storage Error: ' + err.message);
        }
    } else if (command.split(' ')[0].toLowerCase() == 'export') {
        try {
            var source_table = db.tables[command.split(' ')[1]].data;
            download(Papa.unparse(source_table, {
                dynamicTyping: true,
                quotes: (function(table) {
                    var boolArray = [];
                    for (key in table[0]) {
                        boolArray.push(typeof table[0][key] == "string");
                    }
                    return boolArray;
                })(source_table)
            }), (command.split(' ')[2] != undefined ? command.split(' ')[2] : 'SUWDdb-' + command.split(' ')[1]) + '.csv', 'text/csv');
            console.log('Export Data of table ' + command.split(' ')[1] + ' Success');
        } catch (err) {
            console.log('Export Data Error: ' + err.message);
        }
    } else if (command.split(' ')[0].toLowerCase() == 'import') {
        console.log('import (deprecated)');
    } else if (command.split(' ')[0].toLowerCase() == 'backup') {
        export_data();
        console.log('backup data downloaded');
    } else if (command.split(' ')[0].toLowerCase() == 'restore') {

        if (!document.getElementById('fileselector')) {
            $('body').append($('<input></input>', {
                type: "file",
                id: "fileselector",
                accept: 'text/plain'
            }));
        }
        $('#fileselector').css("display", "none");
        $('#fileselector').click();
        $('#fileselector').change(function(e) {
            var reader = new FileReader();
            reader.onload = function() {
                var text = reader.result;
                import_data(text);
                console.log('Data Imported');
            };
            reader.readAsText(document.getElementById('fileselector').files[0]);
        });
        for (i in db.tables) {
            lsload(i);
        }
    } else if (command.toLowerCase() == 'history') {
        console.log("\n" + JSON.stringify(console_command_history, null, ' '));
    } else {
        if (['create', 'drop'].indexOf(command.split(' ')[0].toLowerCase()) != -1) {
            if (!(confirm("You are doing a dangerous SQL operation, confirm?") && prompt('Type in the full name of this school with all capital letters and no space') == 'TINKAPINGSECONDARYSCHOOL' && CryptoJS.SHA256(prompt('Give me the admin password, note that this is the last chance to stop this inreversible process thaat could break everything in the database')).toString() == '9806e133d2a4aef6d63a7db583976144399618849f95de2317545e04e869241f')) {
                command = "";
                return;
            }
        }
        try {
            db.exec(command);
        } catch (err) {
            console.log('SQL Error: ' + err.message);
        }
    }
}

function switch_console(id) {
    save_erase(id, 1);
    $('#' + id).append('Output: <br/>');
    $('#' + id).append($('<textarea></textarea>', {
        id: "output",
        readonly: "readonly"
    }).css({
        "margin": "0px",
        "width": "100%",
        "height": "50vh"
    }).html("Tin Ka Ping Secondary School Student Union Welfare Department Managemant System Console written by Lee Chun Kok Michael in 2016\n"));
    $('#' + id).append('<br/><br/>');
    $('#' + id).append('Command input: <br/>');
    $('#' + id).append($('<input></input>', {
        id: "input",
        type: "text"
    }).css({
        "margin": "0px",
        "width": "100%",
        "font-family": "monospace"
    }).keyup(function(e) {
        if (e.keyCode === 13) {
            var command = $('#input').val();
            $('#input').val("");
            console_run(command);
        }
    }).keydown(function(e) {
        if (e.keyCode == 38) { // pressing upArrow
            console_command_history_currentIndex = console_command_history_currentIndex > 0 ? console_command_history_currentIndex - 1 : 0;
            if (typeof console_command_history[console_command_history_currentIndex] == 'string') {
                $('#input').val(console_command_history[console_command_history_currentIndex]);
            }
        } else if (e.keyCode == 40) { // pressing downArrow
            console_command_history_currentIndex = console_command_history_currentIndex + 1 < console_command_history.length ? console_command_history_currentIndex + 1 : console_command_history.length - 1;
            if (typeof console_command_history[console_command_history_currentIndex] == 'string') {
                $('#input').val(console_command_history[console_command_history_currentIndex]);
            }
        }
    }));
    $('#' + id).append('<br/><br/>');

}

function export_data() {
    download(JSON.stringify(localStorage, function(key, value) {
        console.log(key);
        return typeof value === 'object' || key.split('.')[0] === 'SUWDdb' ? value : undefined;
    }), 'SUWDdb_backup.txt', 'text/plain');
}

function import_data(imported_json_string) {
    var obj = JSON.parse(imported_json_string);
    for (i in obj) {
        localStorage.setItem(i, obj[i].toString());
    }
}

function switch_report(id) {
    save_erase(id, 2);
    $('#' + id).append('<br/>');
    $('#' + id).append('Choose the table that you want to output: \n');
    var table_selection = $('<select></select>', {
        id: "table_selector"
    });
    for (var i in db.tables) {
        table_selection.append($('<option></option>', {
            value: i,
            text: i
        }));
    }
    table_selection.appendTo('#' + id);
    $('#' + id).append('<br/>');
    $('#' + id).append($('<button></button>', {
        text: 'Export csv',
        id: 'btn_csv',
        onclick: 'run("export " + document.getElementById("table_selector").value)'
    }));
    $('#' + id).append($('<button></button>', {
        text: 'Show in HTML table',
        id: 'btn_table'
    }));
    $('#' + id).append('<div id="report_div"></div>');
    $('#btn_table').click(function() {
        lsload($('#table_selector').val());
        $('#report_div').html("");
        $('#report_div').append('<br/><table id="report_table"><thead><tr id="report_table_head"></tr></thead><tbody></tbody></table><br/>');
        for (i in db.tables[$('#table_selector').val()].data[0]) {
            $('#report_table_head').append($('<th></th>', {
                text: i
            }));
        }
        $('#report_table').dynatable({
            dataset: {
                records: db.tables[$('#table_selector').val()].data
            }
        });
    });
}

function switch_edit(id) {
    alert('Edit mode Currently Not Supported');
    return;
    save_erase(id, 1);
    $('#' + id).append('<div id="div_edit"></div>');

    function edit_option(o_name, val, fn) {
        this.name = o_name;
        this.val = val;
        this.fn = fn;
    }

    var myoptions = [];
    myoptions.push(edit_option('Add Sell_Items', 'add_sell_items', function() {
        var d = $('#div_edit');
        d.html("");
        d.append('<br/>Enter your new name of Sell_Items: <input type="text" id="edit_01"></input><br/>');
        d.append('<br/>Enter your new name of Sell_Items: <input type="text" id="edit_01"></input><br/>');
    }));
    myoptions.push(edit_option('Edit Sell_Items', 'edit_sell_items'));
}

function switch_borrow(id) {
    window.SUWD_div_id = id;

    function getListText(gid, name, number) {
        return gid + '    ' + name + '    Number left: ' + number;
    }

    save_erase(id, 4);

    var form = $('<form></form>', {
        id: "borrow_item_selection_form"
    });
    $(form).append('What do you want to borrow? ');
    var borrow_select_item = $('<select></select>', {
        id: "borrow_item_selector"
    });
    $(borrow_select_item).append($('<option></option>', {
        id: 'borrow_item_selector_option_' + 'nothing',
        value: 'nothing',
        text: 'Nothing'
    }));
    for (i in db.tables.Borrow_Items.data) {
        $(borrow_select_item).append($('<option></option>', {
            id: 'borrow_item_selector_option_' + db.tables.Borrow_Items.data[i].bid,
            value: db.tables.Borrow_Items.data[i].bid,
            text: getListText(db.tables.Borrow_Items.data[i].bid, db.tables.Borrow_Items.data[i].name, db.tables.Borrow_Items.data[i].number)
        }));
    }
    $(form).append(borrow_select_item);
    $(form).append('<br/><br/>Who borrow this thing?');
    $(form).append('<input id="student_id"/>');
    $(form).append('<br/><br/>Who are you?');
    var student_helper_select = $('<select></select>', {
        id: "student_helper_selector"
    });
    $(student_helper_select).append($('<option></option>', {
        id: 'stduent_helper_selector_option_' + 'nothing',
        value: 'nobody',
        text: 'Nobody nobody ♫'
    }));
    for (i in db.tables.Student_Helpers.data) {
        $(student_helper_select).append($('<option></option>', {
            id: 'student_helper_selector_option_' + db.tables.Student_Helpers.data[i].hid,
            value: db.tables.Student_Helpers.data[i].hid,
            text: db.tables.Student_Helpers.data[i].hid + ' ' + db.tables.Student_Helpers.data[i].name
        }));
    }
    $(form).append(student_helper_select);
    $(form).append('<br/><br/>Any remarks?  ');
    $(form).append($('<input/>', {
        id: 'remark_text',
        value: "",
        type: "text"
    }));
    $(form).append('<br/><br/>');
    $(form).append($('<button></button>', {
        id: "borrow_confirm",
        text: "confirm",
        type: "button"
    }));
    $('#' + id).append(form);
    $('#borrow_confirm').click(function() {
        if (borrow($('#borrow_item_selector').val(), $('#student_helper_selector').val(), $('#student_id').val(), $('#remark_text').val(), db)) {
            switch_borrow(window.SUWD_div_id);
        }

    });
}

function switch_return(id) {
    window.SUWD_div_id = id;

    function getListText(bid, sid) {
        return "{bid}    {name}    {sid}".format({
            bid: bid,
            name: db.exec("SELECT name FROM Borrow_Items WHERE bid = '{bid}'".format({
                bid: bid
            }))[0].name,
            sid: sid
        });
    }

    save_erase(id, 5);

    var form = $('<form></form>', {
        id: "return_item_selection_form"
    });
    $(form).append('Which entry do you want to return? ');
    var return_select_item = $('<select></select>', {
        id: "return_item_selector"
    });
    $(return_select_item).append($('<option></option>', {
        id: 'return_item_selector_option_' + 'nothing',
        value: 'nothing',
        text: 'Nothing'
    }));
    var borrow_data = db.exec("SELECT bid,sid FROM Borrow_Records WHERE returned = false");
    for (i in borrow_data) {
        $(return_select_item).append($('<option></option>', {
            id: 'return_item_selector_option_' + borrow_data[i].bid,
            value: borrow_data[i].sid,
            text: getListText(borrow_data[i].bid, borrow_data[i].sid)
        }));
    }
    $(form).append(return_select_item);
    $(form).append('<br/><br/>Who are you?');
    var student_helper_select = $('<select></select>', {
        id: "student_helper_selector"
    });
    $(student_helper_select).append($('<option></option>', {
        id: 'stduent_helper_selector_option_' + 'nothing',
        value: 'nobody',
        text: 'Nobody nobody ♫'
    }));
    for (i in db.tables.Student_Helpers.data) {
        $(student_helper_select).append($('<option></option>', {
            id: 'student_helper_selector_option_' + db.tables.Student_Helpers.data[i].hid,
            value: db.tables.Student_Helpers.data[i].hid,
            text: db.tables.Student_Helpers.data[i].hid + ' ' + db.tables.Student_Helpers.data[i].name
        }));
    }
    $(form).append(student_helper_select);
    $(form).append('<br/><br/>Any remarks?  ');
    $(form).append($('<input/>', {
        id: 'remark_text',
        value: "",
        type: "text"
    }));
    $(form).append('<br/><br/>');
    $(form).append($('<button></button>', {
        id: "borrow_confirm",
        text: "confirm",
        type: "button"
    }));
    $('#' + id).append(form);
    $('#borrow_confirm').click(function() {
        if (return_($('#return_item_selector').val(), $('#student_helper_selector').val(), $('#remark_text').val())) {
            switch_return(window.SUWD_div_id);
        }

    });
}
