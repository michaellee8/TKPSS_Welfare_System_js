// var prev = ["","",""];

var CurrentMode = 0; // 0 -> general, 1 -> edit, 2 -> report

function save_erase(TargetDiv,mode){
 // prev[CurrentMode] = documenet.getElementById(id).innerHTML;
    CurrentMode = mode;
    TargetDiv.innerHTML = ""; //erase the previous content of the div
}

function sold(ItemId){
	
}

function switch_general(TargetDiv){
    save_erase(TargetDiv,0);
    var db = new alasql.Database();
    
    // Below code is for debug test, will be corrected later when edit function is developed
    db.exec("CREATE TABLE Sell_Items (name STRING, number INT, price FLOAT)");
    db.exec("CREATE TABLE Borrow_Items (name STRING, number INT)");
    db.exec("CREATE TABLE Borrow_Students (sid STRING, item STRING)");
    db.tables.Sell_Items.data = [
        {name: 'pen01', number: 10, price: 10},
        {name: 'pen02', number: 20, price: 20},
        {name: 'pen03', number: 30, price: 30},
        {name: 'pen04', number: 40, price: 40},
        {name: 'pen05', number: 50, price: 50},
        {name: 'pen06', number: 60, price: 60},
        {name: 'pen07', number: 70, price: 70},
        {name: 'pen08', number: 80, price: 80},
        {name: 'pen09', number: 90, price: 90},
        {name: 'pen10', number: 100, price: 100}
    ];
    db.tables.Borrow_Items.data = [
        {name: 'ball01', number: 1},
        {name: 'ball02', number: 2},
        {name: 'ball03', number: 3},
        {name: 'ball04', number: 4},
        {name: 'ball05', number: 5},
        {name: 'ball06', number: 6},
        {name: 'ball07', number: 7},
        {name: 'ball08', number: 8},
        {name: 'ball09', number: 9},
        {name: 'ball10', number: 10},
    ];
    // Above code is for debug test, will be corrected later when edit function is developed
    
    // generate the table for sell item selection with innerHTML
    /* Rendering table with innerHTML is deprecated since it is unstable, slowers the speed and could break the whole system down
    TargetDiv.innerHTML += '<table width="49%">';
    for (i in db.tables.Sell_Items.data){
        if (i%3==0){
            TargetDiv.innerHTML += "<tr>";
        }
        TargetDiv.innerHTML += '<td><input ' + db.tables.Sell_Items.data[i].number==0?'disabled="disabled"':'' + ' onclick="sold('+i.toString()+')" '+'type="button" id="'+ db.tables.Sell_Items.data[i].name + '_sold_btn" ' + 'value="' + db.tables.Sell_Items.data[i].name + ' $' + db.tables.Sell_Items.data[i].price.toString() +'"></td>';
        if (i % 3 == 2 || i == db.tables.Sell_Items.data.length) {
        	
        	TargetDiv.innerHTML += "</tr>";
        }
    }
    TargetDiv.innerHTML += "</table>";
    
    //generate the table for borrow item selection
    TargetDiv.innerHTML += '<table width="49%>';
    
    TargetDiv.innerHTML += "</table>";
    
    TargetDiv.innerHTML += "<br/>";
    */
   
   // generate the table for item selection with HTML DOM append child method
   
}