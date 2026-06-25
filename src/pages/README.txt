Pages created:
- ConnectWallet.jsx: Handles MetaMask connection UI
- Swap.jsx: Dummy swap UI for crypto

To add more realistic navigation, consider using React Router. For now, both are shown on the main page.

App.jsx and main.jsx are set up to render these pages.

index.html loads from /src/assets/main.jsx, but the correct path is /src/main.jsx. Please update index.html to use the correct script path for the app to work.