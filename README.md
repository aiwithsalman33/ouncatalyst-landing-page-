# OunCatalyst — The Years Exchange

A responsive, standalone landing page for OunCatalyst's The Years Exchange career-readiness bootcamp.

## Run locally

Open `index.html` in a browser. Keep the `images/` folder beside it; it holds the web-sized logo, favicon and photos. The original logo files in the root are the source artwork.

Photos are from Unsplash (Unsplash License).

## Connect the form to Google Sheets

1. Open the sheet, then **Extensions > Apps Script**. Replace the code with `google-apps-script/Code.gs` and save.
2. **Deploy > New deployment > Web app**. Execute as **Me**, access **Anyone**. Deploy and approve access.
3. Copy the URL ending in `/exec` into `SHEET_ENDPOINT` in `index.html`.

Enquiries go to an `Enquiries` tab, created on the first submission. If saving fails, the form shows an error with a prefilled email link. After editing the script, use **Deploy > Manage deployments > Edit > New version**.

Keep the sheet's sharing set to **Restricted**: it holds personal details.

## Publish

Host this folder as a static website. Configure the production canonical and social-sharing URLs in `index.html` once the final domain and route are confirmed.
