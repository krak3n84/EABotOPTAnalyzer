// EA Bot Optimizer Analyzer
// Google Apps Script for filtering and exporting selected MT5 optimization passes.

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('EA Analyzer')
    .addItem('Analyze Profitable Passes', 'analyzeProfitablePasses')
    .addToUi();
}

function analyzeProfitablePasses() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var allSheets = spreadsheet.getSheets();
  var targetName = 'tester optimizer results';
  var sheet = null;

  Logger.log(
    'Available sheet tabs: ' +
      allSheets.map(function (s) { return s.getName(); }).join(', ')
  );

  allSheets.forEach(function (candidate) {
    if (candidate.getName().trim().toLowerCase() === targetName) {
      sheet = candidate;
    }
  });

  if (!sheet) {
    throw new Error('Sheet not found. Expected a tab named "Tester Optimizer Results".');
  }

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    throw new Error('The input sheet does not contain any optimization rows.');
  }

  var headers = data[0].map(function (header) {
    return String(header).trim();
  });

  var desiredColumns = [
    'Pass',
    'Profit',
    'Profit Factor',
    'Recovery Factor',
    'Sharpe Ratio',
    'Equity DD %',
    'Trades',
    'percRisk',
    'stopLoss',
    'takeProfit',
    'iBullishX',
    'iBearishX'
  ];

  var columnMap = {};
  desiredColumns.forEach(function (columnName) {
    var index = headers.indexOf(columnName);
    if (index !== -1) {
      columnMap[columnName] = index;
    } else {
      Logger.log('Optional column not found: ' + columnName);
    }
  });

  var profitIndex = columnMap['Profit'];
  var profitFactorIndex = columnMap['Profit Factor'];
  if (profitIndex === undefined || profitFactorIndex === undefined) {
    throw new Error('Required columns "Profit" and "Profit Factor" must be present.');
  }

  var qualifyingRows = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var profit = parseFloat(row[profitIndex]);
    var profitFactor = parseFloat(row[profitFactorIndex]);

    if (!isNaN(profit) && !isNaN(profitFactor) && profit > 0 && profitFactor > 1) {
      qualifyingRows.push(row);
    }
  }

  var drawdownIndex = columnMap['Equity DD %'];
  qualifyingRows.sort(function (a, b) {
    var profitA = parseFloat(a[profitIndex]);
    var profitB = parseFloat(b[profitIndex]);

    if (profitB !== profitA) {
      return profitB - profitA;
    }

    if (drawdownIndex !== undefined) {
      var drawdownA = parseFloat(a[drawdownIndex]);
      var drawdownB = parseFloat(b[drawdownIndex]);

      if (!isNaN(drawdownA) && !isNaN(drawdownB)) {
        return drawdownA - drawdownB;
      }
    }

    return 0;
  });

  var availableColumns = desiredColumns.filter(function (columnName) {
    return columnMap[columnName] !== undefined;
  });

  var selectedRows = qualifyingRows.slice(0, 50);
  var output = [availableColumns];

  selectedRows.forEach(function (row) {
    output.push(
      availableColumns.map(function (columnName) {
        return row[columnMap[columnName]];
      })
    );
  });

  var outputSheet = spreadsheet.getSheetByName('TopProfitablePasses');
  if (!outputSheet) {
    outputSheet = spreadsheet.insertSheet('TopProfitablePasses');
  } else {
    outputSheet.clearContents();
  }

  outputSheet
    .getRange(1, 1, output.length, output[0].length)
    .setValues(output);
  outputSheet.setFrozenRows(1);
  outputSheet.autoResizeColumns(1, output[0].length);

  var timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyyMMdd_HHmmss'
  );
  var csv = output.map(function (row) {
    return row.map(csvEscape).join(',');
  }).join('\n');

  var fileName = 'profitable_passes_' + timestamp + '.csv';
  DriveApp.createFile(fileName, csv, MimeType.CSV);

  Logger.log(
    'Analysis complete. Reviewed ' + (data.length - 1) +
    ' row(s), found ' + qualifyingRows.length +
    ' qualifying row(s), and exported ' + selectedRows.length +
    ' row(s) to ' + fileName + '.'
  );
}

function csvEscape(value) {
  if (value === null || value === undefined) {
    return '';
  }

  var text = String(value);
  if (/[",\n\r]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"';
  }

  return text;
}
