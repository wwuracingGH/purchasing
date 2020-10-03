//Called on page load, when DOM is ready
$(document).ready(function() {
  document.getElementById("defaultTab").click();

  $("#inputQuantity").on("input", updateInputTotal);
  $("#inputUnitPrice").on("input", updateInputTotal);
  $("#inputUnitDiscount").on("input", updateInputTotal);

  $("#itemInputForm").on("submit", addRow);

});

//Get all tabContent elements and hide them
function hideAllTabContent() {
  var tabContent = document.getElementsByClassName("tabContent");
  var i;
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }
}

//Called when switching tabs
function tabSelect(event, tabName) {
  var i, tabContent, tabs;
  hideAllTabContent();

  //Get all tabs and make them not active
  tabs = document.getElementsByClassName("tabs");
  for (i = 0; i < tabs.length; i++) {
    tabs[i].className = tabs[i].className.replace(" active", "");
  }
  document.getElementById("btnEditPO").className =
      document.getElementById("btnEditPO").className.replace(" active", "");

  //Show the current tab and make the clicked tab active
  document.getElementById(tabName).style.display = "block";

  event.currentTarget.className += " active";
}

//Called when "Create a new PO" button is clicked
function createPO(event) {
  workOnPO(event, null);
}

//Called when "Edit an existing PO" button is clicked
function editPO(event) {
  //display system button list
  document.getElementById("systemList").style.display = "block";
  //set all system buttons to inactive
  var systems = document.getElementsByClassName("system");
  for (i = 0; i < systems.length; i++) {
    systems[i].className = systems[i].className.replace(" active", "");
  }
  //set "Edit an existing PO" button to active
  event.currentTarget.className += " active";

  var systemButtons = '';
  //jquery AJAX call for system buttons
  $.getJSON('years/5f35cdf09c05c8a5b4115021/systems', function(data) {

    //add each system button
    $.each(data, function() {
      systemButtons += '<button type="button" class="system"'
          +'onclick="choosePO(event,\''+this._id+'\')">' + this.systemName
          +'</button>';
    });

    //render the system buttons
    $('#chooseSystemButtons').html(systemButtons);
  });

}

//Called when a system button is clicked
function choosePO(event, systemID) {
  //show loading stuff
  document.getElementById("POList").style.display = "none";
  document.getElementById("noUnsignedPOs").style.display = "none";
  document.getElementById("loadingPOs").style.display = "block";
  //set all system buttons to inactive
  var systems = document.getElementsByClassName("system");
  for (i = 0; i < systems.length; i++) {
    systems[i].className = systems[i].className.replace(" active", "");
  }
  //set clicked system button to active
  event.currentTarget.className += " active";

  var purchaseOrderRows = `
    <tr id=choosePOTableHeader>
      <th class="choosePOTableCell">PO name</th>
      <th class="choosePOTableCell">Author</th>
      <th class="choosePOTableCell">Company</th>
      <th class="choosePOTableCell">Total cost</th>
      <th class="choosePOTableCell"></th>
    </tr>`;
  var noPOs = false;
  //jquery AJAX call for getting purchase orders
  $.getJSON('systems/'+systemID+'/to-be-signed', function (data) {
    if (data.length === 0) {
      document.getElementById("loadingPOs").style.display = "none";
      document.getElementById("noUnsignedPOs").style.display = "block";
      return;
    }
    //add purchaseOrderRows
    var allRowsLoaded = $.when({});
    $.each(data, function() {
      var rowLoaded = $.Deferred();
      allRowsLoaded = $.when(allRowsLoaded, rowLoaded);
      var authorName = "";
      var authorDeffered = $.getJSON('users/'+this.authorID, {}, function(userData) {
        authorName = userData[0].firstName + " " + userData[0].lastName;
      });
      var companyName = "";
      var companyDeffered = $.getJSON('companies/'+this.companyID, {}, function(companyData) {
        companyName = companyData[0].companyName;
      });
      //Java developers be like
      var authorAndCompanyDeffered = $.when(authorDeffered, companyDeffered);
      var poID = this._id;
      var poName = this.poName;
      var totalCost = this.totalCost;
      authorAndCompanyDeffered.done(function() {
        purchaseOrderRows += `
        <tr class="choosePOTableRow">
          <td class="choosePOTableCell">`+poName+`</td>
          <td class="choosePOTableCell">`+authorName+`</td>
          <td class="choosePOTableCell">`+companyName+`</td>
          <td class="choosePOTableCell">$`+totalCost+`</td>
          <td class="choosePOTableCell">
            <button class="choosePOTableButton" type="button"
            onclick="workOnPO(event, \'`+poID+`\')">Edit</button>
          </td>
        </tr>`;
        rowLoaded.resolve();
      });
      authorAndCompanyDeffered.fail(function () {
        rowLoaded.reject();
        console.log("Error: failed to get author and/or company for po \""+poName+".\"");
      });
    });
    allRowsLoaded.then(function () {
      //hide loading stuff
      document.getElementById("loadingPOs").style.display = "none";
      //insert PO list into the webpage
      $('#choosePOTable').html(purchaseOrderRows);
      //show PO list
      document.getElementById("POList").style.display = "block";
    });
  });
}

