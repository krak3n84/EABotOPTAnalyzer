// EA Bot Optimizer Analyzer - A Google Apps Script for filtering profitable MT5 EA passes
// Inspired by Kali Linux pentests: Scans massive CSVs (17k+ lines) in seconds, like vulnerability hunting in data
// Quantum twist: Dynamic and resilient to variations, for robust trading insights
// Built with positive K-LOVE vibes - Reach people through efficient tech!

function analyzeProfitablePasses() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Like a Kali scan: Log all sheet tabs to debug naming issues early
  var allSheets = spreadsheet.getSheets().map(function(s) { return s.getName(); });
  Logger.log('Available sheet tabs: ' + allSheets.join(', '));
  
  // Normalize for case-insensitivity - Handles lowercase/uppercase mismatches like a quantum superposition of states
  var targetName = 'tester optimizer results'.toLowerCase();
  var sheet = null;
  spreadsheet.getSheets().forEach(function(s) {
    if (s.getName().toLowerCase() === targetName) {
      sheet = s;
    }
  });
  
  if (!sheet) {
    Logger.log('Error: Sheet not found! Expected lowercase-normalized "tester optimizer results". Check tabs.');
    return;
  }
  Logger.log('Processing sheet: ' + sheet.getName());
  
  // Grab data - Efficient like Python pandas, but in JS for Sheets
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  // Desired columns for analysis - Customizable for your EA Bot metrics
  var desiredColumns = ['Pass', 'Profit', 'Profit Factor', 'Recovery Factor', 'Sharpe Ratio', 'Equity DD %', 'Trades', 'percRisk', 'stopLoss', 'takeProfit', 'iBullishX', 'iBearishX'];
  
  // Map indices dynamically - Skips missing columns like an ethical hack avoiding false positives
  var columnMap = {};
  desiredColumns.forEach(function(col) {
    var idx = headers.indexOf(col);
    if (idx !== -1) {
      columnMap[col] = idx;
    } else {
      Logger.log('Warning: Missing column - ' + col + '. Skipping it.');
    }
  });
  
  var availableCols = Object.keys(columnMap);
  if (availableCols.length === 0) {
    Logger.log('Error: No matching columns found! Check your CSV headers.');
    return;
  }
  
  // Required columns check - Core for profitability filter, like a pentest validating exploits
  var profitIdx = columnMap['Profit'];
  var profitFactorIdx = columnMap['Profit Factor'];
  if (profitIdx === undefined || profitFactorIdx === undefined) {
    Logger.log('Error: Required columns Profit or Profit Factor missing!');
    return;
  }
  
  // Filter profitable rows - The heart of the script, spotting winners fast
  var profitable = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var profit = parseFloat(row[profitIdx]);
    var profitFactor = parseFloat(row[profitFactorIdx]);
    if (profit > 0 && profitFactor > 1) {
      profitable.push(row);
    }
  }
  
  if (profitable.length === 0) {
    Logger.log('No profitable passes found. Keep optimizing—God’s got a plan!');
    return;
  }
  
  // Sort results - Highest profit first, then lowest drawdown (if available) - Quantum-optimized for best picks
  var ddIdx = columnMap['Equity DD %'];
  profitable.sort(function(a, b) {
    var profitA = parseFloat(a[profitIdx]);
    var profitB = parseFloat(b[profitIdx]);
    if (profitB !== profitA) return profitB - profitA;
    if (ddIdx !== undefined) {
      var ddA = parseFloat(a[ddIdx]);
      var ddB = parseFloat(b[ddIdx]);
      return ddA - ddB;
    }
    return 0;
  });
  
  // Top 50 extraction - Expanded for deeper insights, like a Kali report highlighting more vulns
  var top50 = profitable.slice(0, 50);
  
  // Build output - Dynamic for available columns, resilient to CSV variations
  var output = [availableCols]; // Headers
  
  top50.forEach(function(row) {
    var rowData = [];
    availableCols.forEach(function(col) {
      rowData.push(row[columnMap[col]]);
    });
    output.push(rowData);
  });
  
  // Create summary sheet - Your top 50 profitable passes, ready for content creation
  var newSheet = spreadsheet.insertSheet('TopProfitablePasses');
  newSheet.getRange(1, 1, output.length, output[0].length).setValues(output);
  
  // Export CSV - Backup your insights to Drive, like archiving pentest results
  var blob = Utilities.newBlob(output.map(row => row.join(',')).join('\n'), 'text/csv', 'profitable_passes.csv');
  DriveApp.createFile(blob);
  Logger.log('Success! TopProfitablePasses sheet created (top 50) and CSV exported to Drive. Processed ' + availableCols.length + ' columns.');
}