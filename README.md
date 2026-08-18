# EA Bot OPT Analyzer

A Google Apps Script utility for reducing large MetaTrader 5 optimization exports into a smaller, reviewable set of candidate passes.

The project demonstrates **data filtering, dynamic column mapping, sorting, spreadsheet automation, and CSV export**. It is an analysis helper only; a profitable historical optimization pass does not imply future trading performance.

## What It Does

The analyzer reads data from a Google Sheet tab named `Tester Optimizer Results` and:

1. Detects supported MT5 optimization columns dynamically.
2. Requires `Profit` and `Profit Factor` for the core filter.
3. Keeps rows where:
   - `Profit > 0`
   - `Profit Factor > 1`
4. Sorts qualifying rows by highest profit, then lower equity drawdown when that metric is available.
5. Selects up to the top 50 rows.
6. Writes the result to a `TopProfitablePasses` sheet.
7. Exports the selected rows to a timestamped CSV file in Google Drive.

## Supported Metrics

When present in the source export, the script can include:

- Pass
- Profit
- Profit Factor
- Recovery Factor
- Sharpe Ratio
- Equity DD %
- Trades
- percRisk
- stopLoss
- takeProfit
- iBullishX
- iBearishX

Missing optional columns are logged and skipped rather than causing the entire analysis to fail.

## Setup

1. Create or open a Google Sheet.
2. Add a tab named `Tester Optimizer Results`.
3. Open **Extensions > Apps Script**.
4. Copy the contents of `EA-Bot-Analyzer.gs` into the Apps Script editor.
5. Save the project and grant the required Sheets/Drive permissions.
6. Reload the spreadsheet.

The script adds an **EA Analyzer** menu to the spreadsheet.

## Usage

1. Export MT5 Strategy Tester optimization results to CSV.
2. Import or paste the data, including headers, into `Tester Optimizer Results`.
3. Choose **EA Analyzer > Analyze Profitable Passes**.
4. Review the `TopProfitablePasses` sheet.
5. Use the timestamped CSV in Google Drive if you need the reduced dataset outside Sheets.

If the output sheet already exists, the script clears and reuses it instead of failing on repeated runs.

## Engineering Notes

This project is intentionally simple and transparent:

- Column indexes are discovered from the header row rather than hard-coded positions.
- Required metrics are validated before processing.
- Optional metrics degrade gracefully when absent.
- Repeated runs reuse the output worksheet.
- CSV fields are escaped before export.
- Logs provide basic troubleshooting context.

## Limitations

- The current ranking logic is deliberately basic and should not be treated as a trading strategy.
- Historical optimization can overfit data.
- Profit and Profit Factor alone are insufficient for evaluating live-trading risk.
- Input column names must match the supported MT5 header names.

## License

MIT License. See [LICENSE](LICENSE).

## Purpose

I built this to automate a repetitive data-reduction task: take a large optimization export, apply explicit rules, and create a much smaller dataset for human review and further analysis.