//Edit PO scene
function workOnPO(event, poID) {
  hideAllTabContent();

  var authorID;
  var authorName;
  var companyID;
  var poName;
  var discount;
  var shipping;
  var totalCost;
  var authorDeferred;
  //get PO information
  var poDeferred = $.getJSON('/purchase-orders/'+poID, function (data) {
    console.log(data);
    authorID = data[0].authorID;
    companyID = data[0].companyID;
    poName = data[0].poName;
    discount = data[0].discount;
    shipping = data[0].discount;
    totalCost = data[0].totalCost;
  });
  poDeferred.done(function () {
    //set PO title
    var poTitleHTML = `
        <p id="poTitle">` + poName + `
        <button type="button" id="editPOTitle" onclick="editPOTitle(event)">Edit</button>`;
    $('#poName').html(poTitleHTML);

    //get company information
    $.getJSON('/companies/'+companyID, function(data) {
      companyName = data[0].companyName;
    }).done(function () {
      //fill company field
      var companyHTML = `
      <p id="companyText">Company:
      <p id="companyName">`+companyName+`</p>
      <button type="button" id="companyChoose" onclick="chooseCompany(event)">Choose</button>`;
      $('#company').html(companyHTML);
    });

    //get author information
    authorDeferred = $.getJSON('/users/'+authorID, function (data) {
      authorName = data[0].firstName + " " + data[0].lastName;
    }).done(function () {
      //fill author field
      var authorHTML = '<p id="authorName">'+ authorName;
      $('#author').html(authorHTML);
    });
  });

  //create itemTable header
  var itemTableContents = `
    <tr id=itemTableHeader>
      <th class=itemTableCell>Part #</th>
      <th class=itemTableCell>Part name/link to item</th>
      <th class=itemTableCell>Quantity</th>
      <th class=itemTableCell>Unit Price</th>
      <th class=itemTableCell>Unit Discount</th>
      <th class=itemTableCell>Subtotal</th>
      <th class=itemTableCell></th>
      <th class=itemTableCell></th>
    </tr>`;

  //fill out itemTable
  var start = $.Deferred();
  var allRowsLoaded = $.when(start);
  $.getJSON('/purchase-orders/'+poID+'/items', function (data) {
    var rowLoaded = $.Deferred();
    allRowsLoaded = $.when(allRowsLoaded, rowLoaded);
    start.resolve();
    console.log(data);
    $.each(data, function (i, itemRow) {
      var rowLoaded = $.Deferred();
      allRowsLoaded = $.when(allRowsLoaded, rowLoaded);
      itemTableContents += `
      <tr class=itemTableRow>
        <td class=itemTableCell id=columnNumber>`+this.partNumber+`</td>
        <td class=itemTableCell id=columnName><a href="`+this.partURL+'">'+this.partName+`</a></td>
        <td class=itemTableCell id=columnQuantity>`+this.partQuantity+`</td>
        <td class=itemTableCell id=columnPrice>$`+this.partPrice+`</td>
        <td class=itemTableCell id=columnDiscount>$`+this.partDiscount+`</td>
        <td class=itemTableCell id=columnSubtotal>$`+this.partQuantity * (this.partPrice - this.partDiscount)+`</td>
        <td id=columnButton>
          <button class=itemTableButton type="button" onclick="editRow(event)">Edit</button>
        <td id=columnButton>
          <button class=itemTableButton type="button" onclick="deleteRow(event)">Delete</button>
      </tr>`;
      rowLoaded.resolve();
    });
  });
  allRowsLoaded.then(function () {
    $('#itemTable').html(itemTableContents);
    //show workOnPO section
    document.getElementById("workOnPO").style.display = "block";
  });

  updateInputTotal();
}

function savePOTitle(event) {

}

function savePODiscount(event) {

}

function savePOShipping(event) {

}

function calculateTotal() {
  var quantity = $("#inputQuantity").val();
  var unitPrice = $("#inputUnitPrice").val();
  var unitDiscount = $("#inputUnitDiscount").val();
  return quantity * (unitPrice - unitDiscount);
}

function updateInputTotal() {
  var itemSubtotal = calculateTotal();
  if (Number.isNaN(itemSubtotal)) {
    return;
  }

  //round to four decimal digits
  itemSubtotal = Math.round(itemSubtotal * 10000) / 10000;

  var itemSubtotalStr = itemSubtotal.toString();
  //if subtotal is a whole number, put to zeros after it
  if (itemSubtotalStr.indexOf('.') === -1) {
    itemSubtotal += ".00";
  //if subtotal has one decimal place, put one zero after it
  } else if (itemSubtotalStr.length - itemSubtotalStr.indexOf('.') === 2) {
    itemSubtotal += "0";
  //if subtotal has more than four decimal places, round to four
  } else if (itemSubtotalStr.length - itemSubtotalStr.indexOf('.') > 5) {

  }
  $("#inputSubtotal").text("$" + itemSubtotal);
}

function addRow(event) {

  event.preventDefault();
  $("#itemInputForm")[0].reset();
}

function editRow(event) {

}

function deleteRow(event) {

}
