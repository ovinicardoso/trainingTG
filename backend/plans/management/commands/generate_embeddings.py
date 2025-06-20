import os
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction
from sentence_transformers import SentenceTransformer
from plans.models import DocumentChunk

class Command(BaseCommand):
    help = 'Generates embeddings and stores them in the PGVector database with enhanced logging.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("--- INICIANDO PROCESSO DE GERAÇÃO DE EMBEDDINGS ---"))
        
        try:
            text_dir = os.path.join(settings.BASE_DIR, 'extracted_text')
            if not os.path.exists(text_dir) or not os.listdir(text_dir):
                self.stderr.write(self.style.ERROR(f"O diretório '{text_dir}' não existe ou está vazio. Rode o comando 'extract_texts' primeiro."))
                return

            self.stdout.write("Carregando o modelo SentenceTransformer ('all-MiniLM-L6-v2')...")
            model = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Limpar chunks antigos do banco de dados dentro de uma transação
            with transaction.atomic():
                self.stdout.write("Limpando dados antigos da tabela 'DocumentChunk'...")
                count, _ = DocumentChunk.objects.all().delete()
                self.stdout.write(self.style.SUCCESS(f"{count} chunks antigos foram removidos."))

            chunks_to_create = []
            
            self.stdout.write("Lendo arquivos de texto e preparando chunks...")
            text_files = [f for f in os.listdir(text_dir) if f.endswith('.txt')]
            if not text_files:
                self.stderr.write(self.style.ERROR("Nenhum arquivo .txt encontrado em 'extracted_text/'."))
                return
            
            self.stdout.write(f"Encontrados {len(text_files)} arquivos de texto.")

            for filename in text_files:
                self.stdout.write(f"\nProcessando arquivo: {filename}...")
                with open(os.path.join(text_dir, filename), 'r', encoding='utf-8') as f:
                    text = f.read()
                
                if not text.strip():
                    self.stdout.write(self.style.WARNING(f"  - Arquivo '{filename}' está vazio. Pulando."))
                    continue

                words = text.split()
                text_chunks = [' '.join(words[i:i + 500]) for i in range(0, len(words), 500)]
                self.stdout.write(f"  - Dividido em {len(text_chunks)} chunks.")

                self.stdout.write(f"  - Gerando embeddings para os chunks de '{filename}'...")
                embeddings = model.encode(text_chunks, show_progress_bar=True)
                
                for i, content in enumerate(text_chunks):
                    chunks_to_create.append(
                        DocumentChunk(source=filename, content=content, embedding=embeddings[i])
                    )
            
            if not chunks_to_create:
                self.stderr.write(self.style.ERROR("Nenhum chunk foi criado. Verifique os arquivos de texto."))
                return

            self.stdout.write(f"\nPreparando para salvar {len(chunks_to_create)} novos chunks no banco de dados...")
            try:
                with transaction.atomic():
                    DocumentChunk.objects.bulk_create(chunks_to_create, batch_size=500) # batch_size para eficiência
                self.stdout.write(self.style.SUCCESS("--- PROCESSO CONCLUÍDO COM SUCESSO! ---"))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Ocorreu um erro ao salvar os dados no banco: {e}"))
                self.stderr.write("Verifique se as dimensões do vetor no modelo (384) correspondem às do embedding gerado e se não há violações de constraints no banco.")

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Ocorreu um erro inesperado durante a execução: {e}"))