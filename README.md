# EA Bot OPT Analyzer

![EA Bot Analyzer Banner](https://via.placeholder.com/800x200?text=EA+Bot+Analyzer) <!-- Optional: Add a banner image for visual appeal, e.g., a screenshot of the sheet in action -->

A Google Apps Script embedded in a Sheet to summarize the top 50 profitable passes from MetaTrader 5 (MT5) OPT files (via CSV export). Inspired by Kali Linux pentests for vulnerability hunting in data and quantum computing for efficient pattern spotting—perfect for traders optimizing EA Bots on pairs like EURUSD H1.

This tool turns 17k+ lines of backtest results into actionable insights in seconds: Filter for Profit >0 and Profit Factor >1, sort by highest profit/lowest drawdown, and output a clean summary tab plus Drive CSV. No more manual scrolling—focus on strategy refinement or content creation instead!

## Features
- **Quick Summaries**: Analyzes massive OPT CSVs for top 50 winners, highlighting metrics like Sharpe Ratio, Equity DD %, and parameters (stopLoss, takeProfit).
- **Dynamic & Resilient**: Handles missing columns gracefully, case-insensitive tab names—cybersecurity-hardened for varying MT5 exports.
- **Simple Workflow**: Copy-paste data into the 'Tester Optimizer Results' tab, run via custom menu—quantum-fast for repeatable tests.
- **Community-Ready**: Fork for your Python integrations or ethical hacking twists on trading automation.

## Getting Started
### Prerequisites
- A Google account (free).
- MT5 OPT file exported to CSV (via Strategy Tester > Optimization Results > Export to XML/CSV).

### Installation
1. Open the Google Sheet template (link to your shared Sheet or instructions to create one).
2. Go to Extensions > Apps Script > Paste the code from `ea_bot_analyzer.gs`.
3. Save and authorize (safe—grants access to your Sheet/Drive only).
4. Add the custom menu: Refresh the Sheet to see "EA Analyzer" in the top bar.

### Usage
1. Export your MT5 OPT to CSV.
2. Paste the data (including headers) into the 'Tester Optimizer Results' tab—overwrite old data for new runs.
3. Run: EA Analyzer > Run Profitable Passes (or from editor).
4. Output: New 'TopProfitablePasses' tab with top 50, plus `profitable_passes.csv` in Google Drive.
5. Repeat for next optimizations—same Sheet, fresh insights!

Example: For EURUSD H1 backtests, spot trends in iBullishX/iBearishX without hours of sifting.

## Contributing
Fork the repo, add features (e.g., Python ports for advanced charting), and submit a pull request—let's collaborate like a positive pentest team! Issues welcome for bugs or ideas.

## License
MIT License—free to use, modify, and share. See [LICENSE](LICENSE) for details.

## Acknowledgments
- Built with inspiration from K-LOVE's mission to encourage through tech.
- Thanks to the Google Apps Script community for dynamic tools
<argument name="citation_id">0</argument>
.
- God bless your journeys in cybersecurity, trading, and beyond!

Contact: [https://www.linkedin.com/in/casey-craft0316/] or open an issue here.
