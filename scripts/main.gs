function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Narzędzia API')
        .addItem('Uzupełnij dane','appendData')
        .addToUi();
  }
  
  function getBookData(isbn) {
    
    var response = UrlFetchApp.fetch("http://data.bn.org.pl/api/bibs.json?isbnIssn=" + isbn);
    var json = response.getContentText();
    
    var data = JSON.parse(json);
    
    if (Object.getOwnPropertyNames(data["bibs"]).length === 1.0) {
      var nothing = "entry missed";
      return nothing;
    }
    else {
      return data["bibs"][0];
    }
  }
      
  
  function appendData() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    var range = sheet.getActiveRange();
    
   // Logger.log(range.getNumRows());
    
    for (var i = 1; i <= range.getNumRows(); i++) {
      var isbnCell = range.getCell(i, 1);
      var isbnValue = isbnCell.getValue();
      
      //Logger.log(isbnValue);
      
      var response = getBookData(isbnValue);
      var currentRow = isbnCell.getRow();
       
      if (typeof response["author"] != "undefined"){
        var authorFull = response["author"].split(".");
        var firstAuthor = authorFull[0];
      } else {
        var firstAuthor = response["author"];
      }
      
      if (typeof response["title"] != "undefined"){
        var titleFull = response["title"].split("/");
        var title = titleFull[0];
      } else {
        var title = response["title"];
      }
      
      if (typeof response["title"] != "undefined"){
        var publisherFull = response["publisher"].split(".");
        var publisher = publisherFull[0];
      } else {
        var publisher = response["publisher"];
      }
      
      if (typeof response["title"] != "undefined"){
        var placeFull = response["placeOfPublication"].split(" : ");
        var place = placeFull[0];
      } else {
        var place = response["placeOfPublication"];
      }
    
      sheet.getRange(currentRow, 2).setValue(firstAuthor);
      sheet.getRange(currentRow, 3).setValue(title);
      sheet.getRange(currentRow, 4).setValue(publisher);
      sheet.getRange(currentRow, 5).setValue(place);
      sheet.getRange(currentRow, 6).setValue(response["publicationYear"]);
    }
  }