// var prev = ["","",""];

var CurrentMode = 0 // 0 -> general, 1 -> edit, 2 -> report

function save_erase(id,mode){
    prev[CurrentMode] = documenet.getElementById(id).innerHTML;
    CurrentMode = mode;
    documenet.getElementById(id).innerHTML = ""; //erase the previous content of the div
}

function switch_general(id){
    save_erase(id,0);
    var sell_item_db = new alasql.Database();
    sell_item_db.exec("CREATE TABLE Sell_Item (name STRING, number INT, price FLOAT)");
    document.getElementById(id).innerHTML += "<table>";
    document.getElementById(id).innerHTML += "</table>";
}