import logging
from typing import Optional

from pyppeteer import launch

logger = logging.getLogger(__name__)


async def generate_pdf_from_html(html: str) -> bytes:
    browser = await launch(args=["--no-sandbox", "--disable-setuid-sandbox"])
    try:
        page = await browser.newPage()
        await page.setContent(html, waitUntil="networkidle0")
        pdf_bytes = await page.pdf({"format": "A4", "printBackground": True})
        return pdf_bytes
    finally:
        await browser.close()
