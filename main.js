// var prev = ["","",""];

var CurrentMode = 0;
var db = new alasql.Database();
// 1 -> edit, 2 -> report, 3 -> sell, 4 -> borrow, 5 -> return

function _init_() {

    // Below code is for debug test, will be corrected later when edit function is developed
    db.exec("CREATE TABLE Sell_Items (name STRING, number INT, price FLOAT)");
    db.tables.Sell_Items.data = [{
        name : 'pen01',
        number : 10,
        price : 10
    }, {
        name : 'pen02',
        number : 20,
        price : 20
    }, {
        name : 'pen03',
        number : 30,
        price : 30
    }, {
        name : 'pen04',
        number : 40,
        price : 40
    }, {
        name : 'pen05',
        number : 50,
        price : 50
    }, {
        name : 'pen06',
        number : 60,
        price : 60
    }, {
        name : 'pen07',
        number : 70,
        price : 70
    }, {
        name : 'pen08',
        number : 80,
        price : 80
    }, {
        name : 'pen09',
        number : 90,
        price : 90
    }, {
        name : 'pen10',
        number : 100,
        price : 100
    }];
    // Above code is for debug test, will be corrected later when edit function is developed
}

function save_erase(id, mode) {
    // prev[CurrentMode] = documenet.getElementById(id).innerHTML;
    CurrentMode = mode;
    document.getElementById(id).innerHTML = "";
    //erase the previous content of the target div
}

function sold(name, number, db, id) {
    var number_left = db.exec('SELECT number FROM Sell_Items WHERE name = "' + name+'"')[0].number;
    if (number > number_left) {
        alert('Only ' + number_left.toString() + ' in stock, not enough goods in stock, buy less');
    } else if (number <= 0) {
        alert('Are you kidding me? Buy more than 0 goods please');
    } else {
        var really_buy = confirm('Are you realy going to buy ' + number + ' of ' + name + ' with $' + ((db.exec('SELECT price FROM Sell_Items WHERE name = "' + name+'"')[0].price) * number).toString() + ' ?');
        if (really_buy) {
            db.exec('UPDATE Sell_Items SET number = ' + (number_left - number).toString() + ' WHERE name = "' + name + '"');
            alert('Transaction success, ' + number.toString() + ' of ' + name + ' sold ,' + db.exec('SELECT number FROM Sell_Items WHERE name = "' + name+'"')[0].number.toString() + ' left');
            switch_sell(id);
        } else {
            alert('Select item again then');
        }
    }
}

function getListText(name, price, number) {
    return name + '    Price: $' + price + '    Number left: ' + number;
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
            id : 'sell_item_selector_option_' + db.tables.Sell_Items.data[i].name,
            value : db.tables.Sell_Items.data[i].name,
            text : getListText(db.tables.Sell_Items.data[i].name, db.tables.Sell_Items.data[i].price, db.tables.Sell_Items.data[i].number)
        }));
    }
    $(form).append(sell_select_item);
    $(form).append('<br/><br/>\nHow many do you want? ');
    $(form).append($('<input id="sell_number" type="number"/>'));
    $(form).append('<br/><br/>');
    $(form).append($('<button></button>', {
        id : "sell_confirm",
        text : "confirm",
        type : "button",
        onclick : 'sold(document.getElementById("sell_item_selector").value,document.getElementById("sell_number").value,db,"' + id.toString() + '")'
    }));
    $('#' + id).append(form);
}