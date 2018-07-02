$(document).ready(function () {
    var counter = 0;


///funzione da ampliare
    $("#addrow").on("click", function () {
        var newRow = $("<tr>");
        var cols = "";

        cols += '<td><input type="text" class="form-control" name="descrizione' + counter + '"/></td>';
        cols += '<td><input type="number" class="form-control" name="prezzounit' + counter + '"/></td>';
        cols += '<td><input type="number" class="form-control" name="prezzotot' + counter + '"/></td>';
        cols += '<td><input type="number" class="form-control" name="aliquota' + counter + '"/></td>';

        cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';
        newRow.append(cols);
        $("table.order-list").append(newRow);
        counter++;
    });



    $("table.order-list").on("click", ".ibtnDel", function (event) {
        $(this).closest("tr").remove();       
        counter -= 1
    });


});

function calculateRow(row) {
    var price = +row.find('input[name^="price"]').val();

}

function calculateGrandTotal() {
    var grandTotal = 0;
    $("table.order-list").find('input[name^="price"]').each(function () {
        grandTotal += +$(this).val();
    });
    $("#grandtotal").text(grandTotal.toFixed(2));
}

//download del file xml da identare

function downloadData(contentType,data,filename){
	 
    var link=document.createElement("A");
    link.setAttribute("href",encodeURI("data:"+contentType+","+data));
    link.setAttribute("style","display:none");
    link.setAttribute("download",filename);
    document.body.appendChild(link); //needed for firefox
    console.log(link.outerHTML);
    link.click();
    setTimeout(function(){
        document.body.removeChild(link);
    },1000);
 }
 
 function fromToXml(form){
     var xmldata=['<?xml version="1.0"?>'];
       xmldata.push("<form>");
     var inputs=form.elements;
     for(var i=0;i<inputs.length;i++){
         var el=document.createElement("ELEMENT");
       if (inputs[i].name){
           el.setAttribute("name",inputs[i].name);
         el.setAttribute("value",inputs[i].value);
         xmldata.push(el.outerHTML);
       }
       
     }
     xmldata.push("</form>");
     return xmldata.join("\n");
 }
 
 
 function download(frm){
 
     var data=fromToXml(frm);
   console.log(data);
   
   downloadData("text/xml",data,"export.xml");
 }