import os, re, pdfplumber
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Extracts text from PDF files in the data directory.'
    def handle(self, *args, **options):
        input_dir, output_dir = os.path.join(settings.BASE_DIR, 'data'), os.path.join(settings.BASE_DIR, 'extracted_text')
        os.makedirs(output_dir, exist_ok=True)
        self.stdout.write(self.style.SUCCESS("Iniciando extração de PDFs..."))
        for filename in os.listdir(input_dir):
            if filename.endswith('.pdf'):
                try:
                    with pdfplumber.open(os.path.join(input_dir, filename)) as pdf:
                        text = ''.join(page.extract_text() + ' ' for page in pdf.pages if page.extract_text())
                    cleaned_text = re.sub(r'\s+', ' ', text).strip()
                    with open(os.path.join(output_dir, f"{os.path.splitext(filename)[0]}.txt"), 'w', encoding='utf-8') as f:
                        f.write(cleaned_text)
                    self.stdout.write(f"  - Extraído: {filename}")
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f"Erro em {filename}: {e}"))
        self.stdout.write(self.style.SUCCESS("Extração concluída."))